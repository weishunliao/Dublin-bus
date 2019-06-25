from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse, JsonResponse
from .models import Stop
import requests

    
    


# Create your views here.
# class HomeView(TemplateView):
#     template_name = "home.html"
#     weather_json = None

def home_view(request):
    # url = "https://api.darksky.net/forecast/af244fb72403c52972f85dc3b0513431/37.8267,-122.4233"
    # response = requests.get(url)
    # r = response.json()
    # 
    return render(request, "home.html", {'icon': "clear-day"})

def test_view(request):
    return HttpResponse("<h3>Hi, we're team 8.</h3>")


def test_db(request):
    stations = Stop.objects.all()
    stop_list = {}
    for stop in stations:
        info = {"name": stop.stop_name, "latitude": stop.stop_lat, "longitude": stop.stop_lon}
        stop_list[stop.stop_id] = [info]
    return JsonResponse(stop_list)
