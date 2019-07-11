CREATE SCHEMA `db_raw_data`;

CREATE TABLE `db_raw_data`.`rt_trips`
(
  `datasource` varchar(4),
  `dayofservice` datetime,
  `tripid` varchar(30),
  `lineid` varchar(10),
  `routeid` varchar(20),
  `direction` varchar(2),
  `plannedtime_arr` int,
  `plannedtime_dep` int,
  `actualtime_arr` int,
  `actualtime_dep` int,
  `basin` varchar(20),
  `tenderlot` varchar(30),
  `suppressed` int,
  `justificationid` int,
  `lastupdate` datetime,
  `note` varchar(255),
  CONSTRAINT pk_rt_trips PRIMARY KEY(`datasource`, `dayofservice`, `tripid`)
);

CREATE TABLE `db_raw_data`.`rt_vehicles`
(
  `datasource` varchar(4),
  `dayofservice` datetime,
  `vehicleid` varchar(10),
  `distance` int,
  `minutes` int,
  `lastupdate` datetime,
  `note` varchar(255),
  CONSTRAINT pk_rt_vehicles PRIMARY KEY(`datasource`, `dayofservice`, `vehicleid`)
);

CREATE TABLE `db_raw_data`.`rt_leavetimes`
(
  `datasource` varchar(4),
  `dayofservice` datetime,
  `tripid` varchar(30),
  `prognumber` int,
  `stoppointid` varchar(16),
  `plannedtime_arr` int,
  `plannedtime_dep` int,
  `actualtime_arr` int,
  `actualtime_dep` int,
  `vehicleid` varchar(10),
  `passengers` int,
  `passengersin` int,
  `passengersout` int,
  `distance` int,
  `suppressed` int,
  `justificationid` bigint,
  `lastupdate` datetime,
  `note` varchar(255),
  CONSTRAINT pk_rt_leavetimes PRIMARY KEY(`datasource`, `dayofservice`, `tripid`, `prognumber`),
  CONSTRAINT fk_leavetimes_trips FOREIGN KEY (`datasource`, `dayofservice`, `tripid`) 
  REFERENCES `db_raw_data`.`rt_trips` (`datasource`, `dayofservice`, `tripid`),
  CONSTRAINT fk_leavetimes_vehicles FOREIGN KEY (`datasource`, `dayofservice`,`vehicleid`) 
  REFERENCES `db_raw_data`.`rt_vehicles` (`datasource`, `dayofservice`, `vehicleid`)
);

CREATE TABLE `db_raw_data`.`weather_data`
(
  `record_date` datetime PRIMARY KEY,
  `irain` int,
  `rain` double,
  `itemp` int,
  `temp` double,
  `iwb` int,
  `wetb` double,
  `dewpt` double,
  `vappr` double,
  `rhum` int,
  `msl` double
);