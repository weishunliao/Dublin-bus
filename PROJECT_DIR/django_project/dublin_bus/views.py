from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse, JsonResponse
from .models import Stop
from dublin_bus import functions
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime


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


class predict(APIView):
    """View for returning predictions for journey time."""

    def get(self, request):
        """Takes a list of bus stops and a timestamp (unix format) as input. Returns a prediction of journey 
        time in seconds."""

        # get stops and timestamp from the request

        # call the OpenWeather API and parse the response
        timestamp = datetime.strptime('Jul 5 2019  4:30PM', '%b %d %Y %I:%M%p')
        weather_data = functions.openweather_forecast()
        rain, temp, rhum, msl = functions.parse_weather_forecast(timestamp, weather_data)

        
        # do some stuff here to split the timestamp out

        # make a prediction based on the input and return it
        # prediction = functions.route_prediction_15A(stops, actualtime_arr_stop_first, day_of_week, month, weekday, \
        #     bank_holiday, rain, temp, rhum, msl)
        prediction = 20000

        # return the prediction
        return Response(prediction)