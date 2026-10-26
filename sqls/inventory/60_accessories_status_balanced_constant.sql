-- =====================================================================
-- 用途: 辅料单状态字典补"已结算"态【辅料单厂商配送与费用结算方案 v1.1, 与 50 号同批先于 jar/前端】
--   AccessoriesPO 新增 STATUS_BALANCED_INT = 8(终态, 唯一入路=到货(6)结算)
--   communion.constant 驱动列表状态列翻译与前端 constant.inventory().accessories.status
-- 执行前置条件:
--   1. 与 50 号加列同批执行, 先于 fanglin-inventory jar 与前端发版
--   2. 执行前备份:
--      CREATE TABLE communion.constant_bak_60 AS
--      SELECT * FROM communion.constant WHERE module='inventory' AND clazz='accessories';
-- 回滚方式:
--   DELETE FROM communion.constant WHERE module='inventory' AND clazz='accessories' AND field='STATUS_BALANCED_INT' AND `key`=8;
-- 验证语句:
--   SELECT * FROM communion.constant WHERE module='inventory' AND clazz='accessories' ORDER BY `key`;
--   -- 应见 key=0~8 共 9 行(若历史行齐全), 其中 key=8 value='已结算'
-- 幂等性: 幂等(NOT EXISTS 守卫, 可重复执行)
-- =====================================================================

INSERT INTO communion.constant (module, clazz, type, field, `key`, value, status)
SELECT 'inventory', 'accessories', 'status', 'STATUS_BALANCED_INT', 8, '已结算', 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.constant
  WHERE module = 'inventory' AND clazz = 'accessories' AND field = 'STATUS_BALANCED_INT' AND `key` = 8
);
