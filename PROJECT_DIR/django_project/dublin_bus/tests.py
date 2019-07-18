from django.test import TestCase, Client
from datetime import datetime
from dublin_bus import functions


class TestLoadModel(TestCase):
    """Test cases for the load_model function."""

    def test_load_model_success(self):
        """Test to ensure that a model is loaded correctly."""
        try:
            functions.load_model("15A")
        except Exception as e:
            self.fail("load_model() raised an exception unexpectedly!\n Error is:" + e)

    def test_load_model_invalid_route(self):
        """Test to ensure that an error is raised if an invalid route is entered."""
        with self.assertRaises(Exception):
            functions.load_model("15K")


class TestCreateStopFeatureRef(TestCase):
    """Test cases for the create_stop_feature_ref function."""

    def test_create_stop_feature_ref(self):
        """Test for the ouput of the create_stop_feature_ref function."""
        stop_list = [11, 234, 1108]
        stop_feature_ref = {
            11: [1, 0, 0],
            234: [0, 1, 0],
            1108: [0, 0, 1]
        }
        self.assertEqual(functions.create_stop_feature_ref(stop_list), stop_feature_ref)


class TestCreateDayOfWeekFeatureRef(TestCase):
    """Test cases for the create_day_of_week_feature_ref function."""

    def test_create_day_of_week_feature_ref(self):
        """Test for the ouput of the create_day_of_week_feature_ref function."""
        day_of_week_ref = {
            0: [1, 0, 0, 0, 0, 0, 0],
            1: [0, 1, 0, 0, 0, 0, 0],
            2: [0, 0, 1, 0, 0, 0, 0],
            3: [0, 0, 0, 1, 0, 0, 0],
            4: [0, 0, 0, 0, 1, 0, 0],
            5: [0, 0, 0, 0, 0, 1, 0],
            6: [0, 0, 0, 0, 0, 0, 1]
        }
        self.assertEqual(functions.create_day_of_week_feature_ref(), day_of_week_ref)


class TestCreateMonthFeatureRef(TestCase):
    """Test cases for the create_month_feature_ref function."""

    def test_create_month_feature_ref(self):
        """Test for the ouput of the create_month_feature_ref function."""
        month_ref = {
            1: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            2: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            3: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            4: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            5: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            6: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            7: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            8: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            9: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            11: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            12: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
        }
        self.assertEqual(functions.create_month_feature_ref(), month_ref)


class TestRoutePrediction15A(TestCase):
    """Test cases for the route_prediction_15A function."""

    def test_route_prediction_15A_limekiln(self):
        """Test for the ouput of the route_prediction_15A function going in the Limekiln direction."""
        stops = [395, 396, 397, 398, 399, 400, 7581, 1283, 7579, 1285, 1016, 1017, 1018, 1019, 1020, 1076, 1077, 1078,
                 1079, 1080, \
                 1081, 1082, 1083, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1101, 1102,
                 1103, 1104]
        rain = 0.1
        temp = 15
        rhum = 75
        msl = 1000
        actualtime_arr_stop_first = 32400  # 9:00
        day_of_week = 4  # monday
        month = 7  # july
        weekday = 1
        bank_holiday = 0
        self.assertEqual(functions.route_prediction_15A(stops, actualtime_arr_stop_first, day_of_week, month, \
                                                        weekday, bank_holiday, rain, temp, rhum, msl), 2573)

    def test_route_prediction_15A_ringsend(self):
        """Test for the ouput of the route_prediction_15A function going in the Ringsend direction."""
        stops = [1105, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115, 2437, 1117, 1118, 1119, 1120, 1164, 1165,
                 1166, 1167, \
                 1168, 1169, 1170, 1069, 1070, 1071, 4528, 1072, 7577, 1353, 1354, 7578, 7582, 340, 350, 351, 352, 353,
                 354]
        rain = 0.1
        temp = 15
        rhum = 75
        msl = 1000
        actualtime_arr_stop_first = 32400  # 9:00
        day_of_week = 4  # monday
        month = 7  # july
        weekday = 1
        bank_holiday = 0
        self.assertEqual(functions.route_prediction_15A(stops, actualtime_arr_stop_first, day_of_week, month, \
                                                        weekday, bank_holiday, rain, temp, rhum, msl), 2646)


