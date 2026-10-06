-- =============================================================================
-- quotationformat 规格 镜像报价项字段(13 列)
-- 日期: 2026-10-06
-- 背景: 共享项体系主角化,规格(quotation.quotationformat)需具备报价项(quotation.quotationItem)
--       的全部业务字段,供集团统一维护、报价项创建时按规格预填(关联落库见 QUOTATIONITEM_ADD_QFID.sql)。
--       列名/列型与 quotationItem 同名列对齐;price 即报价项 unitPrice 同义复用(已有列,不动);
--       四类分类经 qcid 由共享项带出,规格不冗余;no/qvid 为报价项自身属性,不镜像。
--       新列全部可空/带默认,存量行为零变化。
-- 方案: docs/01-方案设计/报价项集团共享项与关联字段方案.md (v2.1,拍板1-4)
-- 🔴 上线序: 本 SQL 先于 fanglin-data jar(PO 映射新列,先 jar 后 SQL = Unknown column)
-- 回滚: 列可保留无副作用(PO 映射后全量默认值,不影响存量数据)
-- 幂等性: ALTER 前判断列存在,重复执行安全
-- =============================================================================

-- ---------- 1. 加 13 列(alias/workType/addPrice/subPrice/cost/achePrice/formula/type/discount/isRtem/rtemFlag/isImportant/comment) ----------
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'quotation' AND TABLE_NAME = 'quotationformat' AND COLUMN_NAME = 'alias');
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE quotation.quotationformat
        ADD COLUMN alias VARCHAR(128) DEFAULT NULL COMMENT ''别名'' AFTER pinyin,
        ADD COLUMN workType INT(11) DEFAULT NULL COMMENT ''工种(对齐本表unit列命名风格)'' AFTER alias,
        ADD COLUMN addPrice INT(11) NOT NULL DEFAULT 0 COMMENT ''增补价(分)'' AFTER price,
        ADD COLUMN subPrice INT(11) NOT NULL DEFAULT 0 COMMENT ''退减价(分)'' AFTER addPrice,
        ADD COLUMN cost INT(11) NOT NULL DEFAULT 0 COMMENT ''成本(分)'' AFTER subPrice,
        ADD COLUMN achePrice INT(11) NOT NULL DEFAULT 0 COMMENT ''业绩额(分)'' AFTER cost,
        ADD COLUMN formula VARCHAR(500) DEFAULT NULL COMMENT ''公式'' AFTER achePrice,
        ADD COLUMN type SMALLINT NOT NULL DEFAULT 0 COMMENT ''类型(0普通/1成本/2自定义/3忽略/4不累计)'' AFTER formula,
        ADD COLUMN discount SMALLINT NOT NULL DEFAULT 0 COMMENT ''是否打折(0/1)'' AFTER type,
        ADD COLUMN isRtem SMALLINT NOT NULL DEFAULT 0 COMMENT ''是否材料项(0/1)'' AFTER discount,
        ADD COLUMN rtemFlag VARCHAR(50) DEFAULT NULL COMMENT ''材料项标识'' AFTER isRtem,
        ADD COLUMN isImportant SMALLINT NOT NULL DEFAULT 0 COMMENT ''重要标记(0/1)'' AFTER rtemFlag,
        ADD COLUMN comment VARCHAR(500) DEFAULT NULL COMMENT ''备注'' AFTER isImportant',
    'SELECT ''mirror columns already exists'' AS msg');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------- 2. 执行后核验 ----------
-- SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='quotation' AND TABLE_NAME='quotationformat' AND COLUMN_NAME IN ('alias','workType','addPrice','subPrice','cost','achePrice','formula','type','discount','isRtem','rtemFlag','isImportant','comment');  应=13
-- SELECT COUNT(*) FROM quotation.quotationformat WHERE addPrice<>0 OR subPrice<>0 OR cost<>0 OR achePrice<>0 OR type<>0 OR discount<>0 OR isRtem<>0 OR isImportant<>0;  应=0(存量零变化)
