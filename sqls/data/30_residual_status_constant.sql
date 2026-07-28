-- ==========================================
-- 收尾批次：补录 status 枚举常量（PO 已有/已补枚举）
-- 表: communion.constant
-- ==========================================
-- 数据来源(PO 的 STATUS_* 常量):
--   1. buildingSchedule(building): BuildingSchedulePO (0初始/1失效/2完结)
--   2. customerAfterSales(customer): CustomerAfterSalesPO (0初始/1接收/2分派/3处理/4确认/5完结/6关闭/7取消/8挂起)
--   3. inventoryDrawing(inventory): InventoryDrawingPO (0初始)
--   4. productionWorkFlow(production): ProductionWorkFlowPO (0初始/1执行)
--   5. soods(data): SoodsPO (0有效/1无效)
--   6. cormrice(data): CormricePO (0有效/1无效, 本次补 STATUS_INVALID_STR)
--
-- 幂等 upsert。
-- ==========================================

DROP TEMPORARY TABLE IF EXISTS residual2_status_tmp;
CREATE TEMPORARY TABLE residual2_status_tmp (
  name varchar(32) NOT NULL, module varchar(64) NOT NULL, clazz varchar(64) NOT NULL,
  type varchar(64) NOT NULL, field varchar(64) NULL, `key` varchar(64) NOT NULL,
  value varchar(64) NULL, status tinyint(1) NOT NULL
);

INSERT INTO residual2_status_tmp (name, module, clazz, type, field, `key`, value, status) VALUES
-- buildingSchedule（施工进度: 0初始 1失效 2完结）
('初始(进度状态)', 'building', 'buildingSchedule', 'status', 'STATUS_INIT_SHORT', '0', '初始', 0),
('失效(进度状态)', 'building', 'buildingSchedule', 'status', 'STATUS_DISABLE_SHORT', '1', '失效', 0),
('完结(进度状态)', 'building', 'buildingSchedule', 'status', 'STATUS_END_SHORT', '2', '完结', 0),

-- customerAfterSales（售后工单: 完整9态）
('初始(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_INIT_INT', '0', '初始', 0),
('接收(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_RECEIVE_INT', '1', '接收', 0),
('分派(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_DISPATCH_INT', '2', '分派', 0),
('处理(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_HANDLE_INT', '3', '处理', 0),
('确认(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_CONFIRM_INT', '4', '确认', 0),
('完结(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_FINISH_INT', '5', '完结', 0),
('关闭(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_CLOSE_INT', '6', '关闭', 0),
('取消(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_CANCEL_INT', '7', '取消', 0),
('挂起(售后状态)', 'customer', 'customerAfterSales', 'status', 'STATUS_HOLD_INT', '8', '挂起', 0),

-- inventoryDrawing（清单图纸: 0初始）
('初始(图纸状态)', 'inventory', 'inventoryDrawing', 'status', 'STATUS_INIT_INT', '0', '初始', 0),

-- productionWorkFlow（生产工序流: 0初始 1执行）
('初始(工序状态)', 'production', 'productionWorkFlow', 'status', 'STATUS_INIT_INT', '0', '初始', 0),
('执行(工序状态)', 'production', 'productionWorkFlow', 'status', 'STATUS_OPERATED_INT', '1', '执行', 0),

-- soods（商品: 0有效 1无效）
('有效(商品状态)', 'data', 'soods', 'status', 'STATUS_VALID_INT', '0', '有效', 0),
('无效(商品状态)', 'data', 'soods', 'status', 'STATUS_INVALID_INT', '1', '无效', 0),

-- cormrice（定额米数: 0有效 1无效）
('有效(定额状态)', 'data', 'cormrice', 'status', 'STATUS_VALID_STR', '0', '有效', 0),
('无效(定额状态)', 'data', 'cormrice', 'status', 'STATUS_INVALID_STR', '1', '无效', 0);

UPDATE communion.constant c
INNER JOIN residual2_status_tmp t
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
SET c.name=t.name, c.field=t.field, c.value=t.value;

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT t.name, t.module, t.clazz, t.type, t.field, t.`key`, t.value, t.status
FROM residual2_status_tmp t
LEFT JOIN communion.constant c
  ON c.module=t.module AND c.clazz=t.clazz AND c.type=t.type AND c.`key`=t.`key`
WHERE c.cid IS NULL;

DROP TEMPORARY TABLE IF EXISTS residual2_status_tmp;
SELECT module, clazz, `key`, value FROM communion.constant
WHERE type='status' AND (
  (module='building' AND clazz='buildingSchedule')
  OR (module='customer' AND clazz='customerAfterSales')
  OR (module='inventory' AND clazz='inventoryDrawing')
  OR (module='production' AND clazz='productionWorkFlow')
  OR (module='data' AND clazz IN ('soods','cormrice'))
) ORDER BY module, clazz, `key`;