class TesParseWeatherForecast(TestCase):
    """Test cases for the parse_weather_forecast function."""

    def test_parse_weather_forecast_found(self):
        """Function to test the parse_weather_forecast function when forecast is found for the timestamp."""
        weather_data = {"cod": "200", "message": 0.0066, "cnt": 40, "list": [{"dt": 1562338800,
                                                                              "main": {"temp": 18.82, "temp_min": 18.26,
                                                                                       "temp_max": 18.82,
                                                                                       "pressure": 1019.31,
                                                                                       "sea_level": 1019.31,
                                                                                       "grnd_level": 1009.87,
                                                                                       "humidity": 81, "temp_kf": 0.56},
                                                                              "weather": [{"id": 500, "main": "Rain",
                                                                                           "description": "light rain",
                                                                                           "icon": "10d"}],
                                                                              "clouds": {"all": 100},
                                                                              "wind": {"speed": 3.94, "deg": 271.353},
                                                                              "rain": {"3h": 0.125},
                                                                              "sys": {"pod": "d"},
                                                                              "dt_txt": "2019-07-05 15:00:00"},
                                                                             {"dt": 1562349600,
                                                                              "main": {"temp": 18.11, "temp_min": 17.69,
                                                                                       "temp_max": 18.11,
                                                                                       "pressure": 1017.62,
                                                                                       "sea_level": 1017.62,
                                                                                       "grnd_level": 1008.18,
                                                                                       "humidity": 86, "temp_kf": 0.42},
                                                                              "weather": [{"id": 500, "main": "Rain",
                                                                                           "description": "light rain",
                                                                                           "icon": "10d"}],
                                                                              "clouds": {"all": 100},
                                                                              "wind": {"speed": 3.59, "deg": 274.17},
                                                                              "rain": {"3h": 0.063},
                                                                              "sys": {"pod": "d"},
                                                                              "dt_txt": "2019-07-05 18:00:00"}],
                        "city": {"id": 7778677, "name": "Dublin City", "coord": {"lat": 53.3551, "lon": -6.2493},
                                 "country": "IE", "timezone": 3600}}
        timestamp = datetime.strptime('Jul 5 2019  2:30PM', '%b %d %Y %I:%M%p')
        self.assertEqual(functions.parse_weather_forecast(timestamp, weather_data), (0.125, 18.82, 81, 1019.31))

    def test_parse_weather_forecast_not_found(self):
        """Test that parse_weather_forecast raises an exception when weather info not found for the timestamp."""
        weather_data = {"cod": "200", "message": 0.0066, "cnt": 40, "list": [{"dt": 1562338800,
                                                                              "main": {"temp": 18.82, "temp_min": 18.26,
                                                                                       "temp_max": 18.82,
                                                                                       "pressure": 1019.31,
                                                                                       "sea_level": 1019.31,
                                                                                       "grnd_level": 1009.87,
                                                                                       "humidity": 81, "temp_kf": 0.56},
                                                                              "weather": [{"id": 500, "main": "Rain",
                                                                                           "description": "light rain",
                                                                                           "icon": "10d"}],
                                                                              "clouds": {"all": 100},
                                                                              "wind": {"speed": 3.94, "deg": 271.353},
                                                                              "rain": {"3h": 0.125},
                                                                              "sys": {"pod": "d"},
                                                                              "dt_txt": "2019-07-05 15:00:00"},
                                                                             {"dt": 1562349600,
                                                                              "main": {"temp": 18.11, "temp_min": 17.69,
                                                                                       "temp_max": 18.11,
                                                                                       "pressure": 1017.62,
                                                                                       "sea_level": 1017.62,
                                                                                       "grnd_level": 1008.18,
                                                                                       "humidity": 86, "temp_kf": 0.42},
                                                                              "weather": [{"id": 500, "main": "Rain",
                                                                                           "description": "light rain",
                                                                                           "icon": "10d"}],
                                                                              "clouds": {"all": 100},
                                                                              "wind": {"speed": 3.59, "deg": 274.17},
                                                                              "rain": {"3h": 0.063},
                                                                              "sys": {"pod": "d"},
                                                                              "dt_txt": "2019-07-05 18:00:00"}],
                        "city": {"id": 7778677, "name": "Dublin City", "coord": {"lat": 53.3551, "lon": -6.2493},
                                 "country": "IE", "timezone": 3600}}
        timestamp = datetime.strptime('Jul 4 2019  2:30PM', '%b %d %Y %I:%M%p')
        with self.assertRaises(Exception):
            functions.parse_weather_forecast(timestamp, weather_data)


class TestConvertToSeconds(TestCase):
    """Test cases for the convert_to_seconds function."""

    def test_convert_to_seconds_before_midnight(self):
        """Test that correct value is returned for a timestamp between 4:00 am and midnight."""
        self.assertEqual(functions.convert_to_seconds(9, 30), 34200)

    def test_convert_to_seconds_after_midnight(self):
        """Test that correct value is returned for a timestamp after midnight (but before 4am)."""
        self.assertEqual(functions.convert_to_seconds(00, 20), 87600)

    def test_convert_to_seconds_after_one_am(self):
        """Test that correct value is returned for a timestamp after 1am (but before 4am)."""
        self.assertEqual(functions.convert_to_seconds(1, 20), 91200)


