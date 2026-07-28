-- ==========================================
-- material / system 模块补录 status 枚举常量
-- 表: communion.constant
-- ==========================================
-- 背景:
--   material/system 模块在 constant 表完全空白, PO 有 STATUS 枚举, 本脚本补录。
--
-- 数据来源:
--   1. materialBalance(主材结算): MaterialBalancePO (0预结 STATUS_PRE_BALANCE_INT / 1厂结 STATUS_VENDER_BALANCE_INT / 2结算 STATUS_FINISH_INT)
--   2. company(公司): CompanyPO (0启用 STATUS_ENABLE_INT)
--   3. version(版本): VersionPO (0启用 STATUS_ENABLED_INT / 1禁用 STATUS_DISABLED_INT)
--
-- 未补录:
--   - materialModel: MaterialModelPO 无 STATUS 枚举(仅 COLUMN_STATUS_STR), 保留
--   - upgradePackage: 无对应 PO 或枚举, 保留
--   - company4config: data 对象非 company, 语义待确认, 保留
--
-- 幂等 upsert(临时表 + JOIN UPDATE + LEFT JOIN INSERT)。
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS material_system_status_tmp;
CREATE TEMPORARY TABLE material_system_status_tmp (
  name varchar(32) NOT NULL, module varchar(64) NOT NULL, clazz varchar(64) NOT NULL,
  type varchar(64) NOT NULL, field varchar(64) NULL, `key` varchar(64) NOT NULL,
  value varchar(64) NULL, status tinyint(1) NOT NULL
);

INSERT INTO material_system_status_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
-- materialBalance（主材结算: 0预结 1厂结 2结算）
('预结(结算状态)', 'material', 'materialBalance', 'status', 'STATUS_PRE_BALANCE_INT', '0', '预结', 0),
('厂结(结算状态)', 'material', 'materialBalance', 'status', 'STATUS_VENDER_BALANCE_INT', '1', '厂结', 0),
('结算(结算状态)', 'material', 'materialBalance', 'status', 'STATUS_FINISH_INT', '2', '结算', 0),

-- company（公司: 0启用）
('启用(公司状态)', 'system', 'company', 'status', 'STATUS_ENABLE_INT', '0', '启用', 0),

-- version（版本: 0启用 1禁用）
('启用(版本状态)', 'system', 'version', 'status', 'STATUS_ENABLED_INT', '0', '启用', 0),
('禁用(版本状态)', 'system', 'version', 'status', 'STATUS_DISABLED_INT', '1', '禁用', 0);

UPDATE communion.constant c
INNER JOIN material_system_status_tmp t
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
SET c.name=t.name, c.field=t.field, c.value=t.value;

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM material_system_status_tmp t
LEFT JOIN communion.constant c
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
WHERE c.cid IS NULL;

DROP TEMPORARY TABLE IF EXISTS material_system_status_tmp;
SELECT module, clazz, `key`, value, field FROM communion.constant
WHERE type='status' AND ((module='material' AND clazz='materialBalance') OR (module='system' AND clazz IN ('company','version')))
ORDER BY module, clazz, `key`;
