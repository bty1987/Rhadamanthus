-- =============================================================================
-- noods 定材 上级定材字段(pnid)——集团主数据/分公司引用两级数据
-- 日期: 2026-08-28
-- 背景: data.noods 现状为各公司独立维护(company 过滤),无集团主数据概念
--       (company=0 仅 nid=0 占位行)。本次引入 pnid:
--         pnid=0  集团行/自建行(存量约1500行默认0,行为与现状完全一致)
--         pnid>0  引用行,指向集团行 nid;名称/售价/结算价/计算标识为集团快照,
--                 分公司仅维护浮动量(surplus)与状态
--       配套后端:queryNoodsForGroup(集团定材选择器);addNoods/updateNoods
--       不拆接口,pnid 随 VO copyProperties 自动进出,前端控制字段开放度。
-- 方案: docs/10-指南手册/NOODS_GROUP_COMPANY_ADJUSTMENT.md
--
-- 幂等性: ALTER 前判断列存在,重复执行安全(MySQL 5.6 无 IF NOT EXISTS,用 information_schema 判断)
-- =============================================================================

-- ---------- 1. 加 pnid 列 + 索引 ----------
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'data' AND TABLE_NAME = 'noods' AND COLUMN_NAME = 'pnid');
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE data.noods ADD COLUMN pnid INT(11) NOT NULL DEFAULT 0 AFTER nid, ADD INDEX idx_pnid (pnid)',
    'SELECT ''pnid already exists'' AS msg');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------- 2. 执行后核验 ----------
-- 应返回 1:
-- SELECT COUNT(*) FROM information_schema.COLUMNS
--     WHERE TABLE_SCHEMA='data' AND TABLE_NAME='noods' AND COLUMN_NAME='pnid';
-- 引用行(逐步增长):
-- SELECT COUNT(*) FROM data.noods WHERE pnid > 0;
