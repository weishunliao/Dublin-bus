from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views import View
from .models import Stop
import requests
from .forms import JourneyPlannerForm
    
    


# Create your views here.
class HomeView(TemplateView):
    template_name = "home.html"

    def get(self, request):
        form = JourneyPlannerForm()
        return render(request, self.template_name, {'icon': "clear-day", 'form': form })


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
