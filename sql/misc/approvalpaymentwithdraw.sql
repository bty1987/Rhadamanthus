-- 审批-预付款提现子表
CREATE TABLE IF NOT EXISTS `approval`.`approvalpaymentwithdraw` (
  `apwId` bigint(20) NOT NULL AUTO_INCREMENT,
  `aid` bigint(20) DEFAULT NULL COMMENT '审批主表ID',
  `orderId` varchar(50) DEFAULT NULL COMMENT '装修订单号',
  `paymentType` smallint(6) DEFAULT NULL COMMENT '款项类型:0合同/1工程/2主材/3正林',
  `amount` bigint(20) DEFAULT NULL COMMENT '提现金额',
  `comment` varchar(200) DEFAULT NULL COMMENT '提现说明',
  `status` int(11) DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`apwId`),
  KEY `idx_aid` (`aid`),
  KEY `idx_orderId` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批-预付款提现子表';
