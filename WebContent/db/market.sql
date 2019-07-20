CREATE DATABASE  IF NOT EXISTS `market`;
USE `market`;

DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `caid` int(11) NOT NULL AUTO_INCREMENT COMMENT '名片ID',
  `cuid` int(11) NOT NULL COMMENT '用户ID',
  `userPhoto` varchar(255) DEFAULT NULL COMMENT '头像',
  `userName` varchar(255) DEFAULT NULL COMMENT '姓名',
  `phone` varchar(64) DEFAULT NULL COMMENT '手机号',
  `wechat` varchar(64) DEFAULT NULL COMMENT '微信号',
  `industry` varchar(64) DEFAULT NULL COMMENT '行业',
  `profession` varchar(64) DEFAULT NULL COMMENT '职业',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `info` varchar(255) DEFAULT NULL COMMENT '简介',
  PRIMARY KEY (`caid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='名片表';

DROP TABLE IF EXISTS `cardphoto`;
CREATE TABLE `cardphoto` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '照片墙ID',
  `caid` int(11) NOT NULL COMMENT '名片ID',
  `url` varchar(255) DEFAULT NULL COMMENT '图片',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='名片照片墙';

DROP TABLE IF EXISTS `cnotice`;
CREATE TABLE `cnotice` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `suid` int(11) NOT NULL COMMENT 'sender发起者',
  `ruid` int(11) NOT NULL COMMENT 'receiver接收者',
  `name` varchar(255) DEFAULT NULL COMMENT '预留的姓名',
  `phone` varchar(64) DEFAULT NULL COMMENT '预留的电话',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '状态(0未读,1已读)',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`cnid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='消息事务表';

DROP TABLE IF EXISTS `cuser`;
CREATE TABLE `cuser` (
  `cuid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `unionId` varchar(64) NOT NULL COMMENT '用户unionID',
  PRIMARY KEY (`cuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='微信用户';

DROP TABLE IF EXISTS `ecase`;
CREATE TABLE `ecase` (
  `cid` int(10) NOT NULL AUTO_INCREMENT,
  `cityId` int(11) NOT NULL,
  `villageName` varchar(255) NOT NULL COMMENT '楼盘名称',
  `duid` int(10) DEFAULT NULL COMMENT '设计师',
  `suid` int(10) DEFAULT NULL COMMENT '监理',
  `style` varchar(255) DEFAULT NULL COMMENT '风格',
  `type` int(2) NOT NULL COMMENT '0:  效果图  1:  施工图',
  `houseType` varchar(255) DEFAULT NULL COMMENT '户型',
  `area` decimal(10,2) DEFAULT NULL COMMENT '面积',
  `cycle` int(10) DEFAULT '0' COMMENT '施工周期',
  `defaultUrl` varchar(255) DEFAULT NULL COMMENT '默认图片',
  `status` int(2) DEFAULT '0' COMMENT '是否首页显示 0:不显示  1:显示',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注说明',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ecity`;
CREATE TABLE `ecity` (
  `ecid` int(11) NOT NULL AUTO_INCREMENT,
  `city` varchar(64) NOT NULL,
  `pinyin` varchar(64) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`ecid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='城市表';

DROP TABLE IF EXISTS `ecustomer`;
CREATE TABLE `ecustomer` (
  `ecid` int(11) NOT NULL AUTO_INCREMENT,
  `cityId` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `villageName` varchar(64) NOT NULL,
  `area` decimal(10,2) NOT NULL,
  PRIMARY KEY (`ecid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户表';

DROP TABLE IF EXISTS `eperson`;
CREATE TABLE `eperson` (
  `euid` int(11) NOT NULL AUTO_INCREMENT,
  `cityId` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(64) NOT NULL,
  `phone` varchar(128) NOT NULL,
  `experience` tinyint(2) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `imgUrl` varchar(255) NOT NULL,
  `info` varchar(255) NOT NULL,
  PRIMARY KEY (`euid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员';

DROP TABLE IF EXISTS `epicture`;
CREATE TABLE `epicture` (
  `epid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '案例id',
  `url` varchar(64) NOT NULL COMMENT '图片地址',
  PRIMARY KEY (`epid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='图片表';
