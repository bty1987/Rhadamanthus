-- =============================================================================
-- 电子签多厂商支持：业务表新增 provider 字段
-- 阶段6a：数据模型扩展
--
-- 作用：多厂商并存时，区分一个 signno/合同归属于哪家厂商，避免串号。
--       provider 值：1=法大大 2=e签宝（见 com.fanglin.elecsign.enums.ElecsignProvider）
--
-- 改动范围：4 张业务表
--   - data.signet          公司印章（企业签署账号）
--   - data.supplierSignet  供应商印章
--   - communion.customer   客户（个人签署账号）
--   - communion.user       员工（个人签署账号）
--
-- 存量数据：全部为法大大，provider 列 DEFAULT 1，无需单独回刷。
--           新列 nullable，存量行自动得到 NULL，业务层约定 NULL 视同 1（法大大）。
--
-- 注意：本脚本不改动任何现有列，只新增列。加列操作对在线业务无锁表风险（MySQL 5.6+ instant ADD COLUMN）。
--       但 communion.customer / communion.user 是大表，建议在低峰期执行。
-- =============================================================================

-- 1. 公司印章
ALTER TABLE data.signet ADD COLUMN provider TINYINT NULL DEFAULT 1 COMMENT '电子签厂商：1=法大大 2=e签宝';

-- 2. 供应商印章
ALTER TABLE data.supplierSignet ADD COLUMN provider TINYINT NULL DEFAULT 1 COMMENT '电子签厂商：1=法大大 2=e签宝';

-- 3. 客户
ALTER TABLE communion.customer ADD COLUMN provider TINYINT NULL DEFAULT 1 COMMENT '电子签厂商：1=法大大 2=e签宝';

-- 4. 员工
ALTER TABLE communion.user ADD COLUMN provider TINYINT NULL DEFAULT 1 COMMENT '电子签厂商：1=法大大 2=e签宝';

-- =============================================================================
-- 说明：
-- 1. DEFAULT 1（法大大）保证存量数据语义正确，无需额外 UPDATE。
-- 2. 列设为 NULL DEFAULT 1 而非 NOT NULL：兼容存量行被其他途径插入时不带 provider 的情况，
--    业务层读取时约定 NULL 视同 1（ElecsignProvider.of 返回 null 时兜底法大大）。
-- 3. 本阶段不修改查询条件（现有 WHERE signno=? 暂不加 AND provider=?），
--    因为当前只有法大大一家，不会串号。等阶段5 e签宝接入后再按需收紧查询。
-- =============================================================================
