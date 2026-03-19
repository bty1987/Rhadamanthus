-- ============================================
-- 预算员分配功能 - 常量配置
-- 说明：在 communion.constant 表中添加相关常量
-- 用于前端查询条件的下拉选项数据源
-- ============================================

-- ============================================
-- 1. 预算配置 (quotationAssignConfig) 相关常量
-- ============================================

-- 启用状态
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('已禁用', 'quotation', 'quotationAssignConfig', 'enabled', 'enabled', 'ENABLED_DISABLED_INT', '0', 0),
('已启用', 'quotation', 'quotationAssignConfig', 'enabled', 'enabled', 'ENABLED_ENABLED_INT', '1', 0);

-- 分配方式
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('手动分配', 'quotation', 'quotationAssignConfig', 'autoAssign', 'autoAssign', 'AUTOASSIGN_MANUAL_INT', '0', 0),
('自动分配', 'quotation', 'quotationAssignConfig', 'autoAssign', 'autoAssign', 'AUTOASSIGN_AUTO_INT', '1', 0);

-- ============================================
-- 2. 预算员规则 (quotationAssignUserRule) 相关常量
-- ============================================

-- 预算员状态
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('可用', 'quotation', 'quotationAssignUserRule', 'status', 'status', 'STATUS_AVAILABLE_INT', '1', 0),
('制作中', 'quotation', 'quotationAssignUserRule', 'status', 'status', 'STATUS_BUSY_INT', '2', 0),
('已停用', 'quotation', 'quotationAssignUserRule', 'status', 'status', 'STATUS_STOPPED_INT', '3', 0),
('已完成', 'quotation', 'quotationAssignUserRule', 'status', 'status', 'STATUS_COMPLETED_INT', '4', 0);

-- ============================================
-- 3. 分配请求 (quotationAssignRequest) 相关常量
-- ============================================

-- 请求状态
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('待分配', 'quotation', 'quotationAssignRequest', 'status', 'status', 'STATUS_PENDING_INT', '1', 0),
('已分配', 'quotation', 'quotationAssignRequest', 'status', 'status', 'STATUS_ASSIGNED_INT', '2', 0);

-- 请求优先级
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('最高', 'quotation', 'quotationAssignRequest', 'priority', 'priority', 'PRIORITY_HIGHEST_INT', '1', 0),
('高', 'quotation', 'quotationAssignRequest', 'priority', 'priority', 'PRIORITY_HIGH_INT', '2', 0),
('普通', 'quotation', 'quotationAssignRequest', 'priority', 'priority', 'PRIORITY_NORMAL_INT', '5', 0),
('低', 'quotation', 'quotationAssignRequest', 'priority', 'priority', 'PRIORITY_LOW_INT', '8', 0),
('最低', 'quotation', 'quotationAssignRequest', 'priority', 'priority', 'PRIORITY_LOWEST_INT', '9', 0);

-- ============================================
-- 4. 分配记录 (quotationAssignRecord) 相关常量
-- ============================================

-- 分配类型
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('正向自动', 'quotation', 'quotationAssignRecord', 'assignType', 'assignType', 'ASSIGNTYPE_AUTO_INT', '1', 0),
('手动分配', 'quotation', 'quotationAssignRecord', 'assignType', 'assignType', 'ASSIGNTYPE_MANUAL_INT', '2', 0),
('反向自动', 'quotation', 'quotationAssignRecord', 'assignType', 'assignType', 'ASSIGNTYPE_REVERSE_INT', '3', 0);

-- 分配结果
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('失败', 'quotation', 'quotationAssignRecord', 'assignResult', 'assignResult', 'ASSIGNRESULT_FAILED_INT', '0', 0),
('成功', 'quotation', 'quotationAssignRecord', 'assignResult', 'assignResult', 'ASSIGNRESULT_SUCCESS_INT', '1', 0);

-- ============================================
-- 5. 预算员类型支持 (quotationAssignUserRuleType) 相关常量
-- ============================================

-- 装修类型
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('半包', 'quotation', 'quotationAssignUserRuleType', 'type', 'type', 'TYPE_SEMI_INT', '1', 0),
('整装', 'quotation', 'quotationAssignUserRuleType', 'type', 'type', 'TYPE_FULL_INT', '2', 0);

-- ============================================
-- 查询验证
-- ============================================

-- 查看已插入的常量（按clazz分组）
-- SELECT module, clazz, field, `key`, name, value
-- FROM communion.constant
-- WHERE module = 'quotation'
--   AND clazz IN ('quotationAssignConfig', 'quotationAssignUserRule', 'quotationAssignRequest', 'quotationAssignRecord', 'quotationAssignUserRuleType')
-- ORDER BY clazz, field, value;
