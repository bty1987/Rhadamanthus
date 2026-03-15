-- ============================================
-- 报价单预算员自动分配功能 - 数据库脚本
-- 版本: v1.5
-- 创建日期: 2026-03-15
-- 说明: 包含5张新表（不修改 decoration 表）
-- ============================================

-- ============================================
-- 1. 预算员规则表 (quotation.quotationuserrule)
-- 职责: 管理预算员信息、状态、关联公司
-- ============================================

CREATE TABLE IF NOT EXISTS quotation.quotationuserrule (
    burid INT(11) NOT NULL AUTO_INCREMENT COMMENT '预算员规则ID',
    uid INT(11) NOT NULL COMMENT '用户ID（预算员工号）',
    company INT(11) NOT NULL COMMENT '关联公司ID',
    department INT(11) COMMENT '部门ID',
    status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态：1-待分配，2-制作中，3-停止，4-已完成',
    lastFinishTime TIMESTAMP NULL COMMENT '最后完成时间',
    currentTaskCount INT(8) DEFAULT 0 COMMENT '当前任务数量',
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (burid),
    UNIQUE KEY uk_uid_company (uid, company),
    KEY idx_status_finishTime (status, lastFinishTime),
    KEY idx_company (company),
    KEY idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='预算员人员规则表';

-- ============================================
-- 3. 预算员类型支持表 (quotation.quotationuserruletype)
-- 职责: 定义预算员支持的装修类型（半包/整装）
-- ============================================

CREATE TABLE IF NOT EXISTS quotation.quotationuserruletype (
    id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    burid INT(11) NOT NULL COMMENT '预算员规则ID',
    type TINYINT(1) NOT NULL COMMENT '装修类型：1-半包，2-整装',
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_burid_type (burid, type),
    KEY idx_burid (burid),
    KEY idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='预算员支持类型表';

-- ============================================
-- 4. 装修单预算分配请求表 (quotation.quotationassignrequest)
-- 职责: 控制分配逻辑和待分配队列（装修单级别，最多1条活跃记录）
-- ============================================

CREATE TABLE IF NOT EXISTS quotation.quotationassignrequest (
    barid INT(11) NOT NULL AUTO_INCREMENT COMMENT '请求ID',
    orderId VARCHAR(15) NOT NULL COMMENT '装修单号（关联 decoration）',
    company INT(11) NOT NULL COMMENT '公司ID',
    department INT(11) COMMENT '部门ID',
    decorationType TINYINT(1) NOT NULL COMMENT '装修类型：1-半包，2-整装',
    priority TINYINT(1) NOT NULL DEFAULT 5 COMMENT '优先级：1-最高，5-普通，9-最低',
    requestTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '请求时间',
    requestUid INT(11) COMMENT '请求人用户ID（设计师）',
    status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态：1-待分配，2-已分配',
    assignTime TIMESTAMP NULL COMMENT '分配时间',
    remark VARCHAR(255) COMMENT '备注',
    PRIMARY KEY (barid),
    UNIQUE KEY uk_orderId_status (orderId, status),
    KEY idx_company_status (company, status),
    KEY idx_priority_time (priority, requestTime),
    KEY idx_orderId (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='装修单预算分配请求表';

-- ============================================
-- 5. 装修单预算分配记录表 (quotation.quotationassignrecord)
-- 职责: 追溯所有分配尝试（成功、失败、重新分配）
-- ============================================

CREATE TABLE IF NOT EXISTS quotation.quotationassignrecord (
    qarid INT(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
    orderId VARCHAR(15) NOT NULL COMMENT '装修单号',
    uid INT(11) COMMENT '预算员用户ID（成功时有值）',
    assignType TINYINT(1) NOT NULL COMMENT '分配类型：1-正向自动，2-手动，3-反向自动',
    assignResult TINYINT(1) NOT NULL COMMENT '分配结果：1-成功，0-失败',
    assignUid INT(11) COMMENT '分配人用户ID（手动分配时）',
    assignTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间',
    failReason VARCHAR(255) COMMENT '失败原因',
    decorationType TINYINT(1) COMMENT '装修类型',
    PRIMARY KEY (qarid),
    KEY idx_orderId (orderId),
    KEY idx_uid (uid),
    KEY idx_assignTime (assignTime),
    KEY idx_assignType (assignType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='装修单预算分配记录表（历史追溯）';

-- ============================================
-- 6. 预算配置表 (quotation.quotationconfig)
-- 职责: 控制哪些公司/部门启用预算员分配功能
-- ============================================

CREATE TABLE IF NOT EXISTS quotation.quotationconfig (
    bcid INT(11) NOT NULL AUTO_INCREMENT COMMENT '配置ID',
    company INT(11) NOT NULL COMMENT '公司ID',
    department INT(11) COMMENT '部门ID',
    enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：0-禁用，1-启用',
    autoAssign TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否自动分配：0-手动，1-自动',
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (bcid),
    UNIQUE KEY uk_company_dept (company, department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='预算配置表';

-- ============================================
-- 数据示例（可选，用于测试）
-- ============================================

-- 示例1: 插入预算员规则
-- INSERT INTO quotation.quotationuserrule (uid, company, department, status, lastFinishTime, currentTaskCount)
-- VALUES
-- (1001, 1, 10, 1, '2026-03-11 12:25:20', 0),
-- (1002, 1, 10, 1, '2026-03-12 09:30:00', 0),
-- (1003, 1, 11, 1, '2026-03-10 16:45:00', 0);

-- 示例2: 插入预算员类型支持
-- 假设 burid=1 支持半包和整装（全能预算员）
-- INSERT INTO quotation.quotationuserruletype (burid, type) VALUES (1, 1);
-- INSERT INTO quotation.quotationuserruletype (burid, type) VALUES (1, 2);

-- 假设 burid=2 只支持半包
-- INSERT INTO quotation.quotationuserruletype (burid, type) VALUES (2, 1);

-- 假设 burid=3 只支持整装
-- INSERT INTO quotation.quotationuserruletype (burid, type) VALUES (3, 2);

-- 示例3: 插入预算配置
-- INSERT INTO quotation.quotationconfig (company, department, enabled, autoAssign)
-- VALUES (1, NULL, 1, 1);  -- 公司1启用自动分配，所有部门

-- ============================================
-- 索引说明
-- ============================================

-- quotation.quotationuserrule
-- uk_uid_company: 确保同一预算员在同一公司只有一条规则
-- idx_status_finishTime: 用于自动分配时查找待分配的预算员（按完成时间排序）
-- idx_company: 用于按公司查询预算员
-- idx_department: 用于按部门查询预算员

-- quotation.quotationuserruletype
-- uk_burid_type: 确保同一预算员同一种类型只有一条记录
-- idx_burid: 用于查询预算员支持的所有类型
-- idx_type: 用于查询支持某个类型的所有预算员

-- quotation.quotationassignrequest
-- uk_orderId_status: 确保一个装修单只有一条待分配或已分配记录
-- idx_company_status: 用于查询某个公司的待分配队列
-- idx_priority_time: 用于待分配队列排序（优先级+请求时间）
-- idx_orderId: 用于根据装修单号查询分配请求

-- quotation.quotationassignrecord
-- idx_orderId: 用于查询某个装修单的所有分配记录
-- idx_uid: 用于查询某个预算员的所有分配记录
-- idx_assignTime: 用于按时间统计分配记录
-- idx_assignType: 用于按分配类型统计

-- quotation.quotationconfig
-- uk_company_dept: 确保同一公司/部门只有一条配置

-- ============================================
-- 结束
-- ============================================
