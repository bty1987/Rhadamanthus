select u.userName, count(u.userName) as quotationNum from quotation q, decorationorder do, user u where q.orderId = do.orderId and u.userId = do.designerId group by u.userId; #统计设计师报价数量

update user set password = '35FD596186101F2733C1DD2DD6FBFC6C';

update user set currentName = (select userName from (select userId, userName from user) u where user.userId = u.userId) where currentName = '';

select a.*, v.villageName, d.houseNumber from orderbelonginfo a, decorationorder d, village v ,(select orderId from orderbelonginfo where belongType = '业务' group by orderId having count(*)>=2) b where a.orderId=b.orderId and a.belongType = '业务' and a.belongRate < 1 and d.orderId = a.orderId and d.villageId = v.villageId;

select d.orderId, v.villageName, d.houseNumber, u1.currentName, dp1.deptName, u2.currentName, dp2.deptName, d.houseArea, d.createTime, d.status from decorationorder d, user u1, user u2, customer c, village v, department dp1, department dp2 where d.customerId = c.id and d.villageId = v.villageId and u1.userId = d.designerId and d.salesmanId = u2.userId and u1.deptId = dp1.deptId and u2.deptId = dp2.deptId limit 1;

select d.orderId, d.houseNumber, v.villageName, u.currentName from decorationorder d, user u, village v where createuser in ('FL-00477', 'FL-00478', 'FL-00479', 'FL-1089', 'FL-00507', 'FL-00508', 'FL-00509', 'FL-02194', 'FL-02195', 'FL-02196', 'FL-00510', 'FL-00511', 'FL-00512', 'FL-00513', 'FL-00514', 'FL-00515', 'FL-00516', 'FL-00517', 'FL-00518', 'FL-00519', 'FL-00520', 'FL-00521', 'FL-00522', 'FL-00523', 'FL-00524', 'FL-00525', 'FL-00530', 'FL-02620', 'FL-02621', 'FL-02622', 'FL-02623') and d.designerId = u.userId and v.villageId = d.villageId;

update decorationorder set createTime = '2014-12-31 23:59:59' where createUser in ('FL-00477', 'FL-00478', 'FL-00479', 'FL-1089', 'FL-00507', 'FL-00508', 'FL-00509', 'FL-02194', 'FL-02195', 'FL-02196', 'FL-00510', 'FL-00511', 'FL-00512', 'FL-00513', 'FL-00514', 'FL-00515', 'FL-00516', 'FL-00517', 'FL-00518', 'FL-00519', 'FL-00520', 'FL-00521', 'FL-00522', 'FL-00523', 'FL-00524', 'FL-00525', 'FL-00530', 'FL-02620', 'FL-02621', 'FL-02622', 'FL-02623', 'FL_02063', 'FL_1089');

UPDATE `decorationerp`.`materialpayment` SET `cash`='0', `bank`='4038', `bankInfo`='#兴业通POS|4038|2015-04-17 11:59:44#', `coupon`='685', `couponInfo`='#315主材券:685#' WHERE `mpId`='20744';

update materialpayment set collectTime = '2014-12-31 23:59:59' where collectUserId in ('FL_02066', 'FL_02065', 'FL_02064', 'FL-00614');

update decorationpayment set collectTime = '2014-12-31 23:59:59' where collectUserId in ('FL-00609', 'FL-00621');

update payment set collectTime = '2014-12-31 23:59:59' where collectUserId in ('FL-00609');

update decorationorder set createTime = '2014-12-31 23:59:59' where createUser in ('FL-00609', 'FL-02695');

update decorationorder set contractTime = '2014-12-31 23:59:59' where createUser = 'FL-00609';

alter table quotationfuncationareaitem add qfaiId int auto_increment primary key ;

#addreduce , constructionschedule , decorationcontract , decorationorder , decorationorderoperatehistory , decorationorderdrawline , decorationpayment , materialsuborder , orderbelonginfo , orderdesignpicture , quotation

