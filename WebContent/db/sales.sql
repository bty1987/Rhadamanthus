CREATE DATABASE  IF NOT EXISTS `inventory` ;
USE `inventory`;

DROP TABLE IF EXISTS `refunds`;
CREATE TABLE `refunds` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `spid` int(11) NOT NULL COMMENT '款项ID',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL COMMENT '结算时间',
  `comment` varchar(128) NOT NULL,
  `status` tinyint(2) DEFAULT '0',
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='退货单';

DROP TABLE IF EXISTS `refundsitem`;
CREATE TABLE `refundsitem` (
  `riid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `rid` int(11) NOT NULL COMMENT '退货单ID',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`riid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='退货单';

DROP TABLE IF EXISTS `salesmanifestitem`;
CREATE TABLE `salesmanifestitem` (
  `smiid` int(11) NOT NULL AUTO_INCREMENT,
  `siid` int(11) NOT NULL,
  `miid` int(11) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `surplus` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '余额',
  `type` tinyint(2) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`smiid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='销售采购项';

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `company` tinyint(2) NOT NULL DEFAULT '0',
  `dompany` int(11) NOT NULL,
  `vid` int(11) NOT NULL COMMENT '楼盘ID',
  `houseNumber` varchar(30) NOT NULL COMMENT '楼号',
  `cid` int(11) DEFAULT NULL COMMENT '客户ID',
  `suid` int(11) NOT NULL COMMENT '业务员ID',
  `did` int(11) NOT NULL COMMENT '业务部门ID',
  `rid` int(11) NOT NULL COMMENT '业务分区ID',
  `guid` int(11) DEFAULT NULL COMMENT '导购员ID',
  `gdid` int(11) DEFAULT NULL COMMENT '导购部门ID',
  `iuid` int(11) NOT NULL COMMENT '驻店员ID',
  `category` varchar(32) NOT NULL,
  `brand` varchar(32) NOT NULL,
  `comment` varchar(128) DEFAULT '',
  `createTime` timestamp NULL DEFAULT NULL,
  `balanceTime` timestamp NULL DEFAULT NULL,
  `fullpayTime` timestamp NULL DEFAULT NULL,
  `status` tinyint(2) DEFAULT '0',
  `depositpayStatus` tinyint(2) NOT NULL DEFAULT '-1',
  `fullpayStatus` tinyint(2) DEFAULT '-1',
  `balanceStatus` tinyint(2) DEFAULT '0',
  `otherStatus` tinyint(1) NOT NULL DEFAULT '0',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `maling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `venderMaling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `coupon` decimal(10,3) NOT NULL DEFAULT '0.000',
  `couponInfo` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售单';

DROP TABLE IF EXISTS `salesbalanceitem`;
CREATE TABLE `salesbalanceitem` (
  `sbiid` int(11) NOT NULL AUTO_INCREMENT,
  `sbid` int(11) NOT NULL COMMENT '销售结算ID',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `rawCtype` tinyint(2) NOT NULL COMMENT '原结算方式, 0:底价,1:结算',
  `rawCvalue` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原结算值',
  `ctype` tinyint(2) NOT NULL COMMENT '结算方式',
  `cvalue` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '结算值',
  `num` decimal(10,3) NOT NULL COMMENT '数量',
  `total` decimal(10,3) NOT NULL COMMENT '总价',
  PRIMARY KEY (`sbiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售结算项';

DROP TABLE IF EXISTS `salesitem`;
CREATE TABLE `salesitem` (
  `siid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `purchase` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '进价',
  `selling` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '售价',
  `discount` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折扣',
  `disPrice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折扣价',
  `postDis` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折让',
  `price` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '折让价',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `comment` varchar(128) DEFAULT NULL,
  `rawCtype` tinyint(2) NOT NULL COMMENT '原结算方式',
  `rawCvalue` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '原结算值',
  `ctype` tinyint(2) NOT NULL COMMENT '结算方式',
  `cvalue` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '结算值',
  PRIMARY KEY (`siid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售项';

DROP TABLE IF EXISTS `salesbalance`;
CREATE TABLE `salesbalance` (
  `sbid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单',
  `rid` int(11) DEFAULT NULL COMMENT '退货单',
  `cuid` varchar(32) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `puid` varchar(32) DEFAULT NULL COMMENT '结算人',
  `postTime` timestamp NULL DEFAULT NULL COMMENT '结算时间',
  `venderTime` timestamp NULL DEFAULT NULL COMMENT '厂商结算时间',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '总额',
  `balance` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '预结算值',
  `difference` decimal(10,3) DEFAULT '0.000' COMMENT '差值',
  `vbalance` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '厂商结算',
  `pbalance` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '结算值',
  `type` tinyint(2) NOT NULL COMMENT '类型,0:购货,1:预结算退货,2:结算退货',
  `status` tinyint(2) NOT NULL COMMENT '状态,0:预结算,1:厂商结算,2:结算',
  `comment` varchar(128) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`sbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售结算';
