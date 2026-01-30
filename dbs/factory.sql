CREATE DATABASE IF NOT EXISTS `factory`;
USE `factory`;

-- Generated at 2026-01-06 08:11:04
-- Total tables: 6

DROP TABLE IF EXISTS `logininfo`;
CREATE TABLE `logininfo` (
  `liid` int(11) NOT NULL AUTO_INCREMENT,
  `loginFlag` varchar(32) NOT NULL,
  `code` int(11) NOT NULL DEFAULT -1 COMMENT '-1 无确认, 0 成功 , 其他错误码',
  `message` varchar(64) NOT NULL DEFAULT '',
  `authentication` varchar(512) NOT NULL DEFAULT '',
  `optime` bigint(20) NOT NULL,
  `x` double NOT NULL DEFAULT 0,
  `y` double NOT NULL DEFAULT 0,
  PRIMARY KEY (`liid`),
  KEY `indexone` (`loginFlag`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=136155 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='二维码登陆信息';

DROP TABLE IF EXISTS `macontrol`;
CREATE TABLE `macontrol` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `mac` varchar(12) NOT NULL,
  `ip` varchar(20) NOT NULL,
  `buid` int(11) NOT NULL COMMENT '归属人ID',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态, 0启用, 1禁用',
  `comment` varchar(128) NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='计量单位表';

DROP TABLE IF EXISTS `monitor`;
CREATE TABLE `monitor` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `host` varchar(20) NOT NULL,
  `type` varchar(16) NOT NULL,
  `value` varchar(32) NOT NULL DEFAULT '',
  `comment` varchar(512) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `count` int(11) NOT NULL DEFAULT 0,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='监控';

DROP TABLE IF EXISTS `server`;
CREATE TABLE `server` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `host` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  `comment` varchar(64) NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='服务信息';

DROP TABLE IF EXISTS `token`;
CREATE TABLE `token` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tid`),
  KEY `indexone` (`key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='token表';

DROP TABLE IF EXISTS `trackpoint`;
CREATE TABLE `trackpoint` (
  `tpId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tpId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='轨迹点表';
