-- =============================================================================
-- 迁移脚本: customeruserruleitem 新增 chance 字段 + type=6(面积轮训) 常量
-- 关联需求: 面积轮训规则, 明细自带机会数, 派中后 chance-1, 归0失效
-- =============================================================================

-- 1. customeruserruleitem 表新增 chance 字段(面积轮训专用机会数)
--    若 cpid(城区id) 字段尚未存在(城区规则 type=4 相关), 一并补齐
ALTER TABLE `customer`.`customeruserruleitem`
  ADD COLUMN `cpid` int(11) NULL COMMENT '城区id' AFTER `did`,
  ADD COLUMN `chance` int(8) NOT NULL DEFAULT 0 COMMENT '机会数(面积轮训专用,每次派单-1,归0失效)' AFTER `lowval`;

-- 注意: 若 cpid 字段已存在, 上面的 ADD COLUMN cpid 会报错, 请改用下方单独语句:
-- ALTER TABLE `customer`.`customeruserruleitem`
--   ADD COLUMN `chance` int(8) NOT NULL DEFAULT 0 COMMENT '机会数(面积轮训专用,每次派单-1,归0失效)' AFTER `lowval`;

-- 2. constant 表新增 type=6(面积轮训) 枚举, 供前端下拉框动态加载
--    字段格式参照现有 type=0~5 记录(module=customer, clazz=customerUserRuleItem, type=type)
INSERT INTO `communion`.`constant` (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`)
VALUES ('人员规则项类型-面积轮训', 'customer', 'customerUserRuleItem', 'type', 'TYPE_AREA_POLLING_INT', '6', '面积轮训', 0);
