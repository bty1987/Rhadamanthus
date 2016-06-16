set @orderId = 1507070121;

select * from decorationorder where orderId = @orderId;

select * from decorationpayment where orderId = @orderId;

select * from decorationreceipt where drId in (select drId from decorationpayment where orderId = @orderId);

set @customerId = 33626;

select * from advancepayment where customerId = @customerId;

select * from payment where customerId = @customerId;

select * from advancereceipt where arId in (select arId from payment where customerId = @customerId);

select * from materialsuborder where msoNo = 'M1603316584';

set @msoId = 165242;

select * from materialsuborderitem where msoId = @msoId;

select * from materialsuborderrefund where msoId = @msoId;

select * from materialpayment where msoId = @msoId;

select * from materialreceipt where mrId in (select mrId from materialpayment where msoId = @msoId);



