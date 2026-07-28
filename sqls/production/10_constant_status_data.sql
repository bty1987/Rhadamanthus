-- ==========================================
-- production 模块补录 status 枚举常量
-- 表: communion.constant
-- ==========================================
-- 背景:
--   production 模块在 communion.constant 表中完全空白(0条记录), 但各业务对象
--   的 status 枚举在 Java PO 里有定义。本脚本补录这些枚举, 供前端
--   constant.production().xxx.STATUS_yyy 使用。
--
-- 数据来源(Java PO 的 STATUS_* 常量):
--   1. hardware:        HardwarePO (0初始/1采购/2入库/3完结/4失效)
--   2. outsource:       OutsourcePO (0初始/1审核/2确认/3完结/4失效)
--   3. production:      ProductionPO 第二组新定义 (0初始/1设计/2生产/3入库/4物流/
--                       5运输/6安装/7完成/8售后/9完结/10废单)
--   4. productionPlan:  ProductionPlanPO (0初始/1完结)
--   5. puoteItem:       PuoteItemPO (0解锁/1锁定)
--   6. quoteType:       QuoteTypePO (0启用/1禁用)
--   7. tranpack:        TranpackPO (0初始/1入库/2物流/3运输/4安装/5完成/6丢失)
--   8. workshop:        WorkshopPO (0启用) - 仅 STATUS_ENABLE_SHORT, 无 DISABLE
--
-- ⚠️ ProductionPO 两组冲突常量说明:
--   PO 内存在两组 STATUS 常量, 数值 1-5 含义不同:
--     旧组(单据维度): 1签约/2已审核/3生产/4废单/5完结
--     新组(状态流转): 0初始/1设计/2生产/3入库/4物流/5运输/6安装/7完成/8售后/9完结/10废单
--   前端 production.js 的按钮逻辑(>=1显示图纸/>=2显示外协/==1拆单)与新组吻合,
--   故补录采用新组定义。
--
-- 未补录的对象(PO 无 STATUS 枚举, 保留魔法数):
--   - productionPlanItem: ProductionPlanItemPO 无 STATUS 枚举
--   - puotation:          PuotationPO 无 STATUS 枚举
--   - workflow:           WorkflowPO 仅误命名的 COLUMN_STATUS_STR
--   - workplan:           WorkplanPO 仅误命名的 COLUMN_STATUS_SHORT
--
-- 说明:
--   1. field 写后端 PO 常量名, `key` 写业务实际枚举值, value 写前端显示中文.
--   2. status = 0 表示该常量记录启用(非业务状态).
--   3. communion.constant 无唯一键, 用临时表幂等 upsert.
--   4. 执行前建议备份:
--      CREATE TABLE communion.constant_bak_production AS
--      SELECT * FROM communion.constant WHERE module='production';
--
-- 关联文档: docs/14-分析调研/constant-system/
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS production_status_constant_tmp;

CREATE TEMPORARY TABLE production_status_constant_tmp (
  name varchar(32) NOT NULL,
  module varchar(64) NOT NULL,
  clazz varchar(64) NOT NULL,
  type varchar(64) NOT NULL,
  field varchar(64) NULL,
  `key` varchar(64) NOT NULL,
  value varchar(64) NULL,
  status tinyint(1) NOT NULL
);

INSERT INTO production_status_constant_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
-- 1. hardware（五金: 0初始 1采购 2入库 3完结 4失效）
('初始(五金状态)', 'production', 'hardware', 'status', 'STATUS_INIT_SHORT', '0', '初始', 0),
('采购(五金状态)', 'production', 'hardware', 'status', 'STATUS_PURCHASE_SHORT', '1', '采购', 0),
('入库(五金状态)', 'production', 'hardware', 'status', 'STATUS_INSTORE_SHORT', '2', '入库', 0),
('完结(五金状态)', 'production', 'hardware', 'status', 'STATUS_FINISH_SHORT', '3', '完结', 0),
('失效(五金状态)', 'production', 'hardware', 'status', 'STATUS_FAILURE_SHORT', '4', '失效', 0),

-- 2. outsource（外协: 0初始 1审核 2确认 3完结 4失效）
('初始(外协状态)', 'production', 'outsource', 'status', 'STATUS_INIT_SHORT', '0', '初始', 0),
('审核(外协状态)', 'production', 'outsource', 'status', 'STATUS_RECEIVE_SHORT', '1', '审核', 0),
('确认(外协状态)', 'production', 'outsource', 'status', 'STATUS_CONFIRM_SHORT', '2', '确认', 0),
('完结(外协状态)', 'production', 'outsource', 'status', 'STATUS_END_SHORT', '3', '完结', 0),
('失效(外协状态)', 'production', 'outsource', 'status', 'STATUS_INVALID_SHORT', '4', '失效', 0),

