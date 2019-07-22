CREATE SCHEMA `db_route_info`;

CREATE TABLE `db_route_info`.`calendar`
(
  `service_id` varchar(10) PRIMARY KEY,
  `monday` tinyint,
  `tuesday` tinyint,
  `wednesday` tinyint,
  `thursday` tinyint,
  `friday` tinyint,
  `saturday` tinyint,
  `sunday` tinyint,
  `start_date` varchar(10),
  `end_date` varchar(10)
);

CREATE TABLE `db_route_info`.`calendar_dates`
(
  `service_id` varchar(10),
  `date` varchar(10),
  `exception_type` tinyint,
  CONSTRAINT pk_calendar_dates PRIMARY KEY(`service_id`, `date`)
);

CREATE TABLE `db_route_info`.`routes`
(
  `route_id` varchar(30) PRIMARY KEY,
  `agency_id` varchar(6),
  `route_short_name` varchar(10),
  `route_long_name` varchar(255),
  `route_type` tinyint
);

CREATE TABLE `db_route_info`.`shapes`
(
  `shape_id` varchar(30),
  `shape_pt_lat` double,
  `shape_pt_lon` double,
  `shape_pt_sequence` smallint,
  `shape_dist_traveled` double,
  CONSTRAINT pk_calendar_dates PRIMARY KEY(`shape_id`, `shape_pt_sequence`)
);

CREATE TABLE `db_route_info`.`stop_times`
(
  `trip_id` varchar(60),
  `arrival_time` time,
  `departure_time` time,
  `stop_id` varchar(30),
  `stop_sequence` smallint,
  `stop_headsign` varchar(255),
  `pickup_type` tinyint,
  `drop_off_type` tinyint,
  `shape_dist_traveled` double,
  CONSTRAINT pk_calendar_dates PRIMARY KEY(`trip_id`, `arrival_time`, `stop_id`)
);

CREATE TABLE `db_route_info`.`stops`
(
  `stop_id` varchar(30) PRIMARY KEY,
  `stop_name` varchar(255),
  `stop_lat` double,
  `stop_long` double
);

CREATE TABLE `db_route_info`.`trips`
(
  `route_id` varchar(30),
  `service_id` varchar(10),
  `trip_id` varchar(60) PRIMARY KEY,
  `shape_id` varchar(30),
  `trip_headsign` varchar(255),
  `direction_id` tinyint
);

ALTER TABLE `db_route_info`.`calendar_dates` ADD FOREIGN KEY (`service_id`) REFERENCES `calendar` (`service_id`);

ALTER TABLE `db_route_info`.`stop_times` ADD FOREIGN KEY (`stop_id`) REFERENCES `stops` (`stop_id`);

ALTER TABLE `db_route_info`.`trips` ADD FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`);

ALTER TABLE `db_route_info`.`trips` ADD FOREIGN KEY (`service_id`) REFERENCES `calendar` (`service_id`);

ALTER TABLE `db_route_info`.`trips` ADD FOREIGN KEY (`shape_id`) REFERENCES `shapes` (`shape_id`);

ALTER TABLE `db_route_info`.`stop_times` ADD FOREIGN KEY (`trip_id`) REFERENCES `trips` (`trip_id`);