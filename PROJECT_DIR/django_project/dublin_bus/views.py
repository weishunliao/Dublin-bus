from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from dublin_bus.functions import is_weekday, is_bank_holiday, get_service_id
from .models import Stop
from .forms import JourneyPlannerForm

from dublin_bus import functions
import json
import requests
from bs4 import BeautifulSoup
import os
from django_project.settings import BASE_DIR
from django.db import connection
from datetime import datetime
from django_project.settings import MAP_KEY


# Create your views here.
class HomeView(TemplateView):
    template_name = "home.html"

    def get(self, request):

        return render(request, self.template_name, {'icon': "clear-day", "map_key": MAP_KEY})

    def post(self, request):
        if request.method == "POST":
            form = JourneyPlannerForm(request.POST)
            if form.is_valid():
                start = form.cleaned_data['start']
                end = form.cleaned_data['end']
                time = form.cleaned_data['time']
                print(form.cleaned_data)

            return HttpResponseRedirect('')


def test_view(request):
    return HttpResponse("<h3>Hi, we're team 8.</h3>")


def test_db(request):
    stations = Stop.objects.all()
    stop_list = {}
    for stop in stations:
        info = {"name": stop.stop_name, "latitude": stop.stop_lat, "longitude": stop.stop_lon}
        stop_list[stop.stop_id] = [info]
    return JsonResponse(stop_list)


def test_routing(request):
    return render(request, 'routing.html', {'map_key': MAP_KEY})


@csrf_exempt
def get_travel_time(request):
    route_id = request.POST['route_id']
    start_point = request.POST['start_point']
    end_point = request.POST['end_point']
    departure_time_value = request.POST['departure_time_value']
    num = int(request.POST['num_stops'])
    departure_time = datetime.fromtimestamp(int(departure_time_value))
    start_point_id = 0
    end_point_id = 0
    stop_list = []

    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM stops WHERE stops.stop_name = %s", [start_point])
        start_point_id = cursor.fetchone()[2]
        # cursor.execute("SELECT * FROM stops WHERE stops.stop_name = %s", [end_point])
        # end_point_id = cursor.fetchone()[2]

    service_id = 3
    if departure_time.day == 7:
        service_id = 2
    elif departure_time.day == 6:
        service_id = 1

    with connection.cursor() as cursor:
        sql = "SELECT trip_id FROM stop_times WHERE stop_times.trip_id IN (SELECT trip_id FROM routes,trips WHERE " \
              "routes.route_short_name = %s AND routes.route_id=trips.route_id AND trips.service_id = %s) AND" \
              " stop_id= %s ORDER BY abs(TIME(%s) - stop_times.departure_time) LIMIT 1"
        cursor.execute(sql, [route_id, service_id, start_point_id, departure_time])
        trip_id = cursor.fetchone()
    print(trip_id)
    with connection.cursor() as cursor:
        sql = "SELECT stop_id,stop_sequence FROM stop_times WHERE stop_times.trip_id = %s"
        cursor.execute(sql, [trip_id])
        all_stops = cursor.fetchall()
        index = 0
        for i in all_stops:
            if i[0] == start_point_id:
                index = int(i[1] - 1)
        stop_list = all_stops[index:index + num + 1]

    # if the route_id is 15a, get a prediction from the machine learning model
    if route_id == '15a':
        journey_time = functions.predict_journey_time(stop_list, departure_time_value)
    else:
        journey_time = 0

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


def get_real_time(request):
    stop_id = request.GET['stop_id']
    route_id = request.GET['route_id']
    headers = {
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"}
    resp = requests.get(
        "https://www.dublinbus.ie/RTPI/Sources-of-Real-Time-Information/?searchtype=view&searchquery=" + stop_id,
        headers=headers)

    data = []
    real_time_info = {stop_id: data}
    if resp.status_code == 200:
        content = resp.text
        soup = BeautifulSoup(content, features="lxml")
        slots1 = soup.find_all('tr', class_='odd')
        slots2 = soup.find_all('tr', class_='even')
        arr = []
        for s in slots1:
            for i in s.findChildren("td"):
                arr.append(i.text.strip())
        for s in slots2:
            for i in s.findChildren("td"):
                arr.append(i.text.strip())
        temp = []
        for item in arr:
            if item == '':
                data.append(temp)
                temp = []
                continue
            temp.append(item)

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


def get_trip_id(direction, service_id, current_time, route_id):
    path = os.path.join(BASE_DIR, '../static/cache/route_15a_timetable.json')
    slots = []
    with open(path, 'r') as json_file:
        timetable = json.load(json_file)[direction][str(service_id)]
        for i in range(len(timetable)):
            if timetable[i][0] <= current_time <= timetable[i][1]:
                slots.append(timetable[i][2])
                slots.append(timetable[i + 1][2])
                slots.append(timetable[i + 2][2])
                slots.append(timetable[i + 3][2])
                slots.append(timetable[i + 4][2])
                break
    return slots


def get_trip_info(trip_ids, service_id, direction, route_id):
    path = os.path.join(BASE_DIR, '../static/cache/route_15a.json')
    infos = []
    with open(path, 'r') as json_file:
        data = json.load(json_file)[direction][str(service_id)]
        for trip_id in trip_ids:
            infos.append(data[trip_id])
    return infos


def calculate_time_diff(trips, time):
    i = 1
    stops_list = []

    while i <= len(trips[1]):
        t = 0
        while t < len(trips) and (trips[t][str(i)][2] - time) // 60 < 0:
            t += 1
        stops_list.append(
            [trips[t][str(i)][0][-4:], trips[t][str(i)][1], (trips[t][str(i)][2] - time) // 60, trips[t][str(i)][3]])
        i += 1
    return stops_list
