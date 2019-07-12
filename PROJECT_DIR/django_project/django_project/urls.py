
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from dublin_bus.views import HomeView
from dublin_bus import views
# from dublin_bus.views import FormSubmits



urlpatterns = [
    path('', HomeView.as_view()),
    path('test', views.test_view),
    path('map', views.test_routing),
    path('get_travel_time', views.get_travel_time),
    path('bus_stop_list_by_route', views.get_bus_stop_list),
    path('get_real_time', views.get_real_time),
]

