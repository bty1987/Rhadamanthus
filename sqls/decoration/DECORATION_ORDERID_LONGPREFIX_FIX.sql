-- decoration.decoration 长度14的超长 orderId 批量修复（待生产）
-- 范围(2026-10-05 拍板)：仅处理 CHAR_LENGTH(orderId) = 14 的 13 张单——
--   朝阳方林装饰 10 张 + 朝阳爱林装饰 2 张（前缀=中文全称4字 + yyMMdd + 4位流水，接入初期 shortname 误配全称所致），
--   合肥方林装饰 1 张（05514006611918，前缀=合肥区号0551+400号码，形态特殊一并规范）。
--   11 位的（屿林/1918/花溪等 11,473 张）按拍板不处理。
-- 修复方式：剥前 4 字符 → 标准 10 位单号。撞号核验(2026-10-05)：13 张剥后与全库既有单零冲突。
-- 同步范围：全部 orderId 引用基表 124 张（视图随基表自动变更）经映射表同步。
-- ⚠️ 执行要求：逐步核验；引用表 0 行更新属正常；外部系统(钉钉/小程序/金蝶/纸质单据)中的旧单号无法追溯，映射表保留备查。

-- ========== 1. 建映射表（范围: 长度14, 新号=剥前4字符） ==========
DROP TABLE IF EXISTS decoration.tmp_orderid_fix;
CREATE TABLE decoration.tmp_orderid_fix (
    oid int NOT NULL,
    old_orderId varchar(15) NOT NULL,
    new_orderId varchar(15) NOT NULL,
    PRIMARY KEY (oid),
    UNIQUE KEY uk_new (new_orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO decoration.tmp_orderid_fix (oid, old_orderId, new_orderId)
SELECT d.oid, d.orderId, SUBSTRING(d.orderId, 5)
FROM decoration.decoration d
WHERE CHAR_LENGTH(d.orderId) = 14;

-- 核验: 映射行数(预期 13)
SELECT COUNT(*) AS mapped FROM decoration.tmp_orderid_fix;

-- 核验: 新号与全库既有单零冲突(预期 0)
SELECT COUNT(*) AS conflict
FROM decoration.tmp_orderid_fix f
JOIN decoration.decoration d ON d.orderId = f.new_orderId;

-- 核验: 新号内部零重复(预期 0)
SELECT new_orderId, COUNT(*) FROM decoration.tmp_orderid_fix GROUP BY new_orderId HAVING COUNT(*) > 1;

-- ========== 2. 主表更新 ==========
UPDATE decoration.decoration d
JOIN decoration.tmp_orderid_fix f ON f.oid = d.oid
SET d.orderId = f.new_orderId;

-- 核验: 主表无长度14(预期 0)
SELECT COUNT(*) FROM decoration.decoration WHERE CHAR_LENGTH(orderId) = 14;

-- ========== 3. 引用表同步(124 张基表; 0 行更新属正常) ==========
UPDATE CONCAT(c.table_schema, '.', c.table_name) r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approval r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvaldecorationactivity r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvaldecorationactivityitem r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvaldecorationbelong r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvaldecorationbelongitem r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvaldecorationcontract r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvaldecorationholonomy r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvaldecorationterminal r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvalpaymentwithdraw r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvalquotationdiscount r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE approval.approvalvillage r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE balance.comcost r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE communion.house r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.acceptance r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.camera r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.cameraaccess r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.cameramedia r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.constructer r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.constructerrecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.construction r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.constructiondiary r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.constructioninfo r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.constructionplan r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.constructionprofile r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.constructionrecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.constructionschedule r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.customerservicebackvisit r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.customerservicecomplaint r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.customerserviceguarantee r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.drawline r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.drawlineprofile r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.inspectiondeduction r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.inspectionrecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.materialplan r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.qualiter r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.qualitytestingrecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE construction.rework r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.aepair r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.circle r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.complain r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.consultion r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.conversation r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.cppoint r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.cppointpayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.cppointrecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.customeraftersales r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.customerchance r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.customerchanceorder r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.customernotice r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.customerorigin r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.customerprofile r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.customersource r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.decoration r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.droup r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.feedback r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.feedbackbackvisit r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.feedbackcomplaint r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.feedbackguarantee r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.group r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.revisit r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.survey r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.vscorerecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE customer.vustomer r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.audit r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.backvisit r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decoration r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationaccount r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationaccountitem r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationaccountstatus r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationactivity r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationactivityitem r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationaddition r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationbelong r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationcontract r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationcontract1 r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationcontractrecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationholonomy r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationinclusive r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationinfo r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationmeasure r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationmidpack r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationoperate r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationpicture r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationservice r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE decoration.decorationuser r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE information.awardrecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE information.events r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE information.messagecueuing r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE information.messagedueuing r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE information.messagequeuing r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE information.phonecall r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE information.vpayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE information.vticket r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.activitypayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.advancepayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.decorationpayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.oalespayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.payment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.paymentactivity r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.paymentcontract r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.paytran r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.proxypayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.receipt r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.salespayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE payment.servicepayment r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.addreduce r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.extension r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.normtion r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.protation r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.quotation r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.quotationassignrecord r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.quotationassignrequest r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.quotationassigntalk r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.quotationpicture r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.quotationprefer r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.quotationprofile r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.ruotation r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.selection r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE quotation.selectionitem r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE sales.oales r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE sales.sales r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE sales.salesactivityitem r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;
UPDATE sales.salesprofile r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId SET r.orderId = f.new_orderId;

-- ========== 4. 执行后核验与清理 ==========
-- 4a. 各引用表残留旧单号核验(逐表):
--     SELECT COUNT(*) FROM <表> r JOIN decoration.tmp_orderid_fix f ON f.old_orderId = r.orderId;
-- 4b. 映射表保留备查(外部系统旧单号对账), 不 DROP:
--     SELECT * FROM decoration.tmp_orderid_fix;
