CREATE DATABASE IF NOT EXISTS `inventory`;
USE `inventory`;

-- Generated at 2026-01-06 08:11:03
-- Total tables: 27

DROP TABLE IF EXISTS `accessories`;
CREATE TABLE `accessories` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `hid` int(11) NOT NULL,
  `csid` int(11) NOT NULL,
  `cnid` int(11) NULL DEFAULT 0,
  `suid` int(11) NULL,
  `cuid` int(11) NOT NULL,
  `auid` int(11) NULL,
  `duid` int(11) NULL COMMENT '送货人Id',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approverTime` timestamp NULL,
  `fetchTime` timestamp NULL,
  `deliverTime` timestamp NULL COMMENT '送货时间',
  `schedule` tinyint(1) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `printnum` int(11) NOT NULL DEFAULT 0 COMMENT '打印次数 打印次数',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0:初始',
  `total` bigint(10) NOT NULL DEFAULT 0,
  `comment` varchar(128) NULL COMMENT '备注',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=873 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='辅料订单';

DROP TABLE IF EXISTS `accessoriesitem`;
CREATE TABLE `accessoriesitem` (
  `aiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `selling` int(8) NOT NULL DEFAULT 0,
  `num` int(8) NOT NULL DEFAULT 0,
  `surplus` int(8) NOT NULL DEFAULT 0,
  `normunit` varchar(15) NULL DEFAULT '0' COMMENT '定额单位',
  `normnum` int(8) NULL DEFAULT 0 COMMENT '定额数量',
  `storeunit` varchar(15) NULL DEFAULT '0' COMMENT '库房单位',
  `storenum` varchar(8) NULL DEFAULT '0' COMMENT '库房数量',
  `caid` int(11) NOT NULL,
  `nid` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`aiid`),
  KEY `indexone` (`aid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1097 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='辅料订单';

DROP TABLE IF EXISTS `accessoriesmanifest`;
CREATE TABLE `accessoriesmanifest` (
  `amid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL COMMENT '辅料单ID',
  `mid` int(11) NOT NULL COMMENT '货单ID',
  PRIMARY KEY (`amid`)
) ENGINE=InnoDB AUTO_INCREMENT=526 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='辅料货单';

