import pandas as pd

def timestamp_to_month_weather(timestamp):
    """Takes a timestamp as input and returns the month. Jan is 1, Feb is 2, etc."""
    timestamp = pd.to_datetime(timestamp)
    return timestamp.month

def timestamp_to_day_weather(timestamp):
    """Takes a timestamp as input and returns the day of the month."""
    timestamp = pd.to_datetime(timestamp)
    return timestamp.day

def timestamp_to_hour_weather(timestamp):
    """Takes a timestamp as input and returns the hour."""
    timestamp = pd.to_datetime(timestamp)
    return timestamp.hour

def timestamp_to_hour_bus(seconds):
    """Takes a number of seconds as input, and returns the hour."""
    if seconds <= 86400:
        hour = seconds // 3600
    else:
        hour = (seconds - 86400) // 3600
    return hour % 24

def timestamp_to_day_bus(timestamp, seconds, month):
    """Takes a timestamp and number of seconds as input, and returns the day of the month."""
    day = int(str(timestamp)[8:10])
    if seconds < 86400:
        return day
    else:
        if (month in [1,3,5,7,8,10,12] and day == 31) \
        or (month in [4,6,9,11] and day == 30) \
        or (month == 2 and day == 28):  # 2018 is not a leap year!
            return 1
        else:
            return day + 1

def timestamp_to_day_of_week(timestamp):
    """Takes a timestamp as input and returns the day of the week."""
    timestamp = pd.to_datetime(timestamp)
    return timestamp.weekday()

def timestamp_to_weekday_weekend(timestamp):
    """Takes a timestamp as input and returns 1 for a weekday, and 0 for a weekend. """
    timestamp = pd.to_datetime(timestamp)
    if timestamp.weekday() in [0,1,2,3,4]:
        return 1
    else:
        return 0 

def timestamp_to_bank_holiday(timestamp, holiday_list):
    """Takes a timestamp and list of timestamps as input and returns 1 if the timestamp is in the list."""
    timestamp = pd.to_datetime(timestamp)

    for i in range(len(holiday_list)):
        holiday_list[i] = pd.to_datetime(holiday_list[i])

    if timestamp in holiday_list:
        return 1
    else:
        return 0