insert into orderbelonginfo (orderId, belongType, belongUserId, belongDeptId, belongRegionId, belongRate, operateUserId, operateTime, status, changeReason, approvalUserId, approvalTime, defaultFlag) values ('1501250075', '设计', 'FL-00113', 'FL_DD_11', 'FL_DR_03', 1, 'FL-00477', '2015-01-25 17:40:01', '审批通过', NULL, NULL, NULL, '是');
insert into orderbelonginfo (orderId, belongType, belongUserId, belongDeptId, belongRegionId, belongRate, operateUserId, operateTime, status, changeReason, approvalUserId, approvalTime, defaultFlag) values ('1501250075', '业务', 'FL-00314', 'FL_BD_02', 'FL_BR_01', 1, 'FL-00477', '2015-01-25 17:40:01', '审批通过', NULL, NULL, NULL, '是');

/* 查询楼盘信息 */
select v.villageId, v.villageName, c.cityName, p.cityProperName, b.ruleContent, v.developer, v.salesPhone, v.villageContent from village v, city c, cityproper p, buildingnamerule b where v.cityProperId = p.cityProperId and p.cityId = c.cityId and v.buildingNameRuleId = b.id;

/* 查询一定时间内订单概要信息 */
select d.orderId, v.villageName, d.houseNumber, u1.currentName, dp1.deptName, u2.currentName, dp2.deptName, d.houseArea, d.createTime, d.status, d.orderTotalPrice, d.contractTime, q.discount, c.balance, _dp1.referMoney, _dp1.realMoney, case when d.houseType = '期房' then (_dp2.referMoney) end as referMoney, case when d.houseType = '期房' then (_dp2.realMoney) end as realMoney, _dp3.referMoney, _dp3.realMoney, _dp4.referMoney, _dp4.realMoney from decorationorder d, user u1, user u2, customer c, village v, department dp1, department dp2, quotation q, decorationpayment _dp1, decorationpayment _dp2, decorationpayment _dp3, decorationpayment _dp4 where d.customerId = c.id and d.villageId = v.villageId and u1.userId = d.designerId and d.salesmanId = u2.userId and u1.deptId = dp1.deptId and u2.deptId = dp2.deptId and d.createTime > '2015-03-30 00:00:00' and d.createTime < '2015-03-31 23:59:59' and d.orderId = q.orderId and q.status = 1 and d.orderId = _dp1.orderId and _dp1.paymentType = '首付款' and case when d.houseType = '期房' then (d.orderId = _dp2.orderId and _dp2.paymentType = '首付二期款') else _dp2.autoId = _dp1.autoId end and d.orderId = _dp3.orderId and _dp3.paymentType = '二期款' and d.orderId = _dp4.orderId and _dp4.paymentType = '尾款' limit 1;

/* 查询一定时间内签单订单信息 */
select d.orderId, v.villageName, d.houseNumber, c.customerName, c.phone, u1.currentName, dp1.deptName, u2.currentName, dp2.deptName, d.houseArea, d.orderTotalPrice, d.createTime, d.contractTime from decorationorder d, customer c, village v, user u1, user u2, department dp1, department dp2 where d.status = '已签约' and contractTime >= '2015-04-19 00:00:00' and contractTime <= '2015-04-22 23:59:59' and d.customerId = c.id and d.villageId = v.villageId and u1.userId = d.designerId and u1.deptId = dp1.deptId and u2.userId = d.salesmanId and u2.deptId = dp2.deptId;

/* 查询一定时间内量尺订单信息 */
select d.orderId, v.villageName, d.houseNumber, c.customerName, u1.currentName, dp1.deptName, u2.currentName, dp2.deptName, d.houseArea, d.orderTotalPrice, d.createTime, d.contractTime, d.status from decorationorder d, customer c, village v, user u1, user u2, department dp1, department dp2 where d.createTime >= '2015-08-01 00:00:00' and createTime <= '2015-08-31 23:59:59' and d.customerId = c.id and d.villageId = v.villageId and u1.userId = d.designerId and u1.deptId = dp1.deptId and u2.userId = d.salesmanId and u2.deptId = dp2.deptId;

