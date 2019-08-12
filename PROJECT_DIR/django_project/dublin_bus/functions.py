import os
import pickle
import datetime
import ssl
import aiohttp
import requests
from bs4 import BeautifulSoup
from django.conf import settings
import json
from django_project.settings import BASE_DIR, MAP_KEY
from django.db import connection


def load_model(month):
    """Loads and returns a machine learning model & scaler depending on the month."""
    months = {
        1: "jan",
        2: "feb",
        3: "mar",
        4: "apr",
        5: "may",
        6: "jun",
        7: "jul",
        8: "aug",
        9: "sep",
        10: "oct",
        11: "nov",
        12: "dec"
    }
    month_val = months[month]
    # load the ml model
    model_file = "model_" + month_val + ".sav"
    model_path = os.path.join(settings.ML_MODEL_ROOT, model_file)
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
    # load the scaler
    scaler_file = "scaler_" + month_val + ".sav"
    scaler_path = os.path.join(settings.ML_MODEL_ROOT, scaler_file)
    with open(scaler_path, 'rb') as file:
        scaler = pickle.load(file)
    return model, scaler


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


def create_segment_ref(month):
    """Builds a dictionary that gives the mean & standard deviation for each segment based on month."""

    files = {
        1: 'cache/jan_segments.json',
        2: 'cache/feb_segments.json',
        3: 'cache/mar_segments.json',
        4: 'cache/apr_segments.json',
        5: 'cache/may_segments.json',
        6: 'cache/jun_segments.json',
        7: 'cache/jul_segments.json',
        8: 'cache/aug_segments.json',
        9: 'cache/sep_segments.json',
        10: 'cache/oct_segments.json',
        11: 'cache/nov_segments.json',
        12: 'cache/dec_segments.json'
    }
    filename = files[month]
    path = os.path.join(settings.STATIC_ROOT, filename)
    with open(path) as file:
        segment_mean_ref = json.load(file)
    return segment_mean_ref


def create_segment_ref_gtfs():
    """Builds a dictionary from segment_means_gtfs.JSON that gives the mean value for each segment \
    based on the GTFS data."""

    path = os.path.join(settings.STATIC_ROOT, 'cache/gtfs_segments.json')
    with open(path) as file:
        segment_mean_ref_gtfs = json.load(file)
    return segment_mean_ref_gtfs


def route_prediction(stops, actualtime_arr_stop_first, hour, peak, school_hol, weekday, rain, temp, month):
    """Returns a prediction of journey length in seconds for any bus route.

    Takes a list of stops as input, as well as the arrival time of a bus at the first stop in the list. 
    Also takes as input hour (0-23), weekday (1 for mon-fri, 0 for sat & sun) and peak (1 for peak times, 
    0 for off-peak). Also takes the following weather info as input: rain (in mm), temp (in C). Also takes
    month as input for determining which model to load."""

    # create dictionaries for hour and segment features
    hour_ref = create_hour_feature_ref()
    seg_ref = create_segment_ref(month)
    seg_ref_gtfs = create_segment_ref_gtfs()
    # get hour array from the relevant dictionary
    hour = hour_ref[hour]
    # load the ml model & scaler
    model, scaler = load_model(month)
    # initialise an array to store arrival times at various stops
    arrival_time_at_stop = actualtime_arr_stop_first
    arrival_times = []
    arrival_times.append(arrival_time_at_stop)
    # loop through each set of stops in the list
    for i in range(len(stops) - 1):
        stop_first = stops[i]
        stop_next = stops[i + 1]
        segment = str(stop_first) + "_" + str(stop_next)
        if segment in seg_ref:
            segment_mean = seg_ref[segment]["mean"]
            segment_std = seg_ref[segment]["std"]
        elif segment in seg_ref_gtfs:
            segment_mean = seg_ref_gtfs[segment]["mean"]
            segment_std = seg_ref_gtfs[segment]["std"]
        else:
            segment_mean = 65
            segment_std = 57
            print("Unexpected segment encountered! Using default values for mean and standard deviation...")
        # specify the input for the prediction
        if month in [5, 6, 7, 8, 9]:
            input = [[arrival_time_at_stop, segment_mean, weekday, segment_std, peak, rain, temp] + hour]
        else:
            input = [[arrival_time_at_stop, segment_mean, weekday, segment_std, peak, school_hol, rain, temp] + hour]
        input_scaled = scaler.transform(input)
        # get a prediction and append updated arrival_time to the list
        prediction = (model.predict(input_scaled))
        if prediction[0] <= 0:
            arrival_times.append(arrival_time_at_stop)
        else:
            arrival_time_at_stop = arrival_time_at_stop + prediction[0]
            arrival_times.append(arrival_time_at_stop)
    # calculate the time for the full trip
    full_trip = arrival_times[len(arrival_times) - 1] - arrival_times[0]
    return int(full_trip)


