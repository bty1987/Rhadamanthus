-- =============================================
-- 辅材费用表 (aoodscharge)
-- =============================================
-- 数据库: data
-- 表名: aoodscharge
-- 描述: 存储辅材的费用信息
-- 作者: AI
-- 创建日期: 2026-03-22
-- =============================================

DROP TABLE IF EXISTS `data`.`aoodscharge`;

CREATE TABLE `data`.`aoodscharge` (
  `acid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `aid` BIGINT(20) NOT NULL COMMENT '辅材ID（关联data.aoods.aid）',
  `name` VARCHAR(100) NOT NULL COMMENT '费用名称',
  `price` INT(11) NOT NULL DEFAULT 0 COMMENT '价格（分）',
  `surplus` INT(11) NOT NULL DEFAULT 0 COMMENT '浮动额（分）',
  `type` SMALLINT(6) NOT NULL DEFAULT 0 COMMENT '类型：0-通用，1-超阶',
  `status` SMALLINT(6) NOT NULL DEFAULT 0 COMMENT '状态：0-启用，1-禁用',
  `sort` INT(11) NOT NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`acid`),
  KEY `idx_aid` (`aid`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='辅材费用表';

-- =============================================
-- 初始化数据（可选）
-- =============================================

-- 示例：为辅材ID=1001添加费用项
-- INSERT INTO `data`.`aoodscharge` (`aid`, `name`, `price`, `surplus`, `type`, `status`, `sort`)
-- VALUES
-- (1001, '运输费', 500, 100, 0, 0, 1),
-- (1001, '安装费', 1000, 200, 0, 0, 2),
-- (1001, '上楼费', 300, 0, 1, 0, 3);

-- =============================================
-- 索引说明
-- =============================================
-- idx_aid: 辅材ID索引，用于快速查询某个辅材的费用列表
-- idx_status: 状态索引，用于过滤启用的费用项
-- idx_type: 类型索引，用于按类型查询费用项

-- =============================================
-- 字段说明
-- =============================================
-- acid: 主键ID，自增
-- aid: 辅材ID，外键关联data.aoods表
-- name: 费用名称，如"运输费"、"安装费"、"上楼费"等
-- price: 价格，单位为分，存储实际向客户收取的金额
-- surplus: 浮动额，单位为分，存储可浮动的价格范围
-- type: 费用类型，0-通用费用，1-超阶费用（超出标准范围后的额外费用）
-- status: 状态，0-启用，1-禁用
-- sort: 排序，用于前端显示顺序
