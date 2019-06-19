####################################################################
#
#  Script for loading bus and weather data into the MySQL database.
#  Requires files to have either .txt or .csv as extensions.
#
#  Bus files should have one of the following naming conventions:
#        - rt_trips...
#        - rt_leavetimes...
#        - rt_vehicles...
#
#  There should only be ONE of each type of bus file present.
#
#  Weather files should follow the following naming convention:
#        - hly... 
#
#####################################################################


# import all required modules
import os
import csv
import mysql.connector


def load_files(directory):
    """Funtion for loading files in a particular order.

    Takes a directory as input. Loops through files in the directory and adds them to a list in order
    based on the file name. Assumes that only one of each file type is present in the directory:
    hly, rt_trips, rt_vehicles, rt_leavetimes. Returns the file list."""

    file_list = ["", "", "", ""]
    for filename in os.listdir(directory):
        if filename.endswith(".txt") or filename.endswith(".csv"):
            if filename.startswith("hly"):
                file_list[0] = filename
            elif filename.startswith("rt_trips"):
                file_list[1] = filename
            elif filename.startswith("rt_vehicles"):
                file_list[2] = filename
            elif filename.startswith("rt_leavetimes"):
                file_list[3] = filename
            else:
                print("\nUnrecognised file name format: " + filename + " will not be loaded.")
    return file_list


def process_files(directory, file_list):
    """Function to load a number of files into the database. 
    
    Takes a directory and file_list as input. Loops through each file in the list and depending on 
    the filename, calls the relevant function for processing the file."""

    for filename in file_list:
            if filename.startswith("rt"):
                process_bus_file(directory, filename)
            elif filename.startswith("hly"):
                process_weather_file(directory, filename)
     

def process_bus_file(directory, filename):
    """Function for processing a bus data file.

    Takes a directory and filename as input. Opens the file with csv.reader specifying ';' as the delimiter. 
    Based on the input file type, it calls the relevant function for processing the data rows."""

    with open(os.path.join(directory, filename)) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=';')
        if filename.startswith("rt_trips"):
            process_bus_rows(csv_reader, filename, 'trips')
        elif filename.startswith("rt_leavetimes"):
            process_bus_rows(csv_reader, filename, 'leavetimes')
        elif filename.startswith("rt_vehicles"):
            process_bus_rows(csv_reader, filename, 'vehicles')


def process_weather_file(directory, filename):
    """Function for processing a weather data file.

    Takes a directory and filename as input. Opens the file with csv.reader specifying ',' as the delimiter. 
    Calls the relevant function for processing the data rows."""

    with open(os.path.join(directory, filename)) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        process_weather_rows(csv_reader, filename)


def process_bus_rows(csv_reader, filename, file_type):
    """Function for processing bus file rows.

    Loops through each row in the file and for each row after the first calls the 
    relevant function for inserting data to the database (based on file_type input)."""

    print_load_msg(filename)
    row_count = 1    
    for row in csv_reader:
        if row_count == 1:
            row_count = endrow(row_count)
        else:
            if file_type == 'trips':
                row_count = insert_trips_row(row, row_count)
            elif file_type == 'leavetimes':
                row_count = insert_leavetimes_row(row, row_count)
            elif file_type == 'vehicles':
                row_count = insert_vehicles_row(row, row_count)


def process_weather_rows(csv_reader, filename):
    """Function for processing weather file rows.

    Loops through each row in the file and for row 16 onwards calls the function
    for inserting weather data to the database."""

    print_load_msg(filename)
    row_count = 1   
    for row in csv_reader:
        if row_count < 17:
            row_count = endrow(row_count)
        else:
            row_count = insert_weather_row(row, row_count)


def print_load_msg(filename):
    """Function to print a loading message for a specified file."""

    print("\n****Loading " + filename + "****\n")


def insert_trips_row(row, row_count):
    """Function for inserting data into the rt_trips table.
    
    Deals with null values in the data and converts dates.
    Inserts data into the database and commits. Finally row_count is incremented and returned."""

    row = handle_nulls(row)
    datetime1 = convert_bus_timestamp(row[1])
    datetime2 = convert_bus_timestamp(row[14])
    try:
        vals = (row[0], datetime1, row[2], row[3], row[4], row[5], row[6], row[7], \
            row[8], row[9], row[10], row[11], row[12], row[13], datetime2, row[15])
        sql = "INSERT INTO `rt_trips` (`datasource`, `dayofservice`, `tripid`, \
        `lineid`, `routeid`, `direction`, `plannedtime_arr`, `plannedtime_dep`, \
        `actualtime_arr`, `actualtime_dep`, `basin`, `tenderlot`, `suppressed`,\
        `justificationid`, `lastupdate`, `note`) \
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"
        cursor.execute(sql, vals)
        connection.commit()
    except Exception  as e:
        row_count = rowerror(row_count, e)
    else:
        row_count = endrow(row_count)
    return row_count


