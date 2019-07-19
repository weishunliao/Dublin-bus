from django.test import TestCase, Client
from datetime import datetime
from dublin_bus import functions


class ViewTest(TestCase):
    def test_index_view(self):
        client = Client()
        resp = client.get('/test').content
        self.assertEqual(resp, b"<h3>Hi, we're team 8.</h3>")


class TestLoadModel(TestCase):
    """Test cases for the load_model function."""
    
    def test_load_model_success(self):
        """Test to ensure that a model is loaded correctly."""
        try:
            functions.load_model()
        except Exception as e:
            self.fail("load_model() raised an exception unexpectedly!\n Error is:" + str(e))

class TestCreateHourFeatureRef(TestCase):
    """Test cases for the create_hour_feature_ref function."""

    def test_create_hour_feature_ref(self):
        """Test for the ouput of the create_hour_feature_ref function."""
        hour_ref = {0: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    1: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    4: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    5: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    6: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    7: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    8: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    9: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    10: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    11: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    12: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    13: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    14: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    15: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    16: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    17: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                    18: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                    19: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                    20: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                    21: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                    22: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                    23: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]}
        self.assertEqual(functions.create_hour_feature_ref(), hour_ref)

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

class TestCreateSegmentRef(TestCase):
    """Test cases for the create_segment_ref function."""

    def test_create_segment_ref(self):
        """Test for the ouput of the create_segment_ref function."""
        segment_ref = functions.create_segment_ref()
        self.assertEqual(segment_ref["946_1131"], 69)

class TestRoutePrediction(TestCase):
    """Test cases for the route_prediction function."""

    def test_route_prediction(self):
        """Test for the ouput of the route_prediction function for the 15A going in the Limekiln direction."""
        stops = [395,396,397,398,399,400,7581,1283,7579,1285,1016,1017,1018,1019,1020,1076,1077,1078,1079,1080,\
            1081,1082,1083,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1101,1102,1103,1104]
        rain = 0.1
        temp = 15
        rhum = 75
        msl = 1000
        actualtime_arr_stop_first = 32400 # 9:00
        hour = 9
        day_of_week = 4 # monday
        month = 7 # july
        weekday = 1
        bank_holiday = 0
        self.assertEqual(functions.route_prediction(stops, actualtime_arr_stop_first, hour, day_of_week, month, \
        weekday, bank_holiday, rain, temp, rhum, msl), 2485)

    def test_route_prediction_missing_segment(self):
        """Test for the ouput of the route_prediction function when a missing segment is encountered."""
        stops = [395,396,397,398,99999,400,7581,1283,7579,1285,1016,1017,1018,1019,1020,1076,1077,1078,1079,1080,\
            1081,1082,1083,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1101,1102,1103,1104]
        rain = 0.1
        temp = 15
        rhum = 75
        msl = 1000
        actualtime_arr_stop_first = 32400 # 9:00
        hour = 9
        day_of_week = 4 # monday
        month = 7 # july
        weekday = 1
        bank_holiday = 0
        with self.assertRaises(Exception):
            functions.route_prediction(stops, actualtime_arr_stop_first, hour, day_of_week, month, \
            weekday, bank_holiday, rain, temp, rhum, msl)

