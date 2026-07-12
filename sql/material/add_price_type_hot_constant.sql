-- ========================================
-- 商品价格类型常量数据 - 添加热卖类型
-- ========================================
-- 表名: communion.constant
-- 模块: data
-- 类: price
-- 类型: type
-- 说明: 0-正价, 1-特价, 2-热卖
-- 执行日期: 2026-03-09
-- ========================================

USE `communion`;

-- 插入价格类型常量数据（包含正价、特价、热卖）
INSERT INTO `constant` (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`) VALUES
('正价', 'data', 'price', 'type', 'type', '0', '正价', 0),
('特价', 'data', 'price', 'type', 'type', '1', '特价', 0),
('热卖', 'data', 'price', 'type', 'type', '2', '热卖', 0)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `value` = VALUES(`value`),
  `status` = VALUES(`status`);

-- ========================================
-- 字段说明
-- ========================================
-- module: 'data'      - 数据字典模块
-- clazz: 'price'      - 价格类
-- type: 'type'        - 价格类型
-- field: 'type'       - 字段名
-- key: '2'            - 枚举键值
-- value: '热卖'       - 显示文本
-- status: 0           - 状态(0:启用, 1:禁用)

-- ========================================
-- 前端使用方式
-- ========================================
-- JavaScript 访问路径：
-- constant.data().price.type.datas
--
-- 返回格式：
-- [
--   {"key":"0", "value":"正价"},
--   {"key":"1", "value":"特价"},
--   {"key":"2", "value":"热卖"}
-- ]

-- ========================================
-- 验证查询
-- ========================================
-- 查询所有价格类型常量数据
SELECT c.*
FROM `constant` c
WHERE c.`module` = 'data'
  AND c.`clazz` = 'price'
  AND c.`type` = 'type'
ORDER BY c.`key` + 0;
