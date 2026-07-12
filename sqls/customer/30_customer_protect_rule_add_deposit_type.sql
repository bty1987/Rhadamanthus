-- =============================================
-- 客户保护规则添加定金类型和岗位类型常量
-- =============================================
-- 文档编号: SQL-2026-002
-- 创建日期: 2026-04-08
-- 描述: 在 constant 表中添加定金类型（预付款+设计费）和岗位类型
-- =============================================

-- 添加定金类型常量
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
VALUES ('定金', 'customer', 'customerProtectRule', 'type', 'TYPE_DEPOSIT_SHORT', '3', '定金', 0);

-- 添加岗位类型常量
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
VALUES ('岗位', 'customer', 'customerProtectRule', 'type', 'TYPE_DUTY_SHORT', '4', '岗位', 0);

-- 验证插入
SELECT * FROM communion.constant
WHERE module = 'customer'
  AND clazz = 'customerProtectRule'
  AND type = 'type'
ORDER BY `key`;
