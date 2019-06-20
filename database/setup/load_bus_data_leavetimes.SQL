LOAD DATA INFILE '/var/lib/mysql-files/rt_leavetimes_DB_2018_prepared.txt' 
INTO TABLE `db_raw_data`.`rt_leavetimes`
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\r\n';