class TesParseWeatherForecast(TestCase):
    """Test cases for the parse_weather_forecast function."""

    def test_parse_weather_forecast_found(self):
        """Function to test the parse_weather_forecast function when forecast is found for the timestamp."""
        weather_data = {"cod": "200","message": 0.0066,"cnt": 40,"list": [{"dt": 1562338800,"main": {"temp": 18.82,"temp_min": 18.26,"temp_max": 18.82,"pressure": 1019.31,"sea_level": 1019.31,"grnd_level": 1009.87,"humidity": 81,"temp_kf": 0.56},"weather": [{"id": 500,"main": "Rain","description": "light rain","icon": "10d"}],"clouds": {"all": 100},"wind": {"speed": 3.94,"deg": 271.353},"rain": {"3h": 0.125},"sys": {"pod": "d"},"dt_txt": "2019-07-05 15:00:00"}, {"dt": 1562349600,"main": {"temp": 18.11,"temp_min": 17.69,"temp_max": 18.11,"pressure": 1017.62,"sea_level": 1017.62,"grnd_level": 1008.18,"humidity": 86,"temp_kf": 0.42},"weather": [{"id": 500,"main": "Rain","description": "light rain","icon": "10d"}],"clouds": {"all": 100},"wind": {"speed": 3.59,"deg": 274.17},"rain": {"3h": 0.063},"sys": {"pod": "d"},"dt_txt": "2019-07-05 18:00:00"}],"city": {"id": 7778677,"name": "Dublin City","coord": {"lat": 53.3551,"lon": -6.2493},"country": "IE","timezone": 3600}}
        timestamp = datetime.strptime('Jul 5 2019  2:30PM', '%b %d %Y %I:%M%p')
        self.assertEqual(functions.parse_weather_forecast(timestamp, weather_data), (0.125,18.82,81,1019.31))

    def test_parse_weather_forecast_not_found(self):
        """Test that parse_weather_forecast raises an exception when weather info not found for the timestamp."""
        weather_data = {"cod": "200","message": 0.0066,"cnt": 40,"list": [{"dt": 1562338800,"main": {"temp": 18.82,"temp_min": 18.26,"temp_max": 18.82,"pressure": 1019.31,"sea_level": 1019.31,"grnd_level": 1009.87,"humidity": 81,"temp_kf": 0.56},"weather": [{"id": 500,"main": "Rain","description": "light rain","icon": "10d"}],"clouds": {"all": 100},"wind": {"speed": 3.94,"deg": 271.353},"rain": {"3h": 0.125},"sys": {"pod": "d"},"dt_txt": "2019-07-05 15:00:00"}, {"dt": 1562349600,"main": {"temp": 18.11,"temp_min": 17.69,"temp_max": 18.11,"pressure": 1017.62,"sea_level": 1017.62,"grnd_level": 1008.18,"humidity": 86,"temp_kf": 0.42},"weather": [{"id": 500,"main": "Rain","description": "light rain","icon": "10d"}],"clouds": {"all": 100},"wind": {"speed": 3.59,"deg": 274.17},"rain": {"3h": 0.063},"sys": {"pod": "d"},"dt_txt": "2019-07-05 18:00:00"}],"city": {"id": 7778677,"name": "Dublin City","coord": {"lat": 53.3551,"lon": -6.2493},"country": "IE","timezone": 3600}}
        timestamp = datetime.strptime('Jul 4 2019  2:30PM', '%b %d %Y %I:%M%p')
        with self.assertRaises(Exception):
            functions.parse_weather_forecast(timestamp, weather_data)


class TestConvertToSeconds(TestCase):
    """Test cases for the convert_to_seconds function."""

    def test_convert_to_seconds_before_midnight(self):
        """Test that correct value is returned for a timestamp between 3:00 am and midnight."""
        self.assertEqual(functions.convert_to_seconds(9, 30), 34200)

    def test_convert_to_seconds_after_midnight(self):
        """Test that correct value is returned for a timestamp after midnight (but before 3am)."""
        self.assertEqual(functions.convert_to_seconds(00, 20), 87600)

    def test_convert_to_seconds_after_one_am(self):
        """Test that correct value is returned for a timestamp after 1am (but before 3am)."""
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
        self.assertEqual(functions.is_bank_holiday(5,8), 1)

    def test_not_bank_holiday(self):
        """Test that the value 0 is returned for a normal day"""
        self.assertEqual(functions.is_bank_holiday(4,8), 0)


class TestParseTimestamp(TestCase):
    """Test cases for the parse_timestamp function."""

    def test_parse_timestamp(self):
        """Test that the correct values are returned for a given timestamp."""
        timestamp = datetime.utcfromtimestamp(1562581800)
        self.assertEqual(functions.parse_timestamp(timestamp), (37800, 0, 7, 1, 0, 10))


class TestFormatStopList(TestCase):
    """Test cases for the format_stop_list function."""

    def test_format_stop_list(self):
        """Test that a list is formatted correctly."""
        stop_list = (('8220DB001170', 22), ('8220DB001069', 23), ('8220DB001070', 24), ('8220DB001071', 25), \
            ('8220DB004528', 26), ('8220DB001072', 27), ('8220DB007577', 28), ('8220DB001353', 29), \
                ('8220DB001354', 30), ('8220DB007578', 31), ('8220DB007582', 32), ('8220DB000340', 33))
        self.assertEqual(functions.format_stop_list(stop_list), [1170, 1069, 1070, 1071, 4528, 1072, 7577, \
            1353, 1354, 7578, 7582, 340])
    
    def test_format_stop_list_gen(self):
        """Test that a list is formatted correctly when some stops have the "gen" format."""
        stop_list = (('gen:57102:7731:0:1', 22), ('8220DB001069', 23), ('8220DB001070', 24), ('8220DB001071', 25), \
            ('8220DB004528', 26), ('8220DB001072', 27), ('gen:57102:7948:0:1', 28), ('8220DB001353', 29), \
                ('8220DB001354', 30), ('8220DB007578', 31), ('8220DB007582', 32), ('8220DB000340', 33))
        self.assertEqual(functions.format_stop_list(stop_list), [7675, 1069, 1070, 1071, 4528, 1072, 7701, \
            1353, 1354, 7578, 7582, 340])