def openweather_forecast():
    """This function calls the Openweather API to get a weather forecast. 
    
    Data is returned as a JSON object."""

    # call the API using the ID for Dublin City: 7778677
    api_endpoint = "http://api.openweathermap.org/data/2.5/forecast?id=7778677&units=metric&APPID=" \
                   + settings.OPENWEATHER_KEY

    try:
        # retrieve weather forecast from the OpenWeather API and convert to JSON object
        r = requests.get(url=api_endpoint)
        data = r.json()
        if data["cod"] != '200':
            print("There was an issue retrieving data from the OpenWeather API, using default values.")
            return -1
        return data
    except:
        print("There was an issue retrieving data from the OpenWeather API, using default values.")
        return -1


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
        time_diff_hours = time_diff.total_seconds() / 3600  # get time_diff in hours
        # if the time difference is less than 3, then use this list item for the weather forecast
        if (0 <= time_diff_hours <= 3):
            found = True
            # extract the relevant weather data from the JSON
            temp = item.get("main").get("temp")
            if "rain" in item and "3h" in item["rain"]:
                rain = item.get("rain").get("3h") / 3
            else:
                rain = 0
            # once weather is found, break out of the loop
            break
    # if weather info was found, return it. Otherwise, raise an exceptions
    if (found):
        return rain, temp
    else:
        print("Weather forecast not found, using default values.")
        rain, temp = get_weather_defaults(timestamp.month)
        return rain, temp


def convert_to_seconds(hour, minute):
    """Converts the inputted hour and minute values to seconds.
    
    If the hour is less than 3, then it should be treated as part of the last day."""

    if hour > 3:
        seconds = hour * 60 * 60 + minute * 60
    else:
        seconds = 86400 + hour * 60 * 60 + minute * 60
    return seconds


def is_weekday(day_of_week):
    """Returns 1 if the day of week is mon-fri (0-4), returns 0 otherwise."""

    if day_of_week in [0, 1, 2, 3, 4]:
        return 1
    return 0


def is_bank_holiday(day, month):
    """Returns 1 if the day and month entered is a bank holiday, returns 0 otherwise.
    
    List of bank holidays will need to be updated periodically. Currently has remaining bank
    holidays in 2019 only."""

    bank_holidays = [(5, 8), (28, 10), (25, 12), (26, 12)]
    if (day, month) in bank_holidays:
        return 1
    return 0


def parse_timestamp(timestamp):
    """Function that takes a datetime object as input and returns time in seconds, 
    the hour, and month. Also returns a weekday flag (1 for Mon-Fri, 0 for Sat, Sun & Bank Holidays)."""

    time_in_seconds = convert_to_seconds(timestamp.hour, timestamp.minute)
    weekday = is_weekday(timestamp.weekday())
    if is_bank_holiday(timestamp.day, timestamp.month) == 1:
        weekday = 0
    school_hol = is_school_holiday(timestamp.day, timestamp.month)
    peak = is_peak(timestamp.hour, weekday)
    return time_in_seconds, weekday, timestamp.hour, peak, school_hol


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


def predict_journey_time(stops, timestamp, rain, temp):
    """Takes a list of bus stops and a timestamp (unix format) as input. Returns a prediction of journey 
        time in minutes."""

    # if stops is an empty list, return -1
    if len(stops) <= 1:
        return -1
    # convert stops to the correct format
    stops = format_stop_list(stops)
    # convert and parse the timestamp
    timestamp = datetime.datetime.utcfromtimestamp(int(timestamp))
    actualtime_arr_stop_first, weekday, hour, peak, school_hol = parse_timestamp(timestamp)
    # make a prediction based on the input and return it
    prediction = route_prediction(stops, actualtime_arr_stop_first, hour, peak, school_hol, weekday, rain, temp,
                                  timestamp.month)
    # return the prediction
    return prediction


