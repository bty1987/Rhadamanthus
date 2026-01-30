CREATE DATABASE IF NOT EXISTS `market`;
USE `market`;

-- Generated at 2026-01-06 08:11:02
-- Total tables: 10

DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `caid` int(11) NOT NULL AUTO_INCREMENT COMMENT '名片ID',
  `cuid` int(11) NOT NULL COMMENT '用户ID',
  `userPhoto` varchar(255) NULL COMMENT '头像',
  `userName` varchar(255) NULL COMMENT '姓名',
  `phone` varchar(64) NULL COMMENT '手机号',
  `wechat` varchar(64) NULL COMMENT '微信号',
  `industry` varchar(64) NULL COMMENT '行业',
  `profession` varchar(64) NULL COMMENT '职业',
  `address` varchar(255) NULL COMMENT '地址',
  `info` varchar(255) NULL COMMENT '简介',
  PRIMARY KEY (`caid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='名片表';

DROP TABLE IF EXISTS `cardphoto`;
CREATE TABLE `cardphoto` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '照片墙ID',
  `caid` int(11) NOT NULL COMMENT '名片ID',
  `url` varchar(255) NULL COMMENT '图片',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='照片墙';

DROP TABLE IF EXISTS `cnotice`;
CREATE TABLE `cnotice` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `suid` int(11) NOT NULL COMMENT 'sender发起者',
  `ruid` int(11) NOT NULL COMMENT 'receiver接收者',
  `name` varchar(255) NULL COMMENT '预留的姓名',
  `phone` varchar(64) NULL COMMENT '预留的电话',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态(0未读,1已读)',
  `createTime` timestamp NULL COMMENT '创建时间',
  `comment` varchar(255) NULL COMMENT '备注',
  PRIMARY KEY (`cnid`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='消息事务表';

DROP TABLE IF EXISTS `cuser`;
CREATE TABLE `cuser` (
  `cuid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `unionId` varchar(64) NOT NULL COMMENT '用户unionID',
  PRIMARY KEY (`cuid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='微信用户';

DROP TABLE IF EXISTS `ecase`;
CREATE TABLE `ecase` (
  `cid` int(10) NOT NULL AUTO_INCREMENT,
  `cityId` int(11) NOT NULL,
  `villageName` varchar(255) NOT NULL COMMENT '楼盘名称',
  `duid` int(10) NULL COMMENT '设计师',
  `suid` int(10) NULL COMMENT '监理',
  `style` varchar(255) NULL COMMENT '风格',
  `type` int(2) NOT NULL COMMENT '0:  效果图  1:  施工图',
  `houseType` varchar(255) NULL COMMENT '户型',
  `area` decimal(10,2) NULL COMMENT '面积',
  `cycle` int(10) NULL DEFAULT 0 COMMENT '施工周期',
  `defaultUrl` varchar(255) NULL COMMENT '默认图片',
  `status` int(2) NULL DEFAULT 0 COMMENT '是否首页显示 0:不显示  1:显示',
  `comment` varchar(255) NULL COMMENT '备注说明',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `ecity`;
CREATE TABLE `ecity` (
  `ecid` int(11) NOT NULL AUTO_INCREMENT,
  `city` varchar(64) NOT NULL,
  `pinyin` varchar(64) NOT NULL,
  `x` double NOT NULL DEFAULT 0 COMMENT '经度',
  `y` double NOT NULL DEFAULT 0 COMMENT '纬度',
  PRIMARY KEY (`ecid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='城市表';

DROP TABLE IF EXISTS `ecustomer`;
CREATE TABLE `ecustomer` (
  `ecid` int(11) NOT NULL AUTO_INCREMENT,
  `cityId` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `villageName` varchar(64) NOT NULL,
  `area` decimal(10,2) NOT NULL,
  PRIMARY KEY (`ecid`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `eopinions`;
CREATE TABLE `eopinions` (
  `eoid` int(10) NOT NULL AUTO_INCREMENT,
  `ecid` int(10) NULL,
  `esid` int(10) NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT ' 类型：0: 朋友圈, 1: 锦旗, 2: 其他
',
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NULL,
  PRIMARY KEY (`eoid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `epicture`;
CREATE TABLE `epicture` (
  `epid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '案例id',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 0:案例 1:口碑',
  `url` varchar(64) NOT NULL COMMENT '图片地址',
  PRIMARY KEY (`epid`)
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='图片表';
