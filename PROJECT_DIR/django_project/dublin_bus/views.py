import asyncio
import time as timepkg

import aiohttp
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from dublin_bus.functions import is_weekday, is_bank_holiday, get_service_id, get_real_time_data, get_trip_id, \
    get_trip_info, calculate_time_diff, get_opening_hour, clean_resp
from .forms import JourneyPlannerForm

from dublin_bus import functions
import json
import os
from django_project.settings import BASE_DIR
import requests
from datetime import datetime
from django_project.settings import MAP_KEY


# Create your views here.
class HomeView(TemplateView):
    template_name = "home.html"

    def get(self, request):
        return render(request, self.template_name,
                      {'icon': "partly-cloudy-day", 'temperature': "22", "map_key": MAP_KEY,
                       "is_mobile": request.user_agent.is_touch_capable})


def test_routing(request):
    return render(request, 'routing.html', {'map_key': MAP_KEY})


@csrf_exempt
def get_travel_time(request):
    body = json.loads(request.body)

    print("body of the request", body)

    route_id = body['route_id']
    start_point = body['start_point']
    num_stops = int(body['num_stops'])
    end_point = body['end_point']
    departure_time_value = body['departure_time_value']
    route_id = body['route_id']
    headsign = body['head_sign']
    departure_time = datetime.fromtimestamp(int(departure_time_value))
    # call the OpenWeather API and parse the response
    weather_data = functions.openweather_forecast()
    if weather_data == -1:
        rain, temp = functions.get_weather_defaults(departure_time.month)
    else:
        rain, temp = functions.parse_weather_forecast(departure_time, weather_data)
    # get the list of stops that the bus will pass along
    stop_list = functions.get_stop_list(route_id, headsign, start_point, end_point, num_stops, departure_time)
    # call the machine learning model to get a prediction for journey time
    journey_time = functions.predict_journey_time(stop_list, departure_time_value, rain, temp)
    print("Journey Time:", journey_time)
    return JsonResponse({"journey_time": journey_time})


def get_bus_stop_list(request):
    route_id = request.GET['route_id']
    direction = request.GET['direction']
    time = request.GET['t']
    if not time:
        time = datetime.now()

    current = int(time.hour) * 60 * 60 + int(time.minute) * 60
    weekday = is_weekday(time.weekday())
    bank_holiday = is_bank_holiday(time.day, time.month)
    service_id = get_service_id(weekday, bank_holiday)
    trip_id_list = get_trip_id(direction, service_id, current, route_id)
    trip_info = get_trip_info(trip_id_list, service_id, direction, route_id)
    stops_list = calculate_time_diff(trip_info, current)
    return JsonResponse({"stops_list": stops_list})


def real_time_info_for_bus_stop(request):
    stop_id = request.GET['stop_id']
    path = os.path.join(BASE_DIR, '../static/cache/stops.json')
    with open(path, 'r') as json_file:
        stop_name = json.load(json_file)[str(stop_id)][2]
    current = datetime.now()
    current_min = current.hour * 60 + current.minute
    data = []
    async def send_request(stopid):
        stopid = str(stopid)
        result = await get_real_time_data(stopid)
        for info in result[stopid]:
            data.append(info)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    tasks = [asyncio.ensure_future(send_request(stop_id))]
    loop.run_until_complete(asyncio.wait(tasks))
    loop.close()
    real_time_data = {'stop_name': stop_name, str(stop_id): []}
    for i in data:
        temp = i
        if i[2] != 'Due':
            hr = int(i[2].split(":")[0])
            m = int(i[2].split(":")[1])
            remain = hr * 60 + m - current_min
            if remain == 0:
                temp[2] = 'Due'
            else:
                temp[2] = remain
        real_time_data[str(stop_id)].append(temp)
    return JsonResponse(real_time_data)



def get_server_route(request):
    stop_id = request.GET['stop_id']
    path = os.path.join(BASE_DIR, '../static/cache/bus_serve_route.json')
    server_route = set()
    with open(path, 'r') as json_file:
        data = json.load(json_file)[str(stop_id)]
        for route in data:
            server_route.add(route[0])
    return JsonResponse({'server_route': list(server_route)})


