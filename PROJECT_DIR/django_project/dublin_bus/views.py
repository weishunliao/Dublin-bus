from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from dublin_bus.functions import is_weekday, is_bank_holiday, get_service_id, get_real_time_data, get_trip_id, \
    get_trip_info, calculate_time_diff
from .forms import JourneyPlannerForm

from dublin_bus import functions
import json
import os
from django_project.settings import BASE_DIR
from django.db import connection
from datetime import datetime
from django_project.settings import MAP_KEY


# Create your views here.
class HomeView(TemplateView):
    template_name = "home.html"

    def get(self, request):

        return render(request, self.template_name,
                      {'icon': "partly-cloudy-day", 'temperature': "22", "map_key": MAP_KEY})

    def post(self, request):
        if request.method == "POST":
            form = JourneyPlannerForm(request.POST)
            if form.is_valid():
                start = form.cleaned_data['start']
                end = form.cleaned_data['end']
                time = form.cleaned_data['time']
                print(form.cleaned_data)

            return HttpResponseRedirect('')


def test_routing(request):
    return render(request, 'routing.html', {'map_key': MAP_KEY})


@csrf_exempt
def get_travel_time(request):
    route_id = request.POST['route_id']
    headsign = request.POST['head_sign']
    start_point = request.POST['start_point']
    end_point = request.POST['end_point']
    num_stops = int(request.POST['num_stops'])
    departure_time_value = request.POST['departure_time_value']
    departure_time = datetime.fromtimestamp(int(departure_time_value))
    # get the list of stops that the bus will pass along
    stop_list = functions.get_stop_list(route_id, headsign, start_point, end_point, num_stops, departure_time)
    # call the machine learning model to get a prediction for journey time
    journey_time = functions.predict_journey_time(stop_list, departure_time_value)
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
    print(trip_id_list)
    trip_info = get_trip_info(trip_id_list, service_id, direction, route_id)
    stops_list = calculate_time_diff(trip_info, current)
    return JsonResponse({"stops_list": stops_list})


def real_time_info_for_bus_stop(request):
    stop_id = request.GET['stop_id']
    path = os.path.join(BASE_DIR, '../static/cache/stops_new.json')
    with open(path, 'r') as json_file:
        stop_name = json.load(json_file)[str(stop_id)][2]
    current = datetime.now()
    current_min = current.hour * 60 + current.minute
    real_time_data = get_real_time_data(stop_id)
    real_time_data['stop_name'] = stop_name
    for i in real_time_data[stop_id]:
        if i[2] == 'Due':
            i.append('Due')
        else:
            hr = int(i[2].split(":")[0])
            min = int(i[2].split(":")[1])
            remain = hr * 60 + min - current_min
            if remain == 0:
                i.append('Due')
            else:
                i.append(remain)
    print(real_time_data)
    return JsonResponse(real_time_data)


def real_time_for_route(request):
    stop_id = request.GET['stop_id']
    route_id = request.GET['route_id']

    real_time_info = get_real_time_data(stop_id)
    current = datetime.now()
    t = 9999
    current_min = current.hour * 60 + current.minute
    for i in real_time_info[stop_id]:
        if i[0] == route_id:
            if i[2] == 'Due':
                return JsonResponse({'time': 'Due'})
            hr = int(i[2].split(":")[0])
            min = int(i[2].split(":")[1])
            time = hr * 60 + min - current_min
            if time < t:
                t = time
    if t == 0:
        t = 'Due'
    return JsonResponse({'time': t})


def get_server_route(request):
    stop_id = request.GET['stop_id']
    path = os.path.join(BASE_DIR, '../static/cache/bus_serve_route.json')
    server_route = set()
    with open(path, 'r') as json_file:
        data = json.load(json_file)[str(stop_id)]
        for route in data:
            server_route.add(route[0])
    return JsonResponse({'server_route': list(server_route)})
