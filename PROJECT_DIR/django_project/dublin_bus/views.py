from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.http import HttpResponse, JsonResponse
from .models import Stop
from geopy import distance
import json
import requests
from bs4 import BeautifulSoup
import os
from django_project.settings import STATIC_ROOT, BASE_DIR


# Create your views here.
class HomeView(TemplateView):
    template_name = "home.html"


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
    return render(request, 'routing.html')


@csrf_exempt
def routing(request):
    print(request.POST)
    start_point = request.POST.getlist('start[]')
    end_point = request.POST.getlist('end[]')
    route_list = []
    stop_list = []
    with open(os.path.join(BASE_DIR, '../static/cache/stops_by_route.json'), 'r') as stops_by_route:
        routes = json.load(stops_by_route)
        for r in routes.keys():
            route = Route(r, 'in')
            for i in routes[r]['in']:
                route.add_stop(i)
            route_list.append(route)

            route = Route(r, 'out')
            for i in routes[r]['out']:
                route.add_stop(i)
            route_list.append(route)

    # 27B out ['300', '497', '515', '516', '4384']

    with open(os.path.join(BASE_DIR, '../static/cache/stops.json'), 'r') as stops_file:
        stops = json.load(stops_file)
        for s in stops.keys():
            stop = BusStop(s, stops[s][0], stops[s][1], stops[s][2])
            stop_list.append(stop)

    nearest_stops_start = []
    nearest_stops_end = []

    for i in stop_list:
        stop_location = [i.lat, i.lon]
        dis_start = distance.distance(start_point, stop_location).km
        dis_end = distance.distance(end_point, stop_location).km
        if dis_start <= 0.8:
            nearest_stops_start.append((i.id, dis_start))
        if dis_end <= 0.8:
            nearest_stops_end.append((i.id, dis_end))

    nearest_stops_start_sorted = sorted(nearest_stops_start, key=lambda x: x[1])
    nearest_stops_end_sorted = sorted(nearest_stops_end, key=lambda x: x[1])

    potential_route = {}
    for i in nearest_stops_start_sorted:
        s1 = i[0]
        for j in nearest_stops_end_sorted:
            s2 = j[0]
            for k in route_list:
                if k.contain(s1) and k.contain(s2) and (k.stops.index(s1) < k.stops.index(s2)):
                    if (k.route_id + "_" + k.direction) not in potential_route:
                        potential_route[k.route_id + "_" + k.direction] = [s1, s2]

    # print(potential_route)

    potential_route_clean = {}
    time_table_cache = {}
    for i in potential_route.keys():
        stop_id = potential_route[i][0]
        if stop_id not in time_table_cache:
            real_time_data = get_real_time(stop_id)
            bus_on_service = get_stop_id(real_time_data[stop_id])
            time_table_cache[stop_id] = bus_on_service

        s = i[:i.index('_')]
        if s in time_table_cache[stop_id].keys():
            potential_route_clean[i] = potential_route[i]
            potential_route_clean[i].append(time_table_cache[stop_id][s])

    print(potential_route_clean)
    return JsonResponse(potential_route_clean)


def get_real_time(stop_id):
    headers = {
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"}
    resp = requests.get(
        "https://www.dublinbus.ie/RTPI/Sources-of-Real-Time-Information/?searchtype=view&searchquery=" +
        str(stop_id),
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
    return real_time_info


def get_stop_id(table):
    bus_on_service = {}
    for i in table:
        arrival_time = i[2].split(':')
        if i[2] == 'Due':
            bus_on_service[i[0]] = "Due"
        elif i[0] in bus_on_service and bus_on_service[i[0]] != "Due" and bus_on_service[i[0]] > arrival_time:
            bus_on_service[i[0]] = arrival_time
        else:
            bus_on_service[i[0]] = arrival_time
    return bus_on_service


class BusStop:

    def __init__(self, id, name, lat, lon):
        self.id = id
        self.lat = lat
        self.lon = lon
        self.name = name


class Route:

    def __init__(self, id, direction):
        self.route_id = id
        self.stops = []
        self.direction = direction

    def add_stop(self, id):
        self.stops.append(id)

    def contain(self, id):
        return id in self.stops
