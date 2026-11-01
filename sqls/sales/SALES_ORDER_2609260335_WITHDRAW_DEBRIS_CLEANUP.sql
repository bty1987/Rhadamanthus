-- ============================================================================
-- 文件: SALES_ORDER_2609260335_WITHDRAW_DEBRIS_CLEANUP.sql
-- 库: 生产(payment库为主)
-- ----------------------------------------------------------------------------
-- 用途:
--   销售单 2609260335(sid=1521938, 恒洁卫浴, 装修单2412140212) 2026-10-31 撤款事故还原。
--   事故: 店员(恒洁卫浴 uid=31696) 18:26 建 320万退货单并确认(生成未执行 type=4 退款行,
--         待按正确流程执行), 18:29 点款项弹窗"撤款"按钮(实调 cancelSalesPayment 整单翻转),
--         1775万已确认补款行被翻转 type=3→5 并全额退回主材预付款。
--   处置口径(用户拍板): 退货链(退货单/退款行/退货结算单)是真实业务动作——全部保留;
--         撤款是误操作——完整还原: 补款行恢复 type=3/原收据, 撤款产生的预付款入账
--         (明细+预付款收据)删除, 余额相应扣减。
--
-- 还原清单(撤款完整足迹, 共3删3改):
--   ① payment.payment        pid=2968828  撤款入账流水 SA2207167R(+17,750,000, type=3)
--   ② payment.advancereceipt arId=2918948 撤款预付款收据(transfer=17,750,000, "款项撤款退回主材预付款")
--   ③ payment.salesreceipt   srid=1541114 撤款退款收据(TYPE_REFUND, "款项撤款,退回主材预付款余额17750000")
--   ④ payment.salespayment   spid=2207167 补款行还原: type 5→3, 收据指针 1541114→1516927(原始收款收据,李冬,9-27)
--   ⑤ payment.advancepayment apId=454060 materialBalance 11,109,000 → -6,641,000
--      (=撤款前底数4,359,000[PT320652,10-08实证] - 新单11,000,000消费)
--   ⑥ payment.payment        pid=2968852  新单消费行余额快照同步 11,109,000 → -6,641,000(保持明细累计=余额)
--
-- 明确保留(真实业务, 不动):
--   - 退货单 sales.salesrefunds rid=427753(320万,已确认) + 明细 riid=720027
--   - 悬空退款行 payment.salespayment spid=2236839(type=4,status=0,待执行) —— 后续按正确流程
--     行级执行: 非券320万进预付款, 余额 -6,641,000 → -3,441,000
--   - 退货结算单 sales.salesbalance sbid=1775345(-320万) + 明细 sbiid=3601948(厂商侧真实记录)
--   - sales.salesitem siid=3365398(已被退货链清零) / sales.amount=14,550,000(=Σitems, 自洽)
--   - 销售单头: fullpayStatus=2 在补款行还原后重新为真, status=0/balanceStatus=1/amount 均不动
--   - 原始收款收据 salesreceipt srid=1516927 / 原始预付款收据 advancereceipt arId=2867940 /
--     原始收款流水 payment.payment SA2207167(9-27) / 新单消费流水 SA2236794
--
-- 还原后资金状态(重要):
--   预付款主材余额 = -6,641,000(负数=真实欠款状态, 非错误: 客户新单消费11,000由撤款入账垫付,
--   入账撤回后即透支)。退款行320万正确执行后 → -3,441,000; 客户充值3,441归零
--   (或业务侧将新单11,000改POS/现金重收, 另行处理)。
--
-- 🔴 执行顺序要求:
--   本脚本执行前~代码修复上线前, 该单款项弹窗"撤款"按钮仍指向整单翻转接口(cancelSalesPayment),
--   还原后的补款行(type=3,status=2)再次满足其触发条件——任何人再点一次即重演事故。
--   执行本脚本后立即冻结该单款项操作, 直至弹窗撤款按钮改为行级执行(代码修复)上线。
--
-- 执行前置条件:
--   1. "执行前核验"段逐条 SELECT, 结果与注释预期一致方可执行。
--   2. 2026-11-01 之后该客户(customerId=630174)无新增预付款流水(执行期间业务停手)。
--
-- 回滚方式: 见文件尾部"回滚"注释段(全字段逆向)。
-- 验证: 见文件尾部"执行后验证"段。
-- ============================================================================

-- ─────────────────────────── 执行前核验(逐条) ───────────────────────────
-- V1 预期1行: 撤款入账流水
-- SELECT pid,uniqueid,balance,recharge,type,status FROM payment.payment WHERE pid=2968828 AND uniqueid='SA2207167R';
-- V2 预期1行: 撤款预付款收据
-- SELECT arId,collecterName,collectTime,transfer,comment FROM payment.advancereceipt WHERE arId=2918948 AND transfer=17750000;
-- V3 预期1行: 撤款退款收据
-- SELECT srid,collecterName,collectTime,type,realMoney,advance FROM payment.salesreceipt WHERE srid=1541114 AND type=1 AND realMoney=17750000;
-- V4 预期1行: 被翻转的补款行
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE spid=2207167 AND type=5 AND status=2 AND srid=1541114;
-- V5 预期11,109,000: 当前预付款余额
-- SELECT apId,materialBalance FROM payment.advancepayment WHERE apId=454060 AND orderId='2412140212';
-- V6 预期底数4,359,000: 撤款前最后一笔流水余额(PT320652, 10-08)
-- SELECT pid,uniqueid,balance FROM payment.payment WHERE customerId=630174 AND pid=2931969;
-- V7 预期0行: 该客户10-31 18:33后无新增流水(有则停下核实)
-- SELECT pid,uniqueid,createTime,balance FROM payment.payment WHERE customerId=630174 AND createTime>'2026-10-31 18:34:00';

