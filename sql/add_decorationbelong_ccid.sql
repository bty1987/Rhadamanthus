-- ============================================================
-- 为 DecorationBelong 和 ApprovalDecorationBelong 表添加 ccid 列
-- 用途: 关联客户机会(CustomerChance)表
-- ============================================================

-- 1. decoration.decorationbelong 添加 ccid 字段
ALTER TABLE `decoration`.`decorationbelong` ADD COLUMN `ccid` BIGINT(20) NULL DEFAULT NULL COMMENT '客户机会ID' AFTER `defaultFlag`;

-- 2. approval.approvaldecorationbelong 添加 ccid 字段
ALTER TABLE `approval`.`approvaldecorationbelong` ADD COLUMN `ccid` BIGINT(20) NULL DEFAULT NULL COMMENT '客户机会ID';

-- 3. 添加索引（可选，如果经常按 ccid 查询）
-- ALTER TABLE `decoration`.`decorationbelong` ADD INDEX `idx_ccid` (`ccid`);
-- ALTER TABLE `approval`.`approvaldecorationbelong` ADD INDEX `idx_ccid` (`ccid`);
