-- =====================================================================
-- 用途: 辅材费用表 data.aoodscharge 建表（幂等，可重复执行）
--   存储辅材(data.aoods)的费用项明细：运输费/安装费/上楼费等；
--   费用以本表行为唯一事实源（data.aoods 不落费用列，2026-10-26 用户定调）
-- 执行前置条件:
--   1. 目标库 data 存在且可写
--   2. 首次执行即建表；若已存在同名表，本脚本不动其结构与数据
--      （如存量表结构与本文件不一致，需人工核对差异，勿依赖本脚本做结构迁移）
-- 回滚方式:
--   DROP TABLE data.aoodscharge;  -- 仅当确认表内无有效数据时
-- 验证语句:
--   SHOW CREATE TABLE data.aoodscharge;
--   SELECT aid, COUNT(*) FROM data.aoodscharge GROUP BY aid LIMIT 10;
-- =====================================================================

CREATE TABLE IF NOT EXISTS `data`.`aoodscharge` (
  `acid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `aid` BIGINT(20) NOT NULL COMMENT '辅材ID（关联data.aoods.aid）',
  `name` VARCHAR(100) NOT NULL COMMENT '费用名称',
  `price` INT(11) NOT NULL DEFAULT 0 COMMENT '价格（厘，×1000）',
  `surplus` INT(11) NOT NULL DEFAULT 0 COMMENT '浮动额（厘，×1000）',
  `type` SMALLINT(6) NOT NULL DEFAULT 0 COMMENT '类型：0-通用，1-超阶',
  `status` SMALLINT(6) NOT NULL DEFAULT 0 COMMENT '状态：0-启用，1-禁用',
  `sort` INT(11) NOT NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`acid`),
  KEY `idx_aid` (`aid`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='辅材费用表';

-- =============================================
-- 字段说明
-- =============================================
-- acid: 主键ID，自增
-- aid: 辅材ID，外键关联data.aoods表
-- name: 费用名称，如"运输费"、"安装费"、"上楼费"等
-- price: 价格，单位为厘(×1000)，存储实际向客户收取的金额
-- surplus: 浮动额，单位为厘(×1000)，存储可浮动的价格范围
-- type: 费用类型，0-通用费用，1-超阶费用（超出标准范围后的额外费用）
-- status: 状态，0-启用，1-禁用
-- sort: 排序，用于前端显示顺序
--
-- 索引: idx_aid 按辅材取费用列表 / idx_status 过滤启用 / idx_type 按类型查询