def insert_leavetimes_row(row, row_count):
    """Function for inserting data into the rt_leavetimes table.
    
    Deals with null values in the data and converts dates.
    Inserts data into the database and commits. Finally row_count is incremented and returned."""

    row = handle_nulls(row)
    datetime1 = convert_bus_timestamp(row[1])
    datetime2 = convert_bus_timestamp(row[16])
    try:
        vals = (row[0], datetime1, row[2], row[3], row[4], row[5], row[6], row[7], \
            row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], \
            datetime2, row[17])
        sql = "INSERT INTO `rt_leavetimes` (`datasource`, `dayofservice`, `tripid`, \
        `prognumber`, `stoppointid`, `plannedtime_arr`, `plannedtime_dep`, \
        `actualtime_arr`, `actualtime_dep`, `vehicleid`, `passengers`, `passengersin`, \
        `passengersout`, `distance`, `suppressed`, `justificationid`, `lastupdate`, \
        `note`) \
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"
        cursor.execute(sql, vals)
        connection.commit()
    except Exception  as e:
        row_count = rowerror(row_count, e)
    else:
        row_count = endrow(row_count)
    return row_count


def insert_vehicles_row(row, row_count):
    """Function for inserting data into the rt_vehicles table.
    
    Deals with null values in the data and converts dates.
    Inserts data into the database and commits. Finally row_count is incremented and returned."""

    row = handle_nulls(row)
    datetime1 = convert_bus_timestamp(row[1])
    datetime2 = convert_bus_timestamp(row[5])
    try:
        vals = (row[0], datetime1, row[2], row[3], row[4], datetime2, row[6])
        sql = "INSERT INTO `rt_vehicles` (`datasource`, `dayofservice`, `vehicleid`, \
        `distance`, `minutes`, `lastupdate`, `note`) \
        VALUES (%s,%s,%s,%s,%s,%s,%s);"
        cursor.execute(sql, vals)
        connection.commit()
    except Exception  as e:
        row_count = rowerror(row_count, e)
    else:
        row_count = endrow(row_count)
    return row_count


def insert_weather_row(row, row_count):
    """Function for inserting data into the weather_data table.
    
    Deals with null values in the data and converts dates.
    Inserts data into the database and commits. Finally row_count is incremented and returned."""

    row = handle_nulls(row)
    datetime = convert_weather_timestamp(row[0])
    vals = (datetime, row[1], row[2], row[3], row[4], row[5], row[6], row[7], \
        row[8], row[9], row[10])
    sql = "INSERT INTO `weather_data` (`record_date`, `irain`, `rain`, \
    `itemp`, `temp`, `iwb`, `wetb`, `dewpt`, `vappr`, `rhum`, `msl`) \
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"
    try:
        cursor.execute(sql, vals)
        connection.commit()
    except Exception  as e:
        row_count = rowerror(row_count, e)
    else:
        row_count = endrow(row_count)
    return row_count


def handle_nulls(row):
    """Function to handle null values in a row from a csv file.

    Loops through each field in the row, and if it is empty, replaces it with 'None'."""

    for i in range(len(row)):
        if str(row[i]).strip() == '':
            row[i] = None
    return row


def convert_bus_timestamp(timestamp):
    """Function to convert a date from the format DD-MMM-YY HH:MM:SS to MySQL format."""

    if timestamp is not None:
        months = { "JAN":"01", "FEB":"02", "MAR":"03", "APR":"04", "MAY":"05", "JUN":"06", "JUL":"07", \
        "AUG":"08", "SEP":"09", "OCT":"10", "NOV":"11", "DEC":"12"}
        year = str(timestamp)[7:9]
        month = months[str(timestamp)[3:6]]
        day = str(timestamp)[0:2]
        time = str(timestamp)[10:18]
        datetime = "20" + year + "-" + month + "-" + day + " " + time
    return datetime


def convert_weather_timestamp(timestamp):
    """Function to convert a date from the format DD/MM/YYYY HH:MM to MySQL format."""

    if timestamp is not None:
        year = str(timestamp)[6:10]
        month = str(timestamp)[3:5]
        day = str(timestamp)[0:2]
        time = str(timestamp)[11:16]
        datetime = year + "-" + month + "-" + day + " " + time + ":00"
    return datetime


def endrow(row_count):
    """Function for printing informational messages after rows have been processed.

    Prints an informational message and then increments and returns row count."""

    print("Row", row_count, "successfully processed!")
    row_count +=1 
    return row_count


def rowerror(row_count, e):
    """Function for printing informational messages for rows that have raised an error during processing.

    Prints an informational message, prints the error and then increments and
    returns row count."""

    print("Row", row_count, "failed to process.")
    print(e)
    row_count +=1 
    return row_count


# Find the directory that the script is placed in.
directory = os.path.abspath(os.path.dirname(__file__))

# Try to connect to the database, print an exception if one is encountered. If not, then call the load_files() function.
# Then close the cursor and disconnect from the database.
try:
    connection = mysql.connector.connect(host=os.environ['DBHOST'], user=os.environ['DBUSER'], \
        password=os.environ['DBPASS'], db='db_raw_data')
    cursor = connection.cursor()
except Exception as e:
    print(e)
else:
    file_list = load_files(directory)
    process_files(directory, file_list)
    cursor.close()
    connection.disconnect()