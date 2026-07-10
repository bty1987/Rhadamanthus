CREATE DATABASE IF NOT EXISTS `customer`;
USE `customer`;

-- Generated at 2026-01-06 08:11:05
-- Total tables: 57

DROP TABLE IF EXISTS `aepair`;
CREATE TABLE `aepair` (
  `aid` int(11) NOT NULL AUTO_INCREMENT COMMENT '报修ID',
  `csid` int(11) NULL DEFAULT 0 COMMENT '咨询ID',
  `orderId` varchar(15) NULL COMMENT '装修单',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `upuid` int(11) NOT NULL COMMENT '操作人',
  `ruid` int(11) NULL COMMENT '维修人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `targetTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '预计完成时间',
  `updateTime` timestamp NULL COMMENT '更新时间',
  `finishTime` timestamp NULL COMMENT '完成时间',
  `onestate` tinyint(1) NULL DEFAULT 0 COMMENT '水 (1:水)',
  `twostate` tinyint(1) NULL DEFAULT 0 COMMENT '电 (2:电)',
  `thrstate` tinyint(1) NULL DEFAULT 0 COMMENT '瓦 (3:瓦)',
  `forstate` tinyint(1) NULL DEFAULT 0 COMMENT '木 (4:木)',
  `fivstate` tinyint(1) NULL DEFAULT 0 COMMENT '油 (5:油)',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态 (0:初始)',
  `outlay` bigint(10) NULL DEFAULT 0 COMMENT '维修费用',
  `outpay` bigint(10) NULL DEFAULT 0 COMMENT '已付费用',
  `gladness` tinyint(1) NULL DEFAULT 0 COMMENT '满意度',
  `company` int(11) NOT NULL COMMENT '公司',
  `comment` varchar(255) NULL COMMENT '内容',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `aonversation`;
CREATE TABLE `aonversation` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL,
  `type` tinyint(1) NULL,
  `atttype` tinyint(1) NULL,
  `content` varchar(256) NULL,
  `path` varchar(256) NULL,
  `width` int(8) NULL,
  `height` int(8) NULL,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL,
  `status` tinyint(1) NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='对话';

DROP TABLE IF EXISTS `background`;
CREATE TABLE `background` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(64) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`bid`),
  UNIQUE KEY `oneindex` (`unionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `circle`;
CREATE TABLE `circle` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `cuid` int(11) NOT NULL,
  `content` varchar(255) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `praise` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cid`),
  KEY `oneindex` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=234 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `circledrawing`;
