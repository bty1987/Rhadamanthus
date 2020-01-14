CREATE DATABASE  IF NOT EXISTS `production` ;
USE `production`;

DROP TABLE IF EXISTS `hardware`;
CREATE TABLE `hardware` (
  `hid` INT(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL COMMENT '编号',
  `pid` INT(11) NOT NULL COMMENT '生产ID',
  `cuid` INT(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finishTime` timestamp COMMENT '结束时间',
  `timeLimit` INT(8) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未到货 1已到货 2废除',
  `path` varchar(128) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `company` INT(11) DEFAULT NULL,
  PRIMARY KEY (`hid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='五金单表';

DROP TABLE IF EXISTS `hardwareitem`;
CREATE TABLE `hardwareitem` (
  `hiid` int(11) NOT NULL AUTO_INCREMENT,
  `hid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL DEFAULT '',
  `num` INT(8) NOT NULL DEFAULT '0',
  `unitprice` INT(8) NOT NULL DEFAULT '0',
  `measurementunit` varchar(10) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `total` BIGINT(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`hiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='五金项表';

DROP TABLE IF EXISTS `outsource`;
CREATE TABLE `outsource` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL COMMENT '外协单编号',
  `pid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `fuid` int(11) NOT NULL COMMENT '厂商ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `finishTime` timestamp COMMENT '结束时间',
  `timeLimit` INT(8) NOT NULL DEFAULT '0' COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未到货 1已到货 2废除',
  `path` varchar(128) NOT NULL DEFAULT '',
  `comment` varchar(128) NOT NULL DEFAULT '',
  `company` int(11) DEFAULT NULL COMMENT '公司',
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外协单表';

DROP TABLE IF EXISTS `outsourceitem`;
CREATE TABLE `outsourceitem` (
  `oiid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `height` INT(8) NOT NULL DEFAULT '0',
  `width` INT(8) NOT NULL DEFAULT '0',
  `thick` INT(8) NOT NULL DEFAULT '0',
  `modelling` varchar(128) NOT NULL DEFAULT '' COMMENT '造型',
  `num` INT(8) NOT NULL DEFAULT '0',
  `unitprice` INT(8) NOT NULL DEFAULT '0',
  `total` BIGINT(10) NOT NULL DEFAULT '0',
  `comment` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`oiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外协项表';

DROP TABLE IF EXISTS `tranpack`;
CREATE TABLE `tranpack` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '生产单ID',
  `no` varchar(20) NOT NULL COMMENT '物流包编号',
  `rid` int(11) NOT NULL COMMENT '关联ID',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `suid` int(11) COMMENT '送货人ID',
  `muid` int(11) COMMENT '安装人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `planTime` timestamp COMMENT '物流时间',
  `tranTime` timestamp COMMENT '送货时间',
  `mountTime` timestamp COMMENT '安装时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='物流包表';

DROP TABLE IF EXISTS `production`;
CREATE TABLE `production` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `pno` varchar(20) NOT NULL COMMENT '生产单编号',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `hid` int(11) NOT NULL COMMENT '房产ID',
  `total` BIGINT(10) NOT NULL DEFAULT '0',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `duid` int(11) NOT NULL COMMENT '设计师ID',
  `suid` int(11) NOT NULL COMMENT '拆单员ID',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0初始;1签约;2已审核;3生产;4废单;',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `designTime` timestamp COMMENT '设计时间',
  `divideTime` timestamp COMMENT '拆单时间',
  `storeTime` timestamp COMMENT '入库时间',
  `planTime` timestamp COMMENT '物流时间',
  `mountTime` timestamp COMMENT '安装时间',
  `finishTime` timestamp COMMENT '完结时间',
  `updateTime` timestamp NULL COMMENT '更新时间',
  `timeLimit` int(8) NOT NULL DEFAULT '0' COMMENT '工期',
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
  `path` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0初版;1终版;2废除',
  `type`  tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 文件, 1设计图',
  `comment` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='图纸表';

DROP TABLE IF EXISTS `productionplan`;
CREATE TABLE `productionplan` (
  `ppid` int(11) NOT NULL AUTO_INCREMENT COMMENT '计划ID',
  `pid` int(11) NOT NULL COMMENT '生产单ID',
  `no` varchar(32) NOT NULL COMMENT '编号',
  `path` varchar(128) NOT NULL DEFAULT ' ',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投料时间',
  `finishTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '出货时间',
  `timeLimit` int(8) NOT NULL DEFAULT 0 COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 初始 1完结',
  `comment` varchar(64) COMMENT '备注',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计划单表';

DROP TABLE IF EXISTS `productionplanitem`;
CREATE TABLE `productionplanitem` (
  `ppiid` int(11) NOT NULL AUTO_INCREMENT,
  `ppid` int(11) NOT NULL,
  `typeno` varchar(32) NOT NULL DEFAULT '' COMMENT '型号',
  `name` varchar(32) NOT NULL DEFAULT '',
  `height` int(8) NOT NULL DEFAULT '0',
  `width` int(8) NOT NULL DEFAULT '0',
  `thick` int(8) NOT NULL DEFAULT '0',
  `color` varchar(32) NOT NULL DEFAULT '',
  `unitprice` int(8) NOT NULL DEFAULT '0',
  `num` int(8) NOT NULL DEFAULT '0',
  `total` BIGINT(10) NOT NULL DEFAULT '0',
  `comment` varchar(128) NOT NULL DEFAULT '',
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
  `ouid` int(11) COMMENT '操作人ID',
  `operateTime` timestamp COMMENT '操作时间',
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
  `total` BIGINT(10) NOT NULL DEFAULT '0',
  `discount` int(8) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1正使用;0未使用',
  `comment` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`qid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价单表';

DROP TABLE IF EXISTS `quotationitem`;
CREATE TABLE `quotationitem` (
  `qiid` int(11) NOT NULL AUTO_INCREMENT,
  `qid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `format` varchar(32) NOT NULL DEFAULT '',
  `height` int(8) NOT NULL DEFAULT '0',
  `width` INT(8) NOT NULL DEFAULT '0',
  `thick` INT(8) NOT NULL DEFAULT '0',
  `num` INT(8) NOT NULL DEFAULT '0',
  `unitprice` INT(8) NOT NULL DEFAULT '0',
  `total` BIGINT(10) NOT NULL DEFAULT '0',
  `measurementunit` varchar(10) NOT NULL,
  `comment` varchar(128) NOT NULL DEFAULT '',
  `specil` varchar(128) NOT NULL DEFAULT '' COMMENT '特型',
  `qtid` int(11) NOT NULL COMMENT '报价类型',
  PRIMARY KEY (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价单项表';

DROP TABLE IF EXISTS `quoteitem`;
CREATE TABLE `quoteitem` (
  `qiid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `format` varchar(32) NOT NULL DEFAULT '' COMMENT '型号',
  `measurementunit` varchar(10) NOT NULL,
  `unitprice` INT(8) NOT NULL DEFAULT '0',
  `qtid` int(11) NOT NULL COMMENT '报价类型',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0启用;1禁用',
  `company` int(11),
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
  `company` int(11),
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
  `comment` varchar(128) NOT NULL DEFAULT '',
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


