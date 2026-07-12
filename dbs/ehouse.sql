CREATE DATABASE  IF NOT EXISTS `ehouse`;
USE `ehouse`;

DROP TABLE IF EXISTS `euser`;
CREATE TABLE `euser` (
`euid`  int(11) NOT NULL AUTO_INCREMENT FIRST ,
`cityId` int(11) NOT NULL ,
`name`  varchar(32) NOT NULL ,
`phone`  varchar(128) NOT NULL ,
`experience`  tinyint(2) NOT NULL ,
`type`  tinyint(1) NOT NULL ,
`imgUrl`  varchar(255) NOT NULL ,
`info`  varchar(255) NOT NULL ,
PRIMARY KEY (`euid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员';

DROP TABLE IF EXISTS `case`;
CREATE TABLE `case`  (
  `cid` int(10) NOT NULL AUTO_INCREMENT FIRST,
  `cityId` int(11) NOT NULL ,
  `villageName` varchar(255) NOT NULL COMMENT '楼盘名称',
  `duid` int(10) NOT NULL COMMENT '设计师',
  `suid` int(10) NOT NULL COMMENT '监理',
  `style` varchar(255) NULL COMMENT '风格',
  `type` int(2) NOT NULL COMMENT '0:  效果图  1:  施工图',
  `houseType` varchar(255) NULL COMMENT '户型',
  `area` decimal(10, 2) NULL COMMENT '面积',
  `cycle` int(10) NULL COMMENT '施工周期',
  `defaultUrl` varchar(255) NOT NULL COMMENT '默认图片',
  `status` int(2) NULL DEFAULT 0 COMMENT '是否首页显示 0:不显示  1:显示',
  `comment` varchar(255) NULL COMMENT '备注说明',
  PRIMARY KEY (`cid`)
);

DROP TABLE IF EXISTS `epicture`;
CREATE TABLE `epicture`(
`epid`  int(11) NOT  NULL  AUTO_INCREMENT ,
`cid`  int(11) NOT  NULL  COMMENT '案例id',
`url`  varchar(64) NOT NULL COMMENT '图片地址',
PRIMARY KEY(`epid`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='图片表';

DROP TABLE IF EXISTS `ecustomer`;
CREATE TABLE `ecustomer` (
`ecid`  int(11) NOT NULL AUTO_INCREMENT ,
`cityId` int(11) NOT NULL ,
`name`  varchar(32) NOT NULL ,
`phone`  varchar(32) NOT NULL ,
`villageName`  varchar(64) NOT NULL ,
`area`  decimal(10,2) NOT NULL ,
PRIMARY KEY (`ecid`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户表';

DROP TABLE IF EXISTS `ecity`;
CREATE TABLE `ecity` (
  `ecid`  int(11) NOT NULL AUTO_INCREMENT ,
  `city`  varchar(64) NOT NULL ,
  `x`  double NOT NULL DEFAULT '0',
  `y`  double NOT NULL DEFAULT '0',
PRIMARY KEY (`ecid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='城市表';