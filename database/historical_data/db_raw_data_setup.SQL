CREATE SCHEMA `db_raw_data`;

CREATE TABLE `db_raw_data`.`rt_trips`
(
  `dayofservice` datetime,
  `tripid` varchar(7),
  `lineid` varchar(3),
  `routeid` varchar(7),
  `direction` varchar(2),
  `actualtime_arr` mediumint,
  `actualtime_dep` mediumint,
  CONSTRAINT pk_rt_trips PRIMARY KEY(`dayofservice`, `tripid`)
);

CREATE TABLE `db_raw_data`.`rt_leavetimes`
(
  `dayofservice` datetime,
  `tripid` varchar(7),
  `prognumber` tinyint,
  `stoppointid` varchar(4),
  `actualtime_arr` mediumint,
  `actualtime_dep` mediumint,
  CONSTRAINT pk_rt_leavetimes PRIMARY KEY(`dayofservice`, `tripid`, `prognumber`),
  CONSTRAINT fk_leavetimes_trips FOREIGN KEY (`dayofservice`, `tripid`) 
  REFERENCES `db_raw_data`.`rt_trips` (`dayofservice`, `tripid`)
);

CREATE TABLE `db_raw_data`.`weather_data`
(
  `record_date` datetime PRIMARY KEY,
  `irain` tinyint,
  `rain` double,
  `itemp` tinyint,
  `temp` double,
  `iwb` tinyint,
  `wetb` double,
  `dewpt` double,
  `vappr` double,
  `rhum` tinyint,
  `msl` double
);