def get_sights_info(request):
    category = request.GET['category']
    offset = int(request.GET['offset'])
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=" + MAP_KEY + "&query="
    if category == "Sightseeing":
        url += "Tourist%2Battraction%2BDublin/@53.3498881,-6.2619041,14z/data=!3m1!4b1"
    elif category == "Restaurant":
        url += "restaurant+Dublin/@53.3559966,-6.3761839,12z/data=!4m4!2m3!5m1!4e9!6e5"
    elif category == "Nightlife":
        url += "bar%2BDublin/@53.3211591,-6.3004305,12z/data=!4m4!2m3!5m1!4e3!6e5"
    elif category == "Coffee":
        url += "/coffee+dublin/@53.3454515,-6.2690574,16z/data=!3m1!4b1"
    elif category == "Hotel":
        url += "hotel+dublin/@53.3454768,-6.2690574,16z/data=!3m1!4b1"
    elif category == "Shopping":
        url += "shopping+dublin/@53.3455021,-6.2690574,16z/data=!3m1!4b1"
    infos = requests.get(url=url).json()['results']
    points = []
    for i in infos[offset:5 + offset]:
        try:
            info = clean_resp(i)
            points.append(info)
        except KeyError as e:
            print(e)
    return JsonResponse({"points": points})


def get_sights_info_by_place_id(request):
    place_id = request.GET['place_id']
    point = []
    resp = requests.get(
        "https://maps.googleapis.com/maps/api/place/details/json?fields=photos,formatted_address,name,rating,"
        "opening_hours,geometry&key=" + MAP_KEY + "&placeid=" + place_id).json()['result']
    try:
        point.append(resp['name'])
        point.append(resp['formatted_address'][:resp['formatted_address'].find('Dublin') - 2])
        point.append(resp['rating'])
        photo_ref = resp['photos'][0]['photo_reference']
        photo = requests.get(
            "https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=" + photo_ref + "&key=" + MAP_KEY,
            allow_redirects=True).url
        point.append(photo)
        opening_hour = get_opening_hour(resp)
        point.append(opening_hour)
    except KeyError as e:
        print(e)
    return JsonResponse({"point": point})


@csrf_exempt
def snap_to_road(request):
    stop_list = json.loads(request.body)['stop_list']
    filepath = os.path.join(BASE_DIR, '../static/cache/stops.json')
    path = ""
    with open(filepath, 'r') as json_file:
        data = json.load(json_file)
        for i in stop_list:
            lat = data[str(i)][0]
            lng = data[str(i)][1]
            path += str(lat) + "," + str(lng) + "|"
    path = path[:-1]
    resp = requests.get(
        "https://roads.googleapis.com/v1/snapToRoads?path=" + path + "&interpolate=true&key=" + MAP_KEY).json()
    road = []
    for i in resp['snappedPoints']:
        road.append({'lat': i['location']['latitude'], 'lng': i['location']['longitude']})
    return JsonResponse({'road': road})


@csrf_exempt
def real_time_for_route(request):
    stop_list = json.loads(request.body)['stop_list']
    route_id = json.loads(request.body)['route_id']
    real_time_info = dict()

    async def send_request(stop_id):
        stop_id = str(stop_id)
        result = await get_real_time_data(stop_id)
        real_time_info[stop_id] = result[stop_id]

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    tasks = [asyncio.ensure_future(send_request(stop)) for stop in stop_list]
    loop.run_until_complete(asyncio.wait(tasks))
    loop.close()

    current = datetime.now()
    current_min = current.hour * 60 + current.minute
    # print(real_time_info)
    for k in real_time_info.keys():
        temp = []
        for s in real_time_info[k]:
            if s[0] == route_id:
                if s[2] == 'Due':
                    temp.append('Due')
                else:
                    hr = int(s[2].split(":")[0])
                    m = int(s[2].split(":")[1])
                    diff = hr * 60 + m - current_min
                    if diff == 0:
                        diff = 'Due'
                    temp.append(diff)
        real_time_info[k] = temp
    print(real_time_info)
    return JsonResponse(real_time_info)
