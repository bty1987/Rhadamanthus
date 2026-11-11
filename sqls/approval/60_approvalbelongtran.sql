-- =====================================================================
-- 60_approvalbelongtran.sql
-- 用途: 人员离职归属移交审批(type=27)两张子表建表
--       approval.approvalbelongtran     移交单主行(一人一组一张审批)
--       approval.approvalbelongtranitem 移交明细(单号×归属类型→接手人+rate+默认人, modal人工编辑值)
-- 执行前置: 无(纯新表, 不触碰存量); approval 库
-- 回滚方式: DROP TABLE IF EXISTS approval.approvalbelongtranitem, approval.approvalbelongtran;
-- 验证语句: SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA='approval' AND TABLE_NAME IN ('approvalbelongtran','approvalbelongtranitem'); -- 期望 2
-- 幂等: CREATE TABLE IF NOT EXISTS, 可重复执行
-- =====================================================================

CREATE TABLE IF NOT EXISTS `approvalbelongtran` (
  `abtId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL COMMENT '审批主表aid',
  `ouid` int(11) NOT NULL COMMENT '原移交人user.uId',
  `tranType` tinyint(1) NOT NULL DEFAULT 0 COMMENT '移交类型,0:设计,1:业务,2:两者',
  `reason` varchar(255) NULL COMMENT '移交原因',
  `ccid` bigint(20) NOT NULL DEFAULT 0 COMMENT '客户机会ID冗余(预留)',
  `company` int(11) NOT NULL COMMENT '公司',
  `createTime` datetime NULL COMMENT '创建时间',
  PRIMARY KEY (`abtId`),
  KEY `indexaid` (`aId`) USING BTREE,
  KEY `indexouid` (`ouid`, `company`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=Compact COMMENT='人员离职归属移交审批主表';

CREATE TABLE IF NOT EXISTS `approvalbelongtranitem` (
  `abtiId` int(11) NOT NULL AUTO_INCREMENT,
  `abtId` int(11) NOT NULL COMMENT '移交主表abtId',
  `orderId` varchar(32) NOT NULL COMMENT '装修单号',
  `belongType` tinyint(1) NOT NULL COMMENT '归属类型,0:设计,1:业务',
  `buid` int(11) NOT NULL COMMENT '接手人user.uId',
  `bdid` int(11) NOT NULL COMMENT '接手人部门ID(提交快照,物化以实时为准)',
  `brid` int(11) NOT NULL COMMENT '接手人分区ID(提交快照,物化以实时为准)',
  `rate` int(5) NOT NULL COMMENT '归属比例千分率(modal人工编辑,0~1000)',
  `defaultFlag` tinyint(1) NOT NULL DEFAULT 0 COMMENT '默认人标记(modal人工勾选)',
  PRIMARY KEY (`abtiId`),
  KEY `indexabt` (`abtId`) USING BTREE,
  KEY `indexorderId` (`orderId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=Compact COMMENT='人员离职归属移交审批明细表';
