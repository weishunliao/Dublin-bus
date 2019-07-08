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
from django_project.settings import BASE_DIR
from django.db import connection
from datetime import datetime
from django_project.settings import MAP_KEY


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
    return render(request, 'routing.html', {'map_key': MAP_KEY})


@csrf_exempt
def get_stop_list(request):
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
    return JsonResponse({"list": stop_list, "route_id": route_id})
