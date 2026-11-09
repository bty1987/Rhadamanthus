-- ============================================================
-- 01_salesoperate_create.sql 销售单操作记录表 (sales.salesoperate)
-- 用途: sales 高权限操作留痕(废单/恢复/完结/反付款/归属变更/活动标记/删明细/明细结算改),
--      对齐 decoration.decorationoperate 专表模式; 此前 terminalSales/updateSalesForAdvance
--      等操作零痕迹(actionlog 不在埋点名单), 追溯无门(2606270870 案例, 2026-11-09)
-- 前置: 无; 配套 jar=fanglin-sales-8.3.031(含8处埋点)先建表后部署(建表先行, 空表不炸)
-- 回滚: DROP TABLE sales.salesoperate (仅存审计记录, 删前确认无追溯需求)
-- 验证: SELECT COUNT(*) FROM sales.salesoperate; -- 随操作增长; 触发8操作后应有行
-- 幂等: CREATE TABLE IF NOT EXISTS
-- ============================================================

CREATE TABLE IF NOT EXISTS `sales`.`salesoperate` (
  `soid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `sid` bigint(20) NOT NULL DEFAULT '0' COMMENT '销售单id(sales.sales.sid)',
  `no` varchar(32) NOT NULL DEFAULT '' COMMENT '销售单编号快照',
  `orderId` varchar(15) NOT NULL DEFAULT '' COMMENT '装修单号',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '动作: 1废单 2恢复 3完结 4反付款 5归属变更 6活动标记 7删明细 8明细结算修改',
  `ouid` int(11) DEFAULT NULL COMMENT '操作人uid(communion.user.uid)',
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `comment` varchar(256) NOT NULL DEFAULT '' COMMENT '摘要(前后状态/对象等)',
  `company` int(11) NOT NULL DEFAULT '0' COMMENT '公司快照',
  PRIMARY KEY (`soid`),
  KEY `idx_sid` (`sid`),
  KEY `idx_orderId` (`orderId`),
  KEY `idx_company_type` (`company`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售单操作记录表';
