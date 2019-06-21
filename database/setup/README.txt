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
        > nohup python prepare_files.py &> dataprep.log
7. When the script finishes running, move the files that have been created to the MySQL upload folder:
        > sudo mv *prepared* /var/lib/mysql-files/
   (The files that were downloaded in steps 4 and 5 can now be deleted to clear up space.)
8. Run the SQL scripts as follows, replacing USER & PASSWORD with the login details for mysql:
        > sudo sh -c 'nohup mysql -vv -u USER -pPASSWORD < load_weather_data.SQL &'
        > sudo sh -c 'nohup mysql -vv -u USER -pPASSWORD < load_bus_data_trips.SQL &'
        > sudo sh -c 'nohup mysql -vv -u USER -pPASSWORD < load_bus_data_vehicles.SQL &'
9. Navigate to the directory where the files are stored:
        > sudo -i
        > cd /var/lib/mysql-files/
10. Split the rt_trips_DB_2018_prepared.txt file as follows:
        > nohup split --lines=1000000 rt_leavetimes_DB_2018_prepared.txt rt_leavetimes.txt
11. Remove the files that are no longer needed:
        > rm *prepared*
12. Import the data using mysqlimport:
        > nohup mysqlimport -u USER -pPASSWORD --fields-terminated-by=';' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/rt_leavetimes.txtaa
        > nohup mysqlimport -u USER -pPASSWORD --fields-terminated-by=';' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/rt_leavetimes.txtab
        > nohup mysqlimport -u USER -pPASSWORD --fields-terminated-by=';' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/rt_leavetimes.txtac
        > nohup mysqlimport -u USER -pPASSWORD --fields-terminated-by=';' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/rt_leavetimes.txtad
        > nohup mysqlimport -u USER -pPASSWORD --fields-terminated-by=';' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/rt_leavetimes.txtae
        > nohup mysqlimport -u USER -pPASSWORD --fields-terminated-by=';' --fields-enclosed-by='"' --lines-terminated-by='\n' db_raw_data /var/lib/mysql-files/rt_leavetimes.txtaf
13. Remove the files that are no longer needed:
        > rm rt_leavetimes*