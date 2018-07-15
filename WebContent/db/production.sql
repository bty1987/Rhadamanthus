CREATE DATABASE  IF NOT EXISTS `production` ;
USE `production`;

DROP TABLE IF EXISTS `hardware`;
CREATE TABLE `hardware` (
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未到货 1已到货 2废除',
  `path` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  PRIMARY KEY (`hid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='五金单表';

DROP TABLE IF EXISTS `hardwareitem`;
CREATE TABLE `hardwareitem` (
  `hiid` int(11) NOT NULL AUTO_INCREMENT,
  `hid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL DEFAULT ' ',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `unitprice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `measurementunit` varchar(10) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`hiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='五金项表';

DROP TABLE IF EXISTS `outsource`;
CREATE TABLE `outsource` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未到货 1已到货 2废除',
  `path` varchar(128) NOT NULL DEFAULT ' ',
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外协单表';

DROP TABLE IF EXISTS `outsourceitem`;
CREATE TABLE `outsourceitem` (
  `oiid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `height` decimal(10,3) NOT NULL DEFAULT '0.000',
  `width` decimal(10,3) NOT NULL DEFAULT '0.000',
  `thick` decimal(10,3) NOT NULL DEFAULT '0.000',
  `modelling` varchar(128) NOT NULL DEFAULT ' ' COMMENT '造型',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `unitprice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  PRIMARY KEY (`oiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外协项表';

DROP TABLE IF EXISTS `production`;
CREATE TABLE `production` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `pno` varchar(20) NOT NULL COMMENT '生产单编号',
  `orderId` varchar(10) NOT NULL,
  `vid` int(11) NOT NULL COMMENT '楼盘ID',
  `houseNumber` varchar(512) NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `duid` int(11) NOT NULL COMMENT '设计师ID',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0初始;1签约;2已审核;3生产;4废单;',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `divideTime` timestamp NULL DEFAULT NULL COMMENT '拆单时间',
  `confirmTime` timestamp NULL DEFAULT NULL COMMENT '确认时间',
  `diliverystatus` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未送货;1已送货',
  `diliveryTime` timestamp NULL DEFAULT NULL COMMENT '送货时间',
  `timeLimit` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '工期',
  `spid` varchar(20) NOT NULL DEFAULT '0' COMMENT '父级生产单ID',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0生产;1售后;',
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='生产单表';

DROP TABLE IF EXISTS `productionpicture`;
CREATE TABLE `productionpicture` (
  `ppid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `path` varchar(128) NOT NULL DEFAULT ' ',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0初版;1终版;2废除',
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='图纸表';

DROP TABLE IF EXISTS `productionplan`;
CREATE TABLE `productionplan` (
  `ppid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `no` varchar(32) NOT NULL,
  `path` varchar(128) NOT NULL DEFAULT ' ',
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投料时间',
  `endTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '出货时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 初始 1入库 2送货',
  `comment` varchar(64) NOT NULL,
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划单表';

DROP TABLE IF EXISTS `productionplanitem`;
CREATE TABLE `productionplanitem` (
  `ppiid` int(11) NOT NULL AUTO_INCREMENT,
  `ppid` int(11) NOT NULL,
  `typeno` varchar(32) NOT NULL DEFAULT ' ' COMMENT '型号',
  `name` varchar(32) NOT NULL DEFAULT ' ',
  `height` decimal(10,3) NOT NULL DEFAULT '0.000',
  `width` decimal(10,3) NOT NULL DEFAULT '0.000',
  `thick` decimal(10,3) NOT NULL DEFAULT '0.000',
  `color` varchar(32) NOT NULL DEFAULT ' ',
  `unitprice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  PRIMARY KEY (`ppiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划单项表';

DROP TABLE IF EXISTS `productionsales`;
CREATE TABLE `productionsales` (
  `psid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `sid` int(11) NOT NULL DEFAULT '0',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 主材单;1 销售单',
  PRIMARY KEY (`psid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='生产销售表';

DROP TABLE IF EXISTS `productionuserworkflow`;
CREATE TABLE `productionuserworkflow` (
  `puwfid` int(11) NOT NULL AUTO_INCREMENT,
  `pwfid` int(11) NOT NULL COMMENT '计划工序ID',
  `ouid` int(11) DEFAULT NULL COMMENT '操作人ID',
  `operateTime` timestamp NULL DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`puwfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='生产人员工序表';

DROP TABLE IF EXISTS `productionworkflow`;
CREATE TABLE `productionworkflow` (
  `pwfid` int(11) NOT NULL AUTO_INCREMENT,
  `pwpid` int(11) NOT NULL,
  `wfid` int(11) NOT NULL,
  PRIMARY KEY (`pwfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划工序表';

DROP TABLE IF EXISTS `productionworkplan`;
CREATE TABLE `productionworkplan` (
  `pwpid` int(11) NOT NULL AUTO_INCREMENT,
  `ppid` int(11) NOT NULL,
  `wpid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0初始;1已执行',
  PRIMARY KEY (`pwpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划工序组表';

DROP TABLE IF EXISTS `quotation`;
CREATE TABLE `quotation` (
  `qid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `discount` decimal(10,3) NOT NULL DEFAULT '0.000',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1正使用;0未使用',
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  PRIMARY KEY (`qid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价单表';

DROP TABLE IF EXISTS `quotationitem`;
CREATE TABLE `quotationitem` (
  `qiid` int(11) NOT NULL AUTO_INCREMENT,
  `qid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `format` varchar(32) NOT NULL DEFAULT ' ',
  `height` decimal(10,3) NOT NULL DEFAULT '0.000',
  `width` decimal(10,3) NOT NULL DEFAULT '0.000',
  `thick` decimal(10,3) NOT NULL DEFAULT '0.000',
  `num` decimal(10,3) NOT NULL DEFAULT '0.000',
  `unitprice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `total` decimal(10,3) NOT NULL DEFAULT '0.000',
  `measurementunit` varchar(10) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  `specil` varchar(128) NOT NULL DEFAULT ' ' COMMENT '特型',
  `qtid` int(11) NOT NULL COMMENT '报价类型',
  PRIMARY KEY (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价单项表';

DROP TABLE IF EXISTS `quoteitem`;
CREATE TABLE `quoteitem` (
  `qiid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `format` varchar(32) NOT NULL DEFAULT ' ' COMMENT '型号',
  `measurementunit` varchar(10) NOT NULL,
  `unitprice` decimal(10,3) NOT NULL DEFAULT '0.000',
  `qtid` int(11) NOT NULL COMMENT '报价类型',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0启用;1禁用',
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项表';

DROP TABLE IF EXISTS `quotetype`;
CREATE TABLE `quotetype` (
  `qtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0启用;1禁用',
  PRIMARY KEY (`qtid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价类型表';

DROP TABLE IF EXISTS `userworkflow`;
CREATE TABLE `userworkflow` (
  `uwid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `wfid` int(11) NOT NULL,
  PRIMARY KEY (`uwid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员-工序表';

DROP TABLE IF EXISTS `workflow`;
CREATE TABLE `workflow` (
  `wfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`wfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工序表';

DROP TABLE IF EXISTS `workflowplan`;
CREATE TABLE `workflowplan` (
  `wfpid` int(11) NOT NULL AUTO_INCREMENT,
  `wfid` int(11) NOT NULL,
  `wpid` int(11) NOT NULL,
  PRIMARY KEY (`wfpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工序组-工序表';

DROP TABLE IF EXISTS `workplan`;
CREATE TABLE `workplan` (
  `wpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0启用;1禁用',
  `comment` varchar(128) NOT NULL DEFAULT ' ',
  `wsid` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`wpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工序组表';

DROP TABLE IF EXISTS `workshop`;
CREATE TABLE `workshop` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`wsid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='车间表';
