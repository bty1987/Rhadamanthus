-- =============================================
-- 初始化装饰图片状态常量数据
-- 文件名: init_decoration_picture_status.sql
-- 说明: 为装饰订单图片的状态字段添加常量定义
-- 创建日期: 2025-12-11
-- =============================================

-- 使用 communion 数据库
USE communion;

-- 插入装饰图片状态常量
-- module: decoration (装饰模块)
-- clazz: decorationPicture (图片类)
-- type: status (状态类型)
-- field: 具体状态标识 (status_hidden/status_show/status_confirmed)
-- status: 0 (启用状态)

INSERT INTO `constant` (
    `name`,
    `module`,
    `clazz`,
    `type`,
    `field`,
    `key`,
    `value`,
    `status`
) VALUES
-- 图片状态: 0-隐藏
(
    '装饰图片状态-隐藏',
    'decoration',
    'decorationPicture',
    'status',
    'status_hidden',
    '0',
    '隐藏',
    0
),
-- 图片状态: 1-显示
(
    '装饰图片状态-显示',
    'decoration',
    'decorationPicture',
    'status',
    'status_show',
    '1',
    '显示',
    0
),
-- 图片状态: 4-已确认
(
    '装饰图片状态-已确认',
    'decoration',
    'decorationPicture',
    'status',
    'status_confirmed',
    '4',
    '已确认',
    0
);

-- 验证插入的数据
SELECT
    cid AS 'ID',
    name AS '名称',
    module AS '模块',
    clazz AS '类',
    type AS '类型',
    field AS '字段标识',
    `key` AS '键',
    value AS '值',
    status AS '状态'
FROM `constant`
WHERE module = 'decoration'
  AND clazz = 'decorationPicture'
  AND type = 'status'
ORDER BY `key` + 0;
