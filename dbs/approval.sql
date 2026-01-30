CREATE DATABASE IF NOT EXISTS `approval`;
USE `approval`;

-- Generated at 2026-01-06 08:11:04
-- Total tables: 37

DROP TABLE IF EXISTS `approval`;
CREATE TABLE `approval` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL COMMENT '装修单号',
  `ruid` int(11) NULL COMMENT '接收人ID',
  `suid` int(11) NOT NULL COMMENT '发送人ID',
  `type` tinyint(1) NOT NULL,
  `ident` varchar(20) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approvalTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contents` varchar(256) NULL DEFAULT '',
  `comment` varchar(256) NULL DEFAULT '',
  `annotate` varchar(256) NULL DEFAULT '',
  `company` int(11) NOT NULL,
  `piid` varchar(64) NULL,
  PRIMARY KEY (`aid`),
  KEY `indexfor` (`createTime`) USING BTREE,
  KEY `indexone` (`ruid`) USING BTREE,
  KEY `indexthr` (`ident`) USING BTREE,
  KEY `indextwo` (`suid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10668 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='审批表';

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
) ENGINE=InnoDB AUTO_INCREMENT=555 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户信息修改审批表';

DROP TABLE IF EXISTS `approvalcustomerchance`;
CREATE TABLE `approvalcustomerchance` (
  `accid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批id',
  `ccid` int(11) NOT NULL COMMENT '客源id',
  `type` tinyint(1) NOT NULL COMMENT '类型 0:半包,1:套餐,2:半价,3:满减',
  `typeness` tinyint(1) NOT NULL,
  `dbid` int(11) NOT NULL,
  `salesmanType` varchar(32) NOT NULL COMMENT '房屋类别 0:期房,1:现房',
  `houseType` varchar(32) NOT NULL COMMENT '房屋类别 0:期房,1:现房',
  `houseClass` varchar(32) NOT NULL,
  `resourceType` tinyint(1) NOT NULL COMMENT '资源类型 0:咨询,1:量房',
  PRIMARY KEY (`accid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户机会审批';

DROP TABLE IF EXISTS `approvalcustomerorigin`;
CREATE TABLE `approvalcustomerorigin` (
  `acoid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批id',
  `csid` int(11) NOT NULL COMMENT '客源id',
  PRIMARY KEY (`acoid`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客源初审';

DROP TABLE IF EXISTS `approvalcustomerorigintdecoration`;
CREATE TABLE `approvalcustomerorigintdecoration` (
  `acodid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批id',
  `csid` int(11) NOT NULL COMMENT '客源id',
  `type` tinyint(1) NOT NULL COMMENT '类型 0:半包,1:套餐,2:半价,3:满减',
  `dbid` int(11) NOT NULL,
  `typeness` tinyint(1) NOT NULL,
  `salesmanType` varchar(32) NULL DEFAULT '' COMMENT '房屋类别 0:期房,1:现房',
  `houseType` varchar(32) NOT NULL COMMENT '房屋类别 0:期房,1:现房',
  `houseClass` varchar(32) NOT NULL,
  `resourceType` tinyint(1) NOT NULL COMMENT '资源类型 0:咨询,1:量房',
  `code` varchar(255) NULL,
  `forms` varchar(255) NULL,
  `suid` int(11) NOT NULL,
  PRIMARY KEY (`acodid`)
) ENGINE=InnoDB AUTO_INCREMENT=1170 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='审批记录';

DROP TABLE IF EXISTS `approvalcustomersource`;
CREATE TABLE `approvalcustomersource` (
  `acsid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批id',
  `csid` int(11) NOT NULL COMMENT '资源id',
  `ccid` int(11) NULL,
  `cid` int(11) NULL,
  `hid` int(11) NULL COMMENT '房产id',
  `dbid` int(11) NULL,
  `rate` int(8) NULL,
  PRIMARY KEY (`acsid`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `approvaldecorationactivity`;
CREATE TABLE `approvaldecorationactivity` (
  `adaId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `activityId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  PRIMARY KEY (`adaId`)
) ENGINE=InnoDB AUTO_INCREMENT=1916 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='活动审批表';

DROP TABLE IF EXISTS `approvaldecorationactivityitem`;
CREATE TABLE `approvaldecorationactivityitem` (
  `adaiId` int(11) NOT NULL AUTO_INCREMENT,
  `adaId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activityName` varchar(32) NOT NULL,
  `activityItemName` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 券, 1: 物品',
  `num` int(8) NOT NULL,
  `money` int(8) NOT NULL DEFAULT 0,
  `content` varchar(32) NOT NULL,
  `stateType` tinyint(1) NOT NULL COMMENT '附加类型(0到店/1定金/2签单/3抽奖/4特批/5购买/6其他)',
  `asid` int(11) NOT NULL COMMENT '库存主键',
  PRIMARY KEY (`adaiId`)
) ENGINE=InnoDB AUTO_INCREMENT=2899 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='活动审批表';

DROP TABLE IF EXISTS `approvaldecorationbelong`;
CREATE TABLE `approvaldecorationbelong` (
  `adbId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `belongType` tinyint(1) NOT NULL DEFAULT 0 COMMENT '归属类型, 0:设计, 1:业务',
  PRIMARY KEY (`adbId`)
) ENGINE=InnoDB AUTO_INCREMENT=537 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单归属信息修改审批表';

DROP TABLE IF EXISTS `approvaldecorationbelongitem`;
CREATE TABLE `approvaldecorationbelongitem` (
  `adbiId` int(11) NOT NULL AUTO_INCREMENT,
  `adbId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `buid` int(11) NOT NULL COMMENT '归属人ID',
  `bdid` int(11) NOT NULL COMMENT '归属部门ID',
  `brid` int(11) NOT NULL COMMENT '归属分区ID',
  `rate` int(5) NOT NULL COMMENT '比例',
  `defaultFlag` tinyint(1) NOT NULL DEFAULT 0 COMMENT '默认标识 , 0: 否 , 1: 是',
  PRIMARY KEY (`adbiId`)
) ENGINE=InnoDB AUTO_INCREMENT=799 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单归属信息审批项表';

DROP TABLE IF EXISTS `approvaldecorationcontract`;
CREATE TABLE `approvaldecorationcontract` (
  `adcid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单ID',
  `cid` int(11) NOT NULL COMMENT '合同模板ID',
  PRIMARY KEY (`adcid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修合同审批表';

DROP TABLE IF EXISTS `approvaldecorationholonomy`;
CREATE TABLE `approvaldecorationholonomy` (
  `adhid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `orderId` varchar(256) NOT NULL COMMENT '装修单号',
  `materialPrice` bigint(10) NOT NULL COMMENT '主材配比额',
  PRIMARY KEY (`adhid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `approvaldecorationhouse`;
CREATE TABLE `approvaldecorationhouse` (
  `adhid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `orderid` varchar(15) NOT NULL,
  `shid` int(11) NOT NULL,
  `thid` int(11) NOT NULL,
  PRIMARY KEY (`adhid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `approvaldecorationrefund`;
CREATE TABLE `approvaldecorationrefund` (
  `adrId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `paymentId` int(11) NOT NULL COMMENT '装修款ID',
  PRIMARY KEY (`adrId`)
) ENGINE=InnoDB AUTO_INCREMENT=448 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单退款审批表';

DROP TABLE IF EXISTS `approvaldecorationterminal`;
CREATE TABLE `approvaldecorationterminal` (
  `adtid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  PRIMARY KEY (`adtid`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `approvaldecorationterminalitem`;
CREATE TABLE `approvaldecorationterminalitem` (
  `adtiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `adtid` int(11) NOT NULL COMMENT '合同终止审批ID',
  `refermoney` bigint(10) NOT NULL COMMENT '金额',
  `paymenttype` varchar(15) NOT NULL COMMENT '款项类型',
  PRIMARY KEY (`adtiid`)
) ENGINE=InnoDB AUTO_INCREMENT=404 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `approvalfunction`;
CREATE TABLE `approvalfunction` (
  `cfid` int(11) NOT NULL AUTO_INCREMENT COMMENT '页面存储信息和字段对应关系',
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subType` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) NULL,
  `fieldType` varchar(20) NULL COMMENT '分为共享字段和模块独享字段',
  PRIMARY KEY (`cfid`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='审批功能配置表';

DROP TABLE IF EXISTS `approvalfunctionright`;
CREATE TABLE `approvalfunctionright` (
  `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(32) NULL COMMENT '页面类型名称',
  `cfid` int(11) NULL COMMENT '页面存储信息和字段对应关系',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1442 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='审批配置页面字段表';

DROP TABLE IF EXISTS `approvalmanifestdb`;
CREATE TABLE `approvalmanifestdb` (
  `amdbid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `manifestTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `attachment` varchar(256) NOT NULL DEFAULT '',
  PRIMARY KEY (`amdbid`),
  KEY `indexone` (`aid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=473 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='调拨审批表';

DROP TABLE IF EXISTS `approvalmanifestdbitem`;
CREATE TABLE `approvalmanifestdbitem` (
  `amdbiid` int(11) NOT NULL AUTO_INCREMENT,
  `amdbid` int(11) NOT NULL,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `ishid` int(11) NOT NULL COMMENT '入仓库ID',
  `oshid` int(11) NOT NULL COMMENT '出仓库ID',
  `num` int(8) NOT NULL DEFAULT 0,
  `comment` varchar(256) NULL,
  PRIMARY KEY (`amdbiid`)
) ENGINE=InnoDB AUTO_INCREMENT=492 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='调拨项审批表';

DROP TABLE IF EXISTS `approvalmaterialfullpayment`;
CREATE TABLE `approvalmaterialfullpayment` (
  `amfpId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `referMoney` bigint(10) NOT NULL,
  PRIMARY KEY (`amfpId`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材补款审批表';

DROP TABLE IF EXISTS `approvalmaterialoutsiderefund`;
CREATE TABLE `approvalmaterialoutsiderefund` (
  `amorId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `moId` int(11) NOT NULL,
  PRIMARY KEY (`amorId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材场外退款审批表';

DROP TABLE IF EXISTS `approvalmaterialrefund`;
CREATE TABLE `approvalmaterialrefund` (
  `amrId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `refund` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 退货 , 6: 全退 , 7: 倒单',
  PRIMARY KEY (`amrId`)
) ENGINE=InnoDB AUTO_INCREMENT=1143 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材退货审批表';

DROP TABLE IF EXISTS `approvalmaterialrefunditem`;
CREATE TABLE `approvalmaterialrefunditem` (
  `amriId` int(11) NOT NULL AUTO_INCREMENT,
  `amrId` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `miid` int(11) NOT NULL,
  `num` int(8) NOT NULL DEFAULT 0,
  `total` int(8) NOT NULL DEFAULT 0,
  `packageName` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`amriId`)
) ENGINE=InnoDB AUTO_INCREMENT=1690 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='主材退货项审批表';

DROP TABLE IF EXISTS `approvalprotationprefer`;
CREATE TABLE `approvalprotationprefer` (
  `appid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `pid` int(11) NOT NULL COMMENT '预签报价ID',
  `ppid` int(11) NOT NULL COMMENT '预签产品ID',
  `preferPrice` int(10) NULL DEFAULT 0 COMMENT '优惠额',
  `managePrefer` int(10) NULL DEFAULT 0 COMMENT '管理优惠',
  `advancePrefer` int(10) NULL DEFAULT 0 COMMENT '特殊优惠',
  `taxPrice` int(10) NULL DEFAULT 0 COMMENT '税金',
  `totalPrice` int(10) NULL DEFAULT 0 COMMENT '总额',
  PRIMARY KEY (`appid`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='预签报价优惠审批';

DROP TABLE IF EXISTS `approvalquotationdiscount`;
CREATE TABLE `approvalquotationdiscount` (
  `aqdId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `qid` int(11) NOT NULL,
  `oldDiscount` int(5) NOT NULL,
  `newDiscount` int(5) NOT NULL,
  `basePrice` int(8) NOT NULL DEFAULT 0,
  PRIMARY KEY (`aqdId`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单报价折扣修改审批表';

DROP TABLE IF EXISTS `approvalquotationprefer`;
CREATE TABLE `approvalquotationprefer` (
  `aqpid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `qid` int(11) NOT NULL COMMENT '报价优惠ID',
  `qpid` int(11) NOT NULL COMMENT '报价优惠ID',
  `ppid` int(11) NOT NULL COMMENT '预签产品ID',
  `preferPrice` int(10) NULL DEFAULT 0 COMMENT '优惠额',
  `managePrefer` int(10) NULL DEFAULT 0 COMMENT '管理优惠额',
  `advancePrefer` int(10) NULL DEFAULT 0 COMMENT '特批优惠额',
  `totalPrice` int(10) NULL DEFAULT 0 COMMENT '总额',
  `taxPrice` int(10) NULL DEFAULT 0 COMMENT '税金',
  PRIMARY KEY (`aqpid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价优惠审批';

DROP TABLE IF EXISTS `approvalsalesdayment`;
CREATE TABLE `approvalsalesdayment` (
  `sadid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  PRIMARY KEY (`sadid`)
) ENGINE=InnoDB AUTO_INCREMENT=332 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `approvalsalesdiscount`;
CREATE TABLE `approvalsalesdiscount` (
  `asdid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `refermoney` bigint(10) NOT NULL,
  `paymenttype` tinyint(1) NOT NULL,
  PRIMARY KEY (`asdid`)
) ENGINE=InnoDB AUTO_INCREMENT=620 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售补款项审批表';

DROP TABLE IF EXISTS `approvalsalesrefund`;
CREATE TABLE `approvalsalesrefund` (
  `asrid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `refund` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL,
  PRIMARY KEY (`asrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1913 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售退货审批表';

DROP TABLE IF EXISTS `approvalsalesrefunditem`;
CREATE TABLE `approvalsalesrefunditem` (
  `asriid` int(11) NOT NULL AUTO_INCREMENT,
  `asrid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `siid` int(11) NOT NULL,
  `num` int(8) NOT NULL DEFAULT 0,
  `total` int(8) NOT NULL DEFAULT 0,
  PRIMARY KEY (`asriid`)
) ENGINE=InnoDB AUTO_INCREMENT=2786 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售退货项审批表';

DROP TABLE IF EXISTS `approvalsuppliercontract`;
CREATE TABLE `approvalsuppliercontract` (
  `apscid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `scid` int(11) NULL DEFAULT 0 COMMENT '合同ID',
  `aid` int(11) NULL DEFAULT 0 COMMENT '审批ID',
  `scgid` int(11) NULL DEFAULT 0 COMMENT '厂商合同商品ID',
  `scbid` int(11) NULL DEFAULT 0 COMMENT '厂商合同品牌ID',
  `type` tinyint(1) NOT NULL COMMENT '类型 1:商品,2:品牌',
  PRIMARY KEY (`apscid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商合同审批信息表';

DROP TABLE IF EXISTS `approvalvillage`;
CREATE TABLE `approvalvillage` (
  `avId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `oldVillageId` varchar(10) NOT NULL,
  `oldHouseNumber` varchar(30) NOT NULL,
  `newVillageId` varchar(10) NOT NULL,
  `newHouseNumber` varchar(30) NOT NULL,
  `shid` int(11) NOT NULL,
  `thid` int(11) NOT NULL,
  PRIMARY KEY (`avId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单楼盘信息修改审批表';

DROP TABLE IF EXISTS `approver`;
CREATE TABLE `approver` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NULL,
  `auid` int(11) NOT NULL COMMENT '审批人ID',
  `type` tinyint(2) NOT NULL,
  `comment` varchar(64) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`aid`),
  KEY `indexone` (`userId`, `type`) USING BTREE,
  KEY `indextwo` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=985 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `process`;
CREATE TABLE `process` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `no` varchar(4) NOT NULL,
  `code` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `processitem`;
CREATE TABLE `processitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `id` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `form` varchar(16) NOT NULL,
  `type` varchar(16) NOT NULL,
  `validate` varchar(64) NOT NULL,
  `data` varchar(1024) NOT NULL,
  `comment` varchar(256) NOT NULL,
  `sort` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`piid`),
  KEY `indexone` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4948 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `processrefer`;
CREATE TABLE `processrefer` (
  `prid` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(32) NULL,
  `name` varchar(32) NOT NULL,
  `type` varchar(16) NOT NULL,
  PRIMARY KEY (`prid`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;