CREATE TABLE `circledrawing` (
  `cdid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`cdid`),
  KEY `oneindex` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=308 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `complack`;
CREATE TABLE `complack` (
  `ckid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `ctid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `operateTime` timestamp NULL,
  `ouid` int(11) NULL,
  `comment` varchar(255) NULL,
  PRIMARY KEY (`ckid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `complain`;
CREATE TABLE `complain` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `csid` int(11) NOT NULL COMMENT '咨询ID',
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `orderId` varchar(15) NULL,
  `cuid` int(11) NOT NULL,
  `uuid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL,
  `finishTime` timestamp NULL,
  `level` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `gladness` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `complaint`;
CREATE TABLE `complaint` (
  `ctid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `did` int(11) NOT NULL,
  `suid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  `content` varchar(255) NULL,
  `cuid` int(11) NOT NULL,
  `uuid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL,
  `finishTime` timestamp NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ctid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `consultion`;
CREATE TABLE `consultion` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '咨询ID',
  `no` varchar(15) NOT NULL COMMENT '编号',
  `orderId` varchar(15) NULL COMMENT '装修单号',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `comment` varchar(256) NOT NULL COMMENT '说明',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='咨询单';

DROP TABLE IF EXISTS `conversation`;
CREATE TABLE `conversation` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `name` varchar(64) NULL,
  `type` tinyint(1) NOT NULL,
  `atttype` tinyint(1) NOT NULL,
  `contype` tinyint(1) NULL,
  `content` varchar(512) NULL,
  `path` varchar(256) NULL,
  `filesize` int(10) NULL DEFAULT 0,
  `width` int(8) NULL DEFAULT 0,
  `height` int(8) NULL DEFAULT 0,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`cid`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=990 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `cppoint`;
CREATE TABLE `cppoint` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '积分ID',
  `cid` int(11) NOT NULL COMMENT '客户ID',
  `orderId` varchar(15) NOT NULL COMMENT '订单ID',
  `dpoint` bigint(10) NOT NULL DEFAULT 0 COMMENT '装修积分',
  `spoint` bigint(10) NOT NULL DEFAULT 0 COMMENT '销售积分',
  `opoint` bigint(10) NULL DEFAULT 0 COMMENT '运营积分',
  `point` bigint(10) NULL DEFAULT 0 COMMENT '总积分',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户积分表';

DROP TABLE IF EXISTS `cppointpayment`;
CREATE TABLE `cppointpayment` (
  `cppid` int(11) NOT NULL AUTO_INCREMENT COMMENT '积分款项ID',
  `cpid` int(11) NOT NULL COMMENT '积分ID',
  `cprid` int(11) NULL COMMENT '记录ID',
  `no` varchar(128) NOT NULL COMMENT '编号',
  `orderId` varchar(15) NOT NULL COMMENT '订单ID',
  `pid` int(11) NOT NULL COMMENT '款项ID',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '款项类型：1、装修款 2、销售款',
  `status` tinyint(1) NOT NULL COMMENT '状态 0: 有效 , 1: 失效',
  `point` int(10) NOT NULL COMMENT '本次消耗的积分',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`cppid`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `cppointrecord`;
CREATE TABLE `cppointrecord` (
  `cprid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `cid` int(11) NOT NULL COMMENT '客户ID',
  `cpid` int(11) NOT NULL COMMENT '积分ID',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0: 累计, 1: 消耗',
  `pointType` tinyint(1) NOT NULL DEFAULT 0 COMMENT '积分类型, 0: 装修, 1: 销售',
  `status` tinyint(1) NOT NULL COMMENT '状态 0: 有效 , 1: 失效',
  `balance` bigint(10) NOT NULL DEFAULT 0 COMMENT '剩余积分',
  `no` varchar(128) NOT NULL COMMENT '编号',
  `orderId` varchar(15) NOT NULL COMMENT '订单ID',
  `point` bigint(10) NOT NULL DEFAULT 0 COMMENT '积分',
  `dpoint` int(10) NULL DEFAULT 0,
  `spoint` int(10) NULL DEFAULT 0,
  `opoint` int(10) NULL DEFAULT 0,
  `cuid` int(11) NULL COMMENT '操作人',
  `operateTime` timestamp NULL COMMENT '操作时间',
  PRIMARY KEY (`cprid`)
) ENGINE=InnoDB AUTO_INCREMENT=1050 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户积分记录表';

DROP TABLE IF EXISTS `croup`;
CREATE TABLE `croup` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL,
  `chatId` varchar(15) NULL,
  `openId` varchar(15) NULL,
  `status` tinyint(1) NULL,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='钉群';

DROP TABLE IF EXISTS `customerchance`;
CREATE TABLE `customerchance` (
  `ccid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客机ID',
  `cid` int(11) NULL,
  `hid` int(11) NULL,
  `csid` int(11) NOT NULL COMMENT '客户资源',
  `dbid` int(11) NULL COMMENT '业务类型',
  `cuid` int(11) NULL COMMENT '创建人',
  `iuid` int(11) NULL COMMENT '分配人',
  `buid` int(11) NULL COMMENT '归属人',
  `ddid` int(11) NULL COMMENT '归属部门',
  `rdid` int(11) NULL COMMENT '归属分区',
  `fuid` int(11) NULL COMMENT '罚款人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `issueTime` timestamp NULL COMMENT '分配时间',
  `confirmTime` timestamp NULL COMMENT '确认时间',
  `readTime` timestamp NULL COMMENT '已读时间',
  `fineTime` timestamp NULL COMMENT '罚款时间',
  `meetTime` timestamp NULL,
  `rate` int(8) NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL COMMENT '类型，0:面积，1:特殊，2部门',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态, 0: 初始, 1: 分配, 2: 确认, 3: 审批, 4: 完成, 5: 失效 (0:初始)',
  `isRead` tinyint(1) NULL DEFAULT 0 COMMENT '已读标识 , 0(未读)/1(已读)',
  `isFine` int(11) NULL DEFAULT 0 COMMENT '是否罚款 , 0: 未罚款, 1: 罚款',
  `isPhone` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否交接电话, 0(无状态)/1(否)/2(是)',
  `isMeet` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否见面, 0(无状态)/1(否)/2(是)',
  `isGroup` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否创建微信群 ,0(无状态)/1(否)/2(是)',
  `isTrue` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否真实地址,1(否)/2(是)',
  `orderId` varchar(15) NULL,
  `comment` varchar(128) NULL COMMENT '备注',
  `annotate` varchar(128) NULL DEFAULT '',
  `company` int(11) NOT NULL COMMENT '归属公司',
  `cno` varchar(20) NULL COMMENT '新系统尺源编码',
  `isCheck` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`ccid`),
  KEY `indexone` (`orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=519 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='机会表';

DROP TABLE IF EXISTS `customercompanyrule`;
CREATE TABLE `customercompanyrule` (
  `ccrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '规则ID',
  `cid` int(11) NULL DEFAULT 0 COMMENT '公司ID',
  `did` int(11) NULL,
  `uppval` int(8) NULL DEFAULT 0 COMMENT '起始值',
  `lowval` int(8) NULL DEFAULT 0 COMMENT '终止值',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 , 0: 面积 , 1: 特殊 , 2: 部门',
  `companys` int(11) NOT NULL COMMENT '终止值',
  PRIMARY KEY (`ccrid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户公司规则表';

DROP TABLE IF EXISTS `customerconfigrule`;
CREATE TABLE `customerconfigrule` (
  `ccrid` int(11) NOT NULL AUTO_INCREMENT,
  `signRate` varchar(64) NULL DEFAULT '' COMMENT '签单率',
  `comaRate` varchar(64) NULL DEFAULT '' COMMENT '主基比',
  `depositPrice` varchar(64) NULL DEFAULT '' COMMENT '设计费',
  `signPrice` varchar(64) NULL DEFAULT '' COMMENT '签单额',
  `signAvgs` varchar(64) NULL DEFAULT '' COMMENT '均单值',
  `source` int(8) NULL DEFAULT 0 COMMENT '保底资源数(月) 保底资源数(月)',
  `people` int(8) NULL DEFAULT 0 COMMENT '人员数 人员数',
  `protect` int(8) NULL DEFAULT 0 COMMENT '保底数 保底数',
  `polling` int(8) NULL DEFAULT 0 COMMENT '轮询数 轮询数',
  `surplus` int(8) NULL DEFAULT 0 COMMENT '剩余数 剩余数',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ccrid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户配置规则';

DROP TABLE IF EXISTS `customerdeptrule`;
CREATE TABLE `customerdeptrule` (
  `cdrid` int(11) NOT NULL AUTO_INCREMENT,
  `did` int(11) NOT NULL COMMENT '部门ID',
  `name` varchar(32) NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 , 0: 公司 , 1: 分区 , 2: 部门',
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '业务类型 0:自动',
  `focus` tinyint(1) NULL DEFAULT 0,
  `dbid` int(11) NOT NULL COMMENT '业务类型',
  `cuid` int(11) NULL COMMENT '创建人',
  `createTime` timestamp NULL COMMENT '创建时间',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cdrid`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `customernotice`;
CREATE TABLE `customernotice` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '客户id',
  `orderId` varchar(15) NULL COMMENT '装修单号',
  `title` varchar(64) NULL,
  `content` varchar(255) NULL,
  `uid` int(11) NULL COMMENT '创建人',
  `createTime` datetime NULL COMMENT '创建时间',
  `type` tinyint(1) NULL,
  `path` varchar(255) NULL,
  PRIMARY KEY (`cnid`)
) ENGINE=InnoDB AUTO_INCREMENT=344 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户通知';

DROP TABLE IF EXISTS `customerorigin`;
CREATE TABLE `customerorigin` (
  `coid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客源ID',
  `name` varchar(32) NOT NULL,
  `gender` varchar(2) NULL,
  `phone` varchar(32) NOT NULL COMMENT '电话',
  `purpose` varchar(128) NULL COMMENT '目的',
  `intention` varchar(128) NULL COMMENT '意向',
  `price` varchar(64) NULL COMMENT '需求价格',
  `grade` varchar(32) NULL COMMENT '客户等级',
  `referOrderId` varchar(15) NULL COMMENT '推荐单号',
  `source` varchar(64) NULL COMMENT '来源方',
  `contact` varchar(64) NULL COMMENT '对接人',
  `vid` int(11) NULL,
  `houseNumber` varchar(32) NOT NULL,
  `buildArea` int(8) NOT NULL DEFAULT 0 COMMENT '面积',
  `freeArea` int(8) NOT NULL,
  `totalArea` int(8) NOT NULL,
  `innerArea` int(8) NOT NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `buid` int(11) NULL COMMENT '归属人',
  `did` int(11) NULL COMMENT '归属部门',
  `rdid` int(11) NULL COMMENT '归属分区',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 (0:初始)',
  `comment` varchar(128) NULL COMMENT '备注',
  `cid` int(11) NULL COMMENT '客户ID',
  `hid` int(11) NULL,
  `duid` int(11) NULL COMMENT '设计师',
  `suid` int(11) NULL,
  `dbid` int(11) NULL,
  `orderId` varchar(15) NULL,
  PRIMARY KEY (`coid`)
) ENGINE=InnoDB AUTO_INCREMENT=835 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `customerfunction`;
CREATE TABLE `customerfunction` (
  `cfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) NULL,
  PRIMARY KEY (`cfid`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客源功能配置表';

DROP TABLE IF EXISTS `customeroriginrecord`;
CREATE TABLE `customeroriginrecord` (
  `crid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客户记录ID',
  `coid` int(11) NOT NULL COMMENT '客源ID',
  `comment` varchar(255) NOT NULL COMMENT '记录信息',
  `type` tinyint(1) NOT NULL COMMENT '记录类型   0(更新) , 1(定义)',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operatTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`crid`)
) ENGINE=InnoDB AUTO_INCREMENT=2233 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `customerprofile`;
CREATE TABLE `customerprofile` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '画像ID',
  `tid` int(11) NULL DEFAULT 0 COMMENT '模版ID',
  `csid` int(11) NULL,
  `cid` int(11) NULL DEFAULT 0,
  `orderId` varchar(15) NULL COMMENT '装修单ID',
  `name` varchar(128) NOT NULL COMMENT '画像名称',
  `cuid` int(11) NULL DEFAULT 0 COMMENT '创建人ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `type` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户画像表';

DROP TABLE IF EXISTS `customerprofileitem`;
CREATE TABLE `customerprofileitem` (
  `cpiid` int(11) NOT NULL AUTO_INCREMENT,
  `cpid` int(11) NULL,
  `name` varchar(128) NULL,
  `type` tinyint(1) NULL,
  `require` tinyint(1) NULL DEFAULT 1,
  `content` varchar(255) NULL,
  `soid` int(11) NULL,
  PRIMARY KEY (`cpiid`)
) ENGINE=InnoDB AUTO_INCREMENT=4436 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `customerprofileoption`;
CREATE TABLE `customerprofileoption` (
  `cpoid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cpiid` int(11) NULL DEFAULT 0 COMMENT '画像模版ID',
  `cpid` int(11) NULL DEFAULT 0 COMMENT '画像表ID',
  `title` varchar(64) NULL COMMENT '选项名称',
  `checked` tinyint(1) NOT NULL COMMENT '选项值 ',
  PRIMARY KEY (`cpoid`)
) ENGINE=InnoDB AUTO_INCREMENT=11095 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户画像选项表';

DROP TABLE IF EXISTS `customerprotectrule`;
CREATE TABLE `customerprotectrule` (
  `cprid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL COMMENT '标题',
  `type` tinyint(1) NOT NULL COMMENT '类型 0: 面积 , 1: 预付 , 2: 设计 0: 面积 , 1: 预付 , 2: 设计',
  `uppval` int(11) NOT NULL COMMENT '起始值',
  `lowval` int(11) NOT NULL COMMENT '终止值',
  `days` int(8) NOT NULL COMMENT '天数',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL COMMENT '状态 0: 有效 , 1: 失效',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cprid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='保护规则';

DROP TABLE IF EXISTS `customerrecord`;
CREATE TABLE `customerrecord` (
  `crid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客户记录ID',
  `coid` int(11) NOT NULL COMMENT '客源ID',
  `comment` varchar(255) NOT NULL COMMENT '记录信息',
  `type` tinyint(1) NOT NULL COMMENT '记录类型   0(更新) , 1(定义)',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operatTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`crid`),
  KEY `indexone` (`coid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2158 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `customersource`;
CREATE TABLE `customersource` (
  `csid` int(11) NOT NULL AUTO_INCREMENT COMMENT '客资ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `gender` varchar(2) NULL COMMENT '性别',
  `grade` varchar(32) NULL COMMENT '客户等级',
  `customertype` tinyint(1) NOT NULL COMMENT '客户类型 , 0(到店)/1(量房)/2(守园) , ',
  `houseAttr` tinyint(1) NULL DEFAULT 0 COMMENT '房屋属性, 0清水/1全翻/2局改',
  `vid` int(11) NULL COMMENT '楼盘',
  `houseNumber` varchar(32) NULL COMMENT '楼号',
  `dbid` int(11) NULL,
  `phone` varchar(32) NOT NULL COMMENT '电话',
  `purpose` varchar(128) NULL COMMENT '目的',
  `intention` varchar(128) NULL COMMENT '意向',
  `demand` tinyint(1) NOT NULL COMMENT '装修需求 , 0(基装)/1(整装)/2(局改) (0:基装, 1:整装, 2:局改装)',
  `price` varchar(64) NULL COMMENT '需求价格',
  `referOrderId` varchar(15) NULL COMMENT '推荐单号',
  `source` varchar(64) NULL COMMENT '来源方',
  `contact` varchar(64) NULL COMMENT '对接人',
  `buildArea` int(8) NOT NULL DEFAULT 0 COMMENT '面积',
  `freeArea` int(8) NOT NULL COMMENT '赠送面积',
  `totalArea` int(8) NOT NULL COMMENT '总面积',
  `innerArea` int(8) NOT NULL COMMENT '套内面积',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `company` int(11) NULL DEFAULT 0 COMMENT '公司',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0(初始) , 1(失效) (0:初始)',
  `comment` varchar(128) NULL COMMENT '备注',
  `cid` int(11) NULL COMMENT '客户ID',
  `hid` int(11) NULL COMMENT '房产ID',
  `duid` int(11) NULL COMMENT '设计师',
  `suid` int(11) NULL COMMENT '业务员',
  `orderId` varchar(15) NULL COMMENT '装修单号',
  `no` varchar(20) NULL COMMENT '新系统资源号',
  PRIMARY KEY (`csid`)
) ENGINE=InnoDB AUTO_INCREMENT=919 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `customersourcerecord`;
CREATE TABLE `customersourcerecord` (
  `csrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `csid` int(11) NOT NULL COMMENT '资源ID',
  `ccid` int(11) NOT NULL COMMENT '机会ID',
  `type` tinyint(1) NOT NULL COMMENT '记录类型 , 包括: 0: 通用',
  `ouid` int(11) NULL COMMENT '操作人 , 类型',
  `operatTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  `comment` varchar(128) NULL COMMENT '记录信息',
  PRIMARY KEY (`csrid`)
) ENGINE=InnoDB AUTO_INCREMENT=2200 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='记录表';

DROP TABLE IF EXISTS `customeruserrule`;
CREATE TABLE `customeruserrule` (
  `curid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '人员',
  `period` varchar(16) NOT NULL COMMENT '周期',
  `measureNum` int(10) NOT NULL COMMENT '量尺数',
  `contractNum` int(10) NOT NULL COMMENT '签单数',
  `contractPrice` bigint(10) NOT NULL COMMENT '签单额',
  `predisPrice` bigint(10) NOT NULL,
  `materialPrice` bigint(10) NOT NULL COMMENT '主材额',
  `designPrice` bigint(10) NOT NULL COMMENT '设计费',
  `score` int(4) NOT NULL COMMENT '得分',
  `rank` int(4) NOT NULL COMMENT '排名',
  `chance` int(8) NOT NULL COMMENT '机会数',
  `surplus` int(8) NOT NULL COMMENT '剩余数',
  `polling` int(4) NOT NULL COMMENT '轮询数',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL,
  `finishTime` timestamp NULL COMMENT '结束时间',
  `status` tinyint(1) NOT NULL COMMENT '0: 启用 1: 禁用',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`curid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='人员规则';

DROP TABLE IF EXISTS `customeruserruleitem`;
CREATE TABLE `customeruserruleitem` (
  `curiid` int(11) NOT NULL AUTO_INCREMENT,
  `curid` int(11) NOT NULL COMMENT '规则ID',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `dtid` int(11) NULL,
  `did` int(11) NULL COMMENT '部门id',
  `cpid` int(11) NULL COMMENT '城区id',
  `uppval` int(8) NOT NULL COMMENT '起始值',
  `lowval` int(8) NOT NULL COMMENT '终止值',
  `chance` int(8) NOT NULL DEFAULT 0 COMMENT '机会数(面积轮训专用,每次派单-1,归0失效)',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 有效 , 1: 失效',
  `isDelete` tinyint(1) NOT NULL COMMENT '是否删除 , 0: 删除 , 1: 不删除',
  `isSurplus` tinyint(1) NOT NULL COMMENT '是否减剩余数, 0: 减 , 1: 不减)',
  `priority` tinyint(1) NOT NULL COMMENT '优先级',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `handleTime` timestamp NULL COMMENT '操作时间',
  `deleteTime` timestamp NULL,
  `comment` varchar(64) NULL,
  PRIMARY KEY (`curiid`)
) ENGINE=InnoDB AUTO_INCREMENT=277 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='人员规则项';

DROP TABLE IF EXISTS `decoration`;
CREATE TABLE `decoration` (
  `doId` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `address` varchar(128) NOT NULL,
  `defaultFlag` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`doId`),
  KEY `indexone` (`unionId`) USING BTREE,
  UNIQUE KEY `uniqueone` (`unionId`, `orderId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='用户订单信息';

DROP TABLE IF EXISTS `droup`;
CREATE TABLE `droup` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `orderId` varchar(15) NOT NULL,
  `chatId` varchar(64) NOT NULL,
  `openId` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1:钉钉 2:微信',
  `status` tinyint(1) NOT NULL,
  `updateTime` timestamp NULL,
  `handleTime` timestamp NULL,
  `isHandle` tinyint(1) NOT NULL DEFAULT 1,
  `isRead` tinyint(1) NULL DEFAULT 1,
  `company` int(11) NULL,
  PRIMARY KEY (`did`),
  KEY `uniqueone` (`orderId`) USING BTREE,
  KEY `uniquethr` (`openId`) USING BTREE,
  KEY `uniquetwo` (`chatId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `emember`;
CREATE TABLE `emember` (
  `emid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
  `name` varchar(64) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(128) NOT NULL,
  `unionId` varchar(32) NOT NULL,
  `ticket` varchar(32) NULL,
  `status` tinyint(1) NULL DEFAULT 0,
  `activity` int(11) NULL DEFAULT 1,
  `registerTime` timestamp NULL,
  PRIMARY KEY (`emid`),
  KEY `indexone` (`unionId`) USING BTREE,
  UNIQUE KEY `uniqueone` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='电子会员';

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `content` varchar(512) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 , 0:微信',
  `picture` varchar(255) NOT NULL DEFAULT '',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `orderId` varchar(32) NULL,
  `phone` varchar(16) NULL,
  `company` int(11) NULL DEFAULT 0 COMMENT '公司',
  `ruid` int(11) NULL,
  `huid` int(11) NULL,
  `fuid` int(11) NULL,
  `receiveTime` timestamp NULL,
  `handleTime` timestamp NULL,
  `finishTime` timestamp NULL,
  `status` tinyint(1) NULL COMMENT '0: 初始, 1: 接收 , 2: 处理, 3: 完成',
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='反馈信息表';

DROP TABLE IF EXISTS `feedbackbackvisit`;
CREATE TABLE `feedbackbackvisit` (
  `fbid` int(11) NOT NULL AUTO_INCREMENT COMMENT '回访ID',
  `fid` int(11) NOT NULL COMMENT '反馈ID',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `puid` int(11) NULL COMMENT '表扬人ID',
  `result` tinyint(1) NULL DEFAULT 0 COMMENT '维修结果：整体待修0、整体完工1、确认撤销2、部分完工3、来电表扬4',
  `pleased` tinyint(1) NULL COMMENT '满意度：非常满意0、满意1、一般2、不满意3、非常不满意4',
  `praiseType` tinyint(1) NULL COMMENT '表扬形式：',
  `openWords` tinyint(1) NULL COMMENT '开头语：方便0、不方便/拒绝评价1、未接一①次2、未接一②次3、未接一③次4、超期放弃回访5',
  `contactSoonFlag` tinyint(1) NULL COMMENT '24h内有无人联系您：是0、否1、不记得2',
  `perforFlag` tinyint(1) NULL COMMENT '师傅是否按时上门：是0、否1、不记得2',
  `resultFlag` tinyint(1) NULL COMMENT '报修是否解决：是0、否1',
  `contactFlag` tinyint(1) NULL COMMENT '事后有无人联系您：已解决0、解决过程中1',
  `workDays` int(10) NULL COMMENT '维修周期',
  `createTime` timestamp NULL COMMENT '创建时间',
  `praiseTime` timestamp NULL COMMENT '表扬时间',
  `finishTime` timestamp NULL COMMENT '完工日期',
  `complaint` varchar(256) NULL COMMENT '回访内容',
  `praise` varchar(256) NULL COMMENT '表扬内容',
  `refuseComment` varchar(256) NULL COMMENT '拒绝评价原因',
  `resultComment` varchar(256) NULL COMMENT '未解决问题记录',
  PRIMARY KEY (`fbid`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='回访';

DROP TABLE IF EXISTS `feedbackcomplaint`;
CREATE TABLE `feedbackcomplaint` (
  `fcid` int(11) NOT NULL AUTO_INCREMENT COMMENT '投诉id',
  `fid` int(11) NULL COMMENT '反馈ID',
  `orderId` varchar(15) NULL COMMENT '装修单号',
  `source` tinyint(1) NOT NULL DEFAULT 0 COMMENT ' 渠道 (平台私聊/400电话/到店投诉/内部反馈/消协/工商/ERP小程序/VIP服务群/调研回访/电视/电台曝光/第三方平台)',
  `upgradeSource` tinyint(1) NULL DEFAULT 0 COMMENT '升级渠道',
  `phone` varchar(128) NULL COMMENT '电话',
  `suid` int(11) NULL COMMENT '服务管家ID',
  `muid` int(11) NULL COMMENT '主材导购ID',
  `upgrade` tinyint(1) NULL COMMENT '是否升级 (是（超时）/是（平台）/否)',
  `urgency` tinyint(1) NULL COMMENT '紧急程度 (预警/1级/2级/3级)',
  `deptType` varchar(255) NULL COMMENT '部门类型(多选) (设计/主材/尺源/工程/职能/未知)',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `createTime` timestamp NULL COMMENT '创建时间',
  `content` varchar(255) NULL COMMENT '问题总述',
  `results` tinyint(1) NULL DEFAULT 0 COMMENT '处理结果 0完成 1撤销  2未确定 3 确定方案  4法务介入',
  `appeal` varchar(255) NULL COMMENT '客户诉求',
  `finishTime` datetime NULL COMMENT '完成时间',
  PRIMARY KEY (`fcid`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT=' 投诉';

DROP TABLE IF EXISTS `feedbackcomplaintdept`;
CREATE TABLE `feedbackcomplaintdept` (
  `fcdid` int(11) NOT NULL AUTO_INCREMENT COMMENT '投诉部门id',
  `fcid` int(11) NULL COMMENT '投诉id',
  `deptId` int(11) NULL COMMENT '部门id',
  `did` int(11) NULL COMMENT '职务',
  `duid` int(11) NULL COMMENT '责任人',
  `firstLevel` int(11) NULL COMMENT '一级分类',
  `secondary` int(11) NULL COMMENT '二级分类',
  `problemType` int(11) NULL COMMENT '问题类型',
  `createTime` datetime NULL COMMENT '创建时间',
  PRIMARY KEY (`fcdid`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='投诉部门信息';

DROP TABLE IF EXISTS `feedbackcomplaintdeptinfo`;
CREATE TABLE `feedbackcomplaintdeptinfo` (
  `fcdid` int(11) NOT NULL COMMENT '投诉部门id',
  `fcid` int(11) NOT NULL COMMENT '投诉id',
  `did` int(11) NULL COMMENT '部门id',
  `position` varchar(255) NULL COMMENT '职务',
  `duty` varchar(255) NULL COMMENT '责任人',
  `problemtype` tinyint(1) NULL COMMENT '问题类型',
  PRIMARY KEY (`fcdid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='投诉部门信息';

DROP TABLE IF EXISTS `feedbackcomplaintproblem`;
CREATE TABLE `feedbackcomplaintproblem` (
  `fcpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `parentId` int(11) NULL COMMENT '父类id',
  `level` tinyint(1) NOT NULL COMMENT '层级(1:部门问题,2:一级问题,3:二级问题,4:三级问题)',
  PRIMARY KEY (`fcpid`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='投诉问题分类';

DROP TABLE IF EXISTS `feedbackdrawing`;
CREATE TABLE `feedbackdrawing` (
  `fdid` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `fid` int(11) NOT NULL COMMENT '反馈ID',
  `sid` int(11) NULL,
  `path` varchar(256) NOT NULL COMMENT '图片路径',
  `createTime` timestamp NULL COMMENT '创建时间',
  `type` tinyint(1) NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  PRIMARY KEY (`fdid`)
) ENGINE=InnoDB AUTO_INCREMENT=260 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `feedbackguarantee`;
CREATE TABLE `feedbackguarantee` (
  `fgid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `fid` int(11) NOT NULL COMMENT '反馈ID',
  `orderId` varchar(32) NOT NULL COMMENT '装修单号',
  `source` tinyint(1) NULL DEFAULT 0 COMMENT '渠道(0:400电话,1:媒体平台,2:到店来访,3:监理上报,4:员工上报,5:客户回访,6:ERP小程序,7:工商,8:消协,9:315,10:上门拜访)',
  `phone` varchar(128) NULL COMMENT '电话',
  `cutomerType` tinyint(1) NULL DEFAULT 0 COMMENT '客户类型 (0:终身保修客户,1:过保客户,2:收费客户,3:关系客户,4:核查确认,5:二手房主,6:保修2年,7:保修5年)',
  `deptType` varchar(32) NULL COMMENT '部门类型(多选) (0:监理,1:售后,2:质检,3:值班)',
  `workType` varchar(500) NULL DEFAULT '0' COMMENT '工种',
  `bids` varchar(128) NULL COMMENT '品牌ID',
  `brands` varchar(128) NULL COMMENT '品牌',
  `cuid` int(11) NULL COMMENT '创建人ID',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `content` varchar(256) NULL COMMENT '内容',
  `reportedDate` timestamp NULL COMMENT '报修日期',
  `renovationYear` varchar(10) NULL COMMENT '装修年份',
  `svuid` int(11) NULL COMMENT '施工监理ID',
  `svUserStatus` tinyint(1) NULL DEFAULT 0 COMMENT '监理在职状态( 0：是:1：否:2：调至)',
  `repairResult` tinyint(1) NULL DEFAULT 0 COMMENT '维修结果',
  `upgradeSource` tinyint(1) NULL DEFAULT 0 COMMENT '升级渠道',
  PRIMARY KEY (`fgid`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='维修';

DROP TABLE IF EXISTS `feedbackrecord`;
CREATE TABLE `feedbackrecord` (
  `fbrid` int(11) NOT NULL AUTO_INCREMENT,
  `fbid` int(11) NOT NULL,
  `ouid` int(11) NOT NULL,
  `operateTime` timestamp NULL,
  `comment` varchar(128) NULL,
  PRIMARY KEY (`fbrid`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户反馈记录表';

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `opengid` varchar(32) NOT NULL,
  `orderId` varchar(15) NULL,
  `name` varchar(64) NULL,
  `content` varchar(64) NULL,
  PRIMARY KEY (`gid`),
  KEY `indexone` (`opengid`) USING BTREE,
  UNIQUE KEY `uniqueone` (`opengid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='群信息';

DROP TABLE IF EXISTS `groupuser`;
CREATE TABLE `groupuser` (
  `guid` int(11) NOT NULL AUTO_INCREMENT,
  `openGid` varchar(32) NOT NULL,
  `uid` varchar(15) NOT NULL,
  PRIMARY KEY (`guid`),
  KEY `indexone` (`openGid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='群用户信息';

DROP TABLE IF EXISTS `quotationrecord`;
CREATE TABLE `quotationrecord` (
  `qrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `qid` int(11) NOT NULL COMMENT '预签单ID/报价单ID/扩展单ID/增减单ID',
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0(预签) , 1(报价) , 2(扩展) , 3(增减)',
  `ouid` int(11) NOT NULL COMMENT '记录员',
  `operatTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  `comment` varchar(45) NULL COMMENT '说明',
  PRIMARY KEY (`qrid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='记录';

DROP TABLE IF EXISTS `repair`;
CREATE TABLE `repair` (
  `rid` int(11) NOT NULL AUTO_INCREMENT COMMENT '维修ID',
  `aid` int(11) NOT NULL COMMENT '报修ID',
  `cnid` int(11) NULL COMMENT '工程节点ID',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `upuid` int(11) NULL COMMENT '操作人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL COMMENT '更新时间',
  `finishTime` timestamp NULL COMMENT '完成时间',
  `duid` int(11) NULL COMMENT '转交人',
  `ruid` int(11) NULL COMMENT '维修人',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态 (0:初始)',
  `content` varchar(64) NULL COMMENT '内容',
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `repairpay`;
CREATE TABLE `repairpay` (
  `rpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '维修款ID',
  `aid` int(11) NOT NULL COMMENT '报修ID',
  `type` tinyint(1) NULL COMMENT '类型 , 0: 款项 , 对应装修款 , 1: 扣款 , 员工薪资 , 2: 成本 , 公司承担',
  `ident` int(11) NULL COMMENT '引用ID',
  `money` bigint(10) NULL COMMENT '金额',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态 (0:初始)',
  PRIMARY KEY (`rpid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `revisit`;
CREATE TABLE `revisit` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `ident` int(11) NOT NULL,
  `creater` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gladness` tinyint(1) NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `survey`;
CREATE TABLE `survey` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `stid` int(11) NOT NULL,
  `orderId` varchar(15) NULL,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) NOT NULL,
  `suid` int(11) NULL COMMENT '推送人',
  `fuid` int(11) NULL COMMENT '完成人',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sendTime` timestamp NULL,
  `finishTime` timestamp NULL,
  `handleTime` timestamp NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `surveyitem`;
CREATE TABLE `surveyitem` (
  `siid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NULL,
  `name` varchar(128) NULL,
  `type` tinyint(1) NOT NULL,
  `content` varchar(256) NULL,
  PRIMARY KEY (`siid`)
) ENGINE=InnoDB AUTO_INCREMENT=2526 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `surveyoption`;
CREATE TABLE `surveyoption` (
  `soid` int(11) NOT NULL AUTO_INCREMENT,
  `siid` int(11) NULL,
  `sid` int(11) NULL,
  `title` varchar(32) NULL,
  `checked` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`soid`)
) ENGINE=InnoDB AUTO_INCREMENT=8714 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `vrecord`;
CREATE TABLE `vrecord` (
  `vrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `vid` int(11) NOT NULL COMMENT '返单ID',
  `cuid` int(11) NOT NULL COMMENT '操作人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`vrid`),
  KEY `indexone` (`vid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `vscore`;
CREATE TABLE `vscore` (
  `vsid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`vsid`),
  KEY `indexone` (`unionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `vscorerecord`;
CREATE TABLE `vscorerecord` (
  `vsrid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `orderId` varchar(15) NULL,
  `score` int(11) NOT NULL,
  `ouid` int(11) NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(1) NOT NULL COMMENT ' 类型 , 0: 新增 , 1: 提取',
  `status` tinyint(1) NULL COMMENT '状态 , 0: 初始 , 1: 通过',
  `comment` varchar(128) NULL,
  PRIMARY KEY (`vsrid`),
  KEY `indexone` (`unionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=276 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `vustomer`;
CREATE TABLE `vustomer` (
  `vid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `unionId` varchar(32) NOT NULL COMMENT '微信ID',
  `buid` int(11) NULL,
  `referrer` varchar(32) NOT NULL,
  `referphone` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `phone` varchar(32) NOT NULL COMMENT '电话',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(255) NOT NULL COMMENT '地址',
  `orderId` varchar(32) NULL COMMENT '订单ID',
  `contractPrice` bigint(10) NULL DEFAULT 0 COMMENT '合同额',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态(0:有效 1:无效)',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`vid`),
  KEY `indexone` (`unionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `vustomernet`;
CREATE TABLE `vustomernet` (
  `vnid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `netunionId` varchar(32) NOT NULL,
  PRIMARY KEY (`vnid`),
  KEY `indexone` (`unionId`, `netunionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;
