CREATE DATABASE IF NOT EXISTS `material`;
USE `material`;

-- Generated at 2026-01-06 08:11:02
-- Total tables: 9

DROP TABLE IF EXISTS `material`;
CREATE TABLE `material` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `hid` int(11) NOT NULL,
  `customerId` varchar(15) NOT NULL,
  `salesmanId` varchar(15) NULL,
  `materialerId` varchar(15) NULL,
  `instoreId` varchar(15) NULL,
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `packageFlag` tinyint(4) NOT NULL DEFAULT 0,
  `regionId` varchar(10) NOT NULL,
  `departmentId` varchar(10) NOT NULL,
  `materialDeptId` varchar(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `preBalanceTime` timestamp NULL,
  `postBalanceTime` timestamp NULL,
  `type` tinyint(4) NULL DEFAULT 0,
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '初始, 删除',
  `depositPayment` bigint(10) NOT NULL DEFAULT 0,
  `depositStatus` tinyint(4) NOT NULL DEFAULT 0,
  `fullPayment` bigint(10) NOT NULL DEFAULT 0,
  `fullStatus` tinyint(4) NOT NULL DEFAULT 0,
  `balanceStatus` tinyint(4) NOT NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `distotal` bigint(10) NOT NULL DEFAULT 0 COMMENT '折扣总价',
  `maling` int(8) NOT NULL DEFAULT 0,
  `venderMaling` int(8) NOT NULL DEFAULT 0,
  `coupon` int(8) NOT NULL DEFAULT 0,
  `couponInfo` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(256) NOT NULL DEFAULT '',
  `fullpayTime` timestamp NULL,
  `otherStatus` tinyint(11) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  `smuid` int(11) NOT NULL COMMENT '业务员ID',
  `muid` int(11) NOT NULL COMMENT '主材员ID',
  `iuid` int(11) NULL COMMENT '驻店员ID',
  `bid` int(11) NOT NULL,
  `activityId` int(11) NULL DEFAULT 0,
  `grade` varchar(1) NOT NULL,
  PRIMARY KEY (`mid`),
  KEY `indexone` (`orderId`, `mid`, `status`) USING BTREE,
  KEY `indexsev` (`brand`) USING BTREE,
  KEY `indexsix` (`status`, `fullStatus`) USING BTREE,
  KEY `indexthr` (`no`) USING BTREE,
  KEY `indextwo` (`balanceStatus`, `fullStatus`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2031 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材子订单表';

DROP TABLE IF EXISTS `materialactivityitem`;
CREATE TABLE `materialactivityitem` (
  `maiid` int(11) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `asid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activity` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `state` tinyint(1) NOT NULL,
  `isStock` tinyint(1) NOT NULL,
  `num` int(8) NOT NULL DEFAULT 0,
  `money` int(8) NOT NULL DEFAULT 0,
  `content` varchar(64) NULL,
  `receiveUserId` int(11) NULL,
  `receiveUserName` varchar(15) NOT NULL,
  `receiveTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`maiid`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `materialbalance`;
CREATE TABLE `materialbalance` (
  `mbid` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NOT NULL,
  `createrId` varchar(15) NULL,
  `instorerId` varchar(15) NULL,
  `posterId` varchar(15) NULL,
  `balanceTime` timestamp NULL COMMENT '预结算时间',
  `balance` bigint(10) NOT NULL DEFAULT 0,
  `difference` bigint(10) NOT NULL DEFAULT 0,
  `vbalance` bigint(10) NOT NULL DEFAULT 0,
  `vbalanceTime` timestamp NULL COMMENT '厂商结算时间',
  `post` bigint(10) NOT NULL DEFAULT 0,
  `postTime` timestamp NULL COMMENT '结算时间',
  `total` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `ident` int(11) NOT NULL DEFAULT 0,
  `mpid` int(11) NULL,
  `cuid` int(11) NOT NULL COMMENT ' 创建人ID',
  `iuid` int(11) NULL COMMENT '主材驻店ID',
  `puid` int(11) NULL COMMENT '结算人ID',
  PRIMARY KEY (`mbid`),
  KEY `indexone` (`mid`) USING BTREE,
  KEY `indexthr` (`status`, `type`) USING BTREE,
  KEY `indextwo` (`instorerId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材子订单结算表';

DROP TABLE IF EXISTS `materialinside`;
CREATE TABLE `materialinside` (
  `miId` int(11) NOT NULL AUTO_INCREMENT,
  `orderAddr` varchar(128) NOT NULL,
  `customerId` varchar(15) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `designerId` varchar(15) NOT NULL,
  `designerName` varchar(32) NOT NULL,
  `materialGuideId` varchar(15) NOT NULL,
  `materialGuideName` varchar(32) NOT NULL,
  `materialTypeId` int(11) NOT NULL,
  `materialType` varchar(32) NOT NULL,
  `materialBrandId` int(11) NOT NULL,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` date NOT NULL,
  `sales` decimal(10,3) NOT NULL DEFAULT 0.000,
  `profit` decimal(10,3) NOT NULL DEFAULT 0.000,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `des` varchar(256) NOT NULL DEFAULT '',
  `orderId` varchar(15) NOT NULL,
  PRIMARY KEY (`miId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材场内信息';

DROP TABLE IF EXISTS `materialitem`;
CREATE TABLE `materialitem` (
  `miid` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NOT NULL,
  `no` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `measurementUnit` varchar(10) NOT NULL,
  `packageName` varchar(10) NOT NULL DEFAULT '',
  `unitPrice` int(8) NOT NULL,
  `purchasePrice` int(8) NOT NULL,
  `salePrice` bigint(10) NOT NULL DEFAULT 0,
  `price` bigint(10) NOT NULL DEFAULT 0,
  `discount` int(8) NOT NULL DEFAULT 1000,
  `postDiscount` int(8) NOT NULL DEFAULT 1000,
  `num` bigint(10) NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '无 , 退货 , 预结算 , 结算 , 删除',
  `balanceStatus` tinyint(4) NOT NULL DEFAULT 0,
  `refundStatus` tinyint(4) NOT NULL DEFAULT 0,
  `calcType` tinyint(4) NOT NULL DEFAULT 0,
  `prePoint` int(8) NOT NULL DEFAULT 0,
  `postPoint` int(8) NOT NULL DEFAULT 0,
  `rawCalcType` tinyint(4) NOT NULL DEFAULT 0,
  `rawPoint` int(8) NOT NULL DEFAULT 0,
  `comment` varchar(256) NULL DEFAULT '',
  PRIMARY KEY (`miid`),
  KEY `indextwo` (`mid`, `status`, `refundStatus`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3400 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材子订单项表';

DROP TABLE IF EXISTS `materialoutside`;
CREATE TABLE `materialoutside` (
  `moId` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `orderAddr` varchar(128) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `salesmanId` varchar(15) NOT NULL,
  `salesmanName` varchar(32) NOT NULL,
  `deptId` varchar(10) NOT NULL,
  `deptName` varchar(32) NOT NULL,
  `regionId` varchar(10) NOT NULL,
  `regionName` varchar(32) NOT NULL,
  `createUserId` varchar(15) NOT NULL,
  `createUserName` varchar(32) NOT NULL,
  `materialType` varchar(32) NOT NULL,
  `materialBrand` varchar(32) NOT NULL,
  `createTime` timestamp NULL,
  `sales` decimal(10,3) NOT NULL DEFAULT 0.000,
  `profit` decimal(10,3) NOT NULL DEFAULT 0.000,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `des` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`moId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材场外信息';

DROP TABLE IF EXISTS `materialrefund`;
CREATE TABLE `materialrefund` (
  `mrid` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NOT NULL,
  `miid` int(11) NOT NULL,
  `mpId` int(11) NOT NULL,
  `ident` int(11) NOT NULL,
  `no` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `measurementUnit` varchar(10) NOT NULL,
  `packageName` varchar(10) NOT NULL DEFAULT '',
  `unitPrice` int(8) NOT NULL,
  `purchasePrice` int(8) NOT NULL,
  `salePrice` bigint(10) NOT NULL DEFAULT 0,
  `price` bigint(10) NOT NULL DEFAULT 0,
  `discount` int(8) NOT NULL DEFAULT 1000,
  `postDiscount` int(8) NOT NULL DEFAULT 1000,
  `num` bigint(10) NOT NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `balanceType` int(11) NOT NULL DEFAULT 0,
  `prePoint` int(8) NOT NULL DEFAULT 0,
  `comment` varchar(256) NULL DEFAULT '',
  PRIMARY KEY (`mrid`),
  KEY `indexone` (`mid`, `status`) USING BTREE,
  KEY `indextwo` (`mpId`, `status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1188 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材子订单退款信息表';

DROP TABLE IF EXISTS `materialsuborderpostbalance`;
CREATE TABLE `materialsuborderpostbalance` (
  `msopobId` int(11) NOT NULL AUTO_INCREMENT,
  `msoId` int(11) NOT NULL,
  `msoNo` varchar(15) NOT NULL,
  `userId` varchar(15) NOT NULL,
  `userName` varchar(32) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `postBalance` decimal(10,3) NOT NULL DEFAULT 0.000,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`msopobId`),
  KEY `indexone` (`msoId`, `status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材子订单结算表';

DROP TABLE IF EXISTS `materialsuborderprebalance`;
CREATE TABLE `materialsuborderprebalance` (
  `msoprbId` int(11) NOT NULL AUTO_INCREMENT,
  `msoId` int(11) NOT NULL,
  `msoNo` varchar(15) NOT NULL,
  `userId` varchar(15) NOT NULL,
  `userName` varchar(32) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `preBalance` decimal(10,3) NOT NULL DEFAULT 0.000,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`msoprbId`),
  KEY `indexone` (`msoId`, `status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材子订单预结算表';
