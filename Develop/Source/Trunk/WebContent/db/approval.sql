CREATE DATABASE  IF NOT EXISTS `approval`;
USE `approval`;

DROP TABLE IF EXISTS `approval`;
CREATE TABLE `approval` (
  `aId` int(11) NOT NULL AUTO_INCREMENT,
  `receiverId` varchar(15) NOT NULL,
  `senderId` varchar(15) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `ident` varchar(20) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `createTime` timestamp NULL NOT NULL,
  `approvalTime` timestamp NULL NOT NULL,
  `contents` varchar(256) NOT NULL DEFAULT '',
  `comment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`aId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审批表';

DROP TABLE IF EXISTS `approvalactivity`;
CREATE TABLE `approvalactivity` (
  `aaId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `activityId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  PRIMARY KEY (`aaId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动审批表';

DROP TABLE IF EXISTS `approvalactivityitem`;
CREATE TABLE `approvalactivityitem` (
  `aaiId` int(11) NOT NULL AUTO_INCREMENT,
  `aaId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  `activityItemName` varchar(32) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `num` int(11) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT '0.000',
  `content` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`aaiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动审批表';

DROP TABLE IF EXISTS `approvalcustomer`;
CREATE TABLE `approvalcustomer` (
  `acId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `oldCustomerName` varchar(32) NOT NULL,
  `oldCustomerPhone` varchar(64) NOT NULL,
  `newCustomerName` varchar(32) NOT NULL,
  `newCustomerPhone` varchar(64) NOT NULL,
  PRIMARY KEY (`acId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户信息修改审批表';

DROP TABLE IF EXISTS `approvaldecorationrefund`;
CREATE TABLE `approvaldecorationrefund` (
  `adrId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `paymentId` int(11) NOT NULL,
  PRIMARY KEY (`adrId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单退款审批表';

DROP TABLE IF EXISTS `approvalmaterialfullpayment`;
CREATE TABLE `approvalmaterialfullpayment` (
  `amfpId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `msoId` int(11) NOT NULL,
  `referMoney` decimal(10,3) NOT NULL,
  PRIMARY KEY (`amfpId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材补款审批表';

DROP TABLE IF EXISTS `approvalmaterialoutsiderefund`;
CREATE TABLE `approvalmaterialoutsiderefund` (
  `amorId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `moId` int(11) NOT NULL,
  PRIMARY KEY (`amorId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材场外退款审批表';

DROP TABLE IF EXISTS `approvalmaterialrefund`;
CREATE TABLE `approvalmaterialrefund` (
  `amrId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `msoId` int(11) NOT NULL,
  `refund` decimal(10,3) NOT NULL,
  `type` tinyint(4) NOT NULL,
  PRIMARY KEY (`amrId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材退货审批表';

DROP TABLE IF EXISTS `approvalmaterialrefunditem`;
CREATE TABLE `approvalmaterialrefunditem` (
  `amriId` int(11) NOT NULL AUTO_INCREMENT,
  `amrId` int(11) NOT NULL,
  `msoId` int(11) NOT NULL,
  `msoiId` int(11) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `packageName` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`amriId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材退货项审批表';

DROP TABLE IF EXISTS `approvalorderbelong`;
CREATE TABLE `approvalorderbelong` (
  `aobId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `belongType` varchar(10) NOT NULL,
  PRIMARY KEY (`aobId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单归属信息修改审批表';

DROP TABLE IF EXISTS `approvalorderbelongitem`;
CREATE TABLE `approvalorderbelongitem` (
  `aobiId` int(11) NOT NULL AUTO_INCREMENT,
  `aobId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `belongUserId` varchar(15) NOT NULL,
  `belongRate` decimal(10,3) NOT NULL,
  `defaultFlag` varchar(5) NOT NULL,
  PRIMARY KEY (`aobiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单归属信息审批项表';

DROP TABLE IF EXISTS `approvalquotationdiscount`;
CREATE TABLE `approvalquotationdiscount` (
  `aqdId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `quotationId` bigint(20) NOT NULL,
  `oldDiscount` decimal(10,3) NOT NULL,
  `newDiscount` decimal(10,3) NOT NULL,
  `level` tinyint(4) NOT NULL,
  PRIMARY KEY (`aqdId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单报价折扣修改审批表';

DROP TABLE IF EXISTS `approvalvillage`;
CREATE TABLE `approvalvillage` (
  `avId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `oldVillageId` varchar(10) NOT NULL,
  `oldHouseNumber` varchar(30) NOT NULL,
  `newVillageId` varchar(10) NOT NULL,
  `newHouseNumber` varchar(30) NOT NULL,
  PRIMARY KEY (`avId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单楼盘信息修改审批表';

DROP TABLE IF EXISTS `approvalsalesrefund`;
CREATE TABLE `approvalsalesrefund` (
  `asrid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `refund` decimal(10,3) NOT NULL,
  `type` tinyint(4) NOT NULL,
  PRIMARY KEY (`asrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售退货审批表';

DROP TABLE IF EXISTS `approvalsalesrefunditem`;
CREATE TABLE `approvalsalesrefunditem` (
  `asriid` int(11) NOT NULL AUTO_INCREMENT,
  `asrid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `siid` int(11) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`asriid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售退货项审批表';

DROP TABLE IF EXISTS `approvalmanifestdb`;
CREATE TABLE `approvalmanifestdb` (
  `amdbid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `manifestTime ` timestamp NULL NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `attachment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`amdbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='调拨审批表';

DROP TABLE IF EXISTS `approvalmanifestdbitem`;
CREATE TABLE `approvalmanifestdbitem` (
  `amdbiid` int(11) NOT NULL AUTO_INCREMENT,
  `amdbid` int(11) NOT NULL,
  `miid` int(11) NOT NULL COMMENT '货单项ID',
  `ishid` int(11) NOT NULL COMMENT '入仓库ID',
  `oshid` int(11) NOT NULL COMMENT '出仓库ID',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `comment` varchar(256),
  PRIMARY KEY (`amdbiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='调拨项审批表';

DROP TABLE IF EXISTS `approveuser`;
CREATE TABLE `approveuser` (
  `auid` bigint(32) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `type` tinyint(2) NOT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;