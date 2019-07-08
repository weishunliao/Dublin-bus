
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from dublin_bus.views import HomeView
from .views import home, redirectSomewhere
# from dublin_bus.views import FormSubmits



urlpatterns = [
    url(r'^home/$', home, name='home'),
    url(r'^redirect/$', redirectSomewhere, name='home'),
    path('', HomeView.as_view())
    # path("/journey_planner", FormSubmits.as_view())
]

