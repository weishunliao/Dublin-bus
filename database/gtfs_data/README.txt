This file outlines the steps required to set up the database for storing GTFS Dublin Bus data. 
It also outlines steps for loading data into the tables.

1. Copy contents of the gtfs_data folder to the CS server (e.g. using WinSCP).
2. Log in to the server and navigate to the gtfs_data directory.
3. Run the following command, replacing USER & PASSWORD with the login details for mysql:
    > mysql -u USER -pPASSWORD < db_route_info_setup.sql
(Note: there should NOT be a space between -p and PASSWORD, it's not a typo!)
4. Navigate to the raw_data folder.
5. Download the full Dublin Bus data set into the folder (follow the instructions on Brightspace). 
   The files should be named 'rt_leavetimes_DB_2018.txt', 'rt_trips_DB_2018.txt' & 
   'rt_vehicles_DB_2018.txt'. Delete 'rt_vehicles_DB_2018.txt'.
6. Copy the Met Eireann data set to the same folder (can be downloaded from the Met Eireann website).
   The file should be named 'hly175.csv'.
7. Run the data prep script as follows:
        > nohup python prepare_files.py &> dataprep.log
8. When the script finishes running, move the files that have been created to the MySQL upload folder:
        > sudo mv *prepared* /var/lib/mysql-files/
   The files that were downloaded in steps 5 and 6 can now be deleted to clear up space.
9. Navigate to the directory where the files are stored:
        > sudo -i
        > cd /var/lib/mysql-files/
10. Rename the files as follows:
        > mv hly175_prepared.csv weather_data.csv
        > mv rt_trips_DB_2018_prepared.txt rt_trips.txt
        > mv rt_leavetimes_DB_2018_prepared.txt rt_leavetimes.txt
11. Import the data from each file using mysqlimport:
        > nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/weather_data.csv 
        > nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=';' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/rt_trips.txt
        > nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=';' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/rt_leavetimes.txt
12. Remove the files once they have been processed.