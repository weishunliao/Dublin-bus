
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from dublin_bus.views import HomeView
from dublin_bus import views
# from dublin_bus.views import FormSubmits



urlpatterns = [
    path('', HomeView.as_view()),
    path('map', views.test_routing),
    path('get_travel_time', views.get_travel_time),
    path('bus_stop_list_by_route', views.get_bus_stop_list),
    path('real_time_for_route', views.real_time_for_route),
    path('real_time_info_for_bus_stop', views.real_time_info_for_bus_stop),
    path('server_route', views.get_server_route),
]

