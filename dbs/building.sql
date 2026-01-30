CREATE DATABASE IF NOT EXISTS `building`;
USE `building`;

-- Generated at 2026-01-06 08:11:03
-- Total tables: 9

DROP TABLE IF EXISTS `building`;
CREATE TABLE `building` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL COMMENT '编号',
  `hsid` int(11) NOT NULL COMMENT '房源',
  `csid` int(11) NOT NULL COMMENT '客源',
  `hacid` int(11) NULL COMMENT '房源代理人',
  `cacid` int(11) NULL COMMENT '客源代理人',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `signingTime` timestamp NULL COMMENT '签约时间',
  `tradePrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '成交价格',
  `downpayment` bigint(10) NOT NULL DEFAULT 0 COMMENT '首付款',
  `loanPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '贷款金额',
  `payType` tinyint(1) NOT NULL COMMENT '支付方式',
  `status` tinyint(1) NOT NULL COMMENT '房产单状态',
  `bnid` int(11) NOT NULL COMMENT '流转状态',
  `balanceStatus` tinyint(1) NOT NULL COMMENT '结算状态',
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='房产单';

DROP TABLE IF EXISTS `buildingcustomer`;
CREATE TABLE `buildingcustomer` (
  `csid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL COMMENT '客源编号',
  `cid` int(11) NOT NULL COMMENT '客户ID',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `purpose` varchar(64) NOT NULL COMMENT '目的',
  `intention` varchar(256) NULL COMMENT '意向',
  `price` varchar(64) NOT NULL COMMENT '需求价格',
  `area` varchar(64) NOT NULL COMMENT '需求面积',
  `familyType` tinyint(1) NOT NULL COMMENT '需求户型',
  `orientation` tinyint(2) NOT NULL COMMENT '朝向',
  `conditions` varchar(256) NULL COMMENT '意向备注',
  `grade` varchar(2) NOT NULL COMMENT '客户等级',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `comment` varchar(256) NULL COMMENT '备注',
  PRIMARY KEY (`csid`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客源';

DROP TABLE IF EXISTS `buildingdrawing`;
CREATE TABLE `buildingdrawing` (
  `bdid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '资源ID',
  `name` varchar(15) NULL COMMENT '图片名称',
  `drawingUrl` varchar(256) NOT NULL COMMENT '图片路径',
  `drawingType` tinyint(1) NOT NULL COMMENT '图片类型',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`bdid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='房产图片';

DROP TABLE IF EXISTS `buildinghouse`;
CREATE TABLE `buildinghouse` (
  `hsid` int(11) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL COMMENT '房源编号',
  `type` tinyint(1) NOT NULL COMMENT '房源类型',
  `sourceType` tinyint(1) NOT NULL COMMENT '信息来源',
  `hid` int(11) NOT NULL COMMENT '房产ID',
  `cid` int(11) NOT NULL COMMENT '房产权属',
  `deedNum` varchar(64) NULL COMMENT '契证编号',
  `deedValue` bigint(10) NOT NULL DEFAULT 0 COMMENT '契证原值',
  `unitPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '单价',
  `totalPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '总价',
  `decorateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '装修时间',
  `decorateDegree` tinyint(2) NOT NULL COMMENT '装修程度',
  `discussType` tinyint(1) NOT NULL COMMENT '商议类型',
  `rentType` tinyint(2) NOT NULL DEFAULT 0 COMMENT '交租方式',
  `indoores` varchar(256) NOT NULL COMMENT '室内设施',
  `history` varchar(16) NOT NULL COMMENT '房屋历史',
  `propertyFee` bigint(10) NOT NULL DEFAULT 0 COMMENT '物业费',
  `elevator` tinyint(1) NOT NULL COMMENT '电梯',
  `onlyHousing` tinyint(1) NOT NULL COMMENT '唯一住房',
  `documentsDate` timestamp NULL COMMENT '下证日期',
  `allowLoan` tinyint(1) NOT NULL COMMENT '允许贷款',
  `beingLoan` tinyint(1) NOT NULL COMMENT '有无贷款',
  `checkingTime` varchar(256) NOT NULL COMMENT '看房时间',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `fuid` int(11) NULL COMMENT '跟进人',
  `did` int(11) NULL,
  `rid` int(11) NULL,
  `keyer` int(11) NULL,
  `housingGrade` varchar(2) NOT NULL COMMENT '房源等级',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `path` varchar(256) NULL COMMENT '图片默认路径',
  `comment` varchar(256) NULL COMMENT '备注',
  PRIMARY KEY (`hsid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='房源';

DROP TABLE IF EXISTS `buildingnode`;
CREATE TABLE `buildingnode` (
  `bnid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL COMMENT '节点名称',
  `type` tinyint(1) NOT NULL COMMENT '节点类型',
  `sore` tinyint(1) NOT NULL COMMENT '排序',
  `status` tinyint(1) NOT NULL COMMENT '状态, 0初始, 1失效',
  PRIMARY KEY (`bnid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='流转节点';

DROP TABLE IF EXISTS `buildingpayment`;
CREATE TABLE `buildingpayment` (
  `bpid` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) NOT NULL COMMENT '房产单ID',
  `brid` int(11) NOT NULL COMMENT '收据ID',
  `paymentType` tinyint(1) NOT NULL COMMENT '款项类型',
  `paymentStatus` tinyint(1) NOT NULL COMMENT '状态',
  `cruid` int(11) NOT NULL COMMENT '创建人',
  `createrName` varchar(32) NOT NULL COMMENT '创建人姓名',
  `cluid` int(11) NOT NULL COMMENT '收款人',
  `collecterName` varchar(32) NOT NULL COMMENT '收款人姓名',
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款时间',
  `cfuid` int(11) NOT NULL COMMENT '确认人',
  `confirmerName` varchar(32) NOT NULL COMMENT '确认人姓名',
  `confirmTime` timestamp NULL COMMENT '确认时间',
  `referMoney` bigint(10) NOT NULL DEFAULT 0 COMMENT '应收金额',
  `comment` varchar(256) NULL COMMENT '说明',
  PRIMARY KEY (`bpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='房产款项';

DROP TABLE IF EXISTS `buildingreceipt`;
CREATE TABLE `buildingreceipt` (
  `brid` int(11) NOT NULL AUTO_INCREMENT,
  `receiptType` tinyint(1) NOT NULL COMMENT '收据类型',
  `cluid` int(11) NOT NULL COMMENT '收款人',
  `collecterName` varchar(32) NOT NULL COMMENT '收款人姓名',
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款时间',
  `cfuid` int(11) NOT NULL COMMENT '确认人',
  `confirmerName` varchar(32) NOT NULL COMMENT '确认人姓名',
  `confirmTime` timestamp NULL COMMENT '确认时间',
  `realMoney` bigint(10) NOT NULL DEFAULT 0 COMMENT '实收金额',
  `cash` bigint(10) NOT NULL DEFAULT 0 COMMENT '现金',
  `cashInfo` varchar(256) NOT NULL COMMENT '现金信息',
  `bank` bigint(10) NOT NULL DEFAULT 0 COMMENT '刷卡',
  `bankInfo` varchar(256) NOT NULL COMMENT '刷卡信息',
  `checkv` bigint(10) NOT NULL DEFAULT 0 COMMENT '转账',
  `checkvBankName` varchar(32) NOT NULL COMMENT '转账信息',
  `installment` bigint(10) NOT NULL DEFAULT 0 COMMENT '分期',
  `installBankName` varchar(32) NOT NULL COMMENT '分期信息',
  `accounts` bigint(10) NOT NULL DEFAULT 0 COMMENT '对公',
  `accountsBankName` varchar(32) NOT NULL COMMENT '对公信息',
  `comment` varchar(256) NULL COMMENT '说明',
  PRIMARY KEY (`brid`, `realMoney`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='房产收据';

DROP TABLE IF EXISTS `buildingrecord`;
CREATE TABLE `buildingrecord` (
  `brid` int(11) NOT NULL AUTO_INCREMENT,
  `hsid` int(11) NULL COMMENT '房源ID',
  `csid` int(11) NULL COMMENT '客源ID',
  `comment` varchar(256) NOT NULL COMMENT '记录信息',
  `type` tinyint(1) NOT NULL COMMENT '记录类型',
  `pattern` tinyint(1) NOT NULL COMMENT '联系方式',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operatTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`brid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='房产记录';

DROP TABLE IF EXISTS `buildingschedule`;
CREATE TABLE `buildingschedule` (
  `bsid` int(11) NOT NULL AUTO_INCREMENT,
  `bnid` int(11) NOT NULL COMMENT '房产节点ID',
  `bid` int(11) NOT NULL COMMENT '房产单ID',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `planTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '计划时间',
  `status` tinyint(1) NOT NULL COMMENT '状态, 0初始 , 1失效',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operatTime` timestamp NULL COMMENT '操作时间',
  `comment` varchar(256) NULL COMMENT '备注',
  PRIMARY KEY (`bsid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='房产流转';
