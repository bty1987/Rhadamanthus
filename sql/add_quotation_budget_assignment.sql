-- ============================================================================
-- 报价单预算员自动分配功能 - 数据库表结构
-- ============================================================================
-- 版本: v2.0
-- 创建日期: 2026-03-19
-- 数据库: MySQL 5.x
-- 字符集: utf8mb4
--
-- 说明:
-- 本脚本创建报价单预算员自动分配功能所需的5个核心表
-- 1. quotationassignconfig - 预算配置表
-- 2. quotationassignuserrule - 预算员规则表
-- 3. quotationassignuserruletype - 预算员类型支持表
-- 4. quotationassignrequest - 分配请求表
-- 5. quotationassignrecord - 分配记录表
--
-- 核心原则:
-- - 一个装修单只分配一次报价员（该人员也是后续报价单的预算员）
-- - 报价员=预算员（同一个人）
-- - 分配关系存储在 decoration.quoter (decoration.quid)
-- - 分配时间使用 quotation.createtime
-- ============================================================================

-- 如果数据库不存在则创建
CREATE DATABASE IF NOT EXISTS quotation DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE quotation;

-- 设置字符集
SET NAMES utf8mb4;

-- ============================================================================
-- 表1: 预算配置表 (quotationassignconfig)
-- ============================================================================
-- 职责: 控制哪些公司/部门启用预算员分配功能，以及分配方式
-- ============================================================================

DROP TABLE IF EXISTS quotation.quotationassignconfig;