def get_service_id(weekday, bank_holiday):
    if weekday == 1 and bank_holiday == 0:
        return 1
    elif weekday == 5 and bank_holiday == 0:
        return 3
    else:
        return 2


async def get_real_time_data_bk(stop_id):
    headers = {
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"}
    # resp = requests.get(
    #     "https://www.dublinbus.ie/RTPI/Sources-of-Real-Time-Information/?searchtype=view&searchquery=" + stop_id,
    #     headers=headers)

    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
    session = aiohttp.ClientSession()
    resp = await session.get(
        "https://www.dublinbus.ie/RTPI/Sources-of-Real-Time-Information/?searchtype=view&searchquery=" + stop_id,
        headers=headers, ssl=ssl_context)
    data = []
    real_time_info = {stop_id: data}
    if resp.status == 200:
        content = await resp.text()
        await session.close()
        soup = BeautifulSoup(content, features="lxml")
        slots1 = soup.find_all('tr', class_='odd')
        slots2 = soup.find_all('tr', class_='even')
        arr = []
        for s in slots1:
            for i in s.findChildren("td"):
                arr.append(i.text.strip())
        for s in slots2:
            for i in s.findChildren("td"):
                arr.append(i.text.strip())
        temp = []
        for item in arr:
            if item == '':
                data.append(temp)
                temp = []
                continue
            temp.append(item)
    data.sort(key=lambda x: x[2])
    while len(data) != 0 and data[-1][2] == 'Due':
        due = data.pop(-1)
        data.insert(0, due)

    return real_time_info


def get_trip_id(direction, service_id, current_time, route_id):
    path = os.path.join(BASE_DIR, '../bus_info/timetable/route_' + route_id + '_time_table.json')
    slots = []
    with open(path, 'r') as json_file:
        timetable = json.load(json_file)[direction][str(service_id)]
        for i in range(len(timetable)):
            while timetable[i][0] <= current_time <= timetable[i][1]:
                try:
                    slots.append(timetable[i][2])
                    slots.append(timetable[i + 1][2])
                    slots.append(timetable[i + 2][2])
                    slots.append(timetable[i + 3][2])
                    slots.append(timetable[i + 4][2])
                except ValueError as e:
                    print(e)
                finally:
                    return slots


def get_trip_info(trip_ids, service_id, direction, route_id):
    if not trip_ids:
        return []
    path = os.path.join(BASE_DIR, '../bus_info/routes/route_' + route_id + '.json')
    infos = []
    print(trip_ids)
    with open(path, 'r') as json_file:
        data = json.load(json_file)[direction][str(service_id)]
        for trip_id in trip_ids:
            infos.append(data[trip_id])
    return infos


def calculate_time_diff(trips, time):
    if len(trips) == 0:
        return []
    i = 1
    stops_list = []
    while i <= len(trips[0]):
        # t = 0
        # while t < len(trips) and (trips[t][str(i)][2] - time) // 60 < 0:
        #     t += 1
        # print(trips[t])
        # stops_list.append(
        #     [trips[t][str(i)][0][-4:], trips[t][str(i)][1], (trips[t][str(i)][2] - time) // 60, trips[t][str(i)][3]])
        stops_list.append(
            [trips[0][str(i)][0][-4:], trips[0][str(i)][1], (trips[0][str(i)][2] - time) // 60, trips[0][str(i)][3]])

        i += 1
    return stops_list


def get_stop_list(route_id, headsign, start_point, end_point, num_stops, departure_time):
    """Returns the list of stops that the bus will travel along between the user's origin and destination."""
    # format some of the input values as required for database queries
    start_point = start_point.strip()
    end_point = end_point.strip()
    headsign = headsign.strip()
    stop_list = []
    # get the relevant service id based on the departure time
    service_id = get_current_service_id(departure_time)
    # get the bus stop id of the start point
    start_point_id = get_start_point_id(route_id, headsign, start_point, end_point, num_stops, departure_time,
                                        service_id)
    # if -1 was returned, the bus stop id could not be found so return an empty array
    if start_point_id == -1:
        return []
    # get all stops that the bus will travel along on its full route
    all_stops = get_all_stops(service_id, route_id, start_point_id, headsign, departure_time)
    # get the list of stops that the bus will travel along between the user's origin and destination
    stop_list = get_stop_list_start_point(all_stops, start_point_id, num_stops)
    return stop_list


def get_start_point_id(route_id, headsign, start_point, end_point, num_stops, departure_time, service_id):
    """Returns the bus stop id of the start point based on the input."""
    with connection.cursor() as cursor:
        sql = "select distinct s.stop_id from stops s, stop_times st, routes r \
                where r.route_short_name = %s \
                and s.stop_name = %s \
                and st.stop_headsign = %s;"
        cursor.execute(sql, [route_id, start_point, headsign])
        if cursor.rowcount == 0:
            print("No bus stops found for start point: " + start_point)
            start_point_id = get_start_point_from_end_point(route_id, headsign, end_point, num_stops, departure_time,
                                                            service_id, 0)
        elif cursor.rowcount == 1:
            start_point_id = cursor.fetchone()[0]
            print("Bus stop found for start point: " + start_point)
        else:
            print("Multiple bus stops found for start point: " + start_point)
            start_point_id = get_start_point_from_end_point(route_id, headsign, end_point, num_stops, departure_time,
                                                            service_id, 1)
            if start_point_id == -1:
                print("Choosing a stop from start point options.")
                start_point_id = get_stop_from_multiple(service_id, route_id, start_point, headsign, departure_time,
                                                        num_stops, 1)
    return start_point_id


def get_start_point_from_end_point(route_id, headsign, end_point, num_stops, departure_time, service_id,
                                   multiple_start):
    """Returns the bus stop id of the start point based on the end point. multiple_start will be 1 if multiple \
        start points were found, it will be 0 if no start points were found."""
    with connection.cursor() as cursor:
        sql = "select distinct s.stop_id from stops s, stop_times st, routes r \
                where r.route_short_name = %s \
                and s.stop_name = %s \
                and st.stop_headsign = %s;"
        cursor.execute(sql, [route_id, end_point, headsign])
        if cursor.rowcount == 0:
            print("No bus stops found for end point: " + end_point)
            return -1
        elif cursor.rowcount == 1:
            print("Bus stop found for end point: " + end_point)
            end_point_id = cursor.fetchone()[0]
            all_stops = get_all_stops(service_id, route_id, end_point_id, headsign, departure_time)
            start_point_id = get_start_point_id__from_end_point_id(all_stops, end_point_id, num_stops)
            return start_point_id
        else:
            print("Multiple bus stops found for end point: " + end_point)
            if multiple_start == 1:
                return -1
            else:
                print("Choosing a stop from end point options.")
                end_point_id = get_stop_from_multiple(service_id, route_id, end_point, headsign, departure_time,
                                                      num_stops, 0)
                if end_point_id == -1:
                    return -1
                all_stops = get_all_stops(service_id, route_id, end_point_id, headsign, departure_time)
                start_point_id = get_start_point_id__from_end_point_id(all_stops, end_point_id, num_stops)
                return start_point_id


def get_current_service_id(departure_time):
    """Returns a service id based on the datetime object entered."""
    if is_bank_holiday(departure_time.day, departure_time.month) == 1 or departure_time.weekday() == 6:
        service_id = 'y101d'
    elif departure_time.weekday() == 5:
        service_id = 'y101e'
    else:
        service_id = 'y101c'
    return service_id


def get_all_stops(service_id, route_id, stop_id, headsign, departure_time):
    """Returns a list of all stops on the route based on the input."""
    with connection.cursor() as cursor:
        sql = "select a.stop_id from \
                (select * from stop_times) a \
                JOIN \
                (select t.trip_id \
                from trips t, routes r, stop_times st, stops s	\
                where t.route_id = r.route_id \
                and t.trip_id = st.trip_id \
                and s.stop_id = st.stop_id \
                and t.service_id = %s \
                and r.route_short_name = %s \
                and s.stop_id = %s \
                and st.stop_headsign = %s \
                and (st.arrival_time - TIME(%s)) > 0 \
                order by (st.arrival_time - TIME(%s)) \
                limit 1) as b \
                ON a.trip_id = b.trip_id \
                order by a.stop_sequence;"
        cursor.execute(sql, [service_id, route_id, stop_id, headsign, departure_time, departure_time])
        all_stops = cursor.fetchall()
        return all_stops


def get_stop_list_start_point(all_stops, start_point_id, num_stops):
    """Get a list of stops based on the stop that the user gets on at."""
    index = 0
    for i in range(len(all_stops)):
        if all_stops[i][0] == start_point_id:
            index = i
    if index > 0 and (index + num_stops) < len(all_stops):
        stop_list = all_stops[index:index + num_stops]
    else:
        stop_list = []
    return stop_list


def get_start_point_id__from_end_point_id(all_stops, end_point_id, num_stops):
    """Get a start point id based on the end point id."""
    index = 0
    for i in range(len(all_stops)):
        if all_stops[i][0] == end_point_id:
            index = i
    first_index = index - num_stops + 1
    if first_index < len(all_stops) and first_index > 0:
        start_point_id = all_stops[first_index][0]
    else:
        start_point_id = -1
    return start_point_id


def get_stop_from_multiple(service_id, route_id, stop_name, headsign, departure_time, num_stops, start):
    """Returns a random stop id from those returned. Returns -1 if a valid stop id can't be found."""
    with connection.cursor() as cursor:
        sql = "select distinct s.stop_id from stops s, stop_times st, routes r \
                where r.route_short_name = %s \
                and s.stop_name = %s \
                and st.stop_headsign = %s;"
        cursor.execute(sql, [route_id, stop_name, headsign])
        stop_ids = cursor.fetchall()
        for stop in stop_ids:
            all_stops = get_all_stops(service_id, route_id, stop[0], headsign, departure_time)
            if stop in all_stops:
                if start == 1 and (all_stops.index(stop) + num_stops <= len(all_stops)):
                    return stop[0]
                elif start == 0 and (all_stops.index(stop) - num_stops + 1 >= 0):
                    return stop[0]
        return -1


def get_opening_hour(resp):
    res = []
    if 'opening_hours' in resp:
        weekday = datetime.datetime.now().weekday()
        opening_hour = resp['opening_hours']['weekday_text'][weekday]
        opening_hour = opening_hour[opening_hour.find(":") + 1:]
        res.append(opening_hour)
    else:
        res.append("All day")
    return res


async def clean_resp(resp):
    point = list()
    point.append(resp['name'])
    point.append(resp['formatted_address'][:resp['formatted_address'].find('Dublin') - 2])
    point.append(resp['rating'])
    photo_ref = resp['photos'][0]['photo_reference']
    place_id = resp['place_id']
    session = aiohttp.ClientSession()
    result = await session.get("https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=" + photo_ref + "&key=" + MAP_KEY)
    photo = str(result._real_url)
    # photo = requests.get(
    #     "https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=" + photo_ref + "&key=" + MAP_KEY,
    #     allow_redirects=True).url
    point.append(photo)
    result2= await session.get("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place_id + "&fields=name,opening_hours&key=" + MAP_KEY)
    content = await result2.json()
    await session.close()
    # resp = await requests.get(
    #     "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place_id + "&fields=name,opening_hours&key=" + MAP_KEY).json()[
    #     'result']
    opening_hour = get_opening_hour(content['result'])
    point.append(opening_hour)
    return point


def is_peak(hour, weekday_flag):
    """Takes an hour and weekday flag as input, and returns 1 for peak time and 0 for off-peak."""
    peak_hours = [7, 8, 9, 16, 17, 18]
    if hour in peak_hours and weekday_flag == 1:
        return 1
    return 0


def get_weather_defaults(month):
    path = os.path.join(settings.STATIC_ROOT, 'cache/weather.json')
    with open(path) as file:
        temp_means = json.load(file)
    temp = temp_means[str(month)]
    rain = 0
    return rain, temp


def is_school_holiday(day, month):
    """Returns 1 if the day and month entered is a school holiday, returns 0 otherwise.
    
    List of school holidays will need to be updated periodically. Currently has remaining school
    holidays in 2019 only."""

    school_holidays = [(29, 10), (30, 10), (31, 10), (1, 11), (23, 12), (24, 12), (27, 12), (30, 12), (31, 12)]
    if (day, month) in school_holidays:
        return 1
    return 0


async def get_real_time_data(stop_id):
    session = aiohttp.ClientSession()
    resp = await session.get(
        "https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?format=json&operator=bac&stopid=" + stop_id)

    real_time_info = {stop_id: []}
    if resp.status == 200:
        content = await resp.json()
        await session.close()
        for i in content['results']:
            temp = [i['route'], i['destination'], i['duetime']]
            real_time_info[stop_id].append(temp)
    return real_time_info
