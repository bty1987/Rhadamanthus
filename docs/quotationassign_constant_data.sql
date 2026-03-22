-- ==========================================
-- 装修单预算分配模块 Constant 数据
-- 表: communion.constant
-- ==========================================

-- ==========================================
-- 1. quotationAssignUserRule - 预算员规则
-- ==========================================

-- status: 状态
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('待分配', 'quotation', 'quotationAssignUserRule', 'status', 'STATUS_AVAILABLE_INT', '1', '待分配', 0),
('制作中', 'quotation', 'quotationAssignUserRule', 'status', 'STATUS_BUSY_INT', '2', '制作中', 0),
('停止', 'quotation', 'quotationAssignUserRule', 'status', 'STATUS_STOP_INT', '3', '停止', 0),
('已完成', 'quotation', 'quotationAssignUserRule', 'status', 'STATUS_COMPLETED_INT', '4', '已完成', 0);

-- ==========================================
-- 2. quotationAssignRequest - 待分配请求
-- ==========================================

-- status: 状态
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('待分配', 'quotation', 'quotationAssignRequest', 'status', 'STATUS_PENDING_INT', '1', '待分配', 0),
('已分配', 'quotation', 'quotationAssignRequest', 'status', 'STATUS_ASSIGNED_INT', '2', '已分配', 0);

-- priority: 优先级
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('最高', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_HIGHEST_INT', '1', '最高', 0),
('高', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_HIGH_INT', '3', '高', 0),
('普通', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_NORMAL_INT', '5', '普通', 0),
('低', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_LOW_INT', '7', '低', 0),
('最低', 'quotation', 'quotationAssignRequest', 'priority', 'PRIORITY_LOWEST_INT', '9', '最低', 0);

-- decorationType: 装修类型
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('半包', 'quotation', 'quotationAssignRequest', 'decorationType', 'DECORATION_TYPE_HALF_INT', '1', '半包', 0),
('整装', 'quotation', 'quotationAssignRequest', 'decorationType', 'DECORATION_TYPE_FULL_INT', '2', '整装', 0);

-- ==========================================
-- 3. quotationAssignRecord - 分配记录
-- ==========================================

-- assignType: 分配类型
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('正向自动', 'quotation', 'quotationAssignRecord', 'assignType', 'ASSIGN_TYPE_AUTO_INT', '1', '正向自动', 0),
('手动', 'quotation', 'quotationAssignRecord', 'assignType', 'ASSIGN_TYPE_MANUAL_INT', '2', '手动', 0),
('反向自动', 'quotation', 'quotationAssignRecord', 'assignType', 'ASSIGN_TYPE_REVERSE_INT', '3', '反向自动', 0);

-- assignResult: 分配结果
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('失败', 'quotation', 'quotationAssignRecord', 'assignResult', 'ASSIGN_RESULT_FAIL_INT', '0', '失败', 0),
('成功', 'quotation', 'quotationAssignRecord', 'assignResult', 'ASSIGN_RESULT_SUCCESS_INT', '1', '成功', 0);

-- decorationType: 装修类型
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('半包', 'quotation', 'quotationAssignRecord', 'decorationType', 'DECORATION_TYPE_HALF_INT', '1', '半包', 0),
('整装', 'quotation', 'quotationAssignRecord', 'decorationType', 'DECORATION_TYPE_FULL_INT', '2', '整装', 0);

-- ==========================================
-- 说明：
-- 1. 前台通过Constant对象加载这些常量数据
-- 2. 前台使用constant来转换显示（例如：status=1显示为"待分配"）
-- 3. 后台只存储数字值，不存储中文名称
-- 4. 前台JS使用示例：
--    constant.quotation().quotationAssignUserRule.status.datas
--    或: constant.quotation().quotationAssignRequest.status.datas
--    或: constant.quotation().quotationAssignRecord.assignType.datas
-- ==========================================

-- 示例：获取状态映射数据
-- var statusDatas = constant.quotation().quotationAssignUserRule.status.datas;
-- statusDatas[0].key   // 返回: 1
-- statusDatas[0].value // 返回: "待分配"
--
-- 使用示例：
-- var statusText = constant.quotation().quotationAssignUserRule.status.datas[item.status - 1].value;

-- ==========================================
-- 4. quotationAssignConfig - 分配配置（新增）
-- 更新日期: 2026-03-22
-- ==========================================

-- enabled: 是否启用 (0=禁用, 1=启用)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, `value`, status) VALUES
('禁用(是否启用)', 'quotation', 'quotationAssignConfig', 'enabled', 'ENABLED_DISABLED_INT', '0', '禁用', 0),
('启用(是否启用)', 'quotation', 'quotationAssignConfig', 'enabled', 'ENABLED_ENABLED_INT', '1', '启用', 0);

-- autoAssign: 分配方式 (0=手动, 1=自动)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, `value`, status) VALUES
('手动(分配方式)', 'quotation', 'quotationAssignConfig', 'autoAssign', 'AUTOASSIGN_MANUAL_INT', '0', '手动', 0),
('自动(分配方式)', 'quotation', 'quotationAssignConfig', 'autoAssign', 'AUTOASSIGN_AUTO_INT', '1', '自动', 0);

-- ==========================================
-- 5. quotationAssignUserRule - 支持类型（新增）
-- 更新日期: 2026-03-22
-- ==========================================

-- supportedType: 支持类型 (-1=通用, 0=半包, 1=整装, 2=全部)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, `value`, status) VALUES
('通用(支持类型)', 'quotation', 'quotationAssignUserRule', 'supportedType', 'SUPPORTEDTYPE_COMMON_INT', '-1', '通用', 0),
('半包(支持类型)', 'quotation', 'quotationAssignUserRule', 'supportedType', 'SUPPORTEDTYPE_HALF_INT', '0', '半包', 0),
('整装(支持类型)', 'quotation', 'quotationAssignUserRule', 'supportedType', 'SUPPORTEDTYPE_FULL_INT', '1', '整装', 0),
('全部(支持类型)', 'quotation', 'quotationAssignUserRule', 'supportedType', 'SUPPORTEDTYPE_ALL_INT', '2', '全部', 0);

-- ==========================================
-- 更新说明：
-- 1. 以上新增6个常量（第4、5部分）用于替换前端JS文件中的魔法数字
-- 2. 第1-3部分的17个常量已存在于数据库中（CID: 2009-2028）
-- 3. 新增常量仅在执行SQL后才生效，执行前前端仍需使用魔法数字
-- 4. 执行验证：
--    SELECT * FROM communion.constant
--    WHERE module = 'quotation'
--      AND clazz IN ('quotationAssignConfig', 'quotationAssignUserRule')
--      AND type IN ('enabled', 'autoAssign', 'supportedType')
--    ORDER BY clazz, type, `key`;
-- ==========================================
