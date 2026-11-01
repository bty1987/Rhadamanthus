-- ============================================================================
-- 文件: SALES_ORDER_2609260335_REFUND_ROW_3200_EXECUTE.sql
-- 库: 生产(payment + sales)
-- ----------------------------------------------------------------------------
-- 用途:
--   执行销售单 2609260335 的待退款项行(spid=2236839, type=4, 320万)——即"数据层面执行退款行",
--   320万(非券全额)退回主材预付款。前置=撤款还原脚本已执行(补款行已还原, 余额=-6,641,000)。
--   逐字段复刻 refundSalesPayment(老退款行执行)产物, 形态对齐六月先例(SA2207861R/收据1516926):
--     行 status→2(已确认,先例终态) / 退货单 status→1 / 新建退款收据 + 预付款收据 + 预付款流水。
--
-- 资金效果: 预付款主材余额 -6,641,000 → -3,441,000 (客户透支减少3,200)。
--   后续: 老单剩余14,550退回(店员页面建退货单+确认后同款脚本执行) → +11,109, 客户零补款闭环。
--
-- 操作人口径: 本脚本以恒洁卫浴(uid=31696, 事故操作账号)为 collecter/cuid; 如需记为实际执行人,
--   替换 31696/'恒洁卫浴' 两处即可(共2条INSERT涉及)。
--
-- 执行前置条件:
--   V1~V5 逐条核对, 全部与注释预期一致方可执行; 任一不符立即停下核实。
--
-- 回滚方式: 见文件尾部(按单删/改回, 收据按 srid/@arid 回溯)。
-- 验证: 见文件尾部 W1~W4。
-- ============================================================================

-- ─────────────────────────── 执行前核验 ───────────────────────────
-- V1 预期1行: 待执行退款行(未执行/无收据)
-- SELECT spid,type,status,srid,rid,referMoney FROM payment.salespayment WHERE spid=2236839 AND type=4 AND status=0 AND srid IS NULL;
-- V2 预期-6,641,000: 当前余额(撤款还原已完成的前提)
-- SELECT apId,materialBalance FROM payment.advancepayment WHERE apId=454060;
-- V3 预期1行: 退货单待执行态
-- SELECT rid,spid,total,status FROM sales.salesrefunds WHERE rid=427753 AND spid=2236839 AND status=0;
-- V4 预期0行: 本脚本唯一性(未跑过)
-- SELECT COUNT(*) FROM payment.payment WHERE uniqueid='SA2236839R';
-- V5 预期4行: 老单剩余在退产品(14,550,000) —— 第二步退货单的标的, 确认客户放弃
-- SELECT siid,gid,num,total FROM sales.salesitem WHERE sid=1521938 AND total>0;

START TRANSACTION;

-- ① 退款收据(形态对齐先例1516926: type=1/advance渠道/advanceType=3) —— 生成@srid
INSERT INTO payment.salesreceipt
  (cluid, collecterName, collectTime, type, realMoney, cash, cashInfo, bank, bankInfo,
   checkv, checkvBank, installment, installmentBank, accounts, accountsBank,
   advance, advanceType, coupon, couponInfo, comment)
VALUES
  (31696, '恒洁卫浴', NOW(), 1, 3200000, 0, '', 0, '', 0, '', 0, '', 0, '',
   3200000, 3, 0, '', '.');
SET @srid = LAST_INSERT_ID();

-- ② 预付款收据(returnPayment同款产物) —— 生成@arid
INSERT INTO payment.advancereceipt
  (type, cluid, collecterName, collectTime, cfuid, confirmerName, status, realMoney,
   cash, cashInfo, bank, bankInfo, checkv, checkvBank, installment, installmentBank,
   accounts, accountsBank, transfer, comment)
VALUES
  (0, 31696, '恒洁卫浴', NOW(), NULL, '', 2, 0,
   0, '', 0, '', 0, '', 0, '',
   0, '', 3200000, '装修单号:2412140212,销售单:2609260335,主材预付款');
SET @arid = LAST_INSERT_ID();

-- ③ 退款行闭环(终态对齐先例: status=2已确认) —— 预期影响1行
UPDATE payment.salespayment
   SET status = 2, srid = @srid
 WHERE spid = 2236839 AND type = 4 AND status = 0 AND srid IS NULL;

-- ④ 退货单闭环(status→1已退款, 对齐先例422485) —— 预期影响1行
UPDATE sales.salesrefunds
   SET status = 1
 WHERE rid = 427753 AND spid = 2236839 AND status = 0;

-- ⑤ 预付款入账流水(+3,200,000, balance=-3,441,000, aid=3462与SA2236794/六月先例同口径)
INSERT INTO payment.payment
  (arId, uniqueid, customerId, orderId, company, cuid, createTime, balance, recharge,
   type, paymentType, status, comment, aid)
VALUES
  (@arid, 'SA2236839R', 630174, '2412140212', 1, 31696, NOW(), -3441000, 3200000,
   3, 2, 2, '', 3462);

-- ⑥ 余额增加3,200(守卫: 仅当当前=-6,641,000; 影响0行说明前置不符, 请ROLLBACK) —— 预期影响1行
UPDATE payment.advancepayment
   SET materialBalance = materialBalance + 3200000
 WHERE apId = 454060 AND materialBalance = -6641000;

COMMIT;

-- ─────────────────────────── 执行后验证 ───────────────────────────
-- W1 预期-3,441,000 且 = 末笔流水余额
-- SELECT materialBalance FROM payment.advancepayment WHERE apId=454060;
-- SELECT balance FROM payment.payment WHERE customerId=630174 ORDER BY pid DESC LIMIT 1;
-- W2 预期1行: 退款行 status=2, srid=@srid(实查值)
-- SELECT spid,type,status,srid,referMoney FROM payment.salespayment WHERE spid=2236839;
-- W3 预期1行: 退货单 status=1
-- SELECT rid,total,status FROM sales.salesrefunds WHERE rid=427753;
-- W4 预期1行: 流水 SA2236839R
-- SELECT pid,arId,balance,recharge,type FROM payment.payment WHERE uniqueid='SA2236839R';

-- ═══════════════════════════ 回滚(整体逆向, 用W2/W4实查的@srid/@arid替换) ═══════════════════════════
-- R1 DELETE FROM payment.payment WHERE uniqueid='SA2236839R';
-- R2 UPDATE payment.advancepayment SET materialBalance = materialBalance - 3200000 WHERE apId=454060;
-- R3 UPDATE sales.salesrefunds SET status=0 WHERE rid=427753 AND status=1;
-- R4 UPDATE payment.salespayment SET status=0, srid=NULL WHERE spid=2236839 AND status=2;
-- R5 DELETE FROM payment.advancereceipt WHERE arId=<W4实查arId>;
-- R6 DELETE FROM payment.salesreceipt WHERE srid=<W2实查srid>;
