select t.datasource, t.dayofservice, t.tripid, t.lineid, t.routeid, t.direction, 
t.plannedtime_arr as 'plannedtime_arr_trip', t.plannedtime_dep  as 'plannedtime_dep_trip', 
t.actualtime_arr as 'actualtime_arr_trip', t.actualtime_dep as 'actualtime_dep_trip', 
t.basin, t.tenderlot, t.suppressed as 'suppressed_trip', t.justificationid as 'justificationid_trip',
t.lastupdate as 'lastupdate_trip', t.note as 'note_trip', 
l.prognumber as 'progrnumber', l.stoppointid, l.plannedtime_arr as 'plannedtime_arr_stop', 
l.plannedtime_dep as 'plannedtime_dep_stop', l.actualtime_arr as 'actualtime_arr_stop', 
l.actualtime_dep as 'actualtime_dep_stop', l.vehicleid, l.passengers, l.passengersin, 
l.passengersout, l.distance as 'distance_leavetimes', l.suppressed as 'suppressed_leavetimes', 
l.justificationid as 'justificationid_leavetimes', l.lastupdate as 'lastupdate_leavetimes',
l.note as 'note_leavetimes', v.distance as 'distance_vehicle', 
v.minutes as 'minutes_vehicle', v.note as 'note_vehicle' 
from rt_trips t, rt_leavetimes l, rt_vehicles v 
where t.datasource = l.datasource 
and t.dayofservice = l.dayofservice 
and t.tripid = l.tripid 
and v.datasource = l.datasource 
and v.dayofservice = l.dayofservice 
and v.vehicleid = l.vehicleid 
and t.lineid = '15A'
INTO OUTFILE '/var/lib/mysql-files/route_15A.csv'
FIELDS TERMINATED BY ';'
ENCLOSED BY '"'
LINES TERMINATED BY '\n';