import unittest
import convert_timestamp
import transform_data
import pandas as pd
import pandas.testing as pd_testing

class TestTimestampToMonthWeather(unittest.TestCase):
    """Unit tests for the timestamp_to_month_weather function."""

    def test_jan_date(self):
        """Test to check the value returned for a date in Jan."""
        self.assertEqual(convert_timestamp.timestamp_to_month_weather('2018-01-01 00:00:00'), 1)
    
    def test_dec_date(self):
        """Test to check the value returned for a date in Dec."""
        self.assertEqual(convert_timestamp.timestamp_to_month_weather('2018-12-01 00:00:00'), 12)


class TestTimestampToDayWeather(unittest.TestCase):
    """Unit tests for the timestamp_to_day_weather function."""

    def test_start_of_month(self):
        """Test to check the value returned for a date at the start of a month."""
        self.assertEqual(convert_timestamp.timestamp_to_day_weather('2018-01-01 00:00:00'), 1)
    
    def test_end_of_month(self):
        """Test to check the value returned for a date at the end of a month."""
        self.assertEqual(convert_timestamp.timestamp_to_day_weather('2018-01-31 00:00:00'), 31)


class TestTimestampToHourWeather(unittest.TestCase):
    """Unit tests for the timestamp_to_hour_weather function."""

    def test_early_timestamp(self):
        """Test to check the value returned for a timestamp early in the day."""
        self.assertEqual(convert_timestamp.timestamp_to_hour_weather('2018-01-01 00:00:00'), 0)

    def test_late_timestamp(self):
        """Test to check the value returned for a timestamp late in the day."""
        self.assertEqual(convert_timestamp.timestamp_to_hour_weather('2018-01-01 23:59:00'), 23)


class TestTimestampToHourBus(unittest.TestCase):
    """Unit tests for the timestamp_to_hour_bus function."""

    def test_same_day(self):
        """Test to check the value returned for a value less than 86400 seconds (24*60*60)."""
        self.assertEqual(convert_timestamp.timestamp_to_hour_bus(55000), 15)

    def test_midnight(self):
        """Test to check the value returned at midnight i.e. 86400 seconds."""
        self.assertEqual(convert_timestamp.timestamp_to_hour_bus(86400), 0)

    def test_after_midnight(self):
        """Test to check the value returned after midnight."""
        self.assertEqual(convert_timestamp.timestamp_to_hour_bus(87000), 0)

    def test_after_midnight2(self):
        """Test to check the value returned more than an hour after midnight."""
        self.assertEqual(convert_timestamp.timestamp_to_hour_bus(91000), 1) 

class TestTimestampToDayOfWeek(unittest.TestCase):
    """Unit tests for the timestamp_to_day_of_week function."""

    def test_monday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_day_of_week('2018-10-01 00:00:00'), 0)
    
    def test_tuesday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_day_of_week('2018-10-02 00:00:00'), 1)

    def test_wednesday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_day_of_week('2018-10-03 00:00:00'), 2)

    def test_thursday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_day_of_week('2018-10-04 00:00:00'), 3)

    def test_friday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_day_of_week('2018-10-05 00:00:00'), 4)

    def test_saturday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_day_of_week('2018-10-06 00:00:00'), 5)

    def test_sunday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_day_of_week('2018-10-07 00:00:00'), 6)


class TestTimestampToWeekdayWeekend(unittest.TestCase):
    """Unit tests for the timestamp_to_weekday_weekend function."""

    def test_monday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_weekday_weekend('2018-10-01 00:00:00'), 1)
    
    def test_tuesday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_weekday_weekend('2018-10-02 00:00:00'), 1)

    def test_wednesday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_weekday_weekend('2018-10-03 00:00:00'), 1)

    def test_thursday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_weekday_weekend('2018-10-04 00:00:00'), 1)

    def test_friday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_weekday_weekend('2018-10-05 00:00:00'), 1)

    def test_saturday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_weekday_weekend('2018-10-06 00:00:00'), 0)

    def test_sunday(self):
        """Test to check the value returned for a timestamp that falls on a Monday."""
        self.assertEqual(convert_timestamp.timestamp_to_weekday_weekend('2018-10-07 00:00:00'), 0)


