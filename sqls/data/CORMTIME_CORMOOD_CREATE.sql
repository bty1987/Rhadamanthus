-- =============================================================================
-- cormtime/cormood 共用项规格 定额工时/定额材料 新表
-- 日期: 2026-10-06
-- 背景: 三定格数据拍板统一挂规格级 qfid(拍板1):工费=data.cormrice(已有,迁移挂点见
--       CORMRICE_MIGRATE_QFID.sql);工时/材料为本次新建,结构镜像报价项侧
--       data.normtime / data.normood(挂 qiid),挂 quotation.quotationformat.qfid。
--       共享项体系为集团数据,无 company 列(拍板2,区别于 cormrice 存量列)。
--       workdays/normnum/storenum/price 等数值沿用报价项侧存储口径(前端 api tranargs ×100)。
-- 方案: docs/01-方案设计/报价项集团共享项与关联字段方案.md (v2.1,拍板1-4)
-- 🔴 上线序: 本 SQL 先于 fanglin-data jar(PO 映射新表,先 jar 后 SQL = 表不存在)
-- 回滚: 表可保留无副作用(无存量消费方);确需清理 DROP TABLE data.cormtime / data.cormood
-- 幂等性: CREATE TABLE IF NOT EXISTS,重复执行安全
-- =============================================================================

-- ---------- 1. 定额工时 data.cormtime(镜像 normtime) ----------
CREATE TABLE IF NOT EXISTS data.cormtime (
    ctid INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
    qfid INT(11) NOT NULL COMMENT '规格id(quotation.quotationformat.qfid)',
    cnid INT(11) NOT NULL COMMENT '工程节点(data.constructionnode.cnid)',
    unit VARCHAR(50) DEFAULT NULL COMMENT '定额单位',
    trannum INT(11) DEFAULT 0 COMMENT '转换量',
    workdays DECIMAL(10,2) DEFAULT 0.00 COMMENT '工时天数',
    status SMALLINT DEFAULT 0 COMMENT '状态(0有效/1无效)',
    PRIMARY KEY (ctid),
    KEY idx_qfid (qfid),
    KEY idx_cnid (cnid)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT = '共用项规格-定额工时(镜像data.normtime,挂qfid)';

-- ---------- 2. 定额材料 data.cormood(镜像 normood) ----------
CREATE TABLE IF NOT EXISTS data.cormood (
    cgid INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
    qfid INT(11) NOT NULL COMMENT '规格id(quotation.quotationformat.qfid)',
    name VARCHAR(128) DEFAULT NULL COMMENT '材料名称',
    nid INT(11) NOT NULL COMMENT '定材(data.noods.nid)',
    normunit VARCHAR(50) DEFAULT NULL COMMENT '定额单位',
    normnum INT(11) DEFAULT 0 COMMENT '定额数量',
    storeunit VARCHAR(50) DEFAULT NULL COMMENT '库房单位',
    storenum INT(11) DEFAULT 0 COMMENT '库房数量',
    price INT(11) DEFAULT 0 COMMENT '价格(分)',
    status SMALLINT DEFAULT 0 COMMENT '状态(0有效/1无效)',
    PRIMARY KEY (cgid),
    KEY idx_qfid (qfid),
    KEY idx_nid (nid)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT = '共用项规格-定额材料(镜像data.normood,挂qfid)';

-- ---------- 3. 执行后核验 ----------
-- SHOW TABLES FROM data LIKE 'corm%';  应含 cormrice/cormtime/cormood
-- SELECT COUNT(*) FROM data.cormtime;  应=0
-- SELECT COUNT(*) FROM data.cormood;   应=0
