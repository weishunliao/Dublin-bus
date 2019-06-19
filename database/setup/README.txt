This file outlines the steps required to set up the database schema and tables, and to load data into the tables.

Follow the steps below to set up the database schema and tables:

1. Copy contents of the database_setup folder to the CS server (e.g. using WinSCP).
2. Log in to the server and navigate to the directory.
3. Run the following command, replacing USER & PASSWORD with the login details for mysql:
    mysql -u USER -pPASSWORD < create_tables.SQL
(Note: there should NOT be a space between -p and PASSWORD, it's not a typo!)

Follow the steps below to load data into the tables:

1. Set up environment variables to store details of the database that you want to connect to:
        - DBHOST: database host name
        - DBUSER: username you will log in as
        - DBPASS: password for the user specified above
2. Copy contents of the database_setup folder to the CS server if this has not already been done.
3. Navigate to the raw_data folder.
4. Download the full Dublin Bus data set into the folder (follow the instructions on Brightspace to download).
5. Copy the Met Eireann data set to the same folder (can be downloaded from the Met Eireann website).
6. Run the data load script as follows:
        nohup python load_data.py &> dataload_DD_MM_YYYY.log