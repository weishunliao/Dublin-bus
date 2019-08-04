select 'dayofservice', 'tripid', 'lineid', 'progrnumber', 'stoppointid', 'actualtime_arr_stop'
union all
select t.dayofservice, t.tripid, t.lineid, l.prognumber, l.stoppointid, l.actualtime_arr
from rt_trips t, rt_leavetimes l
where t.dayofservice = l.dayofservice 
and t.tripid = l.tripid
and t.dayofservice BETWEEN CAST('2018-03-01' AS DATE) AND CAST('2018-03-31' AS DATE)
INTO OUTFILE '/var/lib/mysql-files/march_bus_data.csv'
FIELDS TERMINATED BY ';'
ENCLOSED BY '"'
LINES TERMINATED BY '\n';