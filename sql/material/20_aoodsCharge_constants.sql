-- 辅材费用(aoodsCharge)常量定义
-- 用于 data.aoodscharge 表的状态和类型字段
-- 对应 AoodsChargePO.java 中的常量定义

-- 费用状态常量
INSERT INTO communion.constant (module, clazz, type, field, `key`, value, status)
VALUES
('data', 'aoodsCharge', 'status', 'STATUS_ENABLE_SHORT', 0, '启用', 0),
('data', 'aoodsCharge', 'status', 'STATUS_DISABLE_SHORT', 1, '禁用', 0);

-- 费用类型常量
INSERT INTO communion.constant (module, clazz, type, field, `key`, value, status)
VALUES
('data', 'aoodsCharge', 'type', 'TYPE_COMMON_SHORT', 0, '通用', 0),
('data', 'aoodsCharge', 'type', 'TYPE_UPGRADE_SHORT', 1, '超阶', 0);
