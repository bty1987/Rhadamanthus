
# 平均折扣
select avg(q.discount) 
from decoration.decoration d, quotation.quotation q 
where d.contractTime > '2020-01-01 00:00:00' and d.orderId = q.orderId and q.defaults = 1;

# 平均面积
select avg(h.buildarea)
from decoration.decoration d, communion.house h
where d.contractTime > '2020-01-01 00:00:00' and d.hid = h.hid;

# 平均签单额
select avg(d.ordertotalprice)
from decoration.decoration d
where d.contractTime > '2020-01-01 00:00:00';

# 公司签单额
select 
co.name as 'content', sum(d.orderTotalPrice)/1000 as 'value'
from 
decoration.decoration d, communion.company co
where 
d.contractTime > '2021-03-01 00:00:00' and 
d.contractTime < '2021-03-31 23:59:59' and
d.company = co.cid
group by
d.company;

select 
sum(d.orderTotalPrice)/1000
from 
decoration.decoration d, communion.company co
where 
d.contractTime > '2017-01-01 00:00:00' and 
d.contractTime < '2017-12-31 23:59:59' and
d.company = co.cid;

# 签单额
select sum(d.ordertotalprice)/1000, count(*)
from decoration.decoration d
where d.contractTime > '2021-03-01 00:00:00' and d.contractTime < '2021-03-31 23:59:59'
limit 10;

# 量尺数
select count(*) 
from decoration.decoration d
where d.createtime > '2021-03-01 00:00:00' and d.createtime < '2021-03-31 23:59:59';

# 设计费
select sum(dp.referMoney)/1000
from payment.decorationpayment dp, payment.decorationreceipt dr
where dr.collecttime > '2021-03-01 00:00:00' and dr.collecttime < '2021-03-31 23:59:59' and dp.drid = dr.drid and dp.paymenttype = '设计费' and dp.paymentstatus in (1, 2)
limit 10;

# 签单类型
select d.typeness, count(*)
from decoration.decoration d
where d.contractTime > '2021-03-01 00:00:00' and d.contractTime < '2021-03-31 23:59:59'
group by d.typeness;

# 开单数
select count(*) 
from sales.sales s
where s.createTime > '2021-03-01 00:00:00' and s.createTime < '2021-03-31 23:59:59';

# 销售额
select sum(s.total)/1000
from sales.sales s
where s.fullpayTime > '2021-03-01 00:00:00' and s.fullpayTime < '2021-03-31 23:59:59';

# 结算数
select count(*)
from sales.sales s
where s.balancetime > '2021-03-01 00:00:00' and s.balancetime < '2021-03-31 23:59:59';

# 退货数
select count(*)
from sales.refunds r
where r.createtime > '2021-03-01 00:00:00' and r.createtime < '2021-03-31 23:59:59';

# 设计排名
select concat(dd.name, ' ', du.currentname) as 'area', '-' as 'pv', concat(ROUND(sum(d.ordertotalprice)/10000000), 'W') as 'attribute', 'series1' as '+', ROUND(sum(d.ordertotalprice)/10000000)
from decoration.decoration d, communion.user du, communion.department dd
where d.contractTime > '2021-03-01 00:00:00' and d.contractTime < '2021-03-31 23:59:59' and d.dsuid = du.uid and du.deptid = dd.did
group by d.dsuid;

# 业务排名
select concat(sd.name, ' ', su.currentname) as 'area', '-' as 'pv', concat(ROUND(sum(d.ordertotalprice)/10000000), 'W') as 'attribute', 'series1' as '+', ROUND(sum(d.ordertotalprice)/10000000)
from decoration.decoration d, communion.user su, communion.department sd
where d.contractTime > '2021-03-01 00:00:00' and d.contractTime < '2021-03-31 23:59:59' and d.svuid = su.uid and su.deptid = sd.did
group by d.svuid;

# 工程指标
select sum(cs0),sum(cs1),sum(cs2),sum(cs3),sum(cs4),sum(cs5),sum(cs6),sum(cs7),sum(cs8),sum(cs9),sum(cs10),sum(cs11),sum(cs12),sum(cs13),sum(cs24),sum(cs25)
from report.decoration4construction;

# 走势
select concat(date_format(d.contractTime, '%Y/%m'), '/01 00:00:00') x, sum(d.ordertotalprice)/1000 y, co.name name, co.cid s
from decoration.decoration d, communion.company co
where d.contractTime > '2020-01-01 00:00:00' and d.company = co.cid and co.cid in (1,2,3,7,8,9,12,16)
group by date_format(d.contractTime, '%Y-%m'), d.company;

# 公司信息
select concat(cid, '') value, name from communion.company where cid in (1,2,3,7,8,9,12,16,20,21,22,23,24,25,26,27,28,29,30,31,34,35,36,37,38,39);

# 各省份签单额
select sum(d.ordertotalprice)/10000000
from decoration.decoration d
where d.contractTime > '2021-03-01 00:00:00' and d.contractTime < '2021-03-31 23:59:59' and d.company in (8,22);

# 辽宁 (1,2,3,9,12,24,25,26,27,28,31,35,36,37,38)
# 吉林 (16,21)
# 黑龙江 (29,30,39)
# 安徽 (7,20,34)
# 湖北 (8,22)

select count(*) from communion.village;
select count(*) from communion.customer;
select count(*) from decoration.decoration;
select count(*) from material.material;
select count(*) from sales.sales;
select count(*) from construction.construction;
select count(*) from payment.advancepayment;
select count(*) from payment.decorationpayment;
select count(*) from payment.materialpayment;
select count(*) from payment.salespayment;
select count(*) from payment.servicepayment;
select count(*) from communion.user;
select count(*) from quotation.quotation;