-- ==========================================
-- 装修单预算分配模块 Constant 数据
-- 表: communion.constant
-- ==========================================
-- 说明:
-- 1. field 写后端 PO 常量名, `key` 写业务实际枚举值, value 写前端显示中文.
-- 2. status = 0 表示启用.
-- 3. communion.constant 当前无 (module, clazz, type, `key`) 唯一键, 因此使用临时表 + UPDATE/INSERT 修正数据.
-- 4. 装修类型统一按 DecorationPO.type: 0=半包, 1=整装, 2=全包; -1 仅用于 supportedType 的通用.
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS quotationassign_constant_tmp;

CREATE TEMPORARY TABLE quotationassign_constant_tmp (
  name varchar(32) NOT NULL,
  module varchar(64) NULL,
  clazz varchar(64) NULL,
  type varchar(64) NULL,
  field varchar(64) NULL,
  `key` varchar(64) NULL,
  value varchar(64) NULL,
  status tinyint(1) NOT NULL
);

INSERT INTO quotationassign_constant_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
-- quotationAssignUserRule.status
('可用', 'quotation', 'quotationAssignUserRule', 'status', 'STATUS_AVAILABLE_INT', '1', '可用', 0),
('制作中', 'quotation', 'quotationAssignUserRule', 'status', 'STATUS_BUSY_INT', '2', '制作中', 0),
('停止', 'quotation', 'quotationAssignUserRule', 'status', 'STATUS_STOPPED_INT', '3', '停止', 0),

-- quotationAssignUserRule.supportedType
('通用(支持类型)', 'quotation', 'quotationAssignUserRule', 'supportedType', 'SUPPORTED_TYPE_ALL_INT', '-1', '通用', 0),
('半包(支持类型)', 'quotation', 'quotationAssignUserRule', 'supportedType', 'SUPPORTED_TYPE_HALF_INT', '0', '半包', 0),
('整装(支持类型)', 'quotation', 'quotationAssignUserRule', 'supportedType', 'SUPPORTED_TYPE_FULL_INT', '1', '整装', 0),
('全包(支持类型)', 'quotation', 'quotationAssignUserRule', 'supportedType', 'SUPPORTED_TYPE_HOLONOMY_INT', '2', '全包', 0),

-- quotationAssignRequest.status
('待分配', 'quotation', 'quotationAssignRequest', 'status', 'STATUS_PENDING_INT', '1', '待分配', 0),
('已分配', 'quotation', 'quotationAssignRequest', 'status', 'STATUS_ASSIGNED_INT', '2', '已分配', 0),
('已完成', 'quotation', 'quotationAssignRequest', 'status', 'STATUS_COMPLETED_INT', '3', '已完成', 0),

-- quotationAssignRequest.priority
('最高', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_HIGHEST_INT', '1', '最高', 0),
('高', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_HIGH_INT', '3', '高', 0),
('普通', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_NORMAL_INT', '5', '普通', 0),
('低', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_LOW_INT', '7', '低', 0),
('最低', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_LOWEST_INT', '9', '最低', 0),

-- quotationAssignRequest.decorationType
('半包', 'quotation', 'quotationAssignRequest', 'decorationType', 'DECORATION_TYPE_HALF_INT', '0', '半包', 0),
('整装', 'quotation', 'quotationAssignRequest', 'decorationType', 'DECORATION_TYPE_FULL_INT', '1', '整装', 0),
('全包', 'quotation', 'quotationAssignRequest', 'decorationType', 'DECORATION_TYPE_HOLONOMY_INT', '2', '全包', 0),

-- quotationAssignRecord.assignType
('正向自动', 'quotation', 'quotationAssignRecord', 'assignType', 'ASSIGN_TYPE_FORWARD_AUTO_INT', '1', '正向自动', 0),
('手动', 'quotation', 'quotationAssignRecord', 'assignType', 'ASSIGN_TYPE_MANUAL_INT', '2', '手动', 0),
('反向自动', 'quotation', 'quotationAssignRecord', 'assignType', 'ASSIGN_TYPE_REVERSE_AUTO_INT', '3', '反向自动', 0),
('转交', 'quotation', 'quotationAssignRecord', 'assignType', 'ASSIGN_TYPE_TRANSFER_INT', '4', '转交', 0),

-- quotationAssignRecord.assignResult
('失败', 'quotation', 'quotationAssignRecord', 'assignResult', 'ASSIGN_RESULT_FAILED_INT', '0', '失败', 0),
('成功', 'quotation', 'quotationAssignRecord', 'assignResult', 'ASSIGN_RESULT_SUCCESS_INT', '1', '成功', 0),

-- quotationAssignRecord.decorationType
('半包', 'quotation', 'quotationAssignRecord', 'decorationType', 'DECORATION_TYPE_HALF_INT', '0', '半包', 0),
('整装', 'quotation', 'quotationAssignRecord', 'decorationType', 'DECORATION_TYPE_FULL_INT', '1', '整装', 0),
('全包', 'quotation', 'quotationAssignRecord', 'decorationType', 'DECORATION_TYPE_HOLONOMY_INT', '2', '全包', 0),

-- quotationAssignTalk.type
('设计师', 'quotation', 'quotationAssignTalk', 'type', 'TYPE_DESIGNER_TO_BUDGETER_INT', '1', '设计师', 0),
('预算员', 'quotation', 'quotationAssignTalk', 'type', 'TYPE_BUDGETER_TO_DESIGNER_INT', '2', '预算员', 0),

-- quotationAssignConfig.enabled
('禁用(是否启用)', 'quotation', 'quotationAssignConfig', 'enabled', 'ENABLED_DISABLED_INT', '0', '禁用', 0),
('启用(是否启用)', 'quotation', 'quotationAssignConfig', 'enabled', 'ENABLED_ENABLED_INT', '1', '启用', 0),

-- quotationAssignConfig.autoAssign
('手动(分配方式)', 'quotation', 'quotationAssignConfig', 'autoAssign', 'AUTO_ASSIGN_MANUAL_INT', '0', '手动', 0),
('自动(分配方式)', 'quotation', 'quotationAssignConfig', 'autoAssign', 'AUTO_ASSIGN_AUTO_INT', '1', '自动', 0);

-- 修正已存在记录
UPDATE communion.constant c
JOIN quotationassign_constant_tmp t
  ON c.module = t.module
 AND c.clazz = t.clazz
 AND c.type = t.type
 AND c.`key` = t.`key`
SET c.name = t.name,
    c.field = t.field,
    c.value = t.value,
    c.status = t.status;

-- 补齐缺失记录
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM quotationassign_constant_tmp t
LEFT JOIN communion.constant c
  ON c.module = t.module
 AND c.clazz = t.clazz
 AND c.type = t.type
 AND c.`key` = t.`key`
WHERE c.cid IS NULL;

-- 后端无 quotationAssignUserRule.status = 4, 禁用历史错误值
UPDATE communion.constant
SET status = 1
WHERE module = 'quotation'
  AND clazz = 'quotationAssignUserRule'
  AND type = 'status'
  AND `key` = '4';

DROP TEMPORARY TABLE quotationassign_constant_tmp;

-- 验证
SELECT module, clazz, type, field, `key`, value, status
FROM communion.constant
WHERE module = 'quotation'
  AND clazz IN ('quotationAssignConfig', 'quotationAssignUserRule', 'quotationAssignRequest', 'quotationAssignRecord', 'quotationAssignTalk')
ORDER BY clazz, type, CAST(`key` AS SIGNED);
