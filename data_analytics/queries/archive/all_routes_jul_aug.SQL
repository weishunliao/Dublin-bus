select t.dayofservice, t.tripid, t.lineid, t.routeid, t.direction,
t.actualtime_arr as 'actualtime_arr_trip', t.actualtime_dep as 'actualtime_dep_trip',
l.prognumber as 'progrnumber', l.stoppointid, l.actualtime_arr as 'actualtime_arr_stop', 
l.actualtime_dep as 'actualtime_dep_stop'
from rt_trips t, rt_leavetimes l
where t.dayofservice = l.dayofservice 
and t.tripid = l.tripid
and t.dayofservice BETWEEN CAST('2018-07-01' AS DATE) AND CAST('2019-09-01' AS DATE)
INTO OUTFILE '/var/lib/mysql-files/all_routes_jul_aug.csv'
FIELDS TERMINATED BY ';'
ENCLOSED BY '"'
LINES TERMINATED BY '\n';