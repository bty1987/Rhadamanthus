-- =============================================================================
-- cormrice 共用项工费定额 挂点迁移(qcid -> qfid)
-- 日期: 2026-10-06
-- 背景: 三定格数据(工费/工时/材料)拍板统一挂规格级 qfid(拍板1);共享项体系为集团数据,
--       无 company 语义(拍板2)。cormrice 现挂 qcid 且带 company(只写不读,查询从未过滤公司):
--         加列 qfid,新行由页面按规格维护(qfid>0, company 落 0);
--         qcid/company 列保留不删(零破坏),存量行 qfid=0 不回填(拍板4);
--         旧接口 queryCormriceByQcid/pageCormrice 保留,新增 queryCormriceByQfid。
-- 方案: docs/01-方案设计/报价项集团共享项与关联字段方案.md (v2.1,拍板1-4)
-- 🔴 上线序: 本 SQL 先于 fanglin-data jar(PO 映射 qfid 列,先 jar 后 SQL = Unknown column)
-- 回滚: UPDATE data.cormrice SET qfid = 0 即回现状;列可保留无副作用
-- 幂等性: ALTER 前判断列存在,重复执行安全
-- =============================================================================

-- ---------- 1. 加 qfid 列 + 索引 ----------
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'data' AND TABLE_NAME = 'cormrice' AND COLUMN_NAME = 'qfid');
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE data.cormrice ADD COLUMN qfid INT(11) NOT NULL DEFAULT 0 AFTER qcid, ADD INDEX idx_qfid (qfid)',
    'SELECT ''qfid already exists'' AS msg');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------- 2. (可选,默认不执行)仅唯一启用规格的共享项自动回填 qfid ----------
-- 业务如想省去重录,可执行:一个共享项只有一个启用规格时,其 qcid 挂点可无歧义迁移;多规格共享项仍需人工归属。
-- UPDATE data.cormrice cr
--   JOIN quotation.quotationCtem ct ON ct.qcid = cr.qcid
--   JOIN (
--       SELECT qcid, MAX(qfid) AS qfid FROM quotation.quotationformat WHERE status = 0 GROUP BY qcid HAVING COUNT(*) = 1
--   ) f ON f.qcid = cr.qcid
--   SET cr.qfid = f.qfid
-- WHERE cr.qfid = 0;

-- ---------- 3. 执行后核验 ----------
-- SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='data' AND TABLE_NAME='cormrice' AND COLUMN_NAME='qfid';  应=1
-- SELECT qfid, COUNT(*) FROM data.cormrice GROUP BY qfid;  加列后应仅 qfid=0 一组,行数=原全表行数
