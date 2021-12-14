CREATE DATABASE IF NOT EXISTS `customer`;
USE `customer`;

DROP TABLE IF EXISTS `aepair`;
CREATE TABLE `aepair` (
  `aid` int(11) NOT NULL AUTO_INCREMENT COMMENT '报修ID',
  `csid` int(11) DEFAULT '0' COMMENT '咨询ID',
  `orderId` varchar(15) DEFAULT NULL COMMENT '装修单',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `upuid` int(11) NOT NULL COMMENT '操作人',
  `ruid` int(11) DEFAULT NULL COMMENT '维修人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `targetTime` timestamp NULL DEFAULT NULL COMMENT '预计完成时间',
  `updateTime` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `finishTime` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  `onestate` tinyint(1) DEFAULT '0' COMMENT '水',
  `twostate` tinyint(1) DEFAULT '0' COMMENT '电',
  `thrstate` tinyint(1) DEFAULT '0' COMMENT '瓦',
  `forstate` tinyint(1) DEFAULT '0' COMMENT '木',
  `fivstate` tinyint(1) DEFAULT '0' COMMENT '油',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态',
  `outlay` int(10) DEFAULT '0' COMMENT '维修费用',
  `outpay` int(10) DEFAULT '0' COMMENT '已付费用',
  `gladness` tinyint(1) DEFAULT '0' COMMENT '满意度',
  `company` int(11) NOT NULL COMMENT '公司',
  `comment` varchar(256) DEFAULT NULL COMMENT '内容',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服报修表';

DROP TABLE IF EXISTS `background`;
CREATE TABLE `background` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(64) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`bid`),
  UNIQUE KEY `oneindex` (`unionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务圈背景图片';

DROP TABLE IF EXISTS `circle`;
CREATE TABLE `circle` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `cuid` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `praise` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cid`),
  KEY `oneindex` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务圈';

