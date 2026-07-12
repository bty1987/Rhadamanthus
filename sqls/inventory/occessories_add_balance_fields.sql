-- 外辅单（occessories）添加结算额字段
-- 创建时间：2026-03-26
-- 说明：为 inventory.occessories 表添加实结算额和虚结算额字段，并从 occessoriesitem 表汇总历史数据

-- 1. 添加实结算额和虚结算额字段
ALTER TABLE inventory.occessories
ADD COLUMN rbalance INT(8) DEFAULT 0 COMMENT '实结算额' AFTER total,
ADD COLUMN vbalance INT(8) DEFAULT 0 COMMENT '虚结算额' AFTER rbalance;

-- 2. 从 occessoriesitem 汇总历史数据
UPDATE inventory.occessories o
INNER JOIN (
    SELECT
        oid,
        SUM(rbalance) AS total_rbalance,
        SUM(vbalance) AS total_vbalance
    FROM inventory.occessoriesitem
    GROUP BY oid
) item ON o.oid = item.oid
SET
    o.rbalance = item.total_rbalance,
    o.vbalance = item.total_vbalance;

-- 3. 验证数据更新结果
SELECT
    o.oid,
    o.no,
    o.total AS '总额',
    o.rbalance AS '实结算额',
    o.vbalance AS '虚结算额',
    (SELECT SUM(rbalance) FROM inventory.occessoriesitem WHERE oid = o.oid) AS 'item_实结算汇总',
    (SELECT SUM(vbalance) FROM inventory.occessoriesitem WHERE oid = o.oid) AS 'item_虚结算汇总'
FROM inventory.occessories o
WHERE o.rbalance > 0 OR o.vbalance > 0;
