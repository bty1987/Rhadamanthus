-- ==========================================
-- manifest/manifestTemplate 补录 status 枚举常量
-- 表: communion.constant (module=inventory)
-- ==========================================
-- 背景:
--   manifest 前端模块对应后端 inventory PO。以下对象在 PO 有 STATUS 枚举,
--   但 communion.constant 表未登记, 本脚本补录。
--
-- 数据来源:
--   1. manifest(库存清单): ManifestPO (0=初始 STATUS_INIT_INT / 1=确认 STATUS_CONFIRM_INT)
--   2. manifestTemplate(清单模板): ManifestTemplatePO (0=启用 STATUS_ENABLE_INT / 1=禁用 STATUS_DISABLE_INT)
--
-- 未补录(purchaseBalance):
--   PurchaseBalancePO 仅 STATUS_DONE_INT=1, 缺少初始状态枚举, 前端"初始/已付款"
--   文案与 PO 不符, 语义存疑, 保留魔法数。
--
-- 说明:
--   1. 归属 module=inventory(manifest 前端模块对应后端 inventory 包)。
--   2. field 写 PO 常量名, `key` 业务值, value 中文。
--   3. 幂等 upsert(临时表 + JOIN UPDATE + LEFT JOIN INSERT)。
--   4. 执行前备份:
--      CREATE TABLE communion.constant_bak_manifest AS
--      SELECT * FROM communion.constant WHERE module='inventory' AND clazz IN ('manifest','manifestTemplate');
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS manifest_status_constant_tmp;

CREATE TEMPORARY TABLE manifest_status_constant_tmp (
  name varchar(32) NOT NULL,
  module varchar(64) NOT NULL,
  clazz varchar(64) NOT NULL,
  type varchar(64) NOT NULL,
  field varchar(64) NULL,
  `key` varchar(64) NOT NULL,
  value varchar(64) NULL,
  status tinyint(1) NOT NULL
);

INSERT INTO manifest_status_constant_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
-- manifest（库存清单: 0初始 1确认）
('初始(清单状态)', 'inventory', 'manifest', 'status', 'STATUS_INIT_INT', '0', '初始', 0),
('确认(清单状态)', 'inventory', 'manifest', 'status', 'STATUS_CONFIRM_INT', '1', '已确认', 0),

-- manifestTemplate（清单模板: 0启用 1禁用）
('启用(模板状态)', 'inventory', 'manifestTemplate', 'status', 'STATUS_ENABLE_INT', '0', '启用', 0),
('禁用(模板状态)', 'inventory', 'manifestTemplate', 'status', 'STATUS_DISABLE_INT', '1', '禁用', 0);

UPDATE communion.constant c
INNER JOIN manifest_status_constant_tmp t
  ON  c.module = t.module AND c.clazz = t.clazz AND c.type = t.type AND c.`key` = t.`key`
SET c.name = t.name, c.field = t.field, c.value = t.value;

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM manifest_status_constant_tmp t
LEFT JOIN communion.constant c
  ON  c.module = t.module AND c.clazz = t.clazz AND c.type = t.type AND c.`key` = t.`key`
WHERE c.cid IS NULL;

DROP TEMPORARY TABLE IF EXISTS manifest_status_constant_tmp;

SELECT clazz, `key`, value, field FROM communion.constant
WHERE module='inventory' AND type='status' AND clazz IN ('manifest','manifestTemplate')
ORDER BY clazz, `key`;
