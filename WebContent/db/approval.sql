CREATE DATABASE  IF NOT EXISTS `approval`;
USE `approval`;

DROP TABLE IF EXISTS `approval`;
CREATE TABLE `approval` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `ruid` int(11) COMMENT '接收人ID',
  `suid` int(11) NOT NULL COMMENT '发送人ID',
  `type` tinyint(1) NOT NULL COMMENT '类型,1: 客户信息修改, 2: 楼盘信息修改, 3: 装修单归属修改, 4: 报价折扣修改, 5: 装修退款, 6: 主材退货, 7: 主材场外退款, 8: 装修活动申请, 9: 主材补款提交, 10: 销售退货, 11: 商品库存调拨',
  `ident` varchar(20) NOT NULL COMMENT '外部资源引用,例如装修单号,主材单ID等',
  `status` tinyint(1) NOT NULL COMMENT '状态, 1: 审批通过 , 2: 审批拒绝',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approvalTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contents` varchar(256) DEFAULT '',
  `comment` varchar(256) DEFAULT '',
  `company` int(11) NOT NULL,
  `processinstanceid` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`aid`),
  KEY `indexone` (`ruid`),
  KEY `indextwo` (`suid`),
  KEY `indexthr` (`ident`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审批表';

DROP TABLE IF EXISTS `approvalcustomer`;
CREATE TABLE `approvalcustomer` (
  `acid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `oldCustomerName` varchar(32) NOT NULL,
  `oldCustomerPhone` varchar(64) NOT NULL,
  `newCustomerName` varchar(32) NOT NULL,
  `newCustomerPhone` varchar(64) NOT NULL,
  PRIMARY KEY (`acid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户信息修改审批表';

DROP TABLE IF EXISTS `approvalcustomerorigintdecoration`;
CREATE TABLE `approvalcustomerorigintdecoration` (
  `acodid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批id',
  `csid` int(11) NOT NULL COMMENT '客源id',
  `type` tinyint(1) NOT NULL COMMENT '类型 0:半包,1:套餐,2:半价,3:满减',
  `salesmanType` varchar(16) NOT NULL COMMENT '房屋类别 0:期房,1:现房',
  `houseType` varchar(16) NOT NULL COMMENT '房屋类别 0:期房,1:现房',
  `resourceType` tinyint(1) NOT NULL COMMENT '资源类型 0:咨询,1:量房',
  `code` varchar(255) NOT NULL,
  `forms` varchar(255) NOT NULL,
  PRIMARY KEY (`acodid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客源转装修单';

DROP TABLE IF EXISTS `approvalcustomerorigintdecorationbelong`;
CREATE TABLE `approvalcustomerorigintdecorationbelong` (
  `acodbid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批id',
  `csid` int(11) NOT NULL COMMENT '客源id',
  PRIMARY KEY (`acodbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审批客源转装修单归属记录';

DROP TABLE IF EXISTS `approvaldecorationactivity`;
CREATE TABLE `approvaldecorationactivity` (
  `adaId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `activityId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  PRIMARY KEY (`adaid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动审批表';

DROP TABLE IF EXISTS `approvaldecorationactivityitem`;
CREATE TABLE `approvaldecorationactivityitem` (
  `adaiid` int(11) NOT NULL AUTO_INCREMENT,
  `adaid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  `activityItemName` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 券, 1: 物品',
  `num` int(11) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT '0.000',
  `content` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`adaiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='活动审批表';

DROP TABLE IF EXISTS `approvaldecorationbelong`;
CREATE TABLE `approvaldecorationbelong` (
  `adbid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `belongType` tinyint(1) NOT NULL COMMENT '归属类型, 0:设计, 1:业务',
  PRIMARY KEY (`adbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单归属信息修改审批表';

DROP TABLE IF EXISTS `approvaldecorationbelongitem`;
CREATE TABLE `approvaldecorationbelongitem` (
  `adbiid` int(11) NOT NULL AUTO_INCREMENT,
  `adbid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `buid` int(11) NOT NULL COMMENT '归属人ID',
  `rate` decimal(5,3) NOT NULL COMMENT '比例',
  `defaultFlag` tinyint(1) NOT NULL COMMENT '默认标识',
  PRIMARY KEY (`adbiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单归属信息审批项表';

DROP TABLE IF EXISTS `approvaldecorationholonomy`;
CREATE TABLE `approvaldecorationholonomy` (
  `adhid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `orderId` varchar(256) NOT NULL COMMENT '装修单号',
  `materialPrice` decimal(10,3) NOT NULL COMMENT '主材配比额',
  PRIMARY KEY (`adhid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单满减修改审批';

DROP TABLE IF EXISTS `approvaldecorationrefund`;
CREATE TABLE `approvaldecorationrefund` (
  `adrid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `paymentId` int(11) NOT NULL COMMENT '装修款ID',
  PRIMARY KEY (`adrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单退款审批表';

DROP TABLE IF EXISTS `approvalmanifestdb`;
CREATE TABLE `approvalmanifestdb` (
  `amdbid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `manifestTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `attachment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`amdbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='调拨审批表';

DROP TABLE IF EXISTS `approvalmanifestdbitem`;
CREATE TABLE `approvalmanifestdbitem` (
  `amdbiid` int(11) NOT NULL AUTO_INCREMENT,
  `amdbid` int(11) NOT NULL,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `ishid` int(11) NOT NULL COMMENT '入仓库ID',
  `oshid` int(11) NOT NULL COMMENT '出仓库ID',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `comment` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`amdbiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='调拨项审批表';

DROP TABLE IF EXISTS `approvalmaterialfullpayment`;
CREATE TABLE `approvalmaterialfullpayment` (
  `amfpid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `referMoney` decimal(10,3) NOT NULL,
  PRIMARY KEY (`amfpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材补款审批表';

DROP TABLE IF EXISTS `approvalmaterialoutsiderefund`;
CREATE TABLE `approvalmaterialoutsiderefund` (
  `amorid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `moid` int(11) NOT NULL,
  PRIMARY KEY (`amorid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材场外退款审批表';

DROP TABLE IF EXISTS `approvalmaterialrefund`;
CREATE TABLE `approvalmaterialrefund` (
  `amrid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `refund` decimal(10,3) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 退货 , 6: 全退 , 7: 倒单',
  PRIMARY KEY (`amrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材退货审批表';

DROP TABLE IF EXISTS `approvalmaterialrefunditem`;
CREATE TABLE `approvalmaterialrefunditem` (
  `amriid` int(11) NOT NULL AUTO_INCREMENT,
  `amrid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `miid` int(11) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `packageName` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`amriid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材退货项审批表';

DROP TABLE IF EXISTS `approvalquotationdiscount`;
CREATE TABLE `approvalquotationdiscount` (
  `aqdid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `qid` int(11) NOT NULL,
  `oldDiscount` decimal(5,3) NOT NULL,
  `newDiscount` decimal(5,3) NOT NULL,
  `basePrice` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`aqdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单报价折扣修改审批表';

DROP TABLE IF EXISTS `approvalsalesdiscount`;
CREATE TABLE `approvalsalesdiscount` (
  `asdid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `refermoney` decimal(10,3) NOT NULL,
  `paymenttype` tinyint(1) NOT NULL,
  PRIMARY KEY (`asdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售补款项审批表';

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

DROP TABLE IF EXISTS `approvalvillage`;
CREATE TABLE `approvalvillage` (
  `avid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `oldVillageId` varchar(10) NOT NULL,
  `oldHouseNumber` varchar(30) NOT NULL,
  `newVillageId` varchar(10) NOT NULL,
  `newHouseNumber` varchar(30) NOT NULL,
  PRIMARY KEY (`avid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单楼盘信息修改审批表';

DROP TABLE IF EXISTS `approver`;
CREATE TABLE `approver` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `auid` int(11) NOT NULL COMMENT '审批人ID',
  `type` tinyint(2) NOT NULL,
  `comment` varchar(64),
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
