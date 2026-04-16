-- ============================================
-- 迁移 custype 表: communion -> data
-- 日期: 2026-04-16
-- 说明: CustypePO 的 @Table catalog 已改为 data
-- ============================================

-- 1. 在 data 库创建 custype 表（复制结构）
CREATE TABLE IF NOT EXISTS data.custype LIKE communion.custype;

-- 2. 迁移数据
INSERT INTO data.custype SELECT * FROM communion.custype;

-- 3. 验证数据一致性
SELECT 'communion' AS `database`, COUNT(*) AS cnt FROM communion.custype
UNION ALL
SELECT 'data' AS `database`, COUNT(*) AS cnt FROM data.custype;

-- 4. 确认无误后删除旧表（请手动取消注释执行）
-- DROP TABLE communion.custype;
