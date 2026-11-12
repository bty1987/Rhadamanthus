-- =====================================================================
-- 用途: 辅料单配送语义合并——assignFlag 重定义为配送执行线四态, deliveryStatus 废弃
--   assignFlag 新语义: 0自配送 / 1需配送(配送单, 待分配厂商) / 2已分配 / 3已到货(扫码确认)
--   deliveryStatus(0自配/1配送) 列保留废弃(免DDL), 代码不再读写
--   status 单据流保持原有 0-8 不动(STATUS_DELIVERED_INT=9 已回退, deliveAccessories 统一置6)
-- 存量迁移:
--   1. 旧语义 assignFlag(0未标记/1需分配/2已分配): 数值 0/2 不变; 1(需分配, 存量均为自配单
--      因 deliveryStatus 生产全0)迁为新语义 1(需配送)——数值恰好相同, 无需 UPDATE
--   2. 防御性迁移: deliveryStatus=1 且 assignFlag<2 的组合 → assignFlag=1(生产预期 0 行)
--   3. 防御性回退: status=9(上批 89ed7ea6f 已配送态, 若其 jar 曾被部署产生) → 6 到货
-- 执行前置条件:
--   先于 fanglin-inventory jar 与三端前端发版(新代码按新语义读写 assignFlag)
--   执行前备份:
--     CREATE TABLE inventory.accessories_bak_110 AS SELECT aid, no, status, assignFlag, deliveryStatus FROM inventory.accessories;
-- 回滚方式:
--   UPDATE inventory.accessories SET status = 9 WHERE status = 6 AND aid IN (SELECT aid FROM inventory.accessories_bak_110 WHERE status = 9);
--   UPDATE inventory.accessories SET assignFlag = 0, deliveryStatus = 1 WHERE aid IN (SELECT aid FROM inventory.accessories_bak_110 WHERE deliveryStatus = 1 AND assignFlag < 2);
--   (若曾执行 100 号字典: DELETE FROM communion.constant WHERE module='inventory' AND clazz='accessories' AND field='STATUS_DELIVERED_INT' AND `key`=9;)
-- 验证语句:
--   SELECT assignFlag, COUNT(*) FROM inventory.accessories GROUP BY assignFlag;
--   SELECT status, COUNT(*) FROM inventory.accessories GROUP BY status;   -- 不应再出现 9
--   SELECT COUNT(*) FROM inventory.accessories WHERE deliveryStatus = 1;  -- 应为 0
-- 幂等性: 幂等(可重复执行)
-- =====================================================================

-- 防御性迁移: deliveryStatus=1 的配送单合并入 assignFlag(已分配的保持2)
UPDATE inventory.accessories
SET assignFlag = 1
WHERE deliveryStatus = 1 AND assignFlag < 2;

-- 防御性回退: status=9 已配送 → 6 到货(仅上批 jar 曾部署过的环境会有)
UPDATE inventory.accessories
SET status = 6
WHERE status = 9;

-- 字典清理: status key=9 已配送行删除(39号曾接管100号插入, 9 已随本批回退; 39号回滚段同款)
DELETE FROM communion.constant
WHERE module = 'inventory' AND clazz = 'accessories' AND type = 'status' AND `key` = '9';
