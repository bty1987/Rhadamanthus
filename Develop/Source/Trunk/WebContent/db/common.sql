set @orderId = 1605220025;

select * from decorationorder where orderId = @orderId;

select * from decorationpayment where orderId = @orderId;

select * from decorationreceipt where drId in (select drId from decorationpayment where orderId = @orderId);

set @customerId = 71168;

select * from advancepayment where customerId = @customerId;

select * from payment where customerId = @customerId;

select * from advancereceipt where arId in (select arId from payment where customerId = @customerId);

select * from materialsuborder where msoNo = 'M1603316584';

set @msoId = 165242;

select * from materialsuborderitem where msoId = @msoId;

select * from materialsuborderrefund where msoId = @msoId;

select * from materialpayment where msoId = @msoId;

select * from materialreceipt where mrId in (select mrId from materialpayment where msoId = @msoId);

stop slave;set global sql_slave_skip_counter=1;start slave;















/*report*/

select v.vid, count(o.orderId), v.villageName from decorationorder o, communion.village v where o.villageId = v.villageId and o.status = '已签约' group by v.villageId;

select cp.cpId, count(o.orderId), cp.cityproperName from decorationorder o, communion.village v, communion.cityproper cp where o.status = '已签约' and o.villageId = v.villageId and v.cityProperId = cp.cityProperId group by v.cityProperId limit 100;

select c.cid, count(o.orderId), c.cityName from decorationorder o, communion.village v, communion.cityproper cp, communion.city c where o.status = '已签约' and o.villageId = v.villageId and v.cityProperId = cp.cityProperId and cp.cityId = c.cityId group by c.cityId limit 100;

select r.rid, count(o.orderId), r.regionName from decorationorder o, communion.village v, communion.cityproper cp, communion.city c, communion.region r where o.status = '已签约' and o.villageId = v.villageId and v.cityProperId = cp.cityProperId and cp.cityId = c.cityId and c.cityregionId = r.regionId group by r.regionId limit 100;