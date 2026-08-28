-- =============================================================================
-- messagecueuing.args 缺失引号批量修复
-- 日期: 2026-08-27
-- 背景: PaymentServiceImpl.collectPayment / DecorationPaymentServiceImpl.collectDecorationPayment
--       拼 JSON 时 userId 值后少一个闭合引号:
--         实际: {"orderId":"2608240147","userId":"wechat,"event":"PAYMENT_COLLECTED",...}
--         应为: {"orderId":"2608240147","userId":"wechat","event":"PAYMENT_COLLECTED",...}
--       导致消息消费方 JSON 解析失败。代码已修复(fanglin-payment-8.3.028.jar),
--       本脚本修复存量坏数据。
--
-- 影响面(2026-08-27 只读库核查):
--   collectDecorationPayment 17100 条 + collectPayment 13088 条 = 30188 条,全部 status=0
--   另两张同类表 messagequeuing(73万行)/messagedueuing(0行) 无此问题
--   坏行 userId 值均为干净标识符(wechat/alipay/FL-工号),无引号无逗号,
--   且无任何行出现两处 ,"event" —— 定点插入位置无歧义
--
-- 执行顺序: 先发修复后的 jar,再执行本脚本(发 jar 前执行的话,发完需再跑一遍;
--           本脚本幂等,WHERE 正则只会命中坏行,重复执行安全)
-- 执行窗口: 单表 23 万行、单语句更新 ~3 万行,锁行时间秒级,建议低峰期执行
-- =============================================================================

-- ---------- 0. (可选,建议) 备份受影响行,用于回滚 ----------
-- CREATE TABLE information.messagecueuing_badargs_bak_20260827 AS
-- SELECT * FROM information.messagecueuing
-- WHERE args REGEXP '"userId":"[^"]*,"event"';

-- ---------- 1. 执行前校验: 当前坏行数(2026-08-27 核查时为 30188,期间可能新增) ----------
SELECT COUNT(*) AS bad_rows_before
FROM information.messagecueuing
WHERE args REGEXP '"userId":"[^"]*,"event"';

-- ---------- 2. 批量修复 ----------
-- MySQL 5.6 无 REGEXP_REPLACE,用 INSERT(字符串函数)在第一个 ,"event" 前插入闭合引号:
--   LOCATE(',"event"', args) 定位坏位置(经核查必为 userId 值末尾)
--   INSERT(str, pos, 0, '"') 在 pos 前插入 " (len=0 纯插入不覆盖)
UPDATE information.messagecueuing
SET args = INSERT(args, LOCATE(',"event"', args), 0, '"')
WHERE args REGEXP '"userId":"[^"]*,"event"';

-- ---------- 3. 执行后校验 ----------
-- 3.1 坏行数应归 0
SELECT COUNT(*) AS bad_rows_after
FROM information.messagecueuing
WHERE args REGEXP '"userId":"[^"]*,"event"';

-- 3.2 修复行应能匹配合法形态(与 3.1 差值相等即可,以 mcid=234002 抽查为例)
SELECT mcid, args
FROM information.messagecueuing
WHERE mcid = 234002;
-- 预期: {"orderId":"2608240147","userId":"wechat","event":"PAYMENT_COLLECTED","busiTypeName":"市场部客源","ccid":181061}

-- ---------- 4. (仅需要回滚时) 从备份表还原 ----------
-- UPDATE information.messagecueuing m
-- JOIN information.messagecueuing_badargs_bak_20260827 b ON m.mcid = b.mcid
-- SET m.args = b.args;
