CREATE INDEX idx_trips ON db_raw_data.rt_trips (lineid);
CREATE INDEX idx_leavetimes ON db_raw_data.rt_leavetimes (stoppointid);