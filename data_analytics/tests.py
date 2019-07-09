import unittest
import convert_timestamp

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


class TestTimestampToDayBus(unittest.TestCase):
    """Unit tests for the timestamp_to_day_bus function."""

    def test_same_day(self):
        """Test to check the value returned for a value less than 86400 seconds (24*60*60)."""
        self.assertEqual(convert_timestamp.timestamp_to_day_bus('2018-01-31 00:00:00', 37000), 31) 

    def test_after_midnight_mid_month(self):
        """Test to check the value returned for a day that is mid-month when seconds are >= 86400."""
        self.assertEqual(convert_timestamp.timestamp_to_day_bus('2018-01-05 00:00:00', 86500), 6) 

    def test_after_midnight_end_31(self):
        """Test to check the value returned for a day at the end of a 31 day month when seconds are >= 86400."""
        self.assertEqual(convert_timestamp.timestamp_to_day_bus('2018-01-31 00:00:00', 86400), 1) 

    def test_after_midnight_end_30(self):
        """Test to check the value returned for a day at the end of a 31 day month when seconds are >= 86400."""
        self.assertEqual(convert_timestamp.timestamp_to_day_bus('2018-11-30 00:00:00', 86450), 1)

    def test_after_midnight_end_feb(self):
        """Test to check the value returned for a day at the end of feb (non leap year) when seconds are >= 86400."""
        self.assertEqual(convert_timestamp.timestamp_to_day_bus('2018-02-28 00:00:00', 86450), 1)


class TestTimestampToMonthBus(unittest.TestCase):
    """Unit tests for the timestamp_to_month_bus function."""

    def test_same_day(self):
        """Test to check the value returned for a value less than 86400 seconds (24*60*60)."""
        self.assertEqual(convert_timestamp.timestamp_to_month_bus('2018-01-31 00:00:00', 37000), 1)

    def test_after_midnight_mid_month(self):
        """Test to check the value returned for a day that is mid-month when seconds are >= 86400."""
        self.assertEqual(convert_timestamp.timestamp_to_month_bus('2018-01-05 00:00:00', 86500), 1) 

    def test_after_midnight_end_31(self):
        """Test to check the value returned for a day at the end of a 31 day month when seconds are >= 86400."""
        self.assertEqual(convert_timestamp.timestamp_to_month_bus('2018-01-31 00:00:00', 86400), 2) 

    def test_after_midnight_end_30(self):
        """Test to check the value returned for a day at the end of a 31 day month when seconds are >= 86400."""
        self.assertEqual(convert_timestamp.timestamp_to_month_bus('2018-11-30 00:00:00', 86450), 12)

    def test_after_midnight_end_feb(self):
        """Test to check the value returned for a day at the end of feb (non leap year) when seconds are >= 86400."""
        self.assertEqual(convert_timestamp.timestamp_to_month_bus('2018-02-28 00:00:00', 86450), 3)


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


if __name__ == '__main__':
    unittest.main()