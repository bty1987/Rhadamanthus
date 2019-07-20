CREATE DATABASE  IF NOT EXISTS `inventory`;
USE `inventory`;

DROP TABLE IF EXISTS `accessories`;
CREATE TABLE `accessories` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `csid` int(11) NOT NULL,
  `hid` int(11) NOT NULL,
  `suid` int(11) DEFAULT NULL,
  `cuid` int(11) NOT NULL,
  `auid` int(11) DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approverTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fetchTime` timestamp NULL DEFAULT NULL,
  `schedule` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`aid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`orderId`),
  KEY `indextwo` (`no`),
  KEY `indexthr` (`cuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅料单';

DROP TABLE IF EXISTS `accessoriesitem`;
CREATE TABLE `accessoriesitem` (
  `aiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `selling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `surplus` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`aiid`),
  KEY `indexone` (`aid`),
  KEY `indextwo` (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅料项';

DROP TABLE IF EXISTS `accessoriesmanifest`;
CREATE TABLE `accessoriesmanifest` (
  `amid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '辅料单ID',
  `mid` int(11) NOT NULL COMMENT '货单ID',
  PRIMARY KEY (`amid`),
  KEY `indexone` (`aid`),
  KEY `indextwo` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅料货单';
DROP TABLE IF EXISTS `accessoriestype`;
CREATE TABLE `accessoriestype` (
  `atid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `wtid` int(11) NOT NULL COMMENT '工种ID',
  `status` tinyint(1) NOT NULL DEFAULT '0',
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
  `type` tinyint(1) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`clid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='盘点列表';

DROP TABLE IF EXISTS `color`;
CREATE TABLE `color` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品颜色';

DROP TABLE IF EXISTS `format`;
CREATE TABLE `format` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `info` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`fid`),
  KEY `indexone` (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品规格';

DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `barcode` varchar(128) NOT NULL DEFAULT '' COMMENT '条形码',
  `category` varchar(32) NOT NULL,
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `brand` varchar(32) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `purchase` decimal(10,3) DEFAULT '0.000',
  `selling` decimal(10,3) DEFAULT '0.000',
  `pieceNum` int(5) NOT NULL,
  `atid` int(11) DEFAULT NULL COMMENT '辅类ID',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`gid`),
  KEY `indexone` (`company`,`status`,`no`),
  KEY `indextwo` (`company`,`status`,`name`),
  KEY `indexthr` (`company`,`bid`)
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
  PRIMARY KEY (`gshsid`),
  UNIQUE KEY `uniqueone` (`gid`,`cid`,`fid`,`shid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品仓库存量';

DROP TABLE IF EXISTS `manifest`;
CREATE TABLE `manifest` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  `manifestTime` timestamp NULL DEFAULT NULL,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `attachment` varchar(256) NOT NULL DEFAULT '',
  `qmid` int(11) DEFAULT NULL COMMENT '引用货单ID',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mid`),
  UNIQUE KEY `uniqueone` (`code`),
  KEY `indexone` (`code`),
  KEY `indextwo` (`cuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='货单';


DROP TABLE IF EXISTS `manifestitem`;
CREATE TABLE `manifestitem` (
  `miid` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NOT NULL,
  `siid` int(11) DEFAULT '0',
  `piid` int(11) DEFAULT '0',
  `aiid` int(11) DEFAULT '0',
  `qiid` int(11) DEFAULT '0',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `ishId` int(11) DEFAULT NULL COMMENT '进仓库ID',
  `oshId` int(11) DEFAULT NULL COMMENT '出仓库ID',
  `inprice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '入库价',
  `outprice` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '出库价',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `surplus` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '剩余数量',
  `unitPrice` decimal(10,3) DEFAULT '0.000',
  `comment` varchar(256) DEFAULT NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型',
  PRIMARY KEY (`miid`),
  KEY `indexone` (`mid`),
  KEY `indextwo` (`gid`),
  KEY `indexthr` (`siid`),
  KEY `indexfor` (`piid`),
  KEY `indexfiv` (`aiid`),
  KEY `indexsix` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='货单项';

DROP TABLE IF EXISTS `manifesttemplate`;
CREATE TABLE `manifesttemplate` (
  `mtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mtid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='货单模版';

DROP TABLE IF EXISTS `manifesttemplateitem`;
CREATE TABLE `manifesttemplateitem` (
  `mtiid` int(11) NOT NULL AUTO_INCREMENT,
  `mtid` int(11) NOT NULL,
  `gid` int(11) NOT NULL,
  PRIMARY KEY (`mtiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='货单模版项';
DROP TABLE IF EXISTS `price`;
CREATE TABLE `price` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `purchase` decimal(10,3) NOT NULL DEFAULT '0.000',
  `selling` decimal(10,3) NOT NULL DEFAULT '0.000',
  `ctype` tinyint(1) NOT NULL DEFAULT '0',
  `cvalue` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`pid`),
  KEY `indexone` (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品价格';

DROP TABLE IF EXISTS `purchase`;
CREATE TABLE `purchase` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `balanceTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '结算时间',
  `deliveryTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '预到货时间',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `balanceStatus` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(128) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购单';

DROP TABLE IF EXISTS `purchaseamount`;
CREATE TABLE `purchaseamount` (
  `paid` int(11) NOT NULL AUTO_INCREMENT,
  `month` varchar(6) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`paid`),
  KEY `indexone` (`month`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购金额';

DROP TABLE IF EXISTS `purchasebalance`;
CREATE TABLE `purchasebalance` (
  `pbid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `balance` decimal(10,3) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `comment` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`pbid`),
  KEY `indexone` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购结算';

DROP TABLE IF EXISTS `purchaseitem`;
CREATE TABLE `purchaseitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '采购单ID',
  `siid` int(11) DEFAULT NULL COMMENT '销售项ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `sid` int(11) DEFAULT '1' COMMENT '供应商ID',
  `inprice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `surplus` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '剩余数量',
  PRIMARY KEY (`piid`),
  KEY `indexone` (`pid`),
  KEY `indextwo` (`gid`),
  KEY `indexthr` (`siid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购项';

DROP TABLE IF EXISTS `purchasemanifest`;
CREATE TABLE `purchasemanifest` (
  `pmid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '采购单ID',
  `mid` int(11) NOT NULL COMMENT '货单ID',
  PRIMARY KEY (`pmid`),
  KEY `indexone` (`pid`),
  KEY `indextwo` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='采购货单';

DROP TABLE IF EXISTS `storehouse`;
CREATE TABLE `storehouse` (
  `shid` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
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

