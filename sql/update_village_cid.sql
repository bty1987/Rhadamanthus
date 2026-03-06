-- 更新 village 表的 cid 字段（老数据）
-- 从 cityproper 表的关联字段获取城市ID

-- 方案1: 使用 INNER JOIN (推荐，执行效率高)
UPDATE communion.village v
INNER JOIN communion.cityproper cp ON v.cityProperId = cp.cpid
SET v.cid = cp.cid;

-- 方案2: 使用子查询 (备选方案)
-- UPDATE communion.village
-- SET cid = (
--     SELECT cp.cid
--     FROM communion.cityproper cp
--     WHERE cp.cpid = village.cityProperId
-- )
-- WHERE cid IS NULL OR cid = 0;

-- 验证更新结果
SELECT
    v.vid,
    v.no,
    v.name AS village_name,
    v.cityProperId,
    v.cid,
    cp.name AS cityproper_name,
    c.name AS city_name
FROM communion.village v
INNER JOIN communion.cityproper cp ON v.cityProperId = cp.cpid
INNER JOIN communion.city c ON cp.cid = c.cid
ORDER BY v.vid
LIMIT 10;

-- 检查未更新的记录（应该为空）
SELECT
    v.vid,
    v.no,
    v.name,
    v.cityProperId,
    v.cid
FROM communion.village v
WHERE v.cid IS NULL OR v.cid = 0;
