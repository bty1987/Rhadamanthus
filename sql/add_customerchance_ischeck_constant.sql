-- ========================================
-- 客户机会 isCheck 字段数据字典常量
-- 创建时间: 2025-12-31
-- 说明: 用于客户机会验证状态的枚举值
-- ========================================

-- 插入 isCheck 字段常量数据
INSERT INTO `constant` (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`)
VALUES
('验证中', 'customer', 'customerChance', 'isCheck', 'isCheck', '0', '验证中', 0),
('已忽略', 'customer', 'customerChance', 'isCheck', 'isCheck', '1', '已忽略', 0);

-- ========================================
-- 字段说明
-- ========================================
-- module: 'customer'        - 客户模块
-- clazz: 'customerChance'   - 客户机会类
-- type: 'isCheck'           - 字段类型
-- field: 'isCheck'          - 字段名
-- key: '0'/'1'              - 枚举键值
-- value: '验证中'/'已忽略'  - 显示文本
-- status: 0                 - 状态(0:启用, 1:禁用)

-- ========================================
-- 前端使用方式
-- ========================================
-- JavaScript 访问路径：
-- constant.customer().customerChance.isCheck.keys
--
-- 返回格式：
-- [
--   {"key":"0", "value":"验证中"},
--   {"key":"1", "value":"已忽略"}
-- ]

-- ========================================
-- 验证查询
-- ========================================
-- 查询已插入的常量数据
-- SELECT * FROM `constant`
-- WHERE `module` = 'customer'
--   AND `clazz` = 'customerChance'
--   AND `type` = 'isCheck'
-- ORDER BY `key`;
