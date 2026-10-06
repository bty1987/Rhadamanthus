-- =============================================================================
-- quotationItem 报价项 规格关联字段(qfid)
-- 日期: 2026-10-06
-- 背景: 报价项为共享项体系消费者:关联共享项 quotationCtemId(qcid)已存在且 add/update 均写;
--       本次加列 qfid 关联具体规格(quotation.quotationformat.qfid),拍板3=本次仅预留字段并打通
--       落库链路(创建 typeahead key qcid->qfid + 保存携带),「按规格预填写且不可改」的
--       创建/编辑逻辑后续调整;存量不回填(拍板4)。
--       语义对齐工程节点 pcnid 先例:qfid=0 自治/未关联(存量默认),qfid>0 关联的规格行;
--       关联建行即定(update 排除),换绑走运维 SQL,后端零校验零错误码。
-- 方案: docs/01-方案设计/报价项集团共享项与关联字段方案.md (v2.1,拍板1-4)
-- 🔴 上线序: 本 SQL 先于 fanglin-data jar(PO 映射 qfid 列,先 jar 后 SQL = Unknown column)
-- 回滚: 全量 UPDATE quotation.quotationItem SET qfid = 0 即回现状;列可保留无副作用
-- 幂等性: ALTER 前判断列存在,重复执行安全
-- =============================================================================

-- ---------- 1. 加 qfid 列 + 索引 ----------
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'quotation' AND TABLE_NAME = 'quotationItem' AND COLUMN_NAME = 'qfid');
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE quotation.quotationItem ADD COLUMN qfid INT(11) NOT NULL DEFAULT 0 AFTER quotationCtemId, ADD INDEX idx_qfid (qfid)',
    'SELECT ''qfid already exists'' AS msg');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------- 2. 执行后核验 ----------
-- SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='quotation' AND TABLE_NAME='quotationItem' AND COLUMN_NAME='qfid';  应=1
-- SELECT qfid, COUNT(*) FROM quotation.quotationItem GROUP BY qfid;  加列后应仅 qfid=0 一组,行数=原全表行数