DROP TABLE IF EXISTS `circledrawing`;
CREATE TABLE `circledrawing` (
  `cdid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`cdid`),
  KEY `oneindex` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务圈图片';

DROP TABLE IF EXISTS `complack`;
CREATE TABLE `complack` (
  `ckid` int(11) NOT NULL AUTO_INCREMENT COMMENT '跟踪信息ID',
  `cid` int(11) NOT NULL COMMENT '投诉ID',
  `ctid` int(11) NOT NULL COMMENT '投诉内容ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `operateTime` timestamp NULL DEFAULT NULL COMMENT '操作时间',
  `ouid` int(11) DEFAULT NULL COMMENT '操作人',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`ckid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服跟踪表';

DROP TABLE IF EXISTS `complain`;
CREATE TABLE `complain` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '投诉ID',
  `csid` int(11) NOT NULL COMMENT '咨询ID',
  `orderId` varchar(15) DEFAULT NULL COMMENT '装修单号',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `uuid` int(11) DEFAULT NULL COMMENT '更新人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT NULL COMMENT '操作时间',
  `finishTime` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  `level` tinyint(1) NOT NULL DEFAULT '0' COMMENT '等级',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `gladness` tinyint(1) NOT NULL DEFAULT '0' COMMENT '满意度',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服投诉表';

DROP TABLE IF EXISTS `complaint`;
CREATE TABLE `complaint` (
  `ctid` int(11) NOT NULL AUTO_INCREMENT COMMENT '投诉内容ID',
  `cid` int(11) NOT NULL COMMENT '投诉ID',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型',
  `did` int(11) NOT NULL COMMENT '部门ID',
  `suid` int(11) NOT NULL COMMENT '员工ID',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `uuid` int(11) DEFAULT NULL COMMENT '更新人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT NULL COMMENT '操作时间',
  `finishTime` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `content` varchar(255) DEFAULT '' COMMENT '说明',
  PRIMARY KEY (`ctid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服投诉表';

DROP TABLE IF EXISTS `consultion`;
CREATE TABLE `consultion` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '咨询ID',
  `no` varchar(15) NOT NULL COMMENT '编号',
  `orderId` varchar(15) NOT NULL COMMENT '装修单号',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `comment` varchar(256) NOT NULL COMMENT '说明',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='咨询单';

DROP TABLE IF EXISTS `cppoint`;
CREATE TABLE `cppoint` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '积分ID',
  `cid` int(11) NOT NULL COMMENT '客户ID',
  `dpoint` bigint(10) NOT NULL DEFAULT '0' COMMENT '装修积分',
  `spoint` bigint(10) NOT NULL DEFAULT '0' COMMENT '销售积分',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cpid`),
  UNIQUE KEY `uniqueone` (`cid`,`company`),
  KEY `indexone` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户积分表';

DROP TABLE IF EXISTS `cppointrecord`;
CREATE TABLE `cppointrecord` (
  `cprid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `cid` int(11) NOT NULL COMMENT '客户ID',
  `cpid` int(11) NOT NULL COMMENT '积分ID',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型, 0: 累计, 1: 消耗',
  `pointType` tinyint(1) NOT NULL DEFAULT '0' COMMENT '积分类型, 0: 装修, 1: 销售',
  `balance` bigint(10) NOT NULL DEFAULT '0' COMMENT '剩余积分',
  `point` bigint(10) NOT NULL DEFAULT '0' COMMENT '积分',
  `cuid` int(11) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NULL DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`cprid`),
  KEY `indexone` (`cid`),
  KEY `indextwo` (`cpid`)
) ENGINE=InnoDB DEFAULT AUTO_INCREMENT=1 CHARSET=utf8 COMMENT='客户积分记录表';

DROP TABLE IF EXISTS `customerorigin`;
CREATE TABLE `customerorigin` (
  `coid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客源ID',
  `name` varchar(32) NOT NULL,
  `gender` varchar(2) DEFAULT NULL,
  `phone` varchar(32) NOT NULL COMMENT '电话',
  `purpose` varchar(128) DEFAULT NULL COMMENT '目的',
  `intention` varchar(128) DEFAULT NULL COMMENT '意向',
  `price` varchar(64) DEFAULT NULL COMMENT '需求价格',
  `grade` varchar(32) DEFAULT NULL COMMENT '客户等级',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `buid` int(11) DEFAULT NULL COMMENT '归属人',
  `did` int(11) DEFAULT NULL COMMENT '归属部门',
  `rdid` int(11) DEFAULT NULL COMMENT '归属分区',
  `vid` int(11) DEFAULT NULL COMMENT '楼盘ID',
  `houseNumber` varchar(32) NOT NULL COMMENT '楼号',
  `buildArea` int(8) NOT NULL DEFAULT '0' COMMENT '面积',
  `freeArea` int(8) NOT NULL,
  `totalArea` int(8) NOT NULL,
  `innerArea` int(8) NOT NULL,
  `cid` int(11) DEFAULT NULL COMMENT '客户ID',
  `hid` int(11) DEFAULT NULL COMMENT '绑定房产ID',
  `duid` int(11) DEFAULT NULL COMMENT '设计师',
  `suid` int(11) DEFAULT NULL,
  `dbid` int(11) DEFAULT NULL,
  `orderId` varchar(15) DEFAULT NULL COMMENT '生成装修单',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0(初始) , 1(审批) , 2(绑定装修单) , 3(失效)',
  `comment` varchar(128) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`coid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客源表';

DROP TABLE IF EXISTS `customeroriginfunction`;
CREATE TABLE `customeroriginfunction` (
  `cfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`cfid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客源功能配置表';

DROP TABLE IF EXISTS `customerrecord`;
CREATE TABLE `customerrecord` (
  `crid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客户记录ID',
  `coid` int(11) NOT NULL COMMENT '客源ID',
  `comment` varchar(255) NOT NULL COMMENT '记录信息',
  `type` tinyint(1) NOT NULL COMMENT '记录类型',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operatTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`crid`),
  KEY `indexone` (`coid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客源记录';

DROP TABLE IF EXISTS `decoration`;
CREATE TABLE `decoration` (
  `doId` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `address` varchar(128) NOT NULL,
  `defaultFlag` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`doId`),
  UNIQUE KEY `uniqueone` (`unionId`,`orderId`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户订单信息';

DROP TABLE IF EXISTS `emember`;
CREATE TABLE `emember` (
  `emid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `name` varchar(64) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(128) NOT NULL,
  `unionId` varchar(32) NOT NULL,
  `ticket` varchar(32) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `activity` int(11) DEFAULT '1',
  `registerTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`emid`),
  UNIQUE KEY `uniqueone` (`no`,`activity`),
  KEY `indexone` (`unionId`),
  KEY `indextwo` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='电子会员';

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `content` varchar(512) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型 , 0:微信',
  `picture` varchar(255) NOT NULL DEFAULT '',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `orderId` varchar(32) DEFAULT '',
  `phone` varchar(16) DEFAULT '',
  `company` int(11) DEFAULT '0' COMMENT '公司',
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='反馈信息表';

DROP TABLE IF EXISTS `feedbackdrawing`;
CREATE TABLE `feedbackdrawing` (
  `fdid` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `fid` int(11) NOT NULL COMMENT '反馈ID',
  `path` varchar(256) NOT NULL COMMENT '图片路径',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`fdid`),
  KEY `indexone` (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='反馈图片表';

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group`  (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `opengid` varchar(32) NOT NULL,
  `orderId` varchar(15) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `content` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`gid`),
  UNIQUE KEY `uniqueone` (`opengid`),
  KEY `indexone` (`opengid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='群信息';

DROP TABLE IF EXISTS `groupuser`;
CREATE TABLE `groupuser`  (
  `guid` int(11) NOT NULL AUTO_INCREMENT,
  `openGid` varchar(32) NOT NULL,
  `uid` varchar(15) NOT NULL,
  PRIMARY KEY (`guid`),
  KEY `indexone` (`openGid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='群用户信息';

DROP TABLE IF EXISTS `repair`;
CREATE TABLE `repair` (
  `rid` int(11) NOT NULL AUTO_INCREMENT COMMENT '维修ID',
  `aid` int(11) NOT NULL COMMENT '报修ID',
  `cnid` int(11) DEFAULT NULL COMMENT '工程节点ID',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `upuid` int(11) DEFAULT NULL COMMENT '操作人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `finishTime` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  `duid` int(11) DEFAULT NULL COMMENT '转交人',
  `ruid` int(11) DEFAULT NULL COMMENT '维修人',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态',
  `content` varchar(256) DEFAULT '' COMMENT '内容',
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服维修表';

DROP TABLE IF EXISTS `repairpay`;
CREATE TABLE `repairpay` (
  `rpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '维修款ID',
  `aid` int(11) NOT NULL COMMENT '报修ID',
  `type` tinyint(1) DEFAULT NULL COMMENT '类型 , 0: 款项 , 对应装修款 , 1: 扣款 , 员工薪资 , 2: 成本 , 公司承担',
  `ident` int(11) DEFAULT NULL COMMENT '引用ID',
  `money` int(10) DEFAULT NULL COMMENT '金额',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`rpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服维修人表';

DROP TABLE IF EXISTS `revisit`;
CREATE TABLE `revisit` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `ident` int(11) NOT NULL,
  `creater` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gladness` int(1) NOT NULL,
  `content` varchar(256) NOT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客服回访表';

DROP TABLE IF EXISTS `vrecord`;
CREATE TABLE `vrecord` (
  `vrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `vid` int(11) NOT NULL COMMENT '返单ID',
  `cuid` int(11) NOT NULL COMMENT '操作人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`vrid`),
  KEY `indexone` (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大客户记录';

DROP TABLE IF EXISTS `vscore`;
CREATE TABLE `vscore` (
  `vsid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  PRIMARY KEY (`vsid`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大客户积分表';

DROP TABLE IF EXISTS `vscorerecord`;
CREATE TABLE `vscorerecord` (
  `vsrid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `orderId` varchar(15) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `ouid` int(11) DEFAULT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(1) NOT NULL COMMENT ' 类型 , 0: 新增 , 1: 提取',
  `status` tinyint(1) DEFAULT NULL COMMENT '状态 , 0: 初始 , 1: 通过',
  `comment` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`vsrid`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大客户积分记录表';

DROP TABLE IF EXISTS `vustomer`;
CREATE TABLE `vustomer` (
  `vid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `unionId` varchar(32) NOT NULL COMMENT '微信ID',
  `buid` int(11) DEFAULT NULL,
  `referrer` varchar(32) NOT NULL,
  `referphone` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `phone` varchar(32) NOT NULL COMMENT '电话',
  `address` varchar(255) NOT NULL COMMENT '地址',
  `orderId` varchar(32) DEFAULT NULL COMMENT '订单ID',
  `contractPrice` bigint(10) DEFAULT '0' COMMENT '合同额',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`vid`),
  KEY `indexone` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大客户';

DROP TABLE IF EXISTS `vustomernet`;
CREATE TABLE `vustomernet` (
  `vnid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `netunionId` varchar(32) NOT NULL,
  PRIMARY KEY (`vnid`),
  KEY `indexone` (`unionId`,`netunionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 CHARSET=utf8;
