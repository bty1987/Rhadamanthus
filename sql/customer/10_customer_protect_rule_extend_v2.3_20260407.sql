-- =============================================
-- 客户保护规则 - 表结构扩展SQL（V2.3精简版）
-- 文档：docs/customer_protect_rule_adjustment.md
-- 日期：2026-04-07
-- 更新：使用天数代替月数，更精确直观
-- =============================================

-- =============================================
-- 1. 表结构扩展：增加岗位类型支持（V2.3精简版）
-- 只保留判断条件字段，不存储业务数据
-- =============================================
ALTER TABLE customer.customerprotectrule
ADD COLUMN from_duty_ids VARCHAR(256) DEFAULT NULL COMMENT '原归属人岗位ID列表，逗号分隔，如: 10,20',
ADD COLUMN time_condition_type TINYINT(1) DEFAULT 0 COMMENT '时间条件类型: 0=不限制, 1=天数内, 2=天数外',
ADD COLUMN time_condition_day INT(11) DEFAULT 0 COMMENT '时间条件天数，与time_condition_type配合使用',
ADD COLUMN need_approval TINYINT(1) DEFAULT 0 COMMENT '是否需要审批: 0=不需要, 1=需要',
ADD COLUMN priority INT(11) DEFAULT 0 COMMENT '规则优先级，数字越大优先级越高';

-- 添加索引以优化查询性能
ALTER TABLE customer.customerprotectrule
ADD INDEX idx_type_status (type, status),
ADD INDEX idx_company_status (company, status);

-- 验证字段已添加
DESC customer.customerprotectrule;

-- =============================================
-- 2. 查询岗位ID（记录结果用于配置）
-- =============================================
SELECT did, name, code, status
FROM communion.duty
WHERE status = 0
ORDER BY did;

-- 根据查询结果，记录以下岗位ID：
-- 业务员岗位ID: _______
-- 电商岗位ID:   _______
-- 监理岗位ID:   _______

-- =============================================
-- 3. 备份现有配置
-- =============================================
CREATE TABLE IF NOT EXISTS customer.customerprotectrule_backup_20260407 AS
    SELECT * FROM customer.customerprotectrule WHERE company = 1;

-- 确认备份
SELECT COUNT(*) AS 备份记录数 FROM customer.customerprotectrule_backup_20260407;