DROP TABLE IF EXISTS `accessoriestype`;
CREATE TABLE `accessoriestype` (
  `atid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `wtid` int(11) NOT NULL COMMENT '工种ID',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(64) NULL,
  PRIMARY KEY (`atid`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='辅类';

DROP TABLE IF EXISTS `checklist`;
CREATE TABLE `checklist` (
  `clid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `shid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT 0.000,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`clid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='盘点列表';

DROP TABLE IF EXISTS `color`;
CREATE TABLE `color` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cid`),
  KEY `indexone` (`gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5357 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商品颜色';

DROP TABLE IF EXISTS `format`;
CREATE TABLE `format` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `info` varchar(64) NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`fid`),
  KEY `indexone` (`gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3001 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商品规格';

DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `barcode` varchar(128) NOT NULL DEFAULT '' COMMENT '条形码',
  `category` varchar(32) NOT NULL,
  `bid` int(11) NOT NULL,
  `brand` varchar(32) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `purchase` int(8) NULL DEFAULT 0,
  `selling` int(8) NULL DEFAULT 0,
  `pieceNum` int(8) NOT NULL DEFAULT 0,
  `atid` int(11) NULL COMMENT '辅类ID',
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`gid`),
  KEY `indexone` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15018 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商品';

DROP TABLE IF EXISTS `goodspackage`;
CREATE TABLE `goodspackage` (
  `gpid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '套餐ID,对应商品gid',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `num` int(8) NOT NULL DEFAULT 0,
  PRIMARY KEY (`gpid`),
  KEY `indexone` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='套餐';

DROP TABLE IF EXISTS `goodsstorehousestock`;
CREATE TABLE `goodsstorehousestock` (
  `gshsid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `shid` int(11) NOT NULL COMMENT '仓库ID',
  `num` int(8) NOT NULL DEFAULT 0,
  PRIMARY KEY (`gshsid`),
  KEY `indexone` (`gid`, `cid`, `fid`, `shid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=224 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商品仓库存量';

DROP TABLE IF EXISTS `inventorydrawing`;
CREATE TABLE `inventorydrawing` (
  `idid` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `sid` int(11) NULL COMMENT '关联ID',
  `name` varchar(32) NULL COMMENT '名称',
  `path` varchar(255) NULL COMMENT '路径',
  `size` int(11) NULL COMMENT '图片大小',
  `type` tinyint(1) NULL COMMENT '类型',
  `atttype` tinyint(1) NULL COMMENT '业务类型',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `createTime` timestamp NULL COMMENT '创建时间',
  `status` tinyint(1) NULL COMMENT '状态 , 0: 有效 , 1: 无效',
  PRIMARY KEY (`idid`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='仓储图片表';

DROP TABLE IF EXISTS `manifest`;
CREATE TABLE `manifest` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NULL,
  `manifestTime` timestamp NULL,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `comment` varchar(128) NULL DEFAULT '',
  `attachment` varchar(256) NOT NULL DEFAULT '',
  `qmid` int(11) NULL COMMENT '引用货单ID',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=2278 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='货单';

DROP TABLE IF EXISTS `manifestitem`;
CREATE TABLE `manifestitem` (
  `miid` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NOT NULL,
  `siid` int(11) NULL DEFAULT 0,
  `piid` int(11) NULL DEFAULT 0 COMMENT '采购项ID',
  `aiid` int(11) NULL DEFAULT 0,
  `qiid` int(11) NULL DEFAULT 0,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `sid` int(11) NULL COMMENT '供应商ID',
  `ishid` int(11) NULL COMMENT '进仓库ID',
  `oshid` int(11) NULL COMMENT '出仓库ID',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `inprice` int(8) NOT NULL DEFAULT 0 COMMENT '入库价',
  `outprice` int(8) NOT NULL DEFAULT 0 COMMENT '出库价',
  `num` int(8) NOT NULL DEFAULT 0,
  `surplus` int(8) NOT NULL DEFAULT 0,
  `comment` varchar(256) NULL,
  `qmiid` int(11) NULL COMMENT '引用货单项ID',
  PRIMARY KEY (`miid`),
  KEY `indexone` (`mid`) USING BTREE,
  KEY `indextwo` (`siid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2309 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='货单项';

DROP TABLE IF EXISTS `manifesttemplate`;
CREATE TABLE `manifesttemplate` (
  `mtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mtid`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='货单模版';

DROP TABLE IF EXISTS `manifesttemplateitem`;
CREATE TABLE `manifesttemplateitem` (
  `mtiid` int(11) NOT NULL AUTO_INCREMENT,
  `mtid` int(11) NOT NULL,
  `gid` int(11) NOT NULL,
  PRIMARY KEY (`mtiid`),
  KEY `indexone` (`mtid`, `gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='货单模版项';

DROP TABLE IF EXISTS `occessories`;
CREATE TABLE `occessories` (
  `oid` int(11) NOT NULL AUTO_INCREMENT COMMENT '外辅单ID',
  `no` varchar(15) NOT NULL COMMENT '外辅单号',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `deuid` int(11) NULL,
  `reuid` int(11) NULL,
  `svuid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(2) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL COMMENT '公司 公司',
  `spuid` int(11) NULL COMMENT '厂商ID',
  `buid` int(11) NULL COMMENT '结算人',
  `deliveTime` timestamp NULL COMMENT '配送时间',
  `receiveTime` timestamp NULL COMMENT '接收时间',
  `balanceTime` timestamp NULL COMMENT '结算时间',
  `finishTime` timestamp NULL,
  `total` bigint(10) NOT NULL DEFAULT 0,
  `isEnter` tinyint(2) NOT NULL COMMENT '是否可进园区',
  `isLift` tinyint(2) NOT NULL COMMENT '是否有电梯',
  `isExceed` tinyint(2) NOT NULL COMMENT '是否超阶',
  `isAttic` tinyint(2) NOT NULL COMMENT '是否有阁楼',
  `comment` varchar(128) NULL COMMENT '备注',
  `content` varchar(128) NULL COMMENT '说明',
  `rate` int(11) NULL DEFAULT 0 COMMENT '评分',
  `remake` varchar(128) NULL COMMENT '评价',
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `occessoriescost`;
CREATE TABLE `occessoriescost` (
  `ocid` int(11) NOT NULL AUTO_INCREMENT COMMENT '外辅费用ID 外辅费用ID',
  `oid` int(11) NOT NULL COMMENT '辅料单ID 辅料单ID',
  `initprice` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0 COMMENT '金额 金额',
  `cost` int(11) NOT NULL DEFAULT 0 COMMENT '成本 成本',
  `type` tinyint(2) NOT NULL COMMENT '0: 车运费 , 1: 搬运费 , 2: 上楼费 类型 , 0: 车运费 , 1: 搬运费 , 2: 上楼费',
  `status` tinyint(2) NOT NULL COMMENT '状态 , 0: 初始',
  PRIMARY KEY (`ocid`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `occessoriesitem`;
CREATE TABLE `occessoriesitem` (
  `oiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '外辅项ID',
  `oid` int(11) NOT NULL COMMENT '外辅单ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `num` int(8) NOT NULL COMMENT '数量',
  `recnum` int(11) NOT NULL COMMENT '到货数量 到货数量',
  `sennum` int(11) NOT NULL COMMENT '送货数量 送货数量',
  `rbalance` int(11) NOT NULL COMMENT '原结算价 原结算价',
  `vbalance` int(11) NOT NULL COMMENT '结算价 结算价',
  PRIMARY KEY (`oiid`)
) ENGINE=InnoDB AUTO_INCREMENT=286 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `price`;
CREATE TABLE `price` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `purchase` int(8) NOT NULL DEFAULT 0,
  `selling` int(8) NOT NULL DEFAULT 0,
  `ctype` tinyint(1) NOT NULL DEFAULT 0,
  `cvalue` int(8) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  PRIMARY KEY (`pid`),
  KEY `indexone` (`gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1717 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商品价格';

DROP TABLE IF EXISTS `purchase`;
CREATE TABLE `purchase` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `balanceTime` timestamp NULL COMMENT '结算时间',
  `deliveryTime` timestamp NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `balanceStatus` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(128) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=294 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='采购单';

DROP TABLE IF EXISTS `purchaseamount`;
CREATE TABLE `purchaseamount` (
  `paid` int(11) NOT NULL AUTO_INCREMENT,
  `month` varchar(6) NOT NULL,
  `money` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`paid`),
  KEY `indexone` (`month`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='采购金额';

DROP TABLE IF EXISTS `purchasebalance`;
CREATE TABLE `purchasebalance` (
  `pbid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `balance` bigint(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `comment` varchar(128) NULL,
  PRIMARY KEY (`pbid`),
  KEY `indexone` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `purchaseitem`;
CREATE TABLE `purchaseitem` (
  `piid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '采购单ID',
  `siid` int(11) NULL COMMENT '销售项ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `inprice` int(8) NOT NULL DEFAULT 0,
  `num` int(8) NOT NULL DEFAULT 0,
  `surplus` int(8) NOT NULL DEFAULT 0 COMMENT '剩余数量',
  PRIMARY KEY (`piid`),
  KEY `indexone` (`pid`) USING BTREE,
  KEY `indextwo` (`siid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=392 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='采购项';

DROP TABLE IF EXISTS `purchasemanifest`;
CREATE TABLE `purchasemanifest` (
  `pmid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '采购单ID',
  `mid` int(11) NOT NULL COMMENT '货单ID',
  PRIMARY KEY (`pmid`)
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='采购货单';

DROP TABLE IF EXISTS `storehouse`;
CREATE TABLE `storehouse` (
  `shid` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`shid`),
  KEY `name` (`name`) USING BTREE,
  KEY `shid` (`shid`, `code`, `name`, `status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='仓库';

DROP TABLE IF EXISTS `storehousestock`;
CREATE TABLE `storehousestock` (
  `shsid` int(11) NOT NULL AUTO_INCREMENT,
  `shid` int(11) NOT NULL COMMENT '仓库ID',
  `month` varchar(6) NOT NULL,
  `num` decimal(10,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`shsid`),
  KEY `indexone` (`shid`, `month`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='库存';

DROP TABLE IF EXISTS `storehouseuser`;
CREATE TABLE `storehouseuser` (
  `shuid` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) NOT NULL,
  `shId` int(11) NOT NULL,
  PRIMARY KEY (`shuid`),
  KEY `indexone` (`uId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1308 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='仓库人员表';
