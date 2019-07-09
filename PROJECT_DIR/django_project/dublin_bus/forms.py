from django import forms



class JourneyPlannerForm(forms.Form):
    start = forms.IntegerField()
    end = forms.IntegerField()
    time = forms.DateTimeField()