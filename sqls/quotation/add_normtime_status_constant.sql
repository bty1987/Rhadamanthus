-- ========================================
-- 定额工期 status 字段数据字典常量
-- 创建时间: 2025-12-31
-- 说明: 用于定额工期状态的枚举值
-- ========================================

-- 插入 status 字段常量数据
INSERT INTO `constant` (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`)
VALUES
('有效', 'data', 'normtime', 'status', 'status', '0', '有效', 0),
('无效', 'data', 'normtime', 'status', 'status', '1', '无效', 0);

-- ========================================
-- 字段说明
-- ========================================
-- module: 'data'         - 数据字典模块
-- clazz: 'normtime'      - 定额工期类
-- type: 'status'         - 字段类型
-- field: 'status'        - 字段名
-- key: '0'/'1'           - 枚举键值
-- value: '有效'/'无效'   - 显示文本
-- status: 0              - 常量状态(0:启用, 1:禁用)

-- ========================================
-- 前端使用方式
-- ========================================
-- JavaScript 访问路径：
-- constant.data().normtime.status.datas
--
-- 返回格式：
-- [
--   {"key":"0", "value":"有效"},
--   {"key":"1", "value":"无效"}
-- ]

-- ========================================
-- 验证查询
-- ========================================
-- 查询已插入的常量数据
-- SELECT * FROM `constant`
-- WHERE `module` = 'data'
--   AND `clazz` = 'normtime'
--   AND `type` = 'status'
-- ORDER BY `key`;