/* 查询所有订单信息 */
select d.orderId, v.villageName, d.houseNumber, c.customerName, u1.currentName, dp1.deptName, u2.currentName, dp2.deptName, d.houseArea, d.createTime, d.status, d.orderTotalPrice from decorationorder d, user u1, user u2, customer c, village v, department dp1, department dp2 where d.customerId = c.id and d.villageId = v.villageId and u1.userId = d.designerId and d.salesmanId = u2.userId and u1.deptId = dp1.deptId and u2.deptId = dp2.deptId;

/* 更新主材收款错误数据信息 */
update decorationpayment d inner join (select orderId, referMoney from decorationpaymenthis) dh set d.referMoney = dh.referMoney where dh.orderId = d.orderId ; /* 查询 */

select autoId, orderId, referMoney, realMoney, advance from decorationpayment where referMoney != realMoney and realMoney != 0 and referMoney != 0; /* 查询应收款项与实收款项不等,预付款导致 */

/* 查询时间范围内外阜收款信息 */

select o.orderId, v.villageName, o.houseNumber, u.currentName, p.referMoney, p.paymentType, p.cash, p.bankInfo, p.checkv, p.checkvBankName, p.installment, p.installmentBankName, p.accounts, p.accountsBankName, p.advance, p.couponInfo, d.deptName, u1.currentName, p.collectTime from decorationorder o, decorationpayment p, user u, user u1, department d, village v where o.villageId = v.villageId and o.designerId = u.userId and u.deptId = d.deptId and u.deptId in ('FL_DD_18', 'FL_DD_19', 'FL_DD_20', 'FL_DD_21') and p.orderId = o.orderId and p.collectUserId = u1.userId and p.paymentStatus in ('已付款', '已确认') and p.collecttime > '2015-03-01 00:00:00' and p.collecttime < '2015-03-20 23:59:59';

select o.orderId, v.villageName, o.houseNumber, u.currentName, p.recharge, p.paymentType, p.cash, p.bankInfo, p.checkv, p.checkvBankName, p.installment, p.installmentBankName, p.accounts, p.accountsBankName, d.deptName, u1.currentName, p.collectTime  from decorationorder o, payment p, user u, user u1, department d, village v where o.villageId = v.villageId and o.designerId = u.userId and u.deptId = d.deptId and u.deptId in ('FL_DD_18', 'FL_DD_19', 'FL_DD_20', 'FL_DD_21') and p.customerId = o.customerId and p.collectUserId = u1.userId and p.status in ('已付款', '已确认') and p.type = '收款'  and p.collecttime > '2015-03-01 00:00:00' and p.collecttime < '2015-03-20 23:59:59';

/* 查询时间范围内刷卡时间 */
select mso.orderId, mp.cash, mp.bank, mp.bankInfo, mp.couponInfo, mp.collectTime from materialsuborder mso, materialpayment mp where mp.collecttime > '2015-03-19 00:00:00' and mp.collecttime < '2015-03-20 23:59:59' and mso.msoId = mp.msoId limit 2;

/* 查询一定时间内主材子订单信息 */
select mso.orderId, mso.msoNo, mso.orderAddr, mso.customerName, mso.salesmanName, mso.departmentName, mso.regionName, mso.materialType, mso.materialBrand, mso.coupon, mso.couponInfo, mp.paymentType, mp.refermoney, mp.createUserName, mp.collectUserName, mp.collectTime from materialsuborder mso, materialpayment mp where mp.collectTime >= '2015-04-01 00:00:00' and mp.collectTime <= '2015-04-19 23:59:59' and mso.msoId = mp.msoId and mp.paymentStatus in (1, 2) and mp.paymentType in (2,3,4,5,6) limit 1;

/* 查询重复订单信息 */
select orderId, villageId, houseNumber from decorationorder group by villageId, houseNumber having count(*) > 1;

/* 查询重复默认报价信息 */
select * from quotation where status = 1 group by orderid having count(*) > 1;

/* 查看重复订单信息 */
select * from decorationorder group by orderId having count(*) > 1;

