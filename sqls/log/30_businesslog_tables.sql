-- =====================================================================
-- 业务日志整合 DDL：三块业务日志迁移到 log schema
-- Phase 7：客户电话查询日志 + 图纸下载日志 + 金蝶同步日志
--
-- 设计原则：
--   - 在 log schema 下新建三张专用表，保留原表不动（不删除）
--   - 新表 = 原表字段 + log 模块通用字段（traceId/ip/companyId）
--   - operateUserId 统一用 String（userId），与 actionLog 对齐
--   - 原表 @ManyToOne UserPO 关联改为裸字段（避免跨 catalog 外键）
--   - 历史数据一次性 INSERT 迁移
--
-- 兼容性：
--   - 新增字段允许 NULL，存量迁移数据通用字段为 NULL（可接受）
--   - 原表保留，代码切换后原表不再有新写入，仅作历史备份
-- =====================================================================

USE `log`;

-- ---------------------------------------------------------------------
-- 1. 客户电话查询日志表（迁移自 communion.customerrecord）
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `customerPhoneLog` (
  `cplId` int(11) NOT NULL AUTO_INCREMENT,
  `cid` bigint(20) NOT NULL COMMENT '客户ID',
  `cpid` bigint(20) NOT NULL DEFAULT 0 COMMENT '客户电话ID',
  `type` smallint(6) NOT NULL DEFAULT 0 COMMENT '操作类型 0=查询',
  `operateUserId` varchar(32) NULL COMMENT '操作人账号（原ouid转为userId）',
  `operateTime` timestamp NULL COMMENT '操作时间',
  `comment` varchar(255) NULL COMMENT '备注',
  `traceId` varchar(64) NULL COMMENT '链路追踪ID',
  `ip` varchar(45) NULL COMMENT '来源IP',
  `companyId` int(11) NULL COMMENT '所属公司',
  PRIMARY KEY (`cplId`),
  KEY `idx_cid_time` (`cid`, `operateTime`),
  KEY `idx_operateUserId_time` (`operateUserId`, `operateTime`),
  KEY `idx_operateTime` (`operateTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户电话查询日志（迁移自communion.customerrecord）';


-- ---------------------------------------------------------------------
-- 2. 图纸下载日志表（迁移自 decoration.decorationpicturerecord）
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `decorationPictureLog` (
  `dplId` int(11) NOT NULL AUTO_INCREMENT,
  `dpId` bigint(20) NOT NULL COMMENT '图纸/合同文件ID',
  `orderId` varchar(32) NULL COMMENT '装修订单号（新增，便于按订单查询）',
  `operateUserId` varchar(32) NULL COMMENT '操作人账号（原ouid转为userId）',
  `operateTime` timestamp NULL COMMENT '操作时间',
  `traceId` varchar(64) NULL COMMENT '链路追踪ID',
  `ip` varchar(45) NULL COMMENT '来源IP',
  `companyId` int(11) NULL COMMENT '所属公司',
  PRIMARY KEY (`dplId`),
  KEY `idx_dpId_time` (`dpId`, `operateTime`),
  KEY `idx_orderId_time` (`orderId`, `operateTime`),
  KEY `idx_operateUserId_time` (`operateUserId`, `operateTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=Compact COMMENT='图纸下载日志（迁移自decoration.decorationpicturerecord）';


-- ---------------------------------------------------------------------
-- 3. 金蝶同步日志表（迁移自 platform.kingdeeRecord）
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kingdeeSyncLog` (
  `kslId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NULL COMMENT '装修订单号',
  `rtid` bigint(20) NOT NULL DEFAULT 0 COMMENT '收据ID',
  `atttype` smallint(6) NOT NULL DEFAULT 0 COMMENT '属性/收款类型',
  `type` varchar(64) NULL COMMENT '款项类型',
  `message` varchar(1000) NULL COMMENT '错误信息/同步结果',
  `createTime` timestamp NULL COMMENT '创建时间',
  `operateUserId` varchar(32) NULL COMMENT '操作人账号（新增）',
  `traceId` varchar(64) NULL COMMENT '链路追踪ID',
  `ip` varchar(45) NULL COMMENT '来源IP',
  `companyId` int(11) NULL COMMENT '所属公司',
  PRIMARY KEY (`kslId`),
  KEY `idx_orderId_time` (`orderId`, `createTime`),
  KEY `idx_rtid` (`rtid`),
  KEY `idx_createTime` (`createTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=Compact COMMENT='金蝶同步日志（迁移自platform.kingdeeRecord）';


-- =====================================================================
-- 历史数据迁移（可选，首次部署时执行一次）
-- =====================================================================

-- 1. 客户电话查询日志：communion.customerrecord → log.customerPhoneLog
--    注意：ouid（数字UID）需转为 userId 字符串，这里先迁裸值，userId 由运维核对后 UPDATE
-- INSERT INTO log.customerPhoneLog (cid, cpid, type, operateUserId, operateTime, comment)
-- SELECT cr.cid, cr.cpid, cr.type, CAST(cr.ouid AS CHAR), cr.operateTime, cr.comment
-- FROM communion.customerrecord cr;

-- 2. 图纸下载日志：decoration.decorationpicturerecord → log.decorationPictureLog
-- INSERT INTO log.decorationPictureLog (dpId, operateUserId, operateTime)
-- SELECT dpr.dpid, CAST(dpr.ouid AS CHAR), dpr.operateTime
-- FROM decoration.decorationpicturerecord dpr;

-- 3. 金蝶同步日志：platform.kingdeeRecord → log.kingdeeSyncLog
-- INSERT INTO log.kingdeeSyncLog (orderId, rtid, atttype, type, message, createTime)
-- SELECT kr.orderId, kr.rtid, kr.atttype, kr.type, kr.message, kr.createTime
-- FROM platform.kingdeeRecord kr;