START TRANSACTION;

-- ① 撤款入账流水(arId指向②) —— 预期影响1行
DELETE FROM payment.payment
 WHERE pid = 2968828 AND uniqueid = 'SA2207167R' AND recharge = 17750000 AND type = 3;

-- ② 撤款预付款收据 —— 预期影响1行
DELETE FROM payment.advancereceipt
 WHERE arId = 2918948 AND transfer = 17750000 AND collectTime = '2026-10-31 18:29:03';

-- ③ 撤款退款收据 —— 预期影响1行
DELETE FROM payment.salesreceipt
 WHERE srid = 1541114 AND type = 1 AND realMoney = 17750000 AND advance = 17750000;

-- ④ 补款行还原(type 5退补款→3补款, 收据指针回原始收款收据1516927) —— 预期影响1行
UPDATE payment.salespayment
   SET type = 3, srid = 1516927
 WHERE spid = 2207167 AND sid = 1521938 AND type = 5 AND status = 2 AND srid = 1541114;

-- ⑤ 预付款余额扣减撤款入账(11,109,000-17,750,000=-6,641,000) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance - 17750000
 WHERE apId = 454060 AND materialBalance = 11109000;

-- ⑥ 新单消费行余额快照同步(保持明细累计=余额) —— 预期影响1行
UPDATE payment.payment
   SET balance = balance - 17750000
 WHERE pid = 2968852 AND uniqueid = 'SA2236794' AND balance = 11109000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期2行: 补款行(type=3,status=2,srid=1516927) + 待执行退款行(type=4,status=0,rid=427753)
-- SELECT spid,type,status,srid,rid,referMoney FROM payment.salespayment WHERE sid=1521938 ORDER BY spid;
-- W2 预期均0行: 撤款三件套已清
-- SELECT COUNT(*) FROM payment.payment      WHERE uniqueid='SA2207167R';
-- SELECT COUNT(*) FROM payment.advancereceipt WHERE arId=2918948;
-- SELECT COUNT(*) FROM payment.salesreceipt   WHERE srid=1541114;
-- W3 预期-6,641,000 且 = 末笔流水余额(SA2236794)
-- SELECT materialBalance FROM payment.advancepayment WHERE apId=454060;
-- SELECT balance FROM payment.payment WHERE customerId=630174 ORDER BY pid DESC LIMIT 1;
-- W4 预期1行: 退货链完好
-- SELECT rid,total,status,type,isAffirm FROM sales.salesrefunds WHERE rid=427753;
-- W5 预期1行: 单头未动(fullpayStatus=2, amount=14550000, status=0)
-- SELECT no,status,total,amount,fullpay,fullpayStatus,balanceStatus FROM sales.sales WHERE sid=1521938;

-- ═══════════════════════════ 回滚(逐条确认后执行) ═══════════════════════════
-- R1 预付款收据:
-- INSERT INTO payment.advancereceipt (arId,type,cluid,collecterName,collectTime,cfuid,confirmerName,confirmTime,status,realMoney,cash,cashInfo,bank,bankInfo,checkv,checkvBank,installment,installmentBank,accounts,accountsBank,transfer,comment)
-- VALUES (2918948,0,31696,'恒洁卫浴','2026-10-31 18:29:03',NULL,'',NULL,2,0,0,'',0,'',0,'',0,'',0,'',17750000,'装修单号:2412140212,销售单:2609260335,款项撤款退回主材预付款');
-- R2 入账流水:
-- INSERT INTO payment.payment (pid,arId,uniqueid,customerId,orderId,company,cuid,createTime,balance,recharge,type,paymentType,status,comment,aid)
-- VALUES (2968828,2918948,'SA2207167R',630174,'2412140212',1,31696,'2026-10-31 18:29:03',22109000,17750000,3,2,2,'',0);
--   注: cuid/arId/comment 以 V1/V2 实查值为准(arId=2918948, comment列实查为空串)。
-- R3 退款收据:
-- INSERT INTO payment.salesreceipt (srid,cluid,cfuid,collecterName,confirmerName,collectTime,confirmTime,type,realMoney,cash,cashInfo,bank,bankInfo,checkv,checkvBank,installment,installmentBank,accounts,accountsBank,advance,advanceType,coupon,couponInfo,comment)
-- VALUES (1541114,31696,NULL,'恒洁卫浴',NULL,'2026-10-31 18:29:03',NULL,1,17750000,0,'',0,'',0,'',0,'',0,'',17750000,0,0,'','销售单:2609260335,款项撤款,退回主材预付款余额17750000');
-- R4 补款行再翻转:
-- UPDATE payment.salespayment SET type=5, srid=1541114 WHERE spid=2207167 AND type=3 AND srid=1516927;
-- R5 预付款余额加回:
-- UPDATE payment.advancepayment SET materialBalance = materialBalance + 17750000 WHERE apId=454060;
-- R6 快照还原:
-- UPDATE payment.payment SET balance = balance + 17750000 WHERE pid=2968852 AND uniqueid='SA2236794';
