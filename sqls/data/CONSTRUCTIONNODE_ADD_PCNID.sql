-- =============================================================================
-- constructionNode 工程节点 集团节点关联字段(pcnid)
-- 日期: 2026-10-06
-- 背景: data.constructionnode 现状逐公司独立维护(company 过滤),无集团主数据概念。
--       本次引入 pcnid(对齐 noods.pnid 集团/分公司两级先例):
--         pcnid=0  集团行(company=0,集团主数据)/自治行(company>0,存量默认0,行为与现状完全一致)
--         pcnid>0  关联行,指向集团行 cnid;全字段自由,仅归集关系,无快照无同步
--       配套后端: queryConstructionNodeForGroup(集团节点选择器,唯一新读接口);
--       addConstructionNode 仅一行 setPcnid(无校验);「创建分子公司节点须先选集团节点」由前端承载。
-- 方案: docs/01-方案设计/工程节点集团版与分子公司关联方案.md
--       存量归纳/播种/挂接: docs/10-指南手册/CONSTRUCTIONNODE_GROUP_SEED_MAPPING.sql(待业务确认合集后执行)
-- 🔴 上线序: 本 SQL 先于 fanglin-data jar(PO 映射 pcnid 列,先 jar 后 SQL = Unknown column)
-- 回滚: 全量 UPDATE data.constructionnode SET pcnid = 0 即回现状;列可保留无副作用
-- 幂等性: ALTER 前判断列存在,重复执行安全(MySQL 5.6 无 IF NOT EXISTS,用 information_schema 判断)
-- =============================================================================

-- ---------- 1. 加 pcnid 列 + 索引 ----------
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'data' AND TABLE_NAME = 'constructionnode' AND COLUMN_NAME = 'pcnid');
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE data.constructionnode ADD COLUMN pcnid INT(11) NOT NULL DEFAULT 0 AFTER cnid, ADD INDEX idx_pcnid (pcnid)',
    'SELECT ''pcnid already exists'' AS msg');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------- 2. 执行后核验 ----------
-- SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='data' AND TABLE_NAME='constructionnode' AND COLUMN_NAME='pcnid';  应=1
-- SELECT pcnid, COUNT(*) FROM data.constructionnode GROUP BY pcnid;  加列后应仅 pcnid=0 一组,行数=原全表行数
