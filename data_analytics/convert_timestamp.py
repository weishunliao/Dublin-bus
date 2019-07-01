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

def timestamp_to_day_bus(timestamp, seconds):
    """Takes a timestamp and number of seconds as input, and returns the day of the month."""
    timestamp = pd.to_datetime(timestamp)
    if seconds < 86400:
        return timestamp.day
    else:
        if (timestamp.month in [1,3,5,7,8,10,12] and timestamp.day == 31) \
        or (timestamp.month in [4,6,9,11] and timestamp.day == 30) \
        or (timestamp.month == 2 and timestamp.day == 28):  # 2018 is not a leap year!
            return 1
        else:
            return timestamp.day + 1

def timestamp_to_month_bus(timestamp, seconds):
    """Takes a timestamp and number of seconds as input, and returns the month. Jan is 1, Feb is 2, etc."""
    timestamp = pd.to_datetime(timestamp)

    if seconds >= 86400 and ((timestamp.month in [1,3,5,7,8,10,12] and timestamp.day == 31) \
    or (timestamp.month in [4,6,9,11] and timestamp.day == 30) \
    or (timestamp.month == 2 and timestamp.day == 28)):  # 2018 is not a leap year!
        return timestamp.month + 1
    else:
        return timestamp.month