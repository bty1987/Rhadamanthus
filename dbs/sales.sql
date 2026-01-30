CREATE DATABASE IF NOT EXISTS `sales`;
USE `sales`;

-- Generated at 2026-01-06 08:11:04
-- Total tables: 22

DROP TABLE IF EXISTS `oales`;
CREATE TABLE `oales` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL,
  `orderId` varchar(15) NULL,
  `foid` int(11) NOT NULL DEFAULT 0,
  `hid` int(11) NOT NULL DEFAULT 0,
  `cid` int(11) NOT NULL DEFAULT 0,
  `bid` int(11) NOT NULL,
  `category` varchar(32) NOT NULL DEFAULT '',
  `brand` varchar(32) NOT NULL DEFAULT '',
  `atttype` tinyint(1) NOT NULL DEFAULT 0,
  `awardType` tinyint(1) NOT NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 0: 购货 1: 退货',
  `cuid` int(11) NOT NULL,
  `suid` int(11) NULL,
  `svuid` int(11) NULL,
  `chauid` int(11) NULL,
  `auid` int(11) NULL COMMENT '对账人',
  `did` int(11) NULL,
  `rid` int(11) NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `profit` bigint(10) NOT NULL DEFAULT 0,
  `award` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0:初始',
  `accountStatus` tinyint(1) NOT NULL DEFAULT 0 COMMENT '对账状态',
  `isScale` tinyint(1) NOT NULL DEFAULT 0 COMMENT '配比标识 0: 未计入 1: 计入',
  `comment` varchar(128) NULL DEFAULT '',
  `company` int(11) NOT NULL,
  `confirmTime` timestamp NULL COMMENT '确认时间',
  `checkTime` timestamp NULL COMMENT '复核时间',
  `finishTime` timestamp NULL COMMENT '完结时间',
  `accountTime` timestamp NULL COMMENT '对账时间',
  `chuid` int(11) NULL COMMENT '复核人',
  `mauid` int(11) NULL COMMENT '主材员',
  `cost` int(11) NOT NULL DEFAULT 0 COMMENT '成本',
  `threshold` int(11) NOT NULL DEFAULT 0 COMMENT '系数',
  PRIMARY KEY (`oid`),
  KEY `indexone` (`orderId`) USING BTREE,
  KEY `indextwo` (`suid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `oalespay`;
CREATE TABLE `oalespay` (
  `opid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NULL,
  `name` varchar(32) NOT NULL,
  `money` bigint(10) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL,
  `payTime` timestamp NULL,
  `comment` varchar(128) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`opid`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `refunds`;
CREATE TABLE `refunds` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `spid` int(11) NOT NULL COMMENT '款项ID',
  `total` bigint(10) NOT NULL DEFAULT 0,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `balanceTime` timestamp NULL COMMENT '结算时间',
  `comment` varchar(128) NOT NULL,
  `status` tinyint(1) NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL COMMENT '类型',
  PRIMARY KEY (`rid`),
  KEY `indexone` (`sid`) USING BTREE,
  KEY `indextwo` (`createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1144 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='退货单';

DROP TABLE IF EXISTS `refundsitem`;
CREATE TABLE `refundsitem` (
  `riid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `rid` int(11) NOT NULL COMMENT '退货单ID',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `num` bigint(10) NOT NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`riid`),
  KEY `indexone` (`sid`) USING BTREE,
  KEY `indextwo` (`rid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1624 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='退货单';

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `ocuid` int(11) NULL,
  `company` int(11) NOT NULL DEFAULT 0,
  `dompany` int(11) NOT NULL,
  `pompany` int(11) NOT NULL,
  `grade` varchar(1) NULL DEFAULT '',
  `hid` int(11) NOT NULL,
  `cid` int(11) NULL COMMENT '客户ID',
  `cuid` int(11) NULL COMMENT '创建人',
  `suid` int(11) NOT NULL COMMENT '业务员ID',
  `did` int(11) NOT NULL COMMENT '业务部门ID',
  `rid` int(11) NOT NULL COMMENT '业务分区ID',
  `guid` int(11) NULL COMMENT '导购员ID',
  `gdid` int(11) NULL COMMENT '导购部门ID',
  `iuid` int(11) NOT NULL COMMENT '驻店员ID',
  `category` varchar(32) NOT NULL,
  `fuid` int(11) NULL,
  `bid` int(11) NOT NULL,
  `brand` varchar(32) NULL,
  `comment` varchar(256) NULL DEFAULT '',
  `createTime` timestamp NULL,
  `balanceTime` timestamp NULL,
  `fullpayTime` timestamp NULL,
  `finishTime` timestamp NULL,
  `affirmTime` timestamp NULL,
  `isAffirm` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(1) NULL DEFAULT 0,
  `type` tinyint(1) NULL DEFAULT 0 COMMENT '0: 标准, 1: 补贴',
  `depositpay` bigint(10) NOT NULL DEFAULT 0,
  `depositpayStatus` tinyint(1) NOT NULL DEFAULT -1,
  `fullpay` bigint(10) NOT NULL DEFAULT 0,
  `fullpayStatus` tinyint(1) NOT NULL DEFAULT -1,
  `balanceStatus` tinyint(1) NULL DEFAULT 0,
  `otherStatus` tinyint(1) NOT NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `amount` bigint(10) NOT NULL,
  `maling` int(8) NOT NULL DEFAULT 0,
  `venderMaling` int(8) NOT NULL DEFAULT 0,
  `coupon` int(8) NOT NULL DEFAULT 0,
  `couponInfo` varchar(64) NOT NULL DEFAULT '',
  `activityId` int(11) NULL,
  `ctype` tinyint(1) NOT NULL DEFAULT 2,
  `cvalue` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`sid`),
  KEY `indexone` (`orderId`, `company`) USING BTREE,
  KEY `indextwo` (`orderId`, `dompany`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5211 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售单';

DROP TABLE IF EXISTS `salesactivityitem`;
CREATE TABLE `salesactivityitem` (
  `saiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `asid` int(11) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `activity` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `num` int(8) NOT NULL,
  `money` int(8) NOT NULL,
  `integral` int(11) NOT NULL DEFAULT 0 COMMENT '积分',
  `expendPrice` int(8) NULL DEFAULT 0 COMMENT '补款',
  `discountPrice` int(8) NULL DEFAULT 0 COMMENT '抵现',
  `cuid` int(11) NULL,
  `ouid` int(11) NULL,
  `ruid` int(11) NULL,
  `createTime` timestamp NULL,
  `operateTime` timestamp NULL,
  `refundTime` timestamp NULL,
  `affirmTime` timestamp NULL,
  `checkTime` timestamp NULL,
  `type` tinyint(1) NOT NULL,
  `state` tinyint(1) NOT NULL,
  `isStock` tinyint(1) NOT NULL,
  `isAffirm` tinyint(1) NOT NULL COMMENT '0、 未确认 1、客户确认',
  `content` varchar(64) NULL DEFAULT '',
  `comment` varchar(64) NULL DEFAULT '',
  PRIMARY KEY (`saiid`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=791 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售活动';

DROP TABLE IF EXISTS `salesactivityrecord`;
CREATE TABLE `salesactivityrecord` (
  `sarid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `said` int(11) NULL COMMENT '客户',
  `saiid` int(11) NULL DEFAULT 0,
  `ouid` int(11) NULL COMMENT '操作人',
  `operateTime` timestamp NULL COMMENT '操作时间',
  `type` tinyint(1) NULL COMMENT '类型',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`sarid`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售活动记录';

DROP TABLE IF EXISTS `salesbalance`;
CREATE TABLE `salesbalance` (
  `sbid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单',
  `rid` int(11) NULL COMMENT '退货单',
  `bid` int(11) NULL,
  `cuid` varchar(32) NOT NULL COMMENT '创建人',
  `suid` int(11) NOT NULL DEFAULT 0,
  `did` int(11) NOT NULL DEFAULT 0,
  `drid` int(11) NOT NULL DEFAULT 0,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `puid` varchar(32) NULL COMMENT '结算人',
  `postTime` timestamp NULL COMMENT '结算时间',
  `vuid` int(11) NULL COMMENT '厂商结算人',
  `venderTime` timestamp NULL COMMENT '厂商结算时间',
  `chuid` varchar(32) NULL COMMENT '对账人',
  `checkTime` timestamp NULL COMMENT '对账时间',
  `allowance` bigint(10) NOT NULL,
  `coupon` int(8) NULL DEFAULT 0 COMMENT '券值',
  `total` bigint(10) NOT NULL DEFAULT 0 COMMENT '总额',
  `balance` bigint(10) NOT NULL DEFAULT 0 COMMENT '预结算值',
  `difference` bigint(10) NULL DEFAULT 0 COMMENT '差值',
  `vbalance` bigint(10) NOT NULL DEFAULT 0 COMMENT '厂商结算',
  `pbalance` bigint(10) NOT NULL DEFAULT 0 COMMENT '结算值',
  `rate` int(8) NULL DEFAULT 1,
  `type` tinyint(1) NOT NULL COMMENT '类型,0:购货,1:预结算退货,2:结算退货',
  `onetype` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '状态,0:预结算,1:厂商结算,2:结算',
  `deliverStatus` tinyint(1) NULL DEFAULT 0 COMMENT '配送状态 , 0: 未配送 , 1: 部分送达 , 2: 全部送达',
  `verifyStatus` tinyint(1) NULL DEFAULT 0 COMMENT '审核状态 , 0: 未审核 , 1: 部分审核 , 2: 全部审核',
  `confirmStatus` tinyint(1) NULL DEFAULT 0 COMMENT '确认状态 , 0: 未确认 , 1: 部分确认 , 2: 全部确认',
  `checkStatus` tinyint(1) NULL DEFAULT 0 COMMENT '对账状态',
  `deliverSchedule` tinyint(1) NULL DEFAULT -1,
  `deliverySchedule` tinyint(1) NULL DEFAULT -1,
  `comment` varchar(128) NULL COMMENT '备注',
  `company` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`sbid`),
  KEY `indexfor` (`postTime`) USING BTREE,
  KEY `indexone` (`sid`) USING BTREE,
  KEY `indexthr` (`rid`) USING BTREE,
  KEY `indextwo` (`createTime`) USING BTREE,
  KEY `uniqueone` (`sid`, `rid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3847 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesbalanceitem`;
CREATE TABLE `salesbalanceitem` (
  `sbiid` int(11) NOT NULL AUTO_INCREMENT,
  `sbid` int(11) NOT NULL COMMENT '销售结算ID',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `rawCtype` tinyint(1) NOT NULL COMMENT '原结算方式, 0:底价,1:结算',
  `rawCvalue` int(8) NOT NULL DEFAULT 0 COMMENT '原结算值',
  `ctype` tinyint(1) NOT NULL COMMENT '结算方式',
  `cvalue` int(8) NOT NULL DEFAULT 0 COMMENT '结算值',
  `num` bigint(10) NOT NULL DEFAULT 0 COMMENT '数量',
  `total` bigint(10) NOT NULL DEFAULT 0 COMMENT '总价',
  PRIMARY KEY (`sbiid`),
  KEY `indexone` (`sbid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4674 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesdelivery`;
CREATE TABLE `salesdelivery` (
  `sdid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `peliveryTime` timestamp NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(256) NULL DEFAULT '',
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`sdid`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售配送';

DROP TABLE IF EXISTS `salesdeliveryitem`;
CREATE TABLE `salesdeliveryitem` (
  `sdiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '配送项ID',
  `sid` int(11) NOT NULL COMMENT '销售单',
  `siid` int(11) NOT NULL COMMENT '销售项',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `createtime` timestamp NULL COMMENT '创建时间',
  `trantime` timestamp NULL COMMENT '配送时间',
  `checktime` timestamp NULL COMMENT '审核时间',
  `confirmtime` timestamp NULL COMMENT '确认时间',
  `finishtime` timestamp NULL COMMENT '完结时间',
  `protranTime` timestamp NULL COMMENT '预计配送时间',
  `cruid` int(11) NULL COMMENT '创建人',
  `tuid` int(11) NULL COMMENT '配送人',
  `chuid` int(11) NULL COMMENT '审核人',
  `couid` int(11) NULL COMMENT '确认人',
  `fuid` int(11) NULL COMMENT '完结人',
  `comment` varchar(255) NULL COMMENT '备注',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`sdiid`),
  KEY `indexone` (`sid`) USING BTREE,
  KEY `indexthr` (`createtime`) USING BTREE,
  KEY `indextwo` (`siid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=618 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesfunction`;
CREATE TABLE `salesfunction` (
  `sfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `group` tinyint(2) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) NULL,
  PRIMARY KEY (`sfid`)
) ENGINE=InnoDB AUTO_INCREMENT=306 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesitem`;
CREATE TABLE `salesitem` (
  `siid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `psiid` int(11) NULL DEFAULT 0,
  `type` tinyint(1) NULL DEFAULT 0,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `purchase` int(8) NOT NULL DEFAULT 0 COMMENT '进价',
  `selling` int(8) NOT NULL DEFAULT 0 COMMENT '售价',
  `discount` int(8) NOT NULL DEFAULT 0 COMMENT '折扣',
  `disPrice` int(8) NOT NULL DEFAULT 0 COMMENT '折扣价',
  `postDis` int(8) NOT NULL DEFAULT 0 COMMENT '折让',
  `priceType` tinyint(1) NOT NULL,
  `price` int(8) NOT NULL DEFAULT 0 COMMENT '折让价',
  `num` bigint(10) NOT NULL DEFAULT 0,
  `initnum` bigint(10) NOT NULL COMMENT '初始数量',
  `punum` bigint(10) NOT NULL,
  `xgnum` bigint(10) NOT NULL,
  `trnum` bigint(10) NULL DEFAULT 0,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `comment` varchar(128) NULL,
  `rawCtype` tinyint(1) NOT NULL COMMENT '原结算方式',
  `rawCvalue` int(8) NOT NULL DEFAULT 0 COMMENT '原结算值',
  `ctype` tinyint(1) NOT NULL COMMENT '结算方式',
  `cvalue` int(8) NOT NULL DEFAULT 0 COMMENT '结算值',
  PRIMARY KEY (`siid`),
  KEY `indexone` (`sid`) USING BTREE,
  KEY `indextwo` (`gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7711 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售项';

DROP TABLE IF EXISTS `salesmanifest`;
CREATE TABLE `salesmanifest` (
  `smid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  PRIMARY KEY (`smid`),
  KEY `indexone` (`sid`) USING BTREE,
  KEY `indextwo` (`mid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=468 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesmanifestitem`;
CREATE TABLE `salesmanifestitem` (
  `smiid` int(11) NOT NULL AUTO_INCREMENT,
  `siid` int(11) NOT NULL,
  `miid` int(11) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT 0.000,
  `surplus` decimal(10,3) NOT NULL DEFAULT 0.000 COMMENT '余额',
  `type` tinyint(2) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`smiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售采购项';

DROP TABLE IF EXISTS `salespicture`;
CREATE TABLE `salespicture` (
  `spid` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `siid` int(11) NULL COMMENT '销售项ID',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `path` varchar(255) NOT NULL COMMENT '路径',
  `filesize` int(10) NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL COMMENT '类型 1.配送',
  `cuid` int(11) NOT NULL COMMENT '创建人id',
  `createTime` timestamp NULL COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`spid`),
  KEY `indexone` (`sid`) USING BTREE,
  KEY `indextwo` (`siid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=313 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesprofile`;
CREATE TABLE `salesprofile` (
  `spid` int(11) NOT NULL AUTO_INCREMENT COMMENT '画像ID',
  `tid` int(11) NULL DEFAULT 0 COMMENT '模版ID',
  `orderId` varchar(15) NULL COMMENT '装修单ID',
  `name` varchar(128) NOT NULL COMMENT '画像名称',
  `cuid` int(11) NULL DEFAULT 0 COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `type` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`spid`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售画像';

DROP TABLE IF EXISTS `salesprofileitem`;
CREATE TABLE `salesprofileitem` (
  `spiid` int(11) NOT NULL AUTO_INCREMENT,
  `spid` int(11) NULL,
  `name` varchar(128) NULL,
  `bid` int(11) NULL,
  `type` tinyint(1) NULL,
  `require` tinyint(1) NULL DEFAULT 1,
  `content` varchar(255) NULL,
  PRIMARY KEY (`spiid`)
) ENGINE=InnoDB AUTO_INCREMENT=659 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售画像项目';

DROP TABLE IF EXISTS `salesprofileoption`;
CREATE TABLE `salesprofileoption` (
  `spoid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `spiid` int(11) NULL DEFAULT 0 COMMENT '画像模版ID',
  `spid` int(11) NULL DEFAULT 0 COMMENT '画像表ID',
  `title` varchar(64) NULL COMMENT '选项名称',
  `checked` tinyint(1) NOT NULL COMMENT '选项值 ',
  PRIMARY KEY (`spoid`)
) ENGINE=InnoDB AUTO_INCREMENT=1844 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='销售画像选项';

DROP TABLE IF EXISTS `salespurchase`;
CREATE TABLE `salespurchase` (
  `spid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  PRIMARY KEY (`spid`),
  KEY `indexone` (`sid`) USING BTREE,
  KEY `indextwo` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesrefunds`;
CREATE TABLE `salesrefunds` (
  `rid` int(11) NOT NULL AUTO_INCREMENT COMMENT '退货单id',
  `sid` int(11) NOT NULL COMMENT '销售单ID',
  `spid` int(11) NOT NULL COMMENT '款项ID 款项id',
  `total` bigint(10) NOT NULL DEFAULT 0 COMMENT '合计',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NULL,
  `balanceTime` timestamp NULL COMMENT '结算时间',
  `comment` varchar(128) NOT NULL COMMENT '说明',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态',
  `type` tinyint(1) NOT NULL COMMENT '类型 类型',
  `isAffirm` tinyint(1) NULL DEFAULT 1 COMMENT '确认状态 , 0: 确认 , 1: 未确认',
  `affirmTime` timestamp NULL COMMENT '确认时间',
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1326 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `salesrefundsitem`;
CREATE TABLE `salesrefundsitem` (
  `riid` int(11) NOT NULL AUTO_INCREMENT COMMENT '退货项id',
  `sid` int(11) NOT NULL COMMENT '销售单ID 销售单Id',
  `rid` int(11) NOT NULL COMMENT '退货单ID 款项id',
  `siid` int(11) NOT NULL COMMENT '销售项ID',
  `num` bigint(10) NOT NULL DEFAULT 0 COMMENT '数量',
  `total` bigint(10) NOT NULL DEFAULT 0 COMMENT '总额',
  PRIMARY KEY (`riid`)
) ENGINE=InnoDB AUTO_INCREMENT=1841 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;