class TestIsWeekday(TestCase):
    """Test cases for the is_weekday function."""

    def test_is_weekday_mon(self):
        """Test that the value 1 is returned for Monday"""
        self.assertEqual(functions.is_weekday(0), 1)

    def test_is_weekday_tue(self):
        """Test that the value 1 is returned for Tuesday"""
        self.assertEqual(functions.is_weekday(1), 1)

    def test_is_weekday_wed(self):
        """Test that the value 1 is returned for Wednesday"""
        self.assertEqual(functions.is_weekday(2), 1)

    def test_is_weekday_thu(self):
        """Test that the value 1 is returned for Thursday"""
        self.assertEqual(functions.is_weekday(3), 1)

    def test_is_weekday_fri(self):
        """Test that the value 1 is returned for Friday"""
        self.assertEqual(functions.is_weekday(4), 1)

    def test_is_weekday_sat(self):
        """Test that the value 0 is returned for Saturday"""
        self.assertEqual(functions.is_weekday(5), 0)

    def test_is_weekday_sun(self):
        """Test that the value 0 is returned for Sunday"""
        self.assertEqual(functions.is_weekday(6), 0)


class TestIsBankHoliday(TestCase):
    """Test cases for the is_bank_holiday function."""

    def test_is_bank_holiday(self):
        """Test that the value 1 is returned for a bank holiday"""
        self.assertEqual(functions.is_bank_holiday(5, 8), 1)

    def test_not_bank_holiday(self):
        """Test that the value 0 is returned for a normal day"""
        self.assertEqual(functions.is_bank_holiday(4, 8), 0)


class TestParseTimestamp(TestCase):
    """Test cases for the parse_timestamp function."""

    def test_parse_timestamp(self):
        """Test that the correct values are returned for a given timestamp."""
        timestamp = datetime.utcfromtimestamp(1562581800)
        self.assertEqual(functions.parse_timestamp(timestamp), (37800, 0, 7, 1, 0))


class TestFormatStopList(TestCase):
    """Test cases for the format_stop_list function."""

    def test_format_stop_list(self):
        """Test that a list is formatted correctly."""
        stop_list = (('8220DB001170', 22), ('8220DB001069', 23), ('8220DB001070', 24), ('8220DB001071', 25), \
                     ('8220DB004528', 26), ('8220DB001072', 27), ('8220DB007577', 28), ('8220DB001353', 29), \
                     ('8220DB001354', 30), ('8220DB007578', 31), ('8220DB007582', 32), ('8220DB000340', 33))
        self.assertEqual(functions.format_stop_list(stop_list), [1170, 1069, 1070, 1071, 4528, 1072, 7577, \
                                                                 1353, 1354, 7578, 7582, 340])


class GetServiceId(TestCase):

    def test_get_service_id1(self):
        self.assertEqual(functions.get_service_id(1, 0), 1)

    def test_get_service_id3(self):
        self.assertEqual(functions.get_service_id(5, 0), 3)

    def test_get_service_id2(self):
        self.assertEqual(functions.get_service_id(3, 0), 2)


