LOAD DATA INFILE '/var/lib/mysql-files/rt_vehicles_DB_2018_prepared.txt' 
INTO TABLE `db_raw_data`.`rt_vehicles`
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\r\n';