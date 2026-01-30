CREATE DATABASE IF NOT EXISTS `store`;
USE `store`;

-- Generated at 2026-01-06 08:11:04
-- Total tables: 17

DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `aid` int(11) NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `phone` varchar(32) NOT NULL COMMENT '联系电话',
  `province` varchar(32) NULL,
  `city` varchar(32) NULL,
  `proper` varchar(64) NULL,
  `address` varchar(128) NOT NULL COMMENT '详细地址',
  `status` tinyint(1) NOT NULL COMMENT '默认地址(0:否 1:是 2:无效)',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='地址';

DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `pid` int(11) NOT NULL COMMENT '价格ID',
  `num` int(6) NOT NULL COMMENT '商品数量',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='购物车';

DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL COMMENT '价格ID',
  `title` varchar(256) NOT NULL,
  `value` bigint(10) NOT NULL DEFAULT 0 COMMENT '劵值',
  `type` tinyint(1) NOT NULL COMMENT '类型(0:券值 1:折扣)',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='卷信

息';

DROP TABLE IF EXISTS `evaluate`;
CREATE TABLE `evaluate` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL COMMENT '订单ID',
  `pid` int(11) NOT NULL COMMENT '价格ID',
  `gid` int(11) NOT NULL,
  `unionId` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `score` tinyint(1) NOT NULL COMMENT '评分',
  `comment` varchar(256) NULL COMMENT '评价',
  `discribeRate` tinyint(1) NOT NULL COMMENT '描述评价',
  `logisticsRate` tinyint(1) NOT NULL COMMENT '物流评价',
  `serviceRate` tinyint(1) NOT NULL COMMENT '服务评价',
  `imgs` varchar(256) NULL COMMENT '图片路径',
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商城评价';

DROP TABLE IF EXISTS `mbrand`;
CREATE TABLE `mbrand` (
  `bid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Ʒ',
  `cid` int(11) NOT NULL COMMENT 'Ʒ',
  `name` varchar(32) NOT NULL COMMENT 'Ʒ',
  `icon` varchar(256) NOT NULL COMMENT 'Ʒ',
  `status` tinyint(1) NOT NULL COMMENT '״̬(0:',
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='Ʒ';

DROP TABLE IF EXISTS `mcategory`;
CREATE TABLE `mcategory` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Ʒ',
  `name` varchar(15) NOT NULL COMMENT 'Ʒ',
  `icon` varchar(256) NOT NULL COMMENT 'Ʒ',
  `isShow` tinyint(1) NOT NULL COMMENT '״̬(0:',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='Ʒ';

DROP TABLE IF EXISTS `mcolor`;
CREATE TABLE `mcolor` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `color` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '״̬(0:',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `mformat`;
CREATE TABLE `mformat` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `format` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '״̬(0:',
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `mgoods`;
CREATE TABLE `mgoods` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(64) NOT NULL,
  `bid` int(11) NOT NULL COMMENT 'Ʒ',
  `barcode` varchar(32) NOT NULL,
  `title` varchar(256) NOT NULL,
  `defaultImg` varchar(256) NULL,
  `price` bigint(10) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL COMMENT '״̬(0:',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `morder`;
CREATE TABLE `morder` (
  `oid` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `no` varchar(15) NOT NULL COMMENT '订单编号',
  `unionId` varchar(64) NOT NULL,
  `rmunionId` varchar(64) NULL,
  `cid` int(11) NULL,
  `total` bigint(10) NOT NULL DEFAULT 0 COMMENT '总价',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paymentTime` timestamp NULL COMMENT '支付时间',
  `address` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=486 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单表';

DROP TABLE IF EXISTS `morderitem`;
CREATE TABLE `morderitem` (
  `oiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单项ID',
  `oid` int(11) NOT NULL COMMENT '订单ID',
  `pid` int(11) NOT NULL COMMENT '价格ID',
  `num` int(8) NOT NULL DEFAULT 0 COMMENT '商品数量',
  PRIMARY KEY (`oiid`)
) ENGINE=InnoDB AUTO_INCREMENT=529 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='订单项';

DROP TABLE IF EXISTS `mpayment`;
CREATE TABLE `mpayment` (
  `mpid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL COMMENT '订单id',
  `totalPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '总价',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`mpid`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商城款项';

DROP TABLE IF EXISTS `mprice`;
CREATE TABLE `mprice` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `name` varchar(32) NULL,
  `price` bigint(10) NOT NULL DEFAULT 0 COMMENT '价格',
  `img` varchar(256) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '״̬(0:',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `muser`;
CREATE TABLE `muser` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `unionId` varchar(64) NOT NULL COMMENT '用户union',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `phone` varchar(32) NULL COMMENT '联系电话',
  `gender` tinyint(1) NOT NULL COMMENT '性别(0:女 1:男)',
  `birthday` date NULL COMMENT '生日',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='用户';

DROP TABLE IF EXISTS `musercoupon`;
CREATE TABLE `musercoupon` (
  `mcid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '券ID',
  `unionId` varchar(64) NOT NULL COMMENT '推荐人unionId',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`mcid`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='用户

券';

DROP TABLE IF EXISTS `picture`;
CREATE TABLE `picture` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `img` varchar(256) NOT NULL COMMENT 'ͼƬ·',
  `type` tinyint(1) NOT NULL COMMENT 'ͼƬ',
  `sort` tinyint(1) NOT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1246 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `slide`;
CREATE TABLE `slide` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NULL,
  `img` varchar(256) NOT NULL COMMENT 'ͼƬ·',
  `url` varchar(256) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '״̬(0:',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;
