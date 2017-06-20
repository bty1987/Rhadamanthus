CREATE DATABASE  IF NOT EXISTS `inventory`;
USE `inventory`;

DROP TABLE IF EXISTS `assismanifest`;
CREATE TABLE `assismanifest` (
  `amid` int(11) NOT NULL AUTO_INCREMENT,
  `aoid` int(11) NOT NULL COMMENT '辅料单ID',
  `mid` int(11) NOT NULL COMMENT '货单ID',
  PRIMARY KEY (`amid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅料货单';

DROP TABLE IF EXISTS `assisorder`;
CREATE TABLE `assisorder` (
  `aoid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `createrId` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `approverId` int(11) DEFAULT NULL,
  `approverTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`aoid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅料订单';

DROP TABLE IF EXISTS `assisorderitem`;
CREATE TABLE `assisorderitem` (
  `aoiid` int(11) NOT NULL AUTO_INCREMENT,
  `aoid` int(11) NOT NULL,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`aoiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅料项';

DROP TABLE IF EXISTS `assistype`;
CREATE TABLE `assistype` (
  `atid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `wtid` int(11) NOT NULL COMMENT '工种ID',
  `status` tinyint(2) NOT NULL DEFAULT '0',
  `comment` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`atid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅类';

DROP TABLE IF EXISTS `checklist`;
CREATE TABLE `checklist` (
  `clid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `shid` int(11) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `createTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`clid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='盘点列表';

DROP TABLE IF EXISTS `color`;
CREATE TABLE `color` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品颜色';

DROP TABLE IF EXISTS `format`;
CREATE TABLE `format` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `info` varchar(64) NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品规格';

DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `barcode` varchar(128) NOT NULL DEFAULT '' COMMENT '条形码',
  `category` varchar(32) NOT NULL,
  `brand` varchar(32) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `pieceNum` int(5) NOT NULL,
  `atid` int(11) DEFAULT NULL COMMENT '辅类ID',
  `type` tinyint(2) NOT NULL DEFAULT '0',
  `status` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品';

DROP TABLE IF EXISTS `goodspackage`;
CREATE TABLE `goodspackage` (
  `gpid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '套餐ID,对应商品gid',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`gpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='套餐';

DROP TABLE IF EXISTS `goodsstorehousestock`;
CREATE TABLE `goodsstorehousestock` (
  `gshsid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `shid` int(11) NOT NULL COMMENT '仓库ID',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`gshsid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品仓库存量';

DROP TABLE IF EXISTS `manifest`;
CREATE TABLE `manifest` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `manifestTime` timestamp NULL DEFAULT NULL,
  `createUserId` int(11) NOT NULL,
  `total` decimal(13,3) NOT NULL DEFAULT '0.000',
  `type` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `attachment` varchar(256) NOT NULL DEFAULT '',
  `qmid` int(11) DEFAULT NULL COMMENT '引用货单ID',
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='货单';

DROP TABLE IF EXISTS `manifestitem`;
CREATE TABLE `manifestitem` (
  `miid` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NOT NULL,
  `siid` int(11) DEFAULT NULL,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `ishId` int(11) DEFAULT NULL COMMENT '进仓库ID',
  `oshId` int(11) DEFAULT NULL COMMENT '出仓库ID',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `unitPrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `comment` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`miid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='货单项';

DROP TABLE IF EXISTS `manifesttemplate`;
CREATE TABLE `manifesttemplate` (
  `mtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`mtid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='货单模版';

DROP TABLE IF EXISTS `manifesttemplateitem`;
CREATE TABLE `manifesttemplateitem` (
  `mtiId` int(11) NOT NULL AUTO_INCREMENT,
  `mtid` int(11) NOT NULL,
  `gid` int(11) NOT NULL,
  PRIMARY KEY (`mtiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='货单模版项';

DROP TABLE IF EXISTS `price`;
CREATE TABLE `price` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `purchase` decimal(10,3) NOT NULL DEFAULT '0.000',
  `selling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `ctype` tinyint(2) NOT NULL DEFAULT '0',
  `cvalue` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品价格';

DROP TABLE IF EXISTS `purchase`;
CREATE TABLE `purchase` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `balanceTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '结算时间',
  `deliveryTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '预到货时间',
  `status` tinyint(2) NOT NULL DEFAULT '0',
  `balanceStatus` tinyint(2) NOT NULL DEFAULT '0',
  `comment` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购单';

DROP TABLE IF EXISTS `purchaseamount`;
CREATE TABLE `purchaseamount` (
  `paid` int(11) NOT NULL AUTO_INCREMENT,
  `month` varchar(6) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`paid`),
  KEY `indexone` (`month`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购金额';

DROP TABLE IF EXISTS `purchaseitem`;
CREATE TABLE `purchaseitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '采购单ID',
  `siid` int(11) DEFAULT NULL COMMENT '销售项ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `unitPrice` decimal(10,2) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `surplus` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '剩余数量',
  PRIMARY KEY (`piid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购项';

DROP TABLE IF EXISTS `purchasemanifest`;
CREATE TABLE `purchasemanifest` (
  `pmid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '采购单ID',
  `mid` int(11) NOT NULL COMMENT '货单ID',
  PRIMARY KEY (`pmid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购货单';

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

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `company` tinyint(2) NOT NULL DEFAULT '0',
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
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `maling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `venderMaling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `coupon` decimal(10,3) NOT NULL DEFAULT '0.000',
  `couponInfo` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售单';

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

DROP TABLE IF EXISTS `salespayment`;
CREATE TABLE `salespayment` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `type` tinyint(4) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createrName` varchar(32) NOT NULL COMMENT '创建人名',
  `referMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `srid` int(11) DEFAULT NULL,
  PRIMARY KEY (`spid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售款项表';

DROP TABLE IF EXISTS `salesreceipt`;
CREATE TABLE `salesreceipt` (
  `srid` int(11) NOT NULL AUTO_INCREMENT,
  `cluid` int(11) DEFAULT NULL COMMENT '收款人ID',
  `cfuid` int(11) DEFAULT NULL COMMENT '确认人ID',
  `collecterName` varchar(32) DEFAULT NULL COMMENT '收款人名',
  `confirmerName` varchar(32) DEFAULT NULL COMMENT '确认人名',
  `collectTime` timestamp NULL DEFAULT NULL,
  `confirmTime` timestamp NULL DEFAULT NULL,
  `realMoney` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cashInfo` varchar(20) DEFAULT NULL,
  `bank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `bankInfo` varchar(512) NOT NULL DEFAULT '',
  `checkv` decimal(10,3) NOT NULL DEFAULT '0.000',
  `checkvBank` varchar(20) NOT NULL DEFAULT '',
  `installment` decimal(10,3) NOT NULL DEFAULT '0.000',
  `installmentBank` varchar(20) NOT NULL DEFAULT '',
  `accounts` decimal(10,3) NOT NULL DEFAULT '0.000',
  `accountsBank` varchar(20) NOT NULL DEFAULT '',
  `advance` decimal(10,3) NOT NULL DEFAULT '0.000',
  `advanceType` tinyint(4) NOT NULL DEFAULT '0',
  `coupon` decimal(10,3) NOT NULL DEFAULT '0.000',
  `couponInfo` text NOT NULL,
  `des` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`srid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售收据表';

DROP TABLE IF EXISTS `storehouse`;
CREATE TABLE `storehouse` (
  `shid` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`shid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='仓库';

DROP TABLE IF EXISTS `storehousestock`;
CREATE TABLE `storehousestock` (
  `shsid` int(11) NOT NULL AUTO_INCREMENT,
  `shid` int(11) NOT NULL COMMENT '仓库ID',
  `month` varchar(6) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`shsid`),
  KEY `indexone` (`shid`,`month`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='库存';

DROP TABLE IF EXISTS `storehouseuser`;
CREATE TABLE `storehouseuser` (
  `shuid` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `shId` int(11) NOT NULL,
  PRIMARY KEY (`shuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='仓库人员表';

