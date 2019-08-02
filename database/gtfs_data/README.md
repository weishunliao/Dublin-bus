This file outlines the steps required to set up the database for storing GTFS Dublin Bus data. <br>
It also outlines steps for loading data into the tables.

1. Copy contents of the gtfs_data folder to the CS server (e.g. using WinSCP).
2. Log in to the server and navigate to the gtfs_data directory.
3. Run the following command, replacing USER & PASSWORD with the login details for mysql:

        mysql -u USER -pPASSWORD < db_route_info_setup.sql

4. Download the latest GTFS data into the folder (available at https://www.transportforireland.ie/transitData/PT_Data.html).
5. Move the downloaded files to the MySQL upload folder:
        
        sudo mv *.txt /var/lib/mysql-files/

6. Navigate to the directory where the files are stored:

        sudo -i

        cd /var/lib/mysql-files/

7. Delete the file agency.txt, and remove the first row from each of the other files.
8. Import the data from each file using mysqlimport (the order is important due to foreign keys):

        nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n' db_route_info /var/lib/mysql-files/calendar.txt

        nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n' db_route_info /var/lib/mysql-files/calendar_dates.txt

        nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n' db_route_info /var/lib/mysql-files/stops.txt

        nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n' db_route_info /var/lib/mysql-files/routes.txt

        nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n' db_route_info /var/lib/mysql-files/shapes.txt

        nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n' db_route_info /var/lib/mysql-files/trips.txt

        nohup mysqlimport -u USER -pPASSWORD -f --fields-terminated-by=',' --fields-enclosed-by='"' --lines-terminated-by='\n' db_route_info /var/lib/mysql-files/stop_times.txt

9. Remove the files once they have been processed.
10. Navigate back to the gtfs_data directory and run the following script:

        mysql -u USER -pPASSWORD db_route_info < trim_leading_spaces.sql