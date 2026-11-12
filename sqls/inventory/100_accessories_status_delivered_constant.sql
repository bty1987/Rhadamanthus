-- =====================================================================
-- 用途: 辅料单状态字典补"已配送"态【辅料单配送流程批次(费用弹窗金额修复+已配送状态), 与前端/inventory jar 同批, 先于前端发版】
--   AccessoriesPO 新增 STATUS_DELIVERED_INT = 9(配送单专属: 需配送→已发货(出货2)→已配送(9)→已结算(8))
--   deliveAccessories 按 deliveryStatus 分支: 配送单置9已配送, 自配单保持6到货
--   communion.constant 驱动列表状态列翻译与前端 constant.inventory().accessories.STATUS_DELIVERED_INT
-- 执行前置条件:
--   1. 先于前端(accessories.js 用 constant.inventory().accessories.STATUS_DELIVERED_INT 判态)与 inventory jar 发版
--   2. 执行前备份:
--      CREATE TABLE communion.constant_bak_100 AS
--      SELECT * FROM communion.constant WHERE module='inventory' AND clazz='accessories';
-- 回滚方式:
--   DELETE FROM communion.constant WHERE module='inventory' AND clazz='accessories' AND field='STATUS_DELIVERED_INT' AND `key`=9;
--   (回滚前需确认无 status=9 的在途辅料单: SELECT COUNT(*) FROM inventory.accessories WHERE status=9;)
-- 验证语句:
--   SELECT * FROM communion.constant WHERE module='inventory' AND clazz='accessories' ORDER BY `key`;
--   -- 应见 key=0~9, 其中 key=9 value='已配送'
-- 幂等性: 幂等(NOT EXISTS 守卫, 可重复执行)
-- =====================================================================

INSERT INTO communion.constant (module, clazz, type, field, `key`, value, status)
SELECT 'inventory', 'accessories', 'status', 'STATUS_DELIVERED_INT', 9, '已配送', 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.constant
  WHERE module = 'inventory' AND clazz = 'accessories' AND field = 'STATUS_DELIVERED_INT' AND `key` = 9
);
