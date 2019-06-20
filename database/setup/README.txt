This file outlines the steps required to set up the database schema and tables, and to load data into the tables.


Follow the steps below to set up the database schema and tables:

1. Copy contents of the database_setup folder to the CS server (e.g. using WinSCP).
2. Log in to the server and navigate to the directory.
3. Run the following command, replacing USER & PASSWORD with the login details for mysql:
    mysql -u USER -pPASSWORD < create_tables.SQL
(Note: there should NOT be a space between -p and PASSWORD, it's not a typo!)


Follow the steps below to load data into the tables:

1. Copy contents of the database_setup folder to the CS server if this has not already been done.
3. Navigate to the raw_data folder.
4. Download the full Dublin Bus data set into the folder (follow the instructions on Brightspace). 
   The files should be named 'rt_leavetimes_DB_2018.txt', 'rt_trips_DB_2018_prepared.txt' & 
   'rt_vehicles_DB_2018_prepared.txt'.
5. Copy the Met Eireann data set to the same folder (can be downloaded from the Met Eireann website).
   The file should be named 'hly175.csv'.
6. Run the data prep script as follows:
        nohup python prepare_files.py &> dataprep.log
7. When the script finishes running, move the files that have been created to the MySQL upload folder:
        sudo mv *prepared* /var/lib/mysql-files/
8. Run the SQL scripts as follows:
        nohup mysql -vv -u $DBUSER -p$DBPASS < load_weather_data.SQL &> load_weather_data.log
        nohup mysql -vv -u $DBUSER -p$DBPASS < load_bus_data_trips.SQL &> load_bus_data_trips.log
        nohup mysql -vv -u $DBUSER -p$DBPASS < load_bus_data_vehicles.SQL &> load_bus_data_vehicles.log
        nohup mysql -vv -u $DBUSER -p$DBPASS < load_bus_data_leavetimes.SQL &> load_bus_data_leavetimes.log
   (load_bus_data_leavetimes.SQL must be run last, but other than that the order is not important)