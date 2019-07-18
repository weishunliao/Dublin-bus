import os
import pickle
import datetime
import requests
from django.conf import settings

def load_model():
    """Loads and returns a machine learning model for all routes."""
    path = os.path.join(settings.ML_MODEL_ROOT, 'all_routes_aug_linreg_model.sav')
    with open(path, 'rb') as file:
        model = pickle.load(file)
    return model

def create_hour_feature_ref():
    """Builds a dictionary with hours (0 and 1 and 4-23) as key and 1D lists as values.

    In each 1D list, one element will have the value 1, and all others will have the value 0."""
    hour_feature_ref = {}
    for i in range(2):
        hour_array = [0] * 22
        for j in range(2):
            if i == j:
                hour_array[j] = 1
        hour_feature_ref[i] = hour_array
    for i in range(4, 24):
        hour_array = [0] * 22
        for j in range(2, 22):
            if i - 2 == j:
                hour_array[j] = 1
        hour_feature_ref[i] = hour_array
    return hour_feature_ref

def create_day_of_week_feature_ref():
    """Builds a dictionary with weekdays (mon=0, tues=1, etc.) as key and 1D lists as values.

    In each 1D list, one element will have the value 1, and all others will have the value 0."""
    day_of_week_feature_ref = {}
    for i in range(7):
        day_of_week_array = [0] * 7
        for j in range(7):
            if i == j:
                day_of_week_array[j] = 1
        day_of_week_feature_ref[i] = day_of_week_array
        
    return day_of_week_feature_ref

def create_month_feature_ref():
    """Builds a dictionary with months (jan=1, feb=2, etc.) as key and 1D lists as values.

    In each 1D list, one element will have the value 1, and all others will have the value 0."""
    month_feature_ref = {}
    for i in range(1,13):
        month_array = [0] * 12
        for j in range(12):
            if j == i-1:
                month_array[j] = 1
        month_feature_ref[i] = month_array
        
    return month_feature_ref

def route_prediction(stops, actualtime_arr_stop_first, hour, day_of_week, month, weekday, bank_holiday,  
    rain, temp, rhum, msl):
    """Returns a prediction of journey length in seconds for any bus route.

    Takes a list of stops as input, as well as the arrival time of a bus at the first stop in the list. 
    Also takes as input hour (0-23), day_of_week (0-6 for mon-sun), month(1-12 for jan-dec), 
    weekday (1 for mon-fri, 0 for sat & sun) and bank holiday (1 if the journey date is a bank holiday, 0 otherwise). 
    Also takes the following weather info as input: rain (in mm), temp (in C), rhum - relative humidity (%) and 
    msl - mean sea level pressure (hPa)."""

    # create dictionaries for hour, day_of_week, month and bus stop features
    hour_ref = create_hour_feature_ref()
    day_of_week_ref = create_day_of_week_feature_ref()
    month_ref = create_month_feature_ref()
    # create a segment ref

    # get day of week and month from the relevant dictionaries
    day_of_week = day_of_week_ref[day_of_week]
    month = month_ref[month]
    hour = hour_ref[hour]
    # load the ml model
    linreg = load_model()
    # initiate an array to store all predictions
    predictions = []
    # loop through each set of stops in the list
    for i in range(len(stops)-1):
        stop_first = int(stops[i])
        stop_next = int(stops[i+1])
        # specify the input for the prediction
        input = [[actualtime_arr_stop_first, rain, temp, rhum, msl,weekday,bank_holiday] + first_stop_ref[stop_first] + \
        second_stop_ref[stop_next] + month + day_of_week]
        # get a prediction and append to the prediction list
        prediction = (linreg.predict(input))
        predictions.append(prediction)
        # set actualtime_arr_stop_first to the predicted value so it can be used for the next set of stops
        actualtime_arr_stop_first = prediction
    # calculate the time for the full trip
    full_trip = predictions[len(predictions)-1] - predictions[0]
    return int(full_trip)

def openweather_forecast():
    """This function calls the Openweather API to get a weather forecast. 
    
    Data is returned as a JSON object."""

    #call the API using the ID for Dublin City: 7778677 
    api_endpoint = "http://api.openweathermap.org/data/2.5/forecast?id=7778677&units=metric&APPID=" \
        + settings.OPENWEATHER_KEY

    try:
        # retrieve weather forecast from the OpenWeather API and convert to JSON object
        r = requests.get(url=api_endpoint)
        data = r.json()
        return data
    except:
        raise Exception("There was an issue retrieving data from the OpenWeather API.")


def parse_weather_forecast(journey_timestamp, weather_data):
    """Takes a timestamp and JSON object as input. Returns temp, rainfall, humidity and pressure.

    If there is no weather data for the timestamp entered, then an exception is raised."""

     # intialise variable to check whether weather data for the timestamp has been found in the JSON file
    found = False
    # loop through the weather data to find the closest time/date to the prediction time/date
    for item in weather_data["list"]:
        # for each item, get the date and convert
        dt = item.get("dt")
        timestamp = datetime.datetime.utcfromtimestamp(dt)
        # get the time difference between the input and the date in the file
        time_diff = timestamp - journey_timestamp
        time_diff_hours = time_diff.total_seconds()/3600    # get time_diff in hours
        # if the time difference is less than 3, then use this list item for the weather forecast
        if (0 <= time_diff_hours <= 3):
            found = True
            # extract the relevant weather data from the JSON
            temp = item.get("main").get("temp")
            rhum = item.get("main").get("humidity")
            msl = item.get("main").get("pressure")
            if "rain" in item and "3h" in item["rain"]:
                    rain = item.get("rain").get("3h")
            else:
                rain = 0
            # once weather is found, break out of the loop
            break
    # if weather info was found, return it. Otherwise, raise an exceptions
    if (found):
        return rain, temp, rhum, msl
    else:
        raise Exception("Weather forecast not available for the specified timestamp.")


def convert_to_seconds(hour, minute):
    """Converts the inputted hour and minute values to seconds.
    
    If the hour is less than 4, then it should be treated as part of the last day."""

    if hour > 4:
        seconds = hour*60*60 + minute*60
    else:
        seconds = 86400 + hour*60*60 + minute*60
    return seconds


def is_weekday(day_of_week):
    """Returns 1 if the day of week is mon-fri (0-4), returns 0 otherwise."""
    
    if day_of_week in [0,1,2,3,4]:
        return 1
    return 0


def is_bank_holiday(day, month):
    """Returns 1 if the day and month entered is a bank holiday, returns 0 otherwise.
    
    List of bank holidays will need to be updated periodically. Currently has remaining bank
    holidays in 2019 only."""

    bank_holidays = [(5,8), (28,10), (25,12), (26,12)]
    if (day, month) in bank_holidays:
        return 1
    return 0


def parse_timestamp(timestamp):
    """Function that takes a datetime object as input and returns time in seconds, 
    the hour, day of week and month. Also returns a weekday and bank holiday flag (1 for True)."""

    time_in_seconds = convert_to_seconds(timestamp.hour, timestamp.minute)
    day_of_week = timestamp.weekday()
    day = timestamp.day
    month = timestamp.month
    hour = timestamp.hour
    weekday = is_weekday(day_of_week)
    bank_holiday = is_bank_holiday(day, month)

    return time_in_seconds, day_of_week, month, weekday, bank_holiday, hour


def format_stop_list(stops):
    """Takes a list of stops as input, takes the last 4 characters and converts to int for each stop in 
    the list. If the stop name starts with "gen", uses a dict to get the stop id."""
    formatted_stops = []
    gen_stop_key = {'gen:57102:7743:0:1': 7690,
                    'gen:57102:7730:0:1': 7674,
                    'gen:57102:7731:0:1': 7675,
                    'gen:57102:7732:0:1': 7676,
                    'gen:57102:7733:0:1': 7677,
                    'gen:57102:7948:0:1': 7701,
                    'gen:57102:7943:0:1': 7703}
    for stop in stops:
        if stop[0].startswith("gen"):
            formatted = gen_stop_key[stop[0]]
        else:
            formatted = int(stop[0][-4:])
        formatted_stops.append(formatted)
    return formatted_stops

def predict_journey_time(stops, timestamp):
    """Takes a list of bus stops and a timestamp (unix format) as input. Returns a prediction of journey 
        time in minutes."""

    # convert stops to the correct format
    stops = format_stop_list(stops)
    # convert and parse the timestamp
    timestamp = datetime.datetime.utcfromtimestamp(int(timestamp))
    actualtime_arr_stop_first, day_of_week, month, weekday, bank_holiday, hour = parse_timestamp(timestamp)
    # call the OpenWeather API and parse the response
    weather_data = openweather_forecast()
    rain, temp, rhum, msl = parse_weather_forecast(timestamp, weather_data)
    # make a prediction based on the input and return it
    prediction = route_prediction(stops, actualtime_arr_stop_first, hour, day_of_week, month, \
        weekday, bank_holiday, rain, temp, rhum, msl)
    # return the prediction
    return prediction