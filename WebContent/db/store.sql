CREATE DATABASE  IF NOT EXISTS `store`;
USE `store`;


DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `aid` int(11) NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `phone` varchar(32) DEFAULT NULL COMMENT '联系电话',
  `address` varchar(128) NOT NULL COMMENT '详细地址',
  `status` tinyint(1) NOT NULL COMMENT '默认地址(0:否 1:是 2:无效)',
  `province` varchar(32) DEFAULT NULL,
  `city` varchar(32) DEFAULT NULL,
  `proper` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='地址';

DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `pid` int(11) NOT NULL COMMENT '价格ID',
  `num` int(6) NOT NULL COMMENT '商品数量',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='购物车';

DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `title` varchar(256) NOT NULL COMMENT '标题',
  `value` bigint(10) NOT NULL DEFAULT '0' COMMENT '劵值',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='卷信息';

DROP TABLE IF EXISTS `evaluate`;
CREATE TABLE `evaluate` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL COMMENT '订单ID',
  `gid` int(11) DEFAULT NULL,
  `pid` int(11) NOT NULL COMMENT '价格ID',
  `unionId` varchar(64) NOT NULL COMMENT '关联ID',
  `name` varchar(32) NOT NULL COMMENT '用户姓名',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `score` tinyint(1) NOT NULL COMMENT '评分',
  `comment` varchar(256) DEFAULT NULL COMMENT '评价',
  `discribeRate` tinyint(1) NOT NULL COMMENT '描述评价',
  `logisticsRate` tinyint(1) NOT NULL COMMENT '物流评价',
  `serviceRate` tinyint(1) NOT NULL COMMENT '服务评价',
  `imgs` varchar(256) DEFAULT NULL COMMENT '图片路径',
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商城评价';

DROP TABLE IF EXISTS `mbrand`;
CREATE TABLE `mbrand` (
  `bid` int(11) NOT NULL AUTO_INCREMENT COMMENT '品牌ID' ,
  `cid` int(11) NOT NULL COMMENT '品类ID' ,
  `name` varchar(32) NOT NULL COMMENT '品牌名称' ,
  `icon` varchar(256) NOT NULL COMMENT '品牌logo图片' ,
  `status` tinyint(1) NOT NULL COMMENT '状态(0:启用 1：禁用)',
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌';

DROP TABLE IF EXISTS `mcategory`;
CREATE TABLE `mcategory` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '品类ID',
  `name` varchar(15) NOT NULL COMMENT '品类名称',
  `icon` varchar(256) NOT NULL COMMENT '品类logo图片',
  `isShow` tinyint(1) NOT NULL COMMENT '状态(0:首页不显示 1:首页显示)',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品类';

DROP TABLE IF EXISTS `mcolor`;
CREATE TABLE `mcolor` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '颜色ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `color` varchar(32) NOT NULL COMMENT '商品颜色',
  `status` tinyint(1) NOT NULL COMMENT '状态(0:启用 1:禁用)',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='颜色';

DROP TABLE IF EXISTS `mformat`;
CREATE TABLE `mformat` (
  `fid` int(11) NOT NULL AUTO_INCREMENT COMMENT '规格ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `format` varchar(32) NOT NULL COMMENT '商品规格',
  `status` tinyint(1) NOT NULL COMMENT '状态(0:启用 1:禁用)',
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='规格';

DROP TABLE IF EXISTS `mgoods`;
CREATE TABLE `mgoods` (
  `gid` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `no` varchar(15) NOT NULL COMMENT '商品编号',
  `name` varchar(32) NOT NULL COMMENT '商品名称',
  `pinyin` varchar(64) NOT NULL COMMENT '商品名称拼音',
  `barcode` varchar(32) NOT NULL COMMENT '条形码',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `title` varchar(256) NOT NULL COMMENT '标题',
  `price` bigint(10) NOT NULL DEFAULT '0',
  `defaultImg` varchar(256) NOT NULL COMMENT '商品图片',
  `status` tinyint(1) NOT NULL COMMENT '状态(0:启用 1：禁用)',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品';

DROP TABLE IF EXISTS `morder`;
CREATE TABLE `morder` (
  `oid` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `no` varchar(15) NOT NULL COMMENT '订单编号',
  `unionId` varchar(64) NOT NULL,
  `rmunionId` varchar(64) DEFAULT NULL COMMENT '推荐人',
  `total` bigint(10) NOT NULL DEFAULT '0' COMMENT '总价',
  `address` varchar(255) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paymentTime` timestamp NULL DEFAULT NULL COMMENT '支付时间',
  `status` tinyint(1) NOT NULL COMMENT '状态(0:待付款 1:待发货 2:待收货 3:已收货 4:已删除)',
  `cid` int(11) DEFAULT NULL COMMENT '优惠券ID',
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单';

DROP TABLE IF EXISTS `morderitem`;
CREATE TABLE `morderitem` (
  `oiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单项ID',
  `oid` int(11) NOT NULL COMMENT '订单ID',
  `pid` int(11) NOT NULL COMMENT '价格ID',
  `num` int(8) NOT NULL DEFAULT '0' COMMENT '商品数量',
  PRIMARY KEY (`oiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单项';

DROP TABLE IF EXISTS `mpayment`;
CREATE TABLE `mpayment` (
  `mpid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL COMMENT '订单id',
  `totalPrice` bigint(10) NOT NULL DEFAULT '0' COMMENT '总价',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`mpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商城款项';

DROP TABLE IF EXISTS `mprice`;
CREATE TABLE `mprice` (
  `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '价格ID',
  `name` varchar(32) DEFAULT NULL COMMENT '价格名称',
  `price` bigint(10) NOT NULL DEFAULT '0' COMMENT '价格',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL COMMENT '颜色ID',
  `fid` int(11) NOT NULL COMMENT '规格ID',
  `img` varchar(256) NOT NULL COMMENT '商品图片',
  `status` tinyint(1) NOT NULL COMMENT '状态(0:有效 1:无效 2:人气 3:推荐)',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='价格';

DROP TABLE IF EXISTS `muser`;
CREATE TABLE `muser` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `unionId` varchar(32) NOT NULL COMMENT '用户union',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `phone` varchar(32) DEFAULT NULL COMMENT '联系电话',
  `gender` tinyint(1) NOT NULL COMMENT '性别(0:女 1:男)',
  `birthday` date DEFAULT NULL COMMENT '生日',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户';

DROP TABLE IF EXISTS `musercoupon`;
CREATE TABLE `musercoupon` (
  `mcid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '券ID',
  `unionId` varchar(64) NOT NULL COMMENT '推荐人unionId',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`mcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户券';

DROP TABLE IF EXISTS `picture`;
CREATE TABLE `picture` (
  `pid` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品图片ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `img` varchar(256) NOT NULL COMMENT '图片路径',
  `type` tinyint(1) NOT NULL COMMENT '图片类型(0:图片轮播图 1:详情图)',
  `sort` tinyint(1) NOT NULL COMMENT '排序',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品图片';

DROP TABLE IF EXISTS `slide`;
CREATE TABLE `slide` (
  `sid` int(11) NOT NULL AUTO_INCREMENT COMMENT '轮播图片ID',
  `gid` int(11) DEFAULT NULL COMMENT '商品ID',
  `img` varchar(256) NOT NULL COMMENT '图片路径',
  `url` varchar(256) NOT NULL COMMENT '活动链接',
  `status` tinyint(1) NOT NULL COMMENT '状态(0:有效 1:无效)',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='轮播图片';
