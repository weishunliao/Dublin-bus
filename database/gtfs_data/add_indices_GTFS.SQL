CREATE INDEX idx_route_short_name ON db_route_info.routes (route_short_name);
CREATE INDEX idx_stop_name ON db_route_info.stops (stop_name);
CREATE INDEX idx_stop_headsign ON db_route_info.stop_times (stop_headsign);
CREATE INDEX idx_stop_id ON db_route_info.stops (stop_id);
CREATE INDEX idx_service_id ON db_route_info.trips (service_id);
CREATE INDEX idx_arrival_time ON db_route_info.stop_times (arrival_time);