-- 3. production（生产单: 采用第二组状态流转定义）
('初始(生产状态)', 'production', 'production', 'status', 'STATUS_INIT_SHORT', '0', '初始', 0),
('设计(生产状态)', 'production', 'production', 'status', 'STATUS_DESIGN_SHORT', '1', '设计', 0),
('生产(生产状态)', 'production', 'production', 'status', 'STATUS_SPLIT_SHORT', '2', '生产', 0),
('入库(生产状态)', 'production', 'production', 'status', 'STATUS_INSTORE_SHORT', '3', '入库', 0),
('物流(生产状态)', 'production', 'production', 'status', 'STATUS_PLAN_SHORT', '4', '物流', 0),
('运输(生产状态)', 'production', 'production', 'status', 'STATUS_TRANSPORT_SHORT', '5', '运输', 0),
('安装(生产状态)', 'production', 'production', 'status', 'STATUS_MOUNT_SHORT', '6', '安装', 0),
('完成(生产状态)', 'production', 'production', 'status', 'STATUS_COMPLETE_SHORT', '7', '完成', 0),
('售后(生产状态)', 'production', 'production', 'status', 'STATUS_UPHOLD_SHORT', '8', '售后', 0),
('完结(生产状态)', 'production', 'production', 'status', 'STATUS_FINISH_SHORT', '9', '完结', 0),
('废单(生产状态)', 'production', 'production', 'status', 'STATUS_TERMINAL_SHORT', '10', '废单', 0),

-- 4. productionPlan（生产计划: 0初始 1完结）
('初始(计划状态)', 'production', 'productionPlan', 'status', 'STATUS_CREATE_INT', '0', '初始', 0),
('完结(计划状态)', 'production', 'productionPlan', 'status', 'STATUS_FINISH_INT', '1', '完结', 0),

-- 5. puoteItem（报价项: 0解锁 1锁定）
('解锁(报价项状态)', 'production', 'puoteItem', 'status', 'STATUS_UNLOCK_SHORT', '0', '解锁', 0),
('锁定(报价项状态)', 'production', 'puoteItem', 'status', 'STATUS_LOCK_SHORT', '1', '锁定', 0),

-- 6. quoteType（报价类型: 0启用 1禁用）
('启用(报价类型状态)', 'production', 'quoteType', 'status', 'STATUS_ENABLE_SHORT', '0', '启用', 0),
('禁用(报价类型状态)', 'production', 'quoteType', 'status', 'STATUS_DISABLE_SHORT', '1', '禁用', 0),

-- 7. tranpack（物流包: 0初始 1入库 2物流 3运输 4安装 5完成 6丢失）
('初始(物流状态)', 'production', 'tranpack', 'status', 'STATUS_INIT_SHORT', '0', '初始', 0),
('入库(物流状态)', 'production', 'tranpack', 'status', 'STATUS_INSTORE_SHORT', '1', '入库', 0),
('物流(物流状态)', 'production', 'tranpack', 'status', 'STATUS_LOGISTICS_SHORT', '2', '物流', 0),
('运输(物流状态)', 'production', 'tranpack', 'status', 'STATUS_TRANSPORT_SHORT', '3', '运输', 0),
('安装(物流状态)', 'production', 'tranpack', 'status', 'STATUS_INSTALLATION_SHORT', '4', '安装', 0),
('完成(物流状态)', 'production', 'tranpack', 'status', 'STATUS_COMPLETE_SHORT', '5', '完成', 0),
('丢失(物流状态)', 'production', 'tranpack', 'status', 'STATUS_LOSS_SHORT', '6', '丢失', 0),

-- 8. workshop（车间: 0启用）
('启用(车间状态)', 'production', 'workshop', 'status', 'STATUS_ENABLE_SHORT', '0', '启用', 0);

-- 幂等 upsert（因无唯一键，用 JOIN UPDATE + LEFT JOIN INSERT）
UPDATE communion.constant c
INNER JOIN production_status_constant_tmp t
  ON  c.module = t.module
 AND c.clazz  = t.clazz
 AND c.type   = t.type
 AND c.`key`  = t.`key`
SET c.name  = t.name,
    c.field = t.field,
    c.value = t.value;

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM production_status_constant_tmp t
LEFT JOIN communion.constant c
  ON  c.module = t.module
 AND c.clazz  = t.clazz
 AND c.type   = t.type
 AND c.`key`  = t.`key`
WHERE c.cid IS NULL;

DROP TEMPORARY TABLE IF EXISTS production_status_constant_tmp;

-- 验证
SELECT clazz, `key`, value, field
FROM communion.constant
WHERE module = 'production' AND type = 'status'
ORDER BY clazz, `key`;
