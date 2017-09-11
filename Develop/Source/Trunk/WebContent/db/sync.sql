stop slave;
change master to master_log_file='mysql-bin.000001', master_log_pos=120;
start slave;

reset slave;
reset master;

show slave status;
show master status;

stop slave;set global sql_slave_skip_counter=1;start slave;

select max(liid) from communion.logininfo;

select * from communion.user where uid = 34;

select count(*) from communion.user;

select max(qfaiId) from platform.quotationfunctionareaitem;