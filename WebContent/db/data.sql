CREATE DATABASE IF NOT EXISTS `data`;
USE `data`;

DROP TABLE IF EXISTS `additem`;
CREATE TABLE `additem` (
  `aiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '附加项ID',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `cnid` int(11) NOT NULL COMMENT '施工节点ID',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `company` int(11) NOT NULL DEFAULT '1' COMMENT '公司',
  PRIMARY KEY (`aiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='附加项表';

DROP TABLE IF EXISTS `aoods`;
CREATE TABLE `aoods` (
  `aid` int(11) NOT NULL AUTO_INCREMENT COMMENT '辅材ID',
  `gid` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `atid` int(11) NOT NULL DEFAULT '0' COMMENT '辅类ID',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0: 启用 , 1: 禁用',
  `checkup` tinyint(1) NOT NULL DEFAULT '0' COMMENT '验证表示 , 0: 验证 , 1: 通过',
  `company` int(11) NOT NULL COMMENT '公司',
  `bompany` int(11) NOT NULL COMMENT '归属公司',
  PRIMARY KEY (`aid`),
  KEY `indexone` (`atid`),
  KEY `indextwo` (`bompany`),
  KEY `indexthr` (`gid`,`atid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅材';

DROP TABLE IF EXISTS `aoodscost`;
CREATE TABLE `aoodscost` (
  `acid` int(11) NOT NULL AUTO_INCREMENT COMMENT '辅材成本ID',
  `aid` int(11) NOT NULL COMMENT '辅材ID',
  `ccid` int(11) NOT NULL COMMENT '工程成本ID',
  `numLimit` int(11) NOT NULL COMMENT '数量上限',
  PRIMARY KEY (`acid`),
  KEY `indexone` (`ccid`,`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='辅材成本';

DROP TABLE IF EXISTS `brandbalance`;
CREATE TABLE `brandbalance` (
  `bbid` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `ctype` tinyint(1) NOT NULL DEFAULT '2',
  `cvalue` int(11) NOT NULL,
  `comment` varchar(255) DEFAULT '',
  PRIMARY KEY (`bbid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌结算信息表';

DROP TABLE IF EXISTS `chainpage`;
CREATE TABLE `chainpage` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `url` varchar(512) NOT NULL,
  `comment` varchar(256) NOT NULL,
  `companymark` tinyint(1) NOT NULL,
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='外链';

DROP TABLE IF EXISTS `constructionnode`;
CREATE TABLE `constructionnode` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `precheck` int(8) DEFAULT '0',
  `postcheck` int(8) DEFAULT '0',
  `stacheck` int(8) DEFAULT '0',
  `fincheck` int(8) DEFAULT '0',
  `startalk` varchar(256) NOT NULL,
  `endtalk` varchar(256) NOT NULL,
  `timeLimit` int(6) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: 启用, 1: 禁用',
  `sort` tinyint(2) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cnid`),
  KEY `indexone` (`sort`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程节点表';

DROP TABLE IF EXISTS `contract`;
CREATE TABLE `contract` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(255) NOT NULL COMMENT '编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `title` varchar(32) NOT NULL COMMENT '标题',
  `page` varchar(128) NOT NULL DEFAULT '',
  `path` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='合同模版';

DROP TABLE IF EXISTS `decorationbusitype`;
CREATE TABLE `decorationbusitype` (
  `dbid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(36) NOT NULL COMMENT '名称',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态,0启用,1禁用',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`dbid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='业务类型表';

DROP TABLE IF EXISTS `decorationmatching`;
CREATE TABLE `decorationmatching` (
  `dmid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型 , 对应装修单类型',
  `typeness` tinyint(1) NOT NULL COMMENT '类型 , 对应装修单类型',
  `base` int(10) NOT NULL COMMENT '基数',
  `discount` int(5) NOT NULL COMMENT '折扣',
  `material` int(10) NOT NULL COMMENT '主材配比',
  `service` int(10) NOT NULL COMMENT '服务费比例',
  `vision` tinyint(2) NOT NULL COMMENT '功能显示, 1: 报价折扣 , 2: 报价计算 , 4: 生成款项 , 8: 决算计算',
  `comment` varchar(128) DEFAULT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dmid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='装修配比表';

DROP TABLE IF EXISTS `drawlinegroup`;
CREATE TABLE `drawlinegroup` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `content` varchar(128) DEFAULT NULL,
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='放线小组表';

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) NOT NULL,
  `content` varchar(512) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型 , 0:微信',
  `picture` varchar(255) NOT NULL DEFAULT '',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `orderId` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`fid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='反馈信息表';

DROP TABLE IF EXISTS `materialmodel`;
CREATE TABLE `materialmodel` (
  `mmid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `brandId` int(11) NOT NULL,
  `category` varchar(30) NOT NULL DEFAULT '',
  `brand` varchar(30) NOT NULL DEFAULT '',
  `measurementunit` int(11) NOT NULL,
  `unitPrice` decimal(10,3) NOT NULL,
  `purchasePrice` decimal(10,3) NOT NULL,
  `discount` decimal(5,3) NOT NULL,
  `calcType` tinyint(`) NOT NULL DEFAULT '0',
  `point` decimal(5,3) NOT NULL,
  `base` decimal(5,3) NOT NULL,
  `status` tinyint(`) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`mmid`),
  KEY `indexone` (`name`),
  KEY `indextwo` (`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='型号表';

DROP TABLE IF EXISTS `normood`;
CREATE TABLE `normood` (
  `ngid` int(11) NOT NULL AUTO_INCREMENT,
  `qiid` int(11) NOT NULL COMMENT '数据报价项id',
  `gid` int(11) NOT NULL COMMENT '商品id',
  `unit` varchar(10) NOT NULL,
  `num` int(8) NOT NULL COMMENT '数量',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`ngid`),
  KEY `indexone` (`qiid`,`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='定额工费表';

DROP TABLE IF EXISTS `normrice`;
CREATE TABLE `normrice` (
  `npid` int(11) NOT NULL AUTO_INCREMENT,
  `qiid` int(11) NOT NULL COMMENT '数据报价项id',
  `cnid` int(11) NOT NULL COMMENT '工程节点',
  `unit` varchar(10) NOT NULL,
  `trannum` int(8) NOT NULL DEFAULT '0',
  `salary` int(8) NOT NULL COMMENT '工费金额',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`npid`),
  KEY `indexone` (`qiid`,`cnid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='定额工费表';

DROP TABLE IF EXISTS `paymentscale`;
CREATE TABLE `paymentscale` (
  `psid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `comment` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`psid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项比例';

DROP TABLE IF EXISTS `paymentscaleitem`;
CREATE TABLE `paymentscaleitem` (
  `psiid` int(11) NOT NULL AUTO_INCREMENT,
  `psid` int(11) NOT NULL,
  `ptid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `scale` int(8) NOT NULL,
  `sort` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`psiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='款项比例项';

DROP TABLE IF EXISTS `constructionnode`;
CREATE TABLE `constructionnode` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `precheck` int(8) DEFAULT '0',
  `postcheck` int(8) DEFAULT '0',
  `stacheck` int(8) DEFAULT '0',
  `fincheck` int(8) DEFAULT '0',
  `startalk` varchar(128) NOT NULL COMMENT '开工话术',
  `endtalk` varchar(128) NOT NULL COMMENT '完工话术',
  `timeLimit` int(6) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: 启用, 1: 禁用',
  `sort` tinyint(2) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cnid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程节点表';

DROP TABLE IF EXISTS `signet`;
CREATE TABLE `signet` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  `keyword` varchar(32) NOT NULL,
  `path` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL,
  `signid` varchar(64) DEFAULT '',
  `signno` varchar(64) DEFAULT '',
  `token` varchar(255) DEFAULT '',
  `authurl` varchar(320) DEFAULT '',
  PRIMARY KEY (`sid`),
  UNIQUE KEY `uniqueone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='签章';

DROP TABLE IF EXISTS `soods`;
CREATE TABLE `soods` (
  `sid` int(11) NOT NULL AUTO_INCREMENT COMMENT '选材ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `qiid` int(11) DEFAULT NULL COMMENT '报价项ID',
  `num` int(11) NOT NULL DEFAULT '0' COMMENT '数量',
  `selling` int(8) NOT NULL DEFAULT '0' COMMENT '售价',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0: 有效 , 1: 无效',
  `company` int(11) NOT NULL COMMENT '公司ID',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='选材';

DROP TABLE IF EXISTS `soodsitem`;
CREATE TABLE `soodsitem` (
  `siid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `qiid` int(11) NOT NULL,
  `status` tinyint(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`siid`),
  KEY `indexone` (`sid`),
  KEY `indextwo` (`qiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='选材项表';

DROP TABLE IF EXISTS `talking`;
CREATE TABLE `talking` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 工程合同附加信息',
  `content` varchar(256) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0: 启用 , 1: 禁用',
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='话术表';

DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8 NOT NULL,
  `filepath` varchar(128) CHARACTER SET utf8 NOT NULL,
  `plugins` varchar(16) DEFAULT '' COMMENT 'A: 日期范围, B: 日期, C: 上传附件, D: 参数',
  `level` tinyint(1) NOT NULL DEFAULT '0',
  `type` tinyint(1) NOT NULL,
  `handle` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `isShow` tinyint(1) NOT NULL,
  `keyword` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`tid`),
  UNIQUE KEY `uniqueone` (`keyword`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='任务表';

DROP TABLE IF EXISTS `taskparam`;
CREATE TABLE `taskparam` (
  `tpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务字段ID',
  `tid` int(11) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL COMMENT '名称',
  `module` varchar(32) NOT NULL COMMENT '模块',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型',
  `oneType` tinyint(1) NOT NULL DEFAULT '0' COMMENT '文本/数值',
  `unionField` varchar(64) NOT NULL COMMENT '关联',
  `unionParam` int(11) NOT NULL DEFAULT '0' COMMENT '关联字段',
  `field` varchar(32) NOT NULL COMMENT '字段',
  `tableName` varchar(64) NOT NULL COMMENT '表名',
  `alias` varchar(16) NOT NULL COMMENT '别名',
  `ismain` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否重要',
  `handle` varchar(32) DEFAULT NULL COMMENT '处理过程',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `sort` tinyint(2) DEFAULT '0' COMMENT '排序',
  `tablesort` tinyint(2) DEFAULT '0' COMMENT '表排序',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`tpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='任务字段表';