/* 预结算利润 */
select mso.msono, mso.orderId, mso.orderAddr, mso.customerName, mso.salesmanName, mso.departmentName, mso.regionName, mso.materialType, mso.materialBrand, mso.preBalanceTime, mso.profit, mso.maling, mso.venderMaling from materialsuborder mso where mso.preBalanceTime > '2015-04-01 00:00:00' and mso.preBalanceTime < '2015-04-30 23:59:59' and mso.balanceStatus = 1;
select mso.msoid, msoi.msoiid, mso.msono, mso.orderid, msoi.materialModelName, msoi.materialTypeName, msoi.materialBrandName, msoi.measurementUnitName, msoi.packageName, msoi.salePrice, msoi.price, msoi.num, msoi.total, msoi.calcType, msoi.prePoint from materialsuborder mso, materialsuborderitem msoi where mso.preBalanceTime > '2015-04-01 00:00:00' and mso.preBalanceTime < '2015-04-30 23:59:59' and mso.balanceStatus = 1 and mso.msoid = msoi.msoid ;

select mso.msono, mso.orderId, mso.orderAddr, mso.customerName, mso.salesmanName, mso.departmentName, mso.regionName, mso.materialType, mso.materialBrand, mso.preBalanceTime, mso.maling, mso.venderMaling, msopb.preBalance from materialsuborder mso, materialsuborderprebalance msopb where msopb.msono in ('M1505036327', 'M1505036218', 'M1505022065', 'M1505035258', 'M1505031428', 'M1505031100', 'M1505033084', 'M1505032188', 'M1505031256', 'M1505032675', 'M1505038212', 'M1505038839', 'M1505031617', 'M1505034054', 'M1505031761', 'M1505031380', 'M1505035130', 'M1503083628', 'M1505015167', 'M1505023340', 'M1505038027', 'M1505031359', 'M1505039626', 'M1505023078', 'M1505038894', 'M1505023456', 'M1505034586', 'M1505031462', 'M1505033387', 'M1505032025', 'M1505038606', 'M1505036340', 'M1505038962', 'M1505039417', 'M1505033144', 'M1505033764', 'M1505038205', 'M1505035039', 'M1505039612', 'M1505031154', 'M1505034297', 'M1505031789', 'M1505031374', 'M1505037687', 'M1505031139', 'M1505031626', 'M1505036670', 'M1505037929', 'M1505031629', 'M1505035913', 'M1505039199', 'M1505036338', 'M1505035585', 'M1505031482', 'M1505031337', 'M1505033647', 'M1505037692', 'M1505032998', 'M1505037382', 'M1505039927', 'M1505039619', 'M1505032660', 'M1505039422', 'M1505036024', 'M1505031583', 'M1505032428', 'M1505034053', 'M1505036311', 'M1505031973', 'M1505037253', 'M1505034608', 'M1505034901', 'M1505034449', 'M1505036511', 'M1505022831', 'M1505038234', 'M1505032765', 'M1505034403', 'M1505031653', 'M1505035447', 'M1505031984', 'M1505031201', 'M1505031099', 'M1505034400', 'M1505035725', 'M1505031315', 'M1505035286', 'M1505032118', 'M1505033676', 'M1505037625', 'M1505037166', 'M1505034395', 'M1505039595', 'M1505032529', 'M1505031780', 'M1505037835', 'M1505037400', 'M1505034287', 'M1505035849', 'M1505038322', 'M1505032895', 'M1505032524', 'M1505029943', 'M1505032896', 'M1505033640', 'M1505036507', 'M1505034640', 'M1505039178', 'M1505032444', 'M1505031320', 'M1505031528', 'M1505039884', 'M1505037519', 'M1505035836', 'M1504189189', 'M1505033444', 'M1505039737', 'M1505039915', 'M1505031237', 'M1505036173', 'M1505038051', 'M1505034699', 'M1505036982', 'M1505039267', 'M1505031805', 'M1503155321', 'M1505036127', 'M1505032658', 'M1505035951', 'M1505036045', 'M1503148273', 'M1505031927', 'M1505039948', 'M1505033586', 'M1505037860', 'M1505035866', 'M1505029298', 'M1505031157', 'M1505033014', 'M1505039072', 'M1505032131', 'M1505031759', 'M1505035213', 'M1505031461', 'M1505031662', 'M1505031075', 'M1505038294', 'M1505033440', 'M1505039257', 'M1505039486', 'M1505037341', 'M1505031739', 'M1505039589', 'M1505039666', 'M1505035771', 'M1505039016', 'M1505032903', 'M1505031133', 'M1505031553', 'M1505033452', 'M1505033176', 'M1505039349', 'M1505038153', 'M1505034696', 'M1505031569', 'M1505032219', 'M1505036195', 'M1505037670', 'M1505029115', 'M1505036785', 'M1505032392', 'M1505035128', 'M1505018180', 'M1505033565', 'M1505031169', 'M1505035194', 'M1505034159', 'M1505035698', 'M1505031682', 'M1505036834', 'M1505036206', 'M1505034358', 'M1505032331', 'M1505031086', 'M1505039971', 'M1505033137', 'M1505032047', 'M1505039701', 'M1505039105', 'M1505032843', 'M1505039173', 'M1505034575', 'M1505038102', 'M1505031526', 'M1505038584', 'M1505038159', 'M1505035103', 'M1505038798', 'M1505038802', 'M1505037430', 'M1505033899', 'M1505037534', 'M1505034022', 'M1505031492', 'M1505038239', 'M1505038276', 'M1505032670', 'M1505038271', 'M1505031491', 'M1505034589', 'M1505037792', 'M1505038417', 'M1505031041', 'M1505031278', 'M1505038399', 'M1505031168', 'M1505034036', 'M1505031884', 'M1505035888', 'M1505031248', 'M1505038342', 'M1505034899', 'M1505035797', 'M1505036057', 'M1505032956', 'M1505031054', 'M1505034955', 'M1505033146', 'M1505034415', 'M1505036041', 'M1505031275', 'M1505034503', 'M1505032812', 'M1505032345', 'M1505037591', 'M1505032216', 'M1505038229', 'M1505031458', 'M1505033807', 'M1505032924', 'M1505031832', 'M1505031332', 'M1505035726', 'M1505038452', 'M1505033250', 'M1505031913', 'M1505039370') and mso.msoid = msopb.msoid;

