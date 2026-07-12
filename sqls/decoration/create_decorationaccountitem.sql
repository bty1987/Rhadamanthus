CREATE TABLE IF NOT EXISTS `decoration`.`decorationaccountitem` (
  `daiid` int(11) NOT NULL AUTO_INCREMENT,
  `daid` int(11) NOT NULL DEFAULT 0 COMMENT '决算ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `type` tinyint(2) NOT NULL DEFAULT 0 COMMENT '类型: 0预签,1报价,2扩展,3合同,4主材,5外销,6增减,7预付款,8决算',
  `subtype` tinyint(2) NOT NULL DEFAULT 0 COMMENT '子类型',
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT '明细名称',
  `sourceType` tinyint(2) NOT NULL DEFAULT 0 COMMENT '来源类型',
  `sourceId` bigint(20) NOT NULL DEFAULT 0 COMMENT '来源ID',
  `money` bigint(10) NOT NULL DEFAULT 0 COMMENT '金额',
  `rate` int(8) NOT NULL DEFAULT 0 COMMENT '比例/折扣/配比',
  `sort` int(5) NOT NULL DEFAULT 0 COMMENT '排序',
  `content` varchar(512) NOT NULL DEFAULT '' COMMENT '内容快照',
  `comment` varchar(128) NOT NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`daiid`),
  KEY `indexone` (`daid`),
  KEY `indextwo` (`orderId`),
  KEY `indexthree` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='决算明细';
