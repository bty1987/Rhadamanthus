-- ==========================================
-- 甲乙类收尾：补录 status 枚举常量（PO 已补枚举）
-- 表: communion.constant
-- ==========================================
-- 背景:
--   甲乙类收尾处理。以下对象的 PO 已补 STATUS 枚举(PuotationPO/WorkflowPO/WorkplanPO/ChatingPO),
--   CustomerPhonePO 本就有枚举但 constant 表未登记。本脚本补录这些枚举。
--
-- 数据来源(PO 已补/已有的 STATUS_* 常量):
--   1. puotation(production): PuotationPO (0=未使用 STATUS_UNUSE_INT / 1=正使用 STATUS_USING_INT)
--   2. workflow(production): WorkflowPO (0=启用 STATUS_ENABLE_SHORT / 1=禁用 STATUS_DISABLE_SHORT)
--   3. workplan(production): WorkplanPO (0=启用 STATUS_ENABLE_SHORT / 1=禁用 STATUS_DISABLE_SHORT)
--   4. chating(data): ChatingPO (0=开始 STATUS_START_INT / 1=结束 STATUS_END_INT)
--   5. customerPhone(customer): CustomerPhonePO (0=启用 STATUS_ENABLE_INT / 1=禁用 STATUS_DISABLE_INT)
--
-- 幂等 upsert(临时表 + JOIN UPDATE + LEFT JOIN INSERT)。
-- 执行前备份相关行。
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS residual_status_tmp;
CREATE TEMPORARY TABLE residual_status_tmp (
  name varchar(32) NOT NULL, module varchar(64) NOT NULL, clazz varchar(64) NOT NULL,
  type varchar(64) NOT NULL, field varchar(64) NULL, `key` varchar(64) NOT NULL,
  value varchar(64) NULL, status tinyint(1) NOT NULL
);

INSERT INTO residual_status_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
-- puotation（报价: 0未使用 1正使用）
('未使用(报价状态)', 'production', 'puotation', 'status', 'STATUS_UNUSE_INT', '0', '未使用', 0),
('正使用(报价状态)', 'production', 'puotation', 'status', 'STATUS_USING_INT', '1', '正使用', 0),

-- workflow（工作流: 0启用 1禁用）
('启用(工作流状态)', 'production', 'workflow', 'status', 'STATUS_ENABLE_SHORT', '0', '启用', 0),
('禁用(工作流状态)', 'production', 'workflow', 'status', 'STATUS_DISABLE_SHORT', '1', '禁用', 0),

-- workplan（工作计划: 0启用 1禁用）
('启用(工作计划状态)', 'production', 'workplan', 'status', 'STATUS_ENABLE_SHORT', '0', '启用', 0),
('禁用(工作计划状态)', 'production', 'workplan', 'status', 'STATUS_DISABLE_SHORT', '1', '禁用', 0),

-- chating（会话: 0开始 1结束）
('开始(会话状态)', 'data', 'chating', 'status', 'STATUS_START_INT', '0', '开始', 0),
('结束(会话状态)', 'data', 'chating', 'status', 'STATUS_END_INT', '1', '结束', 0),

-- customerPhone（客户电话: 0启用 1禁用）
('启用(电话状态)', 'customer', 'customerPhone', 'status', 'STATUS_ENABLE_INT', '0', '启用', 0),
('禁用(电话状态)', 'customer', 'customerPhone', 'status', 'STATUS_DISABLE_INT', '1', '禁用', 0);

UPDATE communion.constant c
INNER JOIN residual_status_tmp t
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
SET c.name=t.name, c.field=t.field, c.value=t.value;

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM residual_status_tmp t
LEFT JOIN communion.constant c
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
WHERE c.cid IS NULL;

DROP TEMPORARY TABLE IF EXISTS residual_status_tmp;
SELECT module, clazz, `key`, value, field FROM communion.constant
WHERE type='status' AND (
  (module='production' AND clazz IN ('puotation','workflow','workplan'))
  OR (module='data' AND clazz='chating')
  OR (module='customer' AND clazz='customerPhone')
) ORDER BY module, clazz, `key`;