class TestGetBusStopList(TestCase):

    def test_get_bus_stop_list(self):
        client = Client()
        resp = client.get('/bus_stop_list_by_route?route_id=15a&direction=in&t=').json()['stops_list']

        self.assertEqual(len(resp), 38)

    def test_calculate_time_diff(self):
        trips = [{'1': ['8230DB001105', 'Greenhills, Greenhills College', 70200, 'Greenhills College - Barrow Street'],
                  '2': ['8230DB001107', 'Greenhills, Limekiln Road (Limekiln Ave)', 70257,
                        'Greenhills College - Barrow Street'],
                  '3': ['8230DB001108', "Greenhills, Saint Peter's School", 70286,
                        'Greenhills College - Barrow Street'],
                  '4': ['8230DB001109', 'Greenhills, Limekiln Road (Mountdown Park)', 70311,
                        'Greenhills College - Barrow Street'],
                  '5': ['8230DB001110', 'Greenhills, Limekiln Road', 70331, 'Greenhills College - Barrow Street'],
                  '6': ['8230DB001111', 'Greenhills, Wellington Lane (Limekiln Drive)', 70356,
                        'Greenhills College - Barrow Street'],
                  '7': ['8230DB001112', 'Whitehall Park', 70429, 'Greenhills College - Barrow Street'],
                  '8': ['8220DB001113', 'Walkinstown, Glendale Park', 70462, 'Greenhills College - Barrow Street'],
                  '9': ['8220DB001114', 'Kimmage, Manor Grove', 70505, 'Greenhills College - Barrow Street'],
                  '10': ['8220DB001115', 'Kimmage, Whitehall Gardens', 70539, 'Greenhills College - Barrow Street'],
                  '11': ['8220DB002437', 'Kimmage, Kimmage Road West (Whitehall Road)', 70590,
                         'Greenhills College - Barrow Street'],
                  '12': ['8220DB001117', 'Terenure, Lavarna Grove', 70654, 'Greenhills College - Barrow Street'],
                  '13': ['8220DB001118', 'Kimmage, Terenure Road', 70715, 'Greenhills College - Barrow Street'],
                  '14': ['8220DB001119', 'Kimmage, Terenure Road West', 70761, 'Greenhills College - Barrow Street'],
                  '15': ['8220DB001120', 'Terenure, Garda Station', 70845, 'Greenhills College - Barrow Street'],
                  '16': ['8220DB001164', 'Terenure, Terenure Road East', 70969, 'Greenhills College - Barrow Street'],
                  '17': ['8220DB001165', 'Rathgar, Terenure Road East', 71030, 'Greenhills College - Barrow Street'],
                  '18': ['8220DB001166', 'Rathgar, Rathgar Road, Winton Avenue', 71092,
                         'Greenhills College - Barrow Street'],
                  '19': ['8220DB001167', 'Rathgar, Rathgar Road (Garville)', 71132,
                         'Greenhills College - Barrow Street'],
                  '20': ['8220DB001168', 'Rathmines, Rathgar Road', 71172, 'Greenhills College - Barrow Street'],
                  '21': ['8220DB001169', 'Rathmines, Rathmines Park', 71212, 'Greenhills College - Barrow Street'],
                  '22': ['8220DB001170', 'Rathmines, Rathgar Road (Lower Rathmines Road)', 71250,
                         'Greenhills College - Barrow Street'],
                  '23': ['8220DB001069', 'Rathmines, Lower Rathmines Road', 71301,
                         'Greenhills College - Barrow Street'],
                  '24': ['8220DB001070', 'Rathmines, Rathmines Town Centre', 71347,
                         'Greenhills College - Barrow Street'],
                  '25': ['8220DB001071', 'Ranelagh, Rathmines Road Lower (Richmond Hill)', 71410,
                         'Greenhills College - Barrow Street'],
                  '26': ['8220DB004528', "Kelly's Corner, Lower Rathmines Road", 71445,
                         'Greenhills College - Barrow Street'],
                  '27': ['8220DB001072', 'Portobello, Richmond Street Sth (Lennox Street)', 71494,
                         'Greenhills College - Barrow Street'],
                  '28': ['8220DB007577', 'Camden Street', 71576, 'Greenhills College - Barrow Street'],
                  '29': ['8220DB001353', 'Dublin City South, Camden Street', 71646,
                         'Greenhills College - Barrow Street'],
                  '30': ['8220DB001354', 'Dublin City South, Aungier Street', 71739,
                         'Greenhills College - Barrow Street'],
                  '31': ['8220DB007578', "Dublin City South, South Great George's Street", 71862,
                         'Greenhills College - Barrow Street'],
                  '32': ['8220DB007582', 'Temple Bar, Central Bank', 72045, 'Greenhills College - Barrow Street'],
                  '33': ['8220DB000340', 'Dublin City South, Pearse Street Garda Station', 72372,
                         'Greenhills College - Barrow Street'],
                  '34': ['8220DB000350', 'Dublin City South, Lower Sandwith Street', 72457,
                         'Greenhills College - Barrow Street'],
                  '35': ['8220DB000351', 'Pearse Station, Pearse Street', 72558, 'Greenhills College - Barrow Street'],
                  '36': ['8220DB000352', 'Grand Canal Dock, Pearse Square', 72605,
                         'Greenhills College - Barrow Street'],
                  '37': ['8220DB000353', 'Grand Canal Dock, Pearse Street', 72650,
                         'Greenhills College - Barrow Street'],
                  '38': ['8220DB000354', 'Grand Canal Dock, Barrow Street', 72701,
                         'Greenhills College - Barrow Street']},
                 {'1': ['8230DB001105', 'Greenhills, Greenhills College', 72000, 'Greenhills College - Barrow Street'],
                  '2': ['8230DB001107', 'Greenhills, Limekiln Road (Limekiln Ave)', 72057,
                        'Greenhills College - Barrow Street'],
                  '3': ['8230DB001108', "Greenhills, Saint Peter's School", 72086,
                        'Greenhills College - Barrow Street'],
                  '4': ['8230DB001109', 'Greenhills, Limekiln Road (Mountdown Park)', 72111,
                        'Greenhills College - Barrow Street'],
                  '5': ['8230DB001110', 'Greenhills, Limekiln Road', 72131, 'Greenhills College - Barrow Street'],
                  '6': ['8230DB001111', 'Greenhills, Wellington Lane (Limekiln Drive)', 72156,
                        'Greenhills College - Barrow Street'],
                  '7': ['8230DB001112', 'Whitehall Park', 72229, 'Greenhills College - Barrow Street'],
                  '8': ['8220DB001113', 'Walkinstown, Glendale Park', 72262, 'Greenhills College - Barrow Street'],
                  '9': ['8220DB001114', 'Kimmage, Manor Grove', 72305, 'Greenhills College - Barrow Street'],
                  '10': ['8220DB001115', 'Kimmage, Whitehall Gardens', 72339, 'Greenhills College - Barrow Street'],
                  '11': ['8220DB002437', 'Kimmage, Kimmage Road West (Whitehall Road)', 72390,
                         'Greenhills College - Barrow Street'],
                  '12': ['8220DB001117', 'Terenure, Lavarna Grove', 72454, 'Greenhills College - Barrow Street'],
                  '13': ['8220DB001118', 'Kimmage, Terenure Road', 72515, 'Greenhills College - Barrow Street'],
                  '14': ['8220DB001119', 'Kimmage, Terenure Road West', 72561, 'Greenhills College - Barrow Street'],
                  '15': ['8220DB001120', 'Terenure, Garda Station', 72645, 'Greenhills College - Barrow Street'],
                  '16': ['8220DB001164', 'Terenure, Terenure Road East', 72769, 'Greenhills College - Barrow Street'],
                  '17': ['8220DB001165', 'Rathgar, Terenure Road East', 72830, 'Greenhills College - Barrow Street'],
                  '18': ['8220DB001166', 'Rathgar, Rathgar Road, Winton Avenue', 72892,
                         'Greenhills College - Barrow Street'],
                  '19': ['8220DB001167', 'Rathgar, Rathgar Road (Garville)', 72932,
                         'Greenhills College - Barrow Street'],
                  '20': ['8220DB001168', 'Rathmines, Rathgar Road', 72972, 'Greenhills College - Barrow Street'],
                  '21': ['8220DB001169', 'Rathmines, Rathmines Park', 73012, 'Greenhills College - Barrow Street'],
                  '22': ['8220DB001170', 'Rathmines, Rathgar Road (Lower Rathmines Road)', 73050,
                         'Greenhills College - Barrow Street'],
                  '23': ['8220DB001069', 'Rathmines, Lower Rathmines Road', 73101,
                         'Greenhills College - Barrow Street'],
                  '24': ['8220DB001070', 'Rathmines, Rathmines Town Centre', 73147,
                         'Greenhills College - Barrow Street'],
                  '25': ['8220DB001071', 'Ranelagh, Rathmines Road Lower (Richmond Hill)', 73210,
                         'Greenhills College - Barrow Street'],
                  '26': ['8220DB004528', "Kelly's Corner, Lower Rathmines Road", 73245,
                         'Greenhills College - Barrow Street'],
                  '27': ['8220DB001072', 'Portobello, Richmond Street Sth (Lennox Street)', 73294,
                         'Greenhills College - Barrow Street'],
                  '28': ['8220DB007577', 'Camden Street', 73376, 'Greenhills College - Barrow Street'],
                  '29': ['8220DB001353', 'Dublin City South, Camden Street', 73446,
                         'Greenhills College - Barrow Street'],
                  '30': ['8220DB001354', 'Dublin City South, Aungier Street', 73539,
                         'Greenhills College - Barrow Street'],
                  '31': ['8220DB007578', "Dublin City South, South Great George's Street", 73662,
                         'Greenhills College - Barrow Street'],
                  '32': ['8220DB007582', 'Temple Bar, Central Bank', 73845, 'Greenhills College - Barrow Street'],
                  '33': ['8220DB000340', 'Dublin City South, Pearse Street Garda Station', 74172,
                         'Greenhills College - Barrow Street'],
                  '34': ['8220DB000350', 'Dublin City South, Lower Sandwith Street', 74257,
                         'Greenhills College - Barrow Street'],
                  '35': ['8220DB000351', 'Pearse Station, Pearse Street', 74358, 'Greenhills College - Barrow Street'],
                  '36': ['8220DB000352', 'Grand Canal Dock, Pearse Square', 74405,
                         'Greenhills College - Barrow Street'],
                  '37': ['8220DB000353', 'Grand Canal Dock, Pearse Street', 74450,
                         'Greenhills College - Barrow Street'],
                  '38': ['8220DB000354', 'Grand Canal Dock, Barrow Street', 74501,
                         'Greenhills College - Barrow Street']},
                 {'1': ['8230DB001105', 'Greenhills, Greenhills College', 73800, 'Greenhills College - Barrow Street'],
                  '2': ['8230DB001107', 'Greenhills, Limekiln Road (Limekiln Ave)', 73850,
                        'Greenhills College - Barrow Street'],
                  '3': ['8230DB001108', "Greenhills, Saint Peter's School", 73875,
                        'Greenhills College - Barrow Street'],
                  '4': ['8230DB001109', 'Greenhills, Limekiln Road (Mountdown Park)', 73893,
                        'Greenhills College - Barrow Street'],
                  '5': ['8230DB001110', 'Greenhills, Limekiln Road', 73908, 'Greenhills College - Barrow Street'],
                  '6': ['8230DB001111', 'Greenhills, Wellington Lane (Limekiln Drive)', 73927,
                        'Greenhills College - Barrow Street'],
                  '7': ['8230DB001112', 'Whitehall Park', 73983, 'Greenhills College - Barrow Street'],
                  '8': ['8220DB001113', 'Walkinstown, Glendale Park', 74012, 'Greenhills College - Barrow Street'],
                  '9': ['8220DB001114', 'Kimmage, Manor Grove', 74050, 'Greenhills College - Barrow Street'],
                  '10': ['8220DB001115', 'Kimmage, Whitehall Gardens', 74079, 'Greenhills College - Barrow Street'],
                  '11': ['8220DB002437', 'Kimmage, Kimmage Road West (Whitehall Road)', 74123,
                         'Greenhills College - Barrow Street'],
                  '12': ['8220DB001117', 'Terenure, Lavarna Grove', 74175, 'Greenhills College - Barrow Street'],
                  '13': ['8220DB001118', 'Kimmage, Terenure Road', 74207, 'Greenhills College - Barrow Street'],
                  '14': ['8220DB001119', 'Kimmage, Terenure Road West', 74232, 'Greenhills College - Barrow Street'],
                  '15': ['8220DB001120', 'Terenure, Garda Station', 74277, 'Greenhills College - Barrow Street'],
                  '16': ['8220DB001164', 'Terenure, Terenure Road East', 74342, 'Greenhills College - Barrow Street'],
                  '17': ['8220DB001165', 'Rathgar, Terenure Road East', 74390, 'Greenhills College - Barrow Street'],
                  '18': ['8220DB001166', 'Rathgar, Rathgar Road, Winton Avenue', 74438,
                         'Greenhills College - Barrow Street'],
                  '19': ['8220DB001167', 'Rathgar, Rathgar Road (Garville)', 74469,
                         'Greenhills College - Barrow Street'],
                  '20': ['8220DB001168', 'Rathmines, Rathgar Road', 74500, 'Greenhills College - Barrow Street'],
                  '21': ['8220DB001169', 'Rathmines, Rathmines Park', 74531, 'Greenhills College - Barrow Street'],
                  '22': ['8220DB001170', 'Rathmines, Rathgar Road (Lower Rathmines Road)', 74559,
                         'Greenhills College - Barrow Street'],
                  '23': ['8220DB001069', 'Rathmines, Lower Rathmines Road', 74594,
                         'Greenhills College - Barrow Street'],
                  '24': ['8220DB001070', 'Rathmines, Rathmines Town Centre', 74626,
                         'Greenhills College - Barrow Street'],
                  '25': ['8220DB001071', 'Ranelagh, Rathmines Road Lower (Richmond Hill)', 74670,
                         'Greenhills College - Barrow Street'],
                  '26': ['8220DB004528', "Kelly's Corner, Lower Rathmines Road", 74703,
                         'Greenhills College - Barrow Street'],
                  '27': ['8220DB001072', 'Portobello, Richmond Street Sth (Lennox Street)', 74748,
                         'Greenhills College - Barrow Street'],
                  '28': ['8220DB007577', 'Camden Street', 74822, 'Greenhills College - Barrow Street'],
                  '29': ['8220DB001353', 'Dublin City South, Camden Street', 74885,
                         'Greenhills College - Barrow Street'],
                  '30': ['8220DB001354', 'Dublin City South, Aungier Street', 74968,
                         'Greenhills College - Barrow Street'],
                  '31': ['8220DB007578', "Dublin City South, South Great George's Street", 75083,
                         'Greenhills College - Barrow Street'],
                  '32': ['8220DB007582', 'Temple Bar, Central Bank', 75207, 'Greenhills College - Barrow Street'],
                  '33': ['8220DB000340', 'Dublin City South, Pearse Street Garda Station', 75428,
                         'Greenhills College - Barrow Street'],
                  '34': ['8220DB000350', 'Dublin City South, Lower Sandwith Street', 75497,
                         'Greenhills College - Barrow Street'],
                  '35': ['8220DB000351', 'Pearse Station, Pearse Street', 75572, 'Greenhills College - Barrow Street'],
                  '36': ['8220DB000352', 'Grand Canal Dock, Pearse Square', 75607,
                         'Greenhills College - Barrow Street'],
                  '37': ['8220DB000353', 'Grand Canal Dock, Pearse Street', 75640,
                         'Greenhills College - Barrow Street'],
                  '38': ['8220DB000354', 'Grand Canal Dock, Barrow Street', 75678,
                         'Greenhills College - Barrow Street']},
                 {'1': ['8230DB001105', 'Greenhills, Greenhills College', 75600, 'Greenhills College - Barrow Street'],
                  '2': ['8230DB001107', 'Greenhills, Limekiln Road (Limekiln Ave)', 75650,
                        'Greenhills College - Barrow Street'],
                  '3': ['8230DB001108', "Greenhills, Saint Peter's School", 75675,
                        'Greenhills College - Barrow Street'],
                  '4': ['8230DB001109', 'Greenhills, Limekiln Road (Mountdown Park)', 75693,
                        'Greenhills College - Barrow Street'],
                  '5': ['8230DB001110', 'Greenhills, Limekiln Road', 75708, 'Greenhills College - Barrow Street'],
                  '6': ['8230DB001111', 'Greenhills, Wellington Lane (Limekiln Drive)', 75727,
                        'Greenhills College - Barrow Street'],
                  '7': ['8230DB001112', 'Whitehall Park', 75783, 'Greenhills College - Barrow Street'],
                  '8': ['8220DB001113', 'Walkinstown, Glendale Park', 75812, 'Greenhills College - Barrow Street'],
                  '9': ['8220DB001114', 'Kimmage, Manor Grove', 75850, 'Greenhills College - Barrow Street'],
                  '10': ['8220DB001115', 'Kimmage, Whitehall Gardens', 75879, 'Greenhills College - Barrow Street'],
                  '11': ['8220DB002437', 'Kimmage, Kimmage Road West (Whitehall Road)', 75923,
                         'Greenhills College - Barrow Street'],
                  '12': ['8220DB001117', 'Terenure, Lavarna Grove', 75975, 'Greenhills College - Barrow Street'],
                  '13': ['8220DB001118', 'Kimmage, Terenure Road', 76007, 'Greenhills College - Barrow Street'],
                  '14': ['8220DB001119', 'Kimmage, Terenure Road West', 76032, 'Greenhills College - Barrow Street'],
                  '15': ['8220DB001120', 'Terenure, Garda Station', 76077, 'Greenhills College - Barrow Street'],
                  '16': ['8220DB001164', 'Terenure, Terenure Road East', 76142, 'Greenhills College - Barrow Street'],
                  '17': ['8220DB001165', 'Rathgar, Terenure Road East', 76190, 'Greenhills College - Barrow Street'],
                  '18': ['8220DB001166', 'Rathgar, Rathgar Road, Winton Avenue', 76238,
                         'Greenhills College - Barrow Street'],
                  '19': ['8220DB001167', 'Rathgar, Rathgar Road (Garville)', 76269,
                         'Greenhills College - Barrow Street'],
                  '20': ['8220DB001168', 'Rathmines, Rathgar Road', 76300, 'Greenhills College - Barrow Street'],
                  '21': ['8220DB001169', 'Rathmines, Rathmines Park', 76331, 'Greenhills College - Barrow Street'],
                  '22': ['8220DB001170', 'Rathmines, Rathgar Road (Lower Rathmines Road)', 76359,
                         'Greenhills College - Barrow Street'],
                  '23': ['8220DB001069', 'Rathmines, Lower Rathmines Road', 76394,
                         'Greenhills College - Barrow Street'],
                  '24': ['8220DB001070', 'Rathmines, Rathmines Town Centre', 76426,
                         'Greenhills College - Barrow Street'],
                  '25': ['8220DB001071', 'Ranelagh, Rathmines Road Lower (Richmond Hill)', 76470,
                         'Greenhills College - Barrow Street'],
                  '26': ['8220DB004528', "Kelly's Corner, Lower Rathmines Road", 76503,
                         'Greenhills College - Barrow Street'],
                  '27': ['8220DB001072', 'Portobello, Richmond Street Sth (Lennox Street)', 76548,
                         'Greenhills College - Barrow Street'],
                  '28': ['8220DB007577', 'Camden Street', 76622, 'Greenhills College - Barrow Street'],
                  '29': ['8220DB001353', 'Dublin City South, Camden Street', 76685,
                         'Greenhills College - Barrow Street'],
                  '30': ['8220DB001354', 'Dublin City South, Aungier Street', 76768,
                         'Greenhills College - Barrow Street'],
                  '31': ['8220DB007578', "Dublin City South, South Great George's Street", 76883,
                         'Greenhills College - Barrow Street'],
                  '32': ['8220DB007582', 'Temple Bar, Central Bank', 77007, 'Greenhills College - Barrow Street'],
                  '33': ['8220DB000340', 'Dublin City South, Pearse Street Garda Station', 77228,
                         'Greenhills College - Barrow Street'],
                  '34': ['8220DB000350', 'Dublin City South, Lower Sandwith Street', 77297,
                         'Greenhills College - Barrow Street'],
                  '35': ['8220DB000351', 'Pearse Station, Pearse Street', 77372, 'Greenhills College - Barrow Street'],
                  '36': ['8220DB000352', 'Grand Canal Dock, Pearse Square', 77407,
                         'Greenhills College - Barrow Street'],
                  '37': ['8220DB000353', 'Grand Canal Dock, Pearse Street', 77440,
                         'Greenhills College - Barrow Street'],
                  '38': ['8220DB000354', 'Grand Canal Dock, Barrow Street', 77478,
                         'Greenhills College - Barrow Street']},
                 {'1': ['8230DB001105', 'Greenhills, Greenhills College', 77400, 'Greenhills College - Barrow Street'],
                  '2': ['8230DB001107', 'Greenhills, Limekiln Road (Limekiln Ave)', 77450,
                        'Greenhills College - Barrow Street'],
                  '3': ['8230DB001108', "Greenhills, Saint Peter's School", 77475,
                        'Greenhills College - Barrow Street'],
                  '4': ['8230DB001109', 'Greenhills, Limekiln Road (Mountdown Park)', 77493,
                        'Greenhills College - Barrow Street'],
                  '5': ['8230DB001110', 'Greenhills, Limekiln Road', 77508, 'Greenhills College - Barrow Street'],
                  '6': ['8230DB001111', 'Greenhills, Wellington Lane (Limekiln Drive)', 77527,
                        'Greenhills College - Barrow Street'],
                  '7': ['8230DB001112', 'Whitehall Park', 77583, 'Greenhills College - Barrow Street'],
                  '8': ['8220DB001113', 'Walkinstown, Glendale Park', 77612, 'Greenhills College - Barrow Street'],
                  '9': ['8220DB001114', 'Kimmage, Manor Grove', 77650, 'Greenhills College - Barrow Street'],
                  '10': ['8220DB001115', 'Kimmage, Whitehall Gardens', 77679, 'Greenhills College - Barrow Street'],
                  '11': ['8220DB002437', 'Kimmage, Kimmage Road West (Whitehall Road)', 77723,
                         'Greenhills College - Barrow Street'],
                  '12': ['8220DB001117', 'Terenure, Lavarna Grove', 77775, 'Greenhills College - Barrow Street'],
                  '13': ['8220DB001118', 'Kimmage, Terenure Road', 77807, 'Greenhills College - Barrow Street'],
                  '14': ['8220DB001119', 'Kimmage, Terenure Road West', 77832, 'Greenhills College - Barrow Street'],
                  '15': ['8220DB001120', 'Terenure, Garda Station', 77877, 'Greenhills College - Barrow Street'],
                  '16': ['8220DB001164', 'Terenure, Terenure Road East', 77942, 'Greenhills College - Barrow Street'],
                  '17': ['8220DB001165', 'Rathgar, Terenure Road East', 77990, 'Greenhills College - Barrow Street'],
                  '18': ['8220DB001166', 'Rathgar, Rathgar Road, Winton Avenue', 78038,
                         'Greenhills College - Barrow Street'],
                  '19': ['8220DB001167', 'Rathgar, Rathgar Road (Garville)', 78069,
                         'Greenhills College - Barrow Street'],
                  '20': ['8220DB001168', 'Rathmines, Rathgar Road', 78100, 'Greenhills College - Barrow Street'],
                  '21': ['8220DB001169', 'Rathmines, Rathmines Park', 78131, 'Greenhills College - Barrow Street'],
                  '22': ['8220DB001170', 'Rathmines, Rathgar Road (Lower Rathmines Road)', 78159,
                         'Greenhills College - Barrow Street'],
                  '23': ['8220DB001069', 'Rathmines, Lower Rathmines Road', 78194,
                         'Greenhills College - Barrow Street'],
                  '24': ['8220DB001070', 'Rathmines, Rathmines Town Centre', 78226,
                         'Greenhills College - Barrow Street'],
                  '25': ['8220DB001071', 'Ranelagh, Rathmines Road Lower (Richmond Hill)', 78270,
                         'Greenhills College - Barrow Street'],
                  '26': ['8220DB004528', "Kelly's Corner, Lower Rathmines Road", 78303,
                         'Greenhills College - Barrow Street'],
                  '27': ['8220DB001072', 'Portobello, Richmond Street Sth (Lennox Street)', 78348,
                         'Greenhills College - Barrow Street'],
                  '28': ['8220DB007577', 'Camden Street', 78422, 'Greenhills College - Barrow Street'],
                  '29': ['8220DB001353', 'Dublin City South, Camden Street', 78485,
                         'Greenhills College - Barrow Street'],
                  '30': ['8220DB001354', 'Dublin City South, Aungier Street', 78568,
                         'Greenhills College - Barrow Street'],
                  '31': ['8220DB007578', "Dublin City South, South Great George's Street", 78683,
                         'Greenhills College - Barrow Street'],
                  '32': ['8220DB007582', 'Temple Bar, Central Bank', 78807, 'Greenhills College - Barrow Street'],
                  '33': ['8220DB000340', 'Dublin City South, Pearse Street Garda Station', 79028,
                         'Greenhills College - Barrow Street'],
                  '34': ['8220DB000350', 'Dublin City South, Lower Sandwith Street', 79097,
                         'Greenhills College - Barrow Street'],
                  '35': ['8220DB000351', 'Pearse Station, Pearse Street', 79172, 'Greenhills College - Barrow Street'],
                  '36': ['8220DB000352', 'Grand Canal Dock, Pearse Square', 79207,
                         'Greenhills College - Barrow Street'],
                  '37': ['8220DB000353', 'Grand Canal Dock, Pearse Street', 79240,
                         'Greenhills College - Barrow Street'],
                  '38': ['8220DB000354', 'Grand Canal Dock, Barrow Street', 79278,
                         'Greenhills College - Barrow Street']}]

        self.assertEqual((functions.calculate_time_diff(trips, 71820))[0][2], 3)


class TestGetTripInfo(TestCase):

    def test_get_trip_info(self):
        routes = ['3824.1.60-15A-b12-1.392.I', '3553.1.60-15A-b12-1.392.I', '3533.1.60-15A-b12-1.392.I',
                  '3562.1.60-15A-b12-1.392.I', '3826.1.60-15A-b12-1.392.I']
        self.assertEqual(len(functions.get_trip_info(routes, 1, 'in', '15a')), 5)


class TestGetServerRoute(TestCase):

    def test_get_server_route(self):
        client = Client()
        resp = client.get('/server_route?stop_id=1123').json()['server_route']
        self.assertEqual(set(resp), set(['15', '65b', '49', '65']))
