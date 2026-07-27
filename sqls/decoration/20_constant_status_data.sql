-- ==========================================
-- decoration 模块补录 status 枚举常量
-- 表: communion.constant
-- ==========================================
-- 背景:
--   P2-b decoration 模块 status 魔法数收敛时发现, 以下 4 个业务对象的 status 枚举
--   在 Java PO 里有定义, 但 communion.constant 表未登记, 导致前端无法走常量。
--   本脚本补录这 4 个对象的 status 枚举, 供前端 constant.decoration().xxx.status 使用。
--
-- 数据来源（Java PO 的 STATUS_* 常量）:
--   1. decorationActivity: DecorationActivityPO (0=初始 STATUS_INIT_INT / 1=锁定 STATUS_LOCK_INT)
--   2. decorationAtttype:  DecorationAtttypePO (0=启用 STATUS_ENABLE_INT)
--   3. decorationAuditScale: DecorationAuditScalePO (0=初始 STATUS_INIT_INT / 1=确认 STATUS_CONFIRM_INT
--                             / 2=扣款 STATUS_CHARGE_INT / 3=冲减 STATUS_ROLL_INT)
--   4. decorationService:  DecorationServicePO (0=初始 SERVICESTATUS_INIT_INT / 1=完成 SERVICESTATUS_FINISH_INT)
--
-- 说明:
--   1. field 写后端 PO 常量名, `key` 写业务实际枚举值, value 写前端显示中文.
--   2. status = 0 表示该常量记录启用(非业务状态).
--   3. communion.constant 无 (module, clazz, type, `key`) 唯一键(详见 P1-b), 用临时表幂等 upsert.
--   4. 本脚本在只读 RDS 无法执行, 需在可写主库执行. 执行前建议备份:
--      CREATE TABLE communion.constant_bak_decoration_status AS
--      SELECT * FROM communion.constant WHERE module='decoration' AND type='status';
--
-- 关联文档: docs/14-分析调研/constant-system/
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS decoration_status_constant_tmp;

CREATE TEMPORARY TABLE decoration_status_constant_tmp (
  name varchar(32) NOT NULL,
  module varchar(64) NOT NULL,
  clazz varchar(64) NOT NULL,
  type varchar(64) NOT NULL,
  field varchar(64) NULL,
  `key` varchar(64) NOT NULL,
  value varchar(64) NULL,
  status tinyint(1) NOT NULL
);

INSERT INTO decoration_status_constant_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
-- 1. decorationActivity（装修活动: 0=初始 1=锁定）
('初始(活动状态)', 'decoration', 'decorationActivity', 'status', 'STATUS_INIT_INT', '0', '初始', 0),
('锁定(活动状态)', 'decoration', 'decorationActivity', 'status', 'STATUS_LOCK_INT', '1', '锁定', 0),

-- 2. decorationAtttype（装修属性类型: 0=启用）
('启用(属性状态)', 'decoration', 'decorationAtttype', 'status', 'STATUS_ENABLE_INT', '0', '启用', 0),

-- 3. decorationAuditScale（装修审核刻度: 0=初始 1=确认 2=扣款 3=冲减）
('初始(审核状态)', 'decoration', 'decorationAuditScale', 'status', 'STATUS_INIT_INT', '0', '初始', 0),
('确认(审核状态)', 'decoration', 'decorationAuditScale', 'status', 'STATUS_CONFIRM_INT', '1', '确认', 0),
('扣款(审核状态)', 'decoration', 'decorationAuditScale', 'status', 'STATUS_CHARGE_INT', '2', '扣款', 0),
('冲减(审核状态)', 'decoration', 'decorationAuditScale', 'status', 'STATUS_ROLL_INT', '3', '冲减', 0),

-- 4. decorationService（装修服务: 0=初始 1=完成）
('初始(服务状态)', 'decoration', 'decorationService', 'status', 'SERVICESTATUS_INIT_INT', '0', '初始', 0),
('完成(服务状态)', 'decoration', 'decorationService', 'status', 'SERVICESTATUS_FINISH_INT', '1', '完成', 0);

-- 幂等 upsert（因无唯一键，用 JOIN UPDATE + LEFT JOIN INSERT）
-- 步骤一: 已存在的更新 value/field（以 module+clazz+type+key 定位）
UPDATE communion.constant c
INNER JOIN decoration_status_constant_tmp t
  ON  c.module = t.module
 AND c.clazz  = t.clazz
 AND c.type   = t.type
 AND c.`key`  = t.`key`
SET c.name  = t.name,
    c.field = t.field,
    c.value = t.value;

-- 步骤二: 不存在的插入
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM decoration_status_constant_tmp t
LEFT JOIN communion.constant c
  ON  c.module = t.module
 AND c.clazz  = t.clazz
 AND c.type   = t.type
 AND c.`key`  = t.`key`
WHERE c.cid IS NULL;

DROP TEMPORARY TABLE IF EXISTS decoration_status_constant_tmp;

-- 验证
SELECT module, clazz, `key`, value, field
FROM communion.constant
WHERE module = 'decoration'
  AND type = 'status'
  AND clazz IN ('decorationActivity', 'decorationAtttype', 'decorationAuditScale', 'decorationService')
ORDER BY clazz, `key`;
