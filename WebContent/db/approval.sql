CREATE DATABASE  IF NOT EXISTS `approval`;
USE `approval`;

DROP TABLE IF EXISTS `approval`;
CREATE TABLE `approval` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) DEFAULT '' COMMENT '装修单号',
  `ruid` int(11) DEFAULT NULL COMMENT '接收人ID',
  `suid` int(11) NOT NULL COMMENT '发送人ID',
  `type` tinyint(1) NOT NULL COMMENT '类型,1: 客户信息修改, 2: 楼盘信息修改, 3: 装修单归属修改, 4: 报价折扣修改, 5: 装修退款, 6: 主材退货, 7: 主材场外退款, 8: 装修活动申请, 9: 主材补款提交, 10: 销售退货, 11: 商品库存调拨',
  `ident` varchar(20) NOT NULL COMMENT '外部资源引用,例如装修单号,主材单ID等',
  `status` tinyint(1) NOT NULL COMMENT '状态, 1: 审批通过 , 2: 审批拒绝',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approvalTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contents` varchar(256) DEFAULT '',
  `comment` varchar(256) DEFAULT '',
  `annotate` varchar(256) DEFAULT '',
  `company` int(11) NOT NULL,
  `piid` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`aid`),
  KEY `indexone` (`ruid`),
  KEY `indextwo` (`suid`),
  KEY `indexthr` (`ident`),
  KEY `indexfor` (`createTime`)
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

DROP TABLE IF EXISTS `approvalcustomerorigin`;
CREATE TABLE `approvalcustomerorigin` (
  `acoid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批id',
  `csid` int(11) NOT NULL COMMENT '客源id',
  PRIMARY KEY (`acoid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客源初审';

DROP TABLE IF EXISTS `approvalcustomerorigintdecoration`;
CREATE TABLE `approvalcustomerorigintdecoration` (
  `acodid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批id',
  `csid` int(11) NOT NULL COMMENT '客源id',
  `type` tinyint(1) NOT NULL COMMENT '类型 0:半包,1:套餐,2:半价,3:满减',
  `dbid` int(11) NOT NULL,
  `typeness` tinyint(1) NOT NULL,
  `salesmanType` varchar(32) NOT NULL DEFAULT '' COMMENT '房屋类别 0:期房,1:现房',
  `houseType` varchar(32) NOT NULL COMMENT '房屋类别 0:期房,1:现房',
  `houseClass` varchar(32) NOT NULL,
  `resourceType` tinyint(1) NOT NULL COMMENT '资源类型 0:咨询,1:量房',
  `code` varchar(255) DEFAULT '',
  `forms` varchar(255) DEFAULT '',
  `suid` int(11) NOT NULL,
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
  `adaid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
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
  `num` int(8) NOT NULL,
  `money` int(8) NOT NULL DEFAULT '0',
  `content` varchar(32) NOT NULL DEFAULT '',
  `stateType` tinyint(1) NOT NULL COMMENT '附加类型(0到店/1定金/2签单/3抽奖/4特批/5购买/6其他)',
  `asid` int(11) NOT NULL COMMENT '库存主键',
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
  `bdid` int(11) DEFAULT NULL COMMENT '归属部门ID',
  `brid` int(11) DEFAULT NULL COMMENT '归属分区ID',
  `rate` int(5) NOT NULL COMMENT '比例',
  `defaultFlag` tinyint(1) NOT NULL COMMENT '默认标识',
  PRIMARY KEY (`adbiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单归属信息审批项表';

DROP TABLE IF EXISTS `approvaldecorationholonomy`;
CREATE TABLE `approvaldecorationholonomy` (
  `adhid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `orderId` varchar(256) NOT NULL COMMENT '装修单号',
  `materialPrice` bigint(10) NOT NULL COMMENT '主材配比额',
  PRIMARY KEY (`adhid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修单满减修改审批';

DROP TABLE IF EXISTS `approvaldecorationrefund`;
CREATE TABLE `approvaldecorationrefund` (
  `adrid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `paymentId` int(11) NOT NULL COMMENT '装修款ID',
  PRIMARY KEY (`adrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单退款审批表';

DROP TABLE IF EXISTS `approvaldecorationterminal`;
CREATE TABLE `approvaldecorationterminal` (
  `adtid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  PRIMARY KEY (`adtid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修合同终止审批';

DROP TABLE IF EXISTS `approvaldecorationterminalitem`;
CREATE TABLE `approvaldecorationterminalitem` (
  `adtiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '审批ID',
  `adtid` int(11) NOT NULL COMMENT '合同终止审批ID',
  `refermoney` bigint(10) NOT NULL COMMENT '金额',
  `paymenttype` varchar(15) NOT NULL COMMENT '款项类型',
  PRIMARY KEY (`adtiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修合同终止审批';

DROP TABLE IF EXISTS `approvalfunction`;
CREATE TABLE `approvalfunction` (
  `cfid` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL,
  `key` VARCHAR(64) NOT NULL,
  `value` VARCHAR(64) NOT NULL,
  `type` TINYINT(1) NOT NULL,
  `subType` TINYINT(1) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `sort` INT(4) NOT NULL,
  `comment` VARCHAR(255) DEFAULT '',
  `fieldType` VARCHAR(20) NOT NULL COMMENT '分为共享字段和模块独享字段',
  PRIMARY KEY (`cfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审批功能配置表';

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
  `num` int(8) NOT NULL DEFAULT '0',
  `comment` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`amdbiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='调拨项审批表';

DROP TABLE IF EXISTS `approvalmaterialfullpayment`;
CREATE TABLE `approvalmaterialfullpayment` (
  `amfpid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `referMoney` bigint(10) NOT NULL,
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
  `refund` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 退货 , 6: 全退 , 7: 倒单',
  PRIMARY KEY (`amrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材退货审批表';

DROP TABLE IF EXISTS `approvalmaterialrefunditem`;
CREATE TABLE `approvalmaterialrefunditem` (
  `amriid` int(11) NOT NULL AUTO_INCREMENT,
  `amrid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `miid` int(11) NOT NULL,
  `num` int(8) NOT NULL DEFAULT '0',
  `total` int(8) NOT NULL DEFAULT '0',
  `packageName` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`amriid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='主材退货项审批表';

DROP TABLE IF EXISTS `approvalquotationdiscount`;
CREATE TABLE `approvalquotationdiscount` (
  `aqdid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `qid` int(11) NOT NULL,
  `oldDiscount` int(5) NOT NULL,
  `newDiscount` int(5) NOT NULL,
  `basePrice` int(8) NOT NULL DEFAULT '0',
  PRIMARY KEY (`aqdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单报价折扣修改审批表';

DROP TABLE IF EXISTS `approvalsalesdayment`;
CREATE TABLE `approvalsalesdayment` (
  `sadid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  PRIMARY KEY (`sadid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审批不退定金';

DROP TABLE IF EXISTS `approvalsalesdiscount`;
CREATE TABLE `approvalsalesdiscount` (
  `asdid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `refermoney` bigint(10) NOT NULL,
  `paymenttype` tinyint(1) NOT NULL,
  PRIMARY KEY (`asdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售补款项审批表';

DROP TABLE IF EXISTS `approvalsalesrefund`;
CREATE TABLE `approvalsalesrefund` (
  `asrid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `refund` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL,
  PRIMARY KEY (`asrid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='销售退货审批表';

DROP TABLE IF EXISTS `approvalsalesrefunditem`;
CREATE TABLE `approvalsalesrefunditem` (
  `asriid` int(11) NOT NULL AUTO_INCREMENT,
  `asrid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `siid` int(11) NOT NULL,
  `num` int(8) NOT NULL DEFAULT '0',
  `total` bigint(10) NOT NULL DEFAULT '0',
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
  `comment` varchar(64) DEFAULT '',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='审批人';

DROP TABLE IF EXISTS `process`;
CREATE TABLE `process` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `no` varchar(4) NOT NULL,
  `code` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='钉钉审批表';

DROP TABLE IF EXISTS `processitem`;
CREATE TABLE `processitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `id` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `form` varchar(16) NOT NULL,
  `type` varchar(16) NOT NULL,
  `validate` varchar(64) NOT NULL DEFAULT '',
  `data` varchar(1024) NOT NULL DEFAULT '',
  `comment` varchar(512) NOT NULL DEFAULT '',
  `sort` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`piid`),
  KEY `indexone` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='钉钉审批项表';

DROP TABLE IF EXISTS `processrefer`;
CREATE TABLE `processrefer` (
  `prid` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(32) DEFAULT NULL,
  `name` varchar(32) NOT NULL,
  `type` varchar(16) NOT NULL,
  PRIMARY KEY (`prid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='钉钉审批控件表';