class TestTimestampToBankHoliday(unittest.TestCase):
    """Unit tests for the timestamp_to_bank_holiday function."""

    def test_bank_holiday(self):
        """Test to check the value returned for a timestamp that is a bank holiday."""
        holiday_list=['2018-01-01 00:00:00']
        self.assertEqual(convert_timestamp.timestamp_to_bank_holiday('2018-01-01 00:00:00', holiday_list), 1)
    
    def test_non_holiday(self):
        """Test to check the value returned for a timestamp that isn't a bank holiday."""
        holiday_list=['2018-01-01 00:00:00']
        self.assertEqual(convert_timestamp.timestamp_to_bank_holiday('2018-01-02 00:00:00', holiday_list), 0)


class TestTransformData(unittest.TestCase):
    """Unit tests for the transform_data function."""

    def test_transform_data(self):
        """Test for a straightforward success scenario for the transform_data function."""
        data_in = [['2018-08-01 00:00:00','7315261','120','1','6004','25849'],\
            ['2018-08-01 00:00:00','7315261','120','2','3','25957'],\
            ['2018-08-01 00:00:00','7315261','120','3','192','26210'],\
            ['2018-08-01 00:00:00','7315261','120','4','795','26236'],\
            ['2018-08-01 00:00:00','7315262','120','1','284','28813'],\
            ['2018-08-01 00:00:00','7315262','120','2','4504','28920'],\
            ['2018-08-01 00:00:00','7315262','120','3','7028','29073'],\
            ['2018-08-01 00:00:00','7315262','120','4','5147','29198'],\
            ['2018-08-01 00:00:00','7315336','69','1','4495','22498'],\
            ['2018-08-01 00:00:00','7315336','69','2','4720','22647'],\
            ['2018-08-01 00:00:00','7315336','69','3','1443','22738']]
        data_out = [['2018-08-01 00:00:00','7315261','120','1','6004','25849','2','3','25957'],\
            ['2018-08-01 00:00:00','7315261','120','2','3','25957','3','192','26210'],\
            ['2018-08-01 00:00:00','7315261','120','3','192','26210','4','795','26236'],\
            ['2018-08-01 00:00:00','7315262','120','1','284','28813','2','4504','28920'],\
            ['2018-08-01 00:00:00','7315262','120','2','4504','28920','3','7028','29073'],\
            ['2018-08-01 00:00:00','7315262','120','3','7028','29073','4','5147','29198'],\
            ['2018-08-01 00:00:00','7315336','69','1','4495','22498','2','4720','22647'],\
            ['2018-08-01 00:00:00','7315336','69','2','4720','22647','3','1443','22738']]
        df_in = pd.DataFrame(data_in, columns=['dayofservice','tripid','lineid','progrnumber','stoppointid','actualtime_arr_stop'])
        df_out = pd.DataFrame(data_out, columns=['dayofservice','tripid','lineid','progrnumber_first','stoppointid_first','actualtime_arr_stop_first','progrnumber_next','stoppointid_next','actualtime_arr_stop_next'])
        pd_testing.assert_frame_equal(transform_data.transform_data(df_in), df_out)

    def test_transform_data_missing_start(self):
        """Test for the transform_data function where data is missing at the start of a trip."""
        data_in = [['2018-08-01 00:00:00','7315261','120','2','3','25957'],\
            ['2018-08-01 00:00:00','7315261','120','3','192','26210'],\
            ['2018-08-01 00:00:00','7315261','120','4','795','26236'],\
            ['2018-08-01 00:00:00','7315262','120','1','284','28813'],\
            ['2018-08-01 00:00:00','7315262','120','2','4504','28920'],\
            ['2018-08-01 00:00:00','7315262','120','3','7028','29073'],\
            ['2018-08-01 00:00:00','7315262','120','4','5147','29198'],\
            ['2018-08-01 00:00:00','7315336','69','2','4720','22647'],\
            ['2018-08-01 00:00:00','7315336','69','3','1443','22738']]
        data_out = [['2018-08-01 00:00:00','7315261','120','2','3','25957','3','192','26210'],\
            ['2018-08-01 00:00:00','7315261','120','3','192','26210','4','795','26236'],\
            ['2018-08-01 00:00:00','7315262','120','1','284','28813','2','4504','28920'],\
            ['2018-08-01 00:00:00','7315262','120','2','4504','28920','3','7028','29073'],\
            ['2018-08-01 00:00:00','7315262','120','3','7028','29073','4','5147','29198'],\
            ['2018-08-01 00:00:00','7315336','69','2','4720','22647','3','1443','22738']]
        df_in = pd.DataFrame(data_in, columns=['dayofservice','tripid','lineid','progrnumber','stoppointid','actualtime_arr_stop'])
        df_out = pd.DataFrame(data_out, columns=['dayofservice','tripid','lineid','progrnumber_first','stoppointid_first','actualtime_arr_stop_first','progrnumber_next','stoppointid_next','actualtime_arr_stop_next'])
        pd_testing.assert_frame_equal(transform_data.transform_data(df_in), df_out)

    def test_transform_data_missing_mid(self):
        """Test for the transform_data function where data is missing in the middle of a trip."""
        data_in = [['2018-08-01 00:00:00','7315261','120','1','6004','25849'],\
            ['2018-08-01 00:00:00','7315261','120','2','3','25957'],\
            ['2018-08-01 00:00:00','7315261','120','4','795','26236'],\
            ['2018-08-01 00:00:00','7315261','120','5','796','26242'],\
            ['2018-08-01 00:00:00','7315262','120','1','284','28813'],\
            ['2018-08-01 00:00:00','7315262','120','2','4504','28920'],\
            ['2018-08-01 00:00:00','7315262','120','4','5147','29198'],\
            ['2018-08-01 00:00:00','7315336','69','1','4495','22498'],\
            ['2018-08-01 00:00:00','7315336','69','3','1443','22738']]
        data_out = [['2018-08-01 00:00:00','7315261','120','1','6004','25849','2','3','25957'],\
            ['2018-08-01 00:00:00','7315261','120','4','795','26236','5','796','26242'],\
            ['2018-08-01 00:00:00','7315262','120','1','284','28813','2','4504','28920']]
        df_in = pd.DataFrame(data_in, columns=['dayofservice','tripid','lineid','progrnumber','stoppointid','actualtime_arr_stop'])
        df_out = pd.DataFrame(data_out, columns=['dayofservice','tripid','lineid','progrnumber_first','stoppointid_first','actualtime_arr_stop_first','progrnumber_next','stoppointid_next','actualtime_arr_stop_next'])
        pd_testing.assert_frame_equal(transform_data.transform_data(df_in), df_out)
    
    def test_transform_data_missing_end(self):
        """Test for the transform_data function where data is missing at the end of a trip."""
        data_in = [['2018-08-01 00:00:00','7315261','120','1','6004','25849'],\
            ['2018-08-01 00:00:00','7315261','120','2','3','25957'],\
            ['2018-08-01 00:00:00','7315261','120','3','192','26210'],\
            ['2018-08-01 00:00:00','7315262','120','1','284','28813'],\
            ['2018-08-01 00:00:00','7315262','120','2','4504','28920'],\
            ['2018-08-01 00:00:00','7315262','120','3','7028','29073'],\
            ['2018-08-01 00:00:00','7315262','120','4','5147','29198'],\
            ['2018-08-01 00:00:00','7315336','69','1','4495','22498'],\
            ['2018-08-01 00:00:00','7315336','69','2','4720','22647']]
        data_out = [['2018-08-01 00:00:00','7315261','120','1','6004','25849','2','3','25957'],\
            ['2018-08-01 00:00:00','7315261','120','2','3','25957','3','192','26210'],\
            ['2018-08-01 00:00:00','7315262','120','1','284','28813','2','4504','28920'],\
            ['2018-08-01 00:00:00','7315262','120','2','4504','28920','3','7028','29073'],\
            ['2018-08-01 00:00:00','7315262','120','3','7028','29073','4','5147','29198'],\
            ['2018-08-01 00:00:00','7315336','69','1','4495','22498','2','4720','22647']]
        df_in = pd.DataFrame(data_in, columns=['dayofservice','tripid','lineid','progrnumber','stoppointid','actualtime_arr_stop'])
        df_out = pd.DataFrame(data_out, columns=['dayofservice','tripid','lineid','progrnumber_first','stoppointid_first','actualtime_arr_stop_first','progrnumber_next','stoppointid_next','actualtime_arr_stop_next'])
        pd_testing.assert_frame_equal(transform_data.transform_data(df_in), df_out)


if __name__ == '__main__':
    unittest.main()