/* 主材型号和子订单总价不同 */
select mso.msoid, mso.msono, mso.total, test.total from materialsuborder mso, (select msoid, sum(total) as total from materialsuborderitem where status != 4 group by msoid) test where mso.msoid = test.msoid and mso.status != 1 and mso.total != test.total;

/* 统计报价乳胶漆总数 */
select o.orderId, qfai.quoteItemId, qi.itemName, sum(qfai.num) as total from quotationfunctionarea qfa, quotation q, quotationfuncationareaitem qfai, quotationitem qi, decorationorder o where q.orderId = o.orderId and o.status = '已签约' and o.contractTime > '2015-05-01 00:00:00' and o.contractTime < '2015-05-31 23:59:59' and qfa.quotationid = q.autoId and qfai.functionAreaId = qfa.autoId and qfai.quoteItemId = qi.autoId and qi.autoId in (4176,4177,4178,4181,4182,4183,4926,4928,4930,4940,4942,4944,5594,5596,5600,5602) group by o.orderId, qfai.quoteItemId;

/* 导出人员信息表 */
select u.userId, u.oldUserId, u.userName, u.currentName, d.deptName, u.bank, u.bankCardNum from user u, department d where u.deptId = d.deptId;

/* 设计费对应设计师和业务员信息 */
select o.orderId, v.villageName, o.houseNumber, u.oldUserId, u.currentName, r.deptName, d.deptName, p.referMoney, r.collectTime from decorationpayment p, decorationreceipt r, decorationorder o, communion.village v, communion.user u, communion.department d, communion.department r where p.drId = r.drId and r.collectTime > '2016-02-01 00:00:00' and r.collectTime < '2016-02-31 23:59:59' and p.paymentType = '设计费' and not r.collectUserId in ('FL-00621','FL-00609') and p.orderId = o.orderId and o.villageId = v.villageId and o.designerId = u.userId and u.deptId = d.deptId and d.fatherDeptId = r.deptId;
select o.orderId, v.villageName, o.houseNumber, u.oldUserId, u.currentName, r.deptName, d.deptName, p.referMoney, r.collectTime from decorationpayment p, decorationreceipt r, decorationorder o, communion.village v, communion.user u, communion.department d, communion.department r where p.drId = r.drId and r.collectTime > '2016-02-01 00:00:00' and r.collectTime < '2016-02-31 23:59:59' and p.paymentType = '设计费' and not r.collectUserId in ('FL-00621','FL-00609') and p.orderId = o.orderId and o.villageId = v.villageId and o.salesmanId = u.userId and u.deptId = d.deptId and d.fatherDeptId = r.deptId;

/* 装修收款信息 */
select o.orderId, v.villageName, o.houseNumber, u.oldUserId, u.currentName, r.deptName, d.deptName, p.paymentType, p.referMoney, r.coupon, r.couponInfo, r.collectTime from decorationpayment p, decorationreceipt r, decorationorder o, communion.village v, communion.user u, communion.department d, communion.department r where p.drId = r.drId and r.collectTime > '2016-02-01 00:00:00' and r.collectTime < '2016-02-31 23:59:59' and not r.collectUserId in ('FL-00621','FL-00609') and p.orderId = o.orderId and o.villageId = v.villageId and o.designerId = u.userId and u.deptId = d.deptId and d.fatherDeptId = r.deptId;

/* 预付款收款信息 */
select o.orderId, v.villageName, o.houseNumber, u.oldUserId, u.currentName, r.deptName, d.deptName, p.paymentType, p.recharge, r.collectTime from payment p, advancereceipt r, decorationorder o, communion.village v, communion.user u, communion.department d, communion.department r where p.arId = r.arId and r.collectTime > '2016-02-01 00:00:00' and r.collectTime < '2016-02-31 23:59:59' and not r.collectUserId in ('FL-00621','FL-00609') and p.orderId = o.orderId and o.villageId = v.villageId and o.designerId = u.userId and u.deptId = d.deptId and d.fatherDeptId = r.deptId;

/* 查询没有管理费订单信息 */
select q.orderId, t.orderId, t.functionAreaName from quotation q left join (select q.orderId, a.functionAreaName, a.functionAreaType from quotation q, quotationfunctionarea a where a.quotationid = q.autoId and a.functionAreaType = '管理费') t on q.orderId = t.orderId where t.functionareaType is null;
select q.*, t.* from quotation q left join (select a.quotationid, a.functionAreaName, a.autoId from quotationfunctionarea a, quotationfuncationareaitem i where i.functionareaid = a.autoId and i.quoteitemid in (4513,4516,4517,4847,4848,4849,4850,4851,4852,4853,4854,4855,4856,4857,4858,4859,4860,4861,4862,5474,5476,5478,5480,5482,5484,5486,5488,5490,5492,5494,5496,5498,5500,5502,5504,5603,5605)) t on q.autoId = t.quotationid where t.functionareaname is null;
select distinct q.orderid, o.versionId, o.status, o.contractTime from quotation q left join (select a.quotationid, a.functionAreaName, a.autoId from quotationfunctionarea a, quotationfuncationareaitem i where i.functionareaid = a.autoId and i.quoteitemid in (4513,4516,4517,4847,4848,4849,4850,4851,4852,4853,4854,4855,4856,4857,4858,4859,4860,4861,4862,5474,5476,5478,5480,5482,5484,5486,5488,5490,5492,5494,5496,5498,5500,5502,5504,5603,5605)) t on q.autoId = t.quotationid, quotationfunctionarea a, decorationorder o where t.functionareaname is null and q.autoid = a.quotationId and q.orderId = o.orderId and o.contracttime is null;