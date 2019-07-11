import os
import csv

def handle_nulls(row):
    """Function to handle null values in a row from a csv file.

    Loops through each field in the row, and if it is empty, replaces it with \\N."""

    for i in range(len(row)):
        if str(row[i]).strip() == '':
            row[i] = '\\N'
    return row

def convert_weather_timestamp(timestamp):
    """Function to convert a date from the format DD/MM/YYYY HH:MM to MySQL format."""

    if timestamp != '\\N':
        year = str(timestamp)[6:10]
        month = str(timestamp)[3:5]
        day = str(timestamp)[0:2]
        time = str(timestamp)[11:16]
        datetime = year + "-" + month + "-" + day + " " + time + ":00"
    return datetime

def convert_bus_timestamp(timestamp):
    """Function to convert a date from the format DD-MMM-YY HH:MM:SS to MySQL format."""

    if timestamp != '\\N':
        months = { "JAN":"01", "FEB":"02", "MAR":"03", "APR":"04", "MAY":"05", "JUN":"06", "JUL":"07", \
        "AUG":"08", "SEP":"09", "OCT":"10", "NOV":"11", "DEC":"12"}
        year = str(timestamp)[7:9]
        month = months[str(timestamp)[3:6]]
        day = str(timestamp)[0:2]
        time = str(timestamp)[10:18]
        datetime = "20" + year + "-" + month + "-" + day + " " + time
    return datetime

def endrow(filename, row_count):
    """Function for printing informational messages after rows have been processed.

    Prints an informational message and then increments and returns row count."""

    print(filename + ": Row", row_count, "successfully processed!")
    row_count +=1 
    return row_count


def process_weather_file(directory, filename):
    """Function for processing a file with weather data.

    Opens the file using ',' as the delimiter. Loops through each row in the file, deals with null values 
    and dates, and then inserts the row into a new file.
    """

    new_file = open("hly175_prepared.csv", "w")

    with open(os.path.join(directory, filename)) as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            row_count = 1
            for row in csv_reader:
                if row_count < 17:
                    row_count = endrow(filename, row_count)
                else:
                    row = handle_nulls(row)
                    row[0] = convert_weather_timestamp(row[0])
                    row = ','.join(map(str, row)) 
                    new_file.write(row + '\n')
                    row_count = endrow(filename, row_count)

    new_file.close()
    csv_file.close()


def process_bus_file(directory, filename):
    """Function for processing a file with bus data.

    Opens the file using ';' as the delimiter. Loops through each row in the file, deals with null values 
    and dates, and then inserts the row into a new file.
    """

    if filename.startswith("rt_trips"):
        new_file = open("rt_trips_DB_2018_prepared.txt", "w")
    elif filename.startswith("rt_leavetimes"):
        new_file = open("rt_leavetimes_DB_2018_prepared.txt", "w")

    with open(os.path.join(directory, filename)) as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=';')
            row_count = 1
            for row in csv_reader:
                if row_count == 1:
                    row_count = endrow(filename, row_count)
                else:
                    row = handle_nulls(row)
                    row[1] = convert_bus_timestamp(row[1])
                    if filename.startswith("rt_trips"):
                        row[14] = convert_bus_timestamp(row[14])
                    elif filename.startswith("rt_leavetimes"):
                        row[16] = convert_bus_timestamp(row[16])
                    row = ';'.join(map(str, row)) 
                    new_file.write(row + '\n')
                    row_count = endrow(filename, row_count)

    new_file.close()
    csv_file.close()


# Find the directory that the script is placed in.
directory = os.path.abspath(os.path.dirname(__file__))

# Check which files are in the directory and process the relevant files if present
if os.path.isfile(os.path.join(directory, "hly175.csv")):
    process_weather_file(directory, "hly175.csv")

if os.path.isfile(os.path.join(directory, "rt_trips_DB_2018.txt")):
    process_bus_file(directory, "rt_trips_DB_2018.txt")

if os.path.isfile(os.path.join(directory, "rt_leavetimes_DB_2018.txt")):
    process_bus_file(directory, "rt_leavetimes_DB_2018.txt")