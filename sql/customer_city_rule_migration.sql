-- ============================================================================
-- 客户城区分配规则 - 数据库迁移脚本
-- 版本: v1.0
-- 日期: 2026-03-12
-- 说明: 第一阶段数据库调整 - 扩展 customeruserruleitem 表支持城区规则
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 第一阶段：扩展 customeruserruleitem 表
-- ----------------------------------------------------------------------------

-- 1. 增加 cityid 字段（城区ID，关联 communion.cityproper 表）
ALTER TABLE customer.customeruserruleitem
ADD COLUMN cityid INT COMMENT '城区ID，关联cityproper表' AFTER lowval;

-- 2. 添加索引（提升查询性能）
ALTER TABLE customer.customeruserruleitem
ADD INDEX idx_cityid (cityid);

-- 3. 添加外键约束（可选，确保数据完整性）
-- 注意：如果 communion.cityproper 表中已有数据，建议先检查再添加外键
-- ALTER TABLE customer.customeruserruleitem
-- ADD CONSTRAINT fk_customeruserruleitem_city
-- FOREIGN KEY (cityid) REFERENCES communion.cityproper(cpid) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 第二阶段：创建 customercityrule 表（城区规则表）
-- 说明：此阶段可根据实际需求推迟实施
-- ----------------------------------------------------------------------------

-- 4. 创建 customercityrule 表
CREATE TABLE IF NOT EXISTS customer.customercityrule (
    ccrid BIGINT AUTO_INCREMENT COMMENT '规则ID',

    -- 关联字段
    cityid INT NOT NULL COMMENT '城区ID，关联cityproper表',
    company INT NOT NULL COMMENT '创建公司',

    -- 目标对象（三选一，或组合使用）
    cid INT COMMENT '可分配公司ID，关联company表',
    did INT COMMENT '可分配部门ID，关联department表',
    uid INT COMMENT '可分配设计师ID，关联user表',

    -- 规则属性
    type SMALLINT NOT NULL COMMENT '规则类型：0=公司, 1=部门, 2=设计师',
    priority SMALLINT DEFAULT 0 COMMENT '优先级，数字越大优先级越高',
    status SMALLINT DEFAULT 0 COMMENT '状态：0=启用, 1=禁用',

    -- 审计字段
    createruid INT COMMENT '创建人ID',
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateruid INT COMMENT '更新人ID',
    updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    finishTime TIMESTAMP NULL COMMENT '失效时间',

    -- 备注
    comment VARCHAR(500) COMMENT '备注说明',

    PRIMARY KEY (ccrid),
    INDEX idx_cityid (cityid),
    INDEX idx_company (company),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_priority (priority)

) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客户城区分配规则表';

-- 5. 添加外键约束（可选）
-- ALTER TABLE customer.customercityrule
-- ADD CONSTRAINT fk_customercityrule_city
-- FOREIGN KEY (cityid) REFERENCES communion.cityproper(cpid);

-- ALTER TABLE customer.customercityrule
-- ADD CONSTRAINT fk_customercityrule_company
-- FOREIGN KEY (company) REFERENCES system.company(cid);

-- ALTER TABLE customer.customercityrule
-- ADD CONSTRAINT fk_customercityrule_targetcompany
-- FOREIGN KEY (cid) REFERENCES system.company(cid) ON DELETE SET NULL;

-- ALTER TABLE customer.customercityrule
-- ADD CONSTRAINT fk_customercityrule_dept
-- FOREIGN KEY (did) REFERENCES communion.department(did) ON DELETE SET NULL;

-- ALTER TABLE customer.customercityrule
-- ADD CONSTRAINT fk_customercityrule_user
-- FOREIGN KEY (uid) REFERENCES communion.user(uid) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 验证脚本
-- ----------------------------------------------------------------------------

-- 验证 customeruserruleitem 表的 cityid 字段
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM
    information_schema.COLUMNS
WHERE
    TABLE_SCHEMA = 'customer'
    AND TABLE_NAME = 'customeruserruleitem'
    AND COLUMN_NAME = 'cityid';

-- 验证 customercityrule 表是否创建成功
SELECT
    TABLE_NAME,
    ENGINE,
    TABLE_COMMENT
FROM
    information_schema.TABLES
WHERE
    TABLE_SCHEMA = 'customer'
    AND TABLE_NAME = 'customercityrule';

-- ============================================================================
-- 回滚脚本（如需回滚，请执行以下语句）
-- ============================================================================

-- 回滚第一阶段
-- ALTER TABLE customer.customeruserruleitem DROP COLUMN cityid;
-- ALTER TABLE customer.customeruserruleitem DROP INDEX idx_cityid;

-- 回滚第二阶段
-- DROP TABLE IF EXISTS customer.customercityrule;

-- ============================================================================
-- 说明
-- ============================================================================
--
-- 第一阶段（1-2周）：
--   - 扩展现有表 customeruserruleitem，增加 cityid 字段
--   - 支持城区规则（type=4）的人员规则明细配置
--   - 无需创建新表，对现有系统影响最小
--
-- 第二阶段（1-2月）：
--   - 创建 customercityrule 表
--   - 支持城区→公司、城区→部门、城区→设计师的映射
--   - 提供完整的城区规则管理功能
--
-- 数据量评估：
--   - customeruserruleitem: 预计增加几十到几百条记录（城区规则明细）
--   - customercityrule: 预计几十到几百条记录（城区规则）
--
-- 性能影响：
--   - idx_cityid 索引确保城区规则查询性能 < 50ms
--   - 内存操作（Service层过滤）性能影响 < 10ms
--
-- ============================================================================