CREATE TABLE quotation.quotationassignconfig (
    -- 主键
    qacid BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '配置ID (Quotation Assign Config ID)',

    -- 业务字段
    company INT(11) NOT NULL COMMENT '公司ID',
    department INT(11) DEFAULT NULL COMMENT '部门ID（NULL表示该公司所有部门）',

    -- 配置字段
    enabled SMALLINT(6) NOT NULL DEFAULT 1 COMMENT '是否启用：0-禁用（不使用预算员自动分配，走原流程），1-启用（使用预算员自动分配）',
    autoAssign SMALLINT(6) NOT NULL DEFAULT 1 COMMENT '是否自动分配：0-手动（预算员完成后不自动分配，需要手动派单），1-自动（预算员完成后自动从队列分配）',

    -- 时间字段
    createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 主键约束
    PRIMARY KEY (qacid),

    -- 唯一约束：确保每个公司/部门组合只有一条配置记录
    UNIQUE KEY uk_company_dept (company, department),

    -- 索引：按启用状态查询
    KEY idx_enabled (enabled)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预算配置表';

-- ============================================================================
-- 表2: 预算员规则表 (quotationassignuserrule)
-- ============================================================================
-- 职责: 定义预算员的基本信息和状态
-- ============================================================================

DROP TABLE IF EXISTS quotation.quotationassignuserrule;

CREATE TABLE quotation.quotationassignuserrule (
    -- 主键
    qaurid BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '预算员规则ID (Quotation Assign User Rule ID)',

    -- 用户信息
    uid INT(11) NOT NULL COMMENT '用户ID（预算员工号，该用户会被分配为装修单的报价员）',
    company INT(11) NOT NULL COMMENT '关联公司ID',
    department INT(11) DEFAULT NULL COMMENT '部门ID（NULL表示该公司所有部门）',

    -- 状态字段
    status SMALLINT(6) NOT NULL DEFAULT 1 COMMENT '状态：1-待分配（可接收新任务），2-制作中（正在处理任务），3-停止（不再接收任务）',

    -- 任务统计
    lastFinishTime TIMESTAMP NULL COMMENT '最后完成时间（用于自动分配排序，最早完成的优先）',
    currentTaskCount INT(8) NOT NULL DEFAULT 0 COMMENT '当前任务数量（缓存字段，基于quotationassignrequest统计，减少实时统计开销）',
    taskCountUpdateTime TIMESTAMP NULL COMMENT '任务数量统计时间（用于判断缓存是否过期）',

    -- 时间字段
    createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 主键约束
    PRIMARY KEY (qaurid),

    -- 唯一约束：一个用户在同一公司只能有一条规则记录
    UNIQUE KEY uk_uid_company (uid, company),

    -- 索引：按状态和完成时间查询（用于自动分配）
    KEY idx_status_finishTime (status, lastFinishTime),

    -- 索引：按公司和状态查询
    KEY idx_company_status (company, status),

    -- 索引：按部门查询
    KEY idx_department (department)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预算员人员规则表';

-- ============================================================================
-- 表3: 预算员类型支持表 (quotationassignuserruletype)
-- ============================================================================
-- 职责: 定义预算员支持的装修类型（半包/整装）
-- ============================================================================
-- 说明:
-- - 一个预算员可以有多条记录（支持多种类型）
-- - 分配时必须匹配类型才能成功
-- - 支持动态修改预算员的类型支持
-- ============================================================================

DROP TABLE IF EXISTS quotation.quotationassignuserruletype;

CREATE TABLE quotation.quotationassignuserruletype (
    -- 主键
    qasrid BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '类型支持ID (Quotation Assign Support Rule Type ID)',

    -- 关联字段
    qaurid BIGINT(20) NOT NULL COMMENT '预算员规则ID（关联 quotationassignuserrule.qaurid）',

    -- 类型字段
    type SMALLINT(6) NOT NULL COMMENT '装修类型：1-半包，2-整装',

    -- 时间字段
    createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 主键约束
    PRIMARY KEY (qasrid),

    -- 唯一约束：一个预算员对一种类型只能有一条记录
    UNIQUE KEY uk_qaurid_type (qaurid, type),

    -- 索引：按预算员规则ID查询
    KEY idx_qaurid (qaurid),

    -- 索引：按类型查询
    KEY idx_type (type)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预算员支持类型表';

-- ============================================================================
-- 表4: 装修单预算分配请求表 (quotationassignrequest)
-- ============================================================================
-- 职责: 控制分配逻辑和待分配队列（装修单级别，最多1条活跃记录）
-- ============================================================================
-- 说明:
-- - 控制待分配队列（装修单级别）
-- - 用于统计预算员的当前任务数（status=2 的记录）
-- - 支持优先级排序（priority + requestTime）
-- - 支持反向自动分配
-- - 一个装修单只有一条待分配/已分配记录
-- ============================================================================

DROP TABLE IF EXISTS quotation.quotationassignrequest;

CREATE TABLE quotation.quotationassignrequest (
    -- 主键
    qarid BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '请求ID (Quotation Assign Request ID)',

    -- 装修单信息
    orderId VARCHAR(15) NOT NULL COMMENT '装修单号（关联 decoration.orderId）',
    company INT(11) NOT NULL COMMENT '公司ID',
    department INT(11) DEFAULT NULL COMMENT '部门ID（NULL表示该公司所有部门）',
    decorationType SMALLINT(6) NOT NULL COMMENT '装修类型：1-半包，2-整装',

    -- 优先级
    priority SMALLINT(6) NOT NULL DEFAULT 5 COMMENT '优先级：1-最高，5-普通，9-最低',

    -- 请求信息
    requestTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '请求加入队列的时间',
    requestUid INT(11) DEFAULT NULL COMMENT '请求人用户ID（设计师）',

    -- 分配状态
    status SMALLINT(6) NOT NULL DEFAULT 1 COMMENT '状态：1-待分配（在队列中等待），2-已分配（成功分配给预算员）',
    assignTime TIMESTAMP NULL COMMENT '分配时间（status=2时有值，status=1时为NULL）',

    -- 备注
    remark VARCHAR(255) DEFAULT NULL COMMENT '备注',

    -- 主键约束
    PRIMARY KEY (qarid),

    -- 唯一约束：确保一个装修单在同一个状态下只有一条记录
    UNIQUE KEY uk_orderId_status (orderId, status),

    -- 索引：按公司、状态、类型查询（用于反向自动分配）
    KEY idx_company_status_type (company, status, decorationType),

    -- 索引：按优先级和时间排序（用于队列管理）
    KEY idx_priority_time (priority, requestTime),

    -- 索引：按装修单号查询
    KEY idx_orderId (orderId)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='装修单预算分配请求表';

-- ============================================================================
-- 表5: 装修单预算分配记录表 (quotationassignrecord)
-- ============================================================================
-- 职责: 追溯所有分配尝试（成功、失败、重新分配）
-- ============================================================================
-- 说明:
-- - 记录所有分配尝试（成功、失败、重新分配）
-- - 支持分配历史追溯和审计
-- - 统计预算员工作量和成功率
-- - 分析分配失败原因，优化分配策略
-- - 支持按时间、类型、结果等多维度查询
-- ============================================================================

DROP TABLE IF EXISTS quotation.quotationassignrecord;

CREATE TABLE quotation.quotationassignrecord (
    -- 主键
    qasrid BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '分配记录ID (Quotation Assign Support Record ID)',

    -- 装修单信息
    orderId VARCHAR(15) NOT NULL COMMENT '装修单号',

    -- 预算员信息
    uid INT(11) DEFAULT NULL COMMENT '预算员用户ID（成功时有值，失败时为NULL）',

    -- 分配类型
    assignType SMALLINT(6) NOT NULL COMMENT '分配类型：1-正向自动（设计师发起），2-手动（预算经理手动派单），3-反向自动（预算员完成后自动分配）',

    -- 分配结果
    assignResult TINYINT(1) NOT NULL COMMENT '分配结果：0-失败（无预算员/类型不匹配/其他原因），1-成功',

    -- 分配人信息
    assignUid INT(11) DEFAULT NULL COMMENT '分配人用户ID（手动分配时有值，自动分配时为NULL）',

    -- 时间信息
    assignTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间（即记录创建时间）',

    -- 失败原因
    failReason VARCHAR(255) DEFAULT NULL COMMENT '失败原因（assignResult=0时有值）',

    -- 装修类型（用于追溯）
    decorationType SMALLINT(6) DEFAULT NULL COMMENT '装修类型（用于追溯分析）',

    -- 主键约束
    PRIMARY KEY (qasrid),

    -- 索引：按装修单号查询
    KEY idx_orderId (orderId),

    -- 索引：按预算员和结果查询（统计工作量）
    KEY idx_uid_result (uid, assignResult),

    -- 索引：按分配类型和时间查询
    KEY idx_assignType_time (assignType, assignTime),

    -- 索引：按分配时间查询
    KEY idx_assignTime (assignTime)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='装修单预算分配记录表（历史追溯）';

-- ============================================================================
-- 索引说明
-- ============================================================================
--
-- 1. 主键索引 (PRIMARY KEY)
--    - 所有表都有主键，使用 BIGINT(20) AUTO_INCREMENT
--    - 支持大数据量，避免ID耗尽
--
-- 2. 唯一索引 (UNIQUE KEY)
--    - quotationassignconfig.uk_company_dept: 确保配置唯一性
--    - quotationassignuserrule.uk_uid_company: 确保预算员规则唯一性
--    - quotationassignuserruletype.uk_qaurid_type: 确保类型配置唯一性
--    - quotationassignrequest.uk_orderId_status: 确保装修单状态唯一性
--
-- 3. 单列索引 (KEY)
--    - 用于支持常用的单字段查询
--    - 如 idx_enabled, idx_department, idx_orderId 等
--
-- 4. 复合索引 (KEY)
--    - 用于支持多字段组合查询
--    - 索引顺序按照查询频率和选择性排序
--    - 如 idx_status_finishTime, idx_company_status_type 等
--
-- 5. 索引优化建议
--    - 定期使用 EXPLAIN 分析查询语句
--    - 根据实际查询场景调整索引顺序
--    - 避免过多索引影响写入性能
--    - 考虑使用覆盖索引减少回表
--
-- ============================================================================

-- ============================================================================
-- 数据完整性约束说明
-- ============================================================================
--
-- 1. 主键约束 (PRIMARY KEY)
--    - 确保每条记录有唯一标识
--    - 自动递增，避免ID冲突
--
-- 2. 唯一约束 (UNIQUE KEY)
--    - 防止重复数据
--    - 确保业务逻辑一致性
--
-- 3. 非空约束 (NOT NULL)
--    - 关键字段必须有值
--    - 防止数据不完整
--
-- 4. 默认值 (DEFAULT)
--    - 为字段提供合理的默认值
--    - 简化插入操作
--
-- 5. 自动更新 (ON UPDATE CURRENT_TIMESTAMP)
--    - updateTime 字段自动更新
--    - 记录数据修改时间
--
-- 6. 外键约束
--    - 本脚本未创建外键约束
--    - 在应用层进行数据校验
--    - 原因：避免外键锁影响性能，便于分库分表
--
-- ============================================================================

-- ============================================================================
-- 字符集说明
-- ============================================================================
--
-- 1. 字符集: utf8mb4
--    - 支持完整的 UTF-8 字符集
--    - 包括 emoji 等特殊字符
--    - 比 utf8 更完整
--
-- 2. 排序规则: utf8mb4_unicode_ci
--    - 不区分大小写
--    - 支持多语言排序
--    - 适合国际化场景
--
-- 3. 使用建议
--    - 数据库级字符集: utf8mb4
--    - 表级字符集: utf8mb4
--    - 字段级字符集: 继承表级设置
--    - 连接字符集: SET NAMES utf8mb4
--
-- ============================================================================

-- ============================================================================
-- 性能优化建议
-- ============================================================================
--
-- 1. 存储引擎: InnoDB
--    - 支持事务
--    - 支持外键
--    - 支持行级锁
--    - 支持崩溃恢复
--
-- 2. 索引优化
--    - 为常用查询字段创建索引
--    - 避免过多索引影响写入性能
--    - 定期分析和优化索引
--
-- 3. 查询优化
--    - 使用 EXPLAIN 分析查询计划
--    - 避免全表扫描
--    - 合理使用覆盖索引
--    - 避免使用 SELECT *
--
-- 4. 缓存策略
--    - currentTaskCount 字段作为缓存
--    - 定期更新而非实时统计
--    - 减少 JOIN 和 COUNT 操作
--
-- 5. 分区表（可选）
--    - 当数据量很大时考虑分区
--    - 按时间分区 quotationassignrecord
--    - 按公司分区 quotationassignrequest
--
-- ============================================================================

-- ============================================================================
-- 数据初始化（可选）
-- ============================================================================

-- 插入示例配置数据
INSERT INTO quotation.quotationassignconfig (company, department, enabled, autoAssign) VALUES
(1, NULL, 1, 1),  -- 公司1所有部门启用自动分配
(1, 10, 1, 1),   -- 公司1部门10启用自动分配（覆盖全局配置）
(2, NULL, 1, 0);  -- 公司2所有部门启用手动分配

-- 插入示例预算员数据
INSERT INTO quotation.quotationassignuserrule (uid, company, department, status, currentTaskCount) VALUES
(1001, 1, NULL, 1, 0),  -- 预算员1001，公司1所有部门，待分配
(1002, 1, 10, 1, 0),    -- 预算员1002，公司1部门10，待分配
(1003, 1, NULL, 2, 1);   -- 预算员1003，公司1所有部门，制作中

-- 插入示例预算员类型支持数据
INSERT INTO quotation.quotationassignuserruletype (qaurid, type) VALUES
(1, 1),  -- 预算员1001支持半包
(1, 2),  -- 预算员1001支持整装
(2, 1),  -- 预算员1002支持半包
(3, 2);  -- 预算员1003支持整装

-- ============================================================================
-- 前端常量数据（communion.constant）
-- ============================================================================
-- 说明: 前端页面使用constant常量进行枚举转换
-- 位置: WebContent/js/quotation/quotationAssignConfig.js
-- 访问方式: constant.quotation().quotationAssignConfig.enabled.datas[value]
-- ============================================================================

-- 切换到communion数据库
USE communion;

-- 插入启用状态枚举数据
INSERT INTO communion.constant (module, clazz, type, field, `key`, `value`) VALUES
('quotation', 'quotationAssignConfig', 'enabled', 'enabled', '0', '禁用'),
('quotation', 'quotationAssignConfig', 'enabled', 'enabled', '1', '启用');

INSERT INTO `communion`.`constant` (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`, `updateTime`) VALUES 
('禁用', 'quotation', 'quotationAssignConfig', 'enabled', 'ENABLED_DISABLED_INT', '0', '禁用', '0'),
('启用', 'quotation', 'quotationAssignConfig', 'enabled', 'ENABLED_ENABLED_INT', '1', '启用', '0');

-- 插入分配方式枚举数据
INSERT INTO communion.constant (module, clazz, type, field, `key`, `value`) VALUES
('quotation', 'quotationAssignConfig', 'autoAssign', 'autoAssign', '0', '手动'),
('quotation', 'quotationAssignConfig', 'autoAssign', 'autoAssign', '1', '自动');

INSERT INTO `communion`.`constant` (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`, `updateTime`) VALUES 
('手动', 'quotation', 'quotationAssignConfig', 'autoAssign', 'ASSIGN_MUNAL_INT', '0', '手动', '0'),
('自动', 'quotation', 'quotationAssignConfig', 'autoAssign', 'ASSIGN_AUTO_INT', '1', '自动', '0');


-- 切换回quotation数据库
USE quotation;

-- ============================================================================
-- 验证脚本
-- ============================================================================

-- 验证表是否创建成功
SHOW TABLES LIKE 'quotationassign%';

-- 验证表结构
DESC quotation.quotationassignconfig;
DESC quotation.quotationassignuserrule;
DESC quotation.quotationassignuserruletype;
DESC quotation.quotationassignrequest;
DESC quotation.quotationassignrecord;

-- 验证索引
SHOW INDEX FROM quotation.quotationassignconfig;
SHOW INDEX FROM quotation.quotationassignuserrule;
SHOW INDEX FROM quotation.quotationassignuserruletype;
SHOW INDEX FROM quotation.quotationassignrequest;
SHOW INDEX FROM quotation.quotationassignrecord;

-- 验证示例数据
SELECT * FROM quotation.quotationassignconfig;
SELECT * FROM quotation.quotationassignuserrule;
SELECT * FROM quotation.quotationassignuserruletype;

-- ============================================================================
-- 脚本执行完成
-- ============================================================================
-- 执行时间: 约 1-2 秒
-- 影响范围: quotation 数据库
-- 回滚方式: 删除相关表后重新执行本脚本
-- ============================================================================
