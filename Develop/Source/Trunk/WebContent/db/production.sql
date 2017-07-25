CREATE DATABASE  IF NOT EXISTS `production`;
USE `production`;

CREATE TABLE `workshop` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT `0`,
  PRIMARY KEY (`wsid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='车间表';

CREATE TABLE `workflow` (
  `wfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT `0`,
  PRIMARY KEY (`wfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工序表';

CREATE TABLE `workplan`(
  `wpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT `0` COMMENT '0启用;1禁用',
  `comment` varchar(128) NOT NULL DEFAULT ``,
  `wsid` int(11) NOT NULL,
  PRIMARY KEY (`wpid`),
) ENGING=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工序组表';

CREATE TABLE `workflowplan`(
  `wfpid` int(11) NOT NULL AUTO_INCREMENT,
  `wfid` int(11) NOT NULL ,
  `wpid` int(11) NOT NULL,
  PRINARY KEY (`wfpid`),
) ENGING=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工序组-工序表';

CREATE TABLE `userworkflow`(
  `uwid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `wfid` int(11) NOT NULL,
  PRIMARY KEY (`uwfid`),
) ENGING=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员-工序表';

CREATE TABLE `quoteitem` (
  `qiid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `format` varchar(32) NOT NULL DEFAULT `` COMMENT '型号', 
  `measurementunit` varchar(10) NOT NULL,
  `unitprice` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `qtid` int(11) NOT NULL COMMENT '报价类型',
  `status` tinyint(1) NOT NULL DEFAULT `0` COMMENT '0启用;1禁用',
  PRIMARY KEY (`qifid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项表';

CREATE TABLE `quotetype`(
  `qtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0启用;1禁用',
  PRIMARY KEY (`qtid`),
) ENGING=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价类型表';

CREATE TABLE `quotation` (
  `qid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL ,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) NOT NULL ,
  `createTime` timestamp NOT NULL COMMENT '创建时间',
  `total` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `discount` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `default` tinyint(1) NOT NULL DEFAULT `1` COMMENT '1正使用;0未使用',
  `comment` varchar(128) NOT NULL DEFAULT ``,
  PRIMARY KEY (`qid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价单表';

CREATE TABLE `quotationitem` (
  `qiid` int(11) NOT NULL AUTO_INCREMENT,
  `qid` int(11) NOT NULL ,
  `name` varchar(32) NOT NULL,
  `format` varchar(32) NOT NULL DEFAULT ``,
  `height` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `width` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `thick` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `num` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `unitprice` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `total` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `measurementunit` varchar(10) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT ``,
  `specil` varchar(128) NOT NULL DEFAULT `` COMMENT '特型',
  `qtid` int(11) NOT NULL COMMENT '报价类型',
  PRIMARY KEY (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价单项表';

CREATE TABLE `production`(
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(10) NOT NULL,
  `vid` int(11) NOT NULL COMMENT '楼盘ID',
  `houseNumber` varchar(512) NOT NULL,
  `total` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `duid` int(11) NOT NULL COMMENT '设计师ID',
  `status` tinyint(1) NOT NULL DEFAULT `0` COMMENT '0初始;1签约;2已审核;3生产;4废单;',
  `createTime` timestamp NULL NOT NULL COMMENT '创建时间',
  `divideTime` timestamp NOT NULL COMMENT '拆单时间',
  `confirmTime` timestamp NOT NULL COMMENT '确认时间',
  `diliverystatus` tinyint(1) NOT NULL DEFAULT `0` COMMENT '0未送货;1已送货',
  `diliveryTime` timestamp NOT NULL COMMENT '送货时间',
  `timeLimit` decimal(10,3) NOT NULL DEFAULT `0.000` COMMENT '工期',
  `spid` int(11) NOT NULL DEFAULT `0` COMMENT '父级生产单ID',
  `type` tinyint(1) NOT NULL DEFAULT `0` COMMENT '0生产;1售后;',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='生产单表';

CREATE TABLE `productionsales`(
  `psid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `sid` int(11) NOT NULL DEFAULT `0`,
  `type` tinyint(1) NOT NULL DEFAULT `0` COMMENT '0 主材单;1 销售单',
  PRIMARY KEY(`psid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='生产销售表';

CREATE TABLE `productionpicture`(
  `ppid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL,
  `path` varchar(128) NOT NULL DEFAULT ``,
  `status` tinyint(1) NOT NULL DEFAULT `0` COMMENT'0初版;1终版;2废除',
  `comment` varchar(128) NOT NULL DEFAULT ``,
  PRIMARY KEY(`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='图纸表';

CREATE TABLE `hardware`(
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT `0` COMMENT'0未到货 1已到货 2废除',
  `path` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT ``,
  PRIMARY KEY(`hid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='五金单表';

CREATE TABLE `hardwareitem`(
  `hiid` int(11) NOT NULL AUTO_INCREMENT,
  `hid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL DEFAULT ``,
  `num` decimal(10, 3) NOT NULL DEFAULT `0.000`,
  `unitprice` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `measurementunit` varchar(10) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT ``,
  `total` decimal(10,3) NOT NULL DEFAULT `0.000`,
   PRIMARY KEY(`hiid`)  
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='五金项表';

CREATE TABLE `outsource`(
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT `0` COMMENT'0未到货 1已到货 2废除',
  `path` varchar(128) NOT NULL DEFAULT ``,
  `comment` varchar(128) NOT NULL DEFAULT ``,
  PRIMARY KEY(`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外协单表';

CREATE TABLE `outsourceitem`(
  `oiid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL,
  `height` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `width` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `thick` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `modelling` varchar(128) NOT NULL DEFAULT `` COMMENT '造型',
  `num` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `unitprice` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `total` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `comment` varchar(128) NOT NULL DEFAULT ``,
  PRIMARY KEY(`oiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外协项表';

CREATE TABLE `productionplan`(
  `ppid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `no` varchar(32) NOT NULL,
  `path` varchar(128) NOT NULL DEFAULT ``,
  `startTime` timestamp NOT NULL COMMENT '投料时间',
  `endTime` timestamp NOT NULL COMMENT '出货时间',
  `status` tinyint(1) NOT NULL DEFAULT `0` COMMENT '0 初始 1入库 2送货',
  PRIMARY KEY(`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划单表';

CREATE TABLE `productionplanitem`(
  `ppiid` int(11) NOT NULL AUTO_INCREMENT,
  `ppid` int(11) NOT NULL,
  `typeno` varchar(32) NOT NULL DEFAULT `` COMMENT '型号',
  `name` varchar(32) NOT NULL DEFAULT ``,
  `height` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `width` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `thick` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `color` varchar(32) NOT NULL DEFAULT ``,
  `unitprice` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `num` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `total` decimal(10,3) NOT NULL DEFAULT `0.000`,
  `comment` varchar(128) NOT NULL DEFAULT ``,
  PRIMARY KEY(`ppiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划单项表';

CREATE TABLE `productionworkplan`(
  `pwpid` int(11) NOT NULL AUTO_INCREMENT,
  `ppid` int(11) NOT NULL,
  `wpid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL comment '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT `0000-00-00 00:00:00` comment '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT `0` COMMENT'0初始;1已执行',
  PRIMARY KEY(`pwpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划工序组表';

CREATE TABLE `productionworkflow`(
  `pwfid` int(11) NOT NULL AUTO_INCREMENT,
  `pwpid` int(11) NOT NULL,
  `wfid` int(11) NOT NULL,
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NOT NULL COMMENT '操作时间',
  PRIMARY KEY(`pwfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划工序表';

