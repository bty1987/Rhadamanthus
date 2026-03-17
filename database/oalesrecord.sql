-- 外销单操作记录表
-- 用于记录外销单(oales)和外销单支付(oalespay)的所有操作历史
-- 创建日期: 2026-03-17

CREATE TABLE IF NOT EXISTS `sales`.`oalesrecord` (
  `orid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `oid` BIGINT(20) NOT NULL COMMENT '外销单ID',
  `opid` BIGINT(20) DEFAULT NULL COMMENT '支付记录ID(支付相关操作时填写)',
  `ouid` BIGINT(20) NOT NULL COMMENT '操作人ID',
  `operateTime` DATETIME NOT NULL COMMENT '操作时间',
  `type` SMALLINT(6) NOT NULL COMMENT '操作类型: 1-新增 2-更新 3-提交 4-取消 5-确认 6-驳回 7-复核 8-完结 9-废单 10-退款 11-删除 12-活动 13-添加支付 14-更新支付 15-删除支付',
  `comment` VARCHAR(500) DEFAULT NULL COMMENT '备注说明',
  `beforeStatus` SMALLINT(6) DEFAULT NULL COMMENT '操作前状态',
  `afterStatus` SMALLINT(6) DEFAULT NULL COMMENT '操作后状态',
  `ip` VARCHAR(50) DEFAULT NULL COMMENT '操作人IP地址',
  PRIMARY KEY (`orid`),
  KEY `idx_oid` (`oid`),
  KEY `idx_opid` (`opid`),
  KEY `idx_ouid` (`ouid`),
  KEY `idx_operateTime` (`operateTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外销单操作记录表';
