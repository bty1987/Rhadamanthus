-- ==========================================
-- 收尾批次3：B1/B2/B3/B4/B7 补录 status 枚举
-- ==========================================
-- 数据来源(PO 已补/已有):
--   1. purchaseBalance(inventory): PurchaseBalancePO (0初始 STATUS_INIT_INT[本次补] / 1已付款 STATUS_DONE_INT)
--   2. productionPlan(production): ProductionPlanPO (0初始/1完结[已录] + 2失效 STATUS_INVALID_INT[本次补])
--   3. quotationVersion(data): QuotationVersionPO (0启用 STATUS_ENABLE_INT[已有] + 1禁用 STATUS_DISABLE_INT[本次补])
--   4. upgradePackage(system): UpgradePackagePO (0初始 STATUS_INIT_INT[本次补] / 1上线 STATUS_ONLINE_INT[本次补])
--
-- 幂等 upsert。
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS residual3_status_tmp;
CREATE TEMPORARY TABLE residual3_status_tmp (
  name varchar(32) NOT NULL, module varchar(64) NOT NULL, clazz varchar(64) NOT NULL,
  type varchar(64) NOT NULL, field varchar(64) NULL, `key` varchar(64) NOT NULL,
  value varchar(64) NULL, status tinyint(1) NOT NULL
);

INSERT INTO residual3_status_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
-- purchaseBalance（采购结算: 0初始 1已付款）
('初始(结算状态)', 'inventory', 'purchaseBalance', 'status', 'STATUS_INIT_INT', '0', '初始', 0),
('已付款(结算状态)', 'inventory', 'purchaseBalance', 'status', 'STATUS_DONE_INT', '1', '已付款', 0),

-- productionPlan（生产计划: 0初始 1完结 已录，补 2失效）
('失效(计划状态)', 'production', 'productionPlan', 'status', 'STATUS_INVALID_INT', '2', '失效', 0),

-- quotationVersion（报价版本: 0启用 已有，补 1禁用）
('禁用(版本状态)', 'data', 'quotationVersion', 'status', 'STATUS_DISABLE_INT', '1', '禁用', 0),

-- upgradePackage（升级包: 0初始 1上线 2下线）
('初始(升级包状态)', 'system', 'upgradePackage', 'status', 'STATUS_INIT_INT', '0', '初始', 0),
('上线(升级包状态)', 'system', 'upgradePackage', 'status', 'STATUS_ONLINE_INT', '1', '上线', 0),
('下线(升级包状态)', 'system', 'upgradePackage', 'status', 'STATUS_OFFLINE_INT', '2', '下线', 0);

UPDATE communion.constant c
INNER JOIN residual3_status_tmp t
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
SET c.name=t.name, c.field=t.field, c.value=t.value;

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM residual3_status_tmp t
LEFT JOIN communion.constant c
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
WHERE c.cid IS NULL;

DROP TEMPORARY TABLE IF EXISTS residual3_status_tmp;
SELECT module, clazz, `key`, value FROM communion.constant
WHERE type='status' AND (
  (module='inventory' AND clazz='purchaseBalance')
  OR (module='production' AND clazz='productionPlan' AND `key`='2')
  OR (module='data' AND clazz='quotationVersion' AND `key`='1')
  OR (module='system' AND clazz='upgradePackage')
) ORDER BY module, clazz, `key`;
-- upgradePackage 验证(含2下线)
SELECT `key`, value FROM communion.constant
WHERE module='system' AND clazz='upgradePackage' AND type='status' ORDER BY `key`;
