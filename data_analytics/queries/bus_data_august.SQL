select 'dayofservice', 'tripid', 'lineid', 'routeid', 'direction', 'progrnumber', 'stoppointid',
'actualtime_arr_stop', 'actualtime_dep_stop'
union all
select t.dayofservice, t.tripid, t.lineid, t.routeid, t.direction,
l.prognumber, l.stoppointid, l.actualtime_arr, l.actualtime_dep
from rt_trips t, rt_leavetimes l
where t.dayofservice = l.dayofservice 
and t.tripid = l.tripid
and t.dayofservice BETWEEN CAST('2018-08-01' AS DATE) AND CAST('2018-08-31' AS DATE)
INTO OUTFILE '/var/lib/mysql-files/august_bus_data.csv'
FIELDS TERMINATED BY ';'
ENCLOSED BY '"'
LINES TERMINATED BY '\n';