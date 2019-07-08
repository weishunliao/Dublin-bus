LOAD DATA INFILE '/var/lib/mysql-files/hly175_prepared.csv' 
INTO TABLE `db_raw_data`.`weather_data`
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n';