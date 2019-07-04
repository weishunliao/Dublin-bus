import os
import pickle
from django.conf import settings

def load_model(route):
    """Loads and returns a machine learning model for the specified bus route."""
    if route == '15A':
        model_name = '15A_model.sav'
    else:
        raise Exception(route + " is not a valid bus route!")
    path = os.path.join(settings.MODEL_ROOT, model_name)
    with open(path, 'rb') as file:
        model = pickle.load(file)
    return model

def create_stop_feature_ref(stop_list):
    """Builds a dictionary with stop numbers as key and 1D lists as values.

    In each 1D list, one element will have the value 1, and all others will have the value 0.
    Stops in the input list must be in the order that they appear as features in the ml model."""
    stop_feature_ref = {}
    for i in stop_list:
        stop_array = [0] * len(stop_list)
        for j in range(len(stop_list)):
            if i == stop_list[j]:
                stop_array[j] = 1
        stop_feature_ref[i] = stop_array
        
    return stop_feature_ref

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

def route_prediction_15A(stops, actualtime_arr_stop_first, day_of_week, month, weekday, bank_holiday,  
    rain, temp, rhum, msl):
    """Returns a prediction of journey length in seconds for the 15A bus route.

    Takes a list of stops as input, as well as the arrival time of a bus at the first stop in the list. 
    Also takes as input day_of_week (0-6 for mon-sun), month(1-12 for jan-dec), weekday (1 for mon-fri, 
    0 for sat & sun) and bank holiday (1 if the journey date is a bank holiday, 0 otherwise). Also takes 
    the following weather info as input: rain (in mm), temp (in C), rhum - relative humidity (%) and 
    msl - mean sea level pressure (hPa)."""

    first_stop_list = [340.0,350.0,351.0,352.0,353.0,395.0,396.0,397.0,398.0,399.0,400.0,407.0,1016.0,1017.0,1018.0,1019.0,1020.0,1069.0,1070.0,1071.0,1072.0,1076.0,1077.0,1078.0,1079.0,1080.0,1081.0,1082.0,1083.0,1085.0,1086.0,1087.0,1088.0,1089.0,1090.0,1091.0,1092.0,1093.0,1094.0,1095.0,1096.0,1101.0,1102.0,1103.0,1105.0,1107.0,1108.0,1109.0,1110.0,1111.0,1112.0,1113.0,1114.0,1115.0,1117.0,1118.0,1119.0,1120.0,1164.0,1165.0,1166.0,1167.0,1168.0,1169.0,1170.0,1283.0,1285.0,1353.0,1354.0,2437.0,2498.0,2499.0,4528.0,7216.0,7558.0,7577.0,7578.0,7579.0,7581.0,7582.0,7589.0]
    second_stop_list = [340.0,350.0,351.0,352.0,353.0,354.0,396.0,397.0,398.0,399.0,400.0,407.0,1016.0,1017.0,1018.0,1019.0,1020.0,1069.0,1070.0,1071.0,1072.0,1076.0,1077.0,1078.0,1079.0,1080.0,1081.0,1082.0,1083.0,1085.0,1086.0,1087.0,1088.0,1089.0,1090.0,1091.0,1092.0,1093.0,1094.0,1095.0,1096.0,1101.0,1102.0,1103.0,1104.0,1107.0,1108.0,1109.0,1110.0,1111.0,1112.0,1113.0,1114.0,1115.0,1117.0,1118.0,1119.0,1120.0,1164.0,1165.0,1166.0,1167.0,1168.0,1169.0,1170.0,1283.0,1285.0,1353.0,1354.0,2437.0,2498.0,2499.0,4528.0,7216.0,7558.0,7577.0,7578.0,7579.0,7581.0,7582.0,7589.0]
    # create dictionaries for day_of_week, month and bus stop features
    day_of_week_ref = create_day_of_week_feature_ref()
    month_ref = create_month_feature_ref()
    first_stop_ref = create_stop_feature_ref(first_stop_list)
    second_stop_ref = create_stop_feature_ref(second_stop_list)
    # get day of week and month from the relevant dictionaries
    day_of_week = day_of_week_ref[day_of_week]
    month = month_ref[month]
    # load the ml model
    linreg = load_model("15A")
    # initiate an array to store all predictions
    predictions = []
    # loop through each set of stops in the list
    for i in range(len(stops)-1):
        stop_first = stops[i]
        stop_next = stops[i+1]
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