CREATE DATABASE IF NOT EXISTS `data`;
USE `data`;

-- Generated at 2026-01-06 08:11:04
-- Total tables: 66

DROP TABLE IF EXISTS `accessoriestype`;
CREATE TABLE `accessoriestype` (
  `atid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `wtid` int(11) NOT NULL COMMENT '工种ID',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0:分类, 1:排序',
  `sort` tinyint(1) NOT NULL COMMENT '排序',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(64) NULL,
  PRIMARY KEY (`atid`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='辅类';

DROP TABLE IF EXISTS `aoods`;
CREATE TABLE `aoods` (
  `aid` int(11) NOT NULL AUTO_INCREMENT COMMENT '辅材ID',
  `name` varchar(32) NULL COMMENT '名称',
  `gid` int(11) NOT NULL DEFAULT 0 COMMENT '商品ID',
  `atid` int(11) NULL DEFAULT 0 COMMENT '辅类ID',
  `satid` int(11) NULL COMMENT '排序辅类',
  `nid` int(11) NULL COMMENT '材料项',
  `cnid` int(11) NULL COMMENT '工程节点',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 启用 , 1: 禁用',
  `checkup` tinyint(2) NOT NULL DEFAULT 0 COMMENT '验证表示 , 0: 验证 , 1: 通过',
  `company` int(11) NOT NULL COMMENT '公司',
  `bompany` int(11) NULL DEFAULT 0 COMMENT '归属公司 , 可为0表示共享',
  `atttype` tinyint(2) NOT NULL DEFAULT 0 COMMENT '业务类型 , 0: 普通 , 1: 外辅',
  `balance` int(11) NOT NULL DEFAULT 0 COMMENT '结算价',
  `selling` int(11) NOT NULL DEFAULT 0 COMMENT '售价',
  `normunit` varchar(15) NULL DEFAULT '0' COMMENT '定额单位',
  `normnum` int(8) NULL DEFAULT 0 COMMENT '定额数量',
  `storeunit` varchar(15) NULL DEFAULT '0' COMMENT '库房单位',
  `storenum` varchar(8) NULL DEFAULT '0' COMMENT '库房数量',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=7279 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `aoodscost`;
CREATE TABLE `aoodscost` (
  `acid` int(11) NOT NULL AUTO_INCREMENT COMMENT '辅材成本ID',
  `aid` int(11) NOT NULL COMMENT '辅材ID',
  `ccid` int(11) NOT NULL COMMENT '工程成本ID',
  `numLimit` int(11) NOT NULL COMMENT '数量上限',
  PRIMARY KEY (`acid`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `assistance`;
CREATE TABLE `assistance` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `keyword` varchar(32) NULL,
  `atttype` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(1) NULL DEFAULT 0,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `assistanceitem`;
CREATE TABLE `assistanceitem` (
  `aiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NULL,
  `title` varchar(32) NULL,
  `content` varchar(64) NULL,
  `sort` int(4) NULL,
  `ddid` int(11) NULL,
  PRIMARY KEY (`aiid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `bankaccount`;
CREATE TABLE `bankaccount` (
  `baid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `bankName` varchar(32) NOT NULL,
  `bankNo` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`baid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='银行账户表';

DROP TABLE IF EXISTS `brandbalance`;
CREATE TABLE `brandbalance` (
  `bbid` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `ctype` tinyint(1) NOT NULL DEFAULT 0,
  `cvalue` int(11) NOT NULL,
  `comment` varchar(255) NULL,
  PRIMARY KEY (`bbid`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `branddeliver`;
CREATE TABLE `branddeliver` (
  `bdid` int(11) NOT NULL AUTO_INCREMENT COMMENT '交付ID',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `cnid` int(11) NULL COMMENT '工程节点ID',
  `workNum` int(11) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 启用 , 1: 禁用',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`bdid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌交付表';

DROP TABLE IF EXISTS `brandinstall`;
CREATE TABLE `brandinstall` (
  `biid` int(11) NOT NULL AUTO_INCREMENT COMMENT '安装ID',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `cnid` int(11) NULL COMMENT '工程节点ID',
  `workNum` int(11) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 启用 , 1: 禁用',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`biid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌安装表';

DROP TABLE IF EXISTS `brandproduct`;
CREATE TABLE `brandproduct` (
  `bpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '生产ID',
  `bid` int(11) NULL COMMENT '品牌ID',
  `name` varchar(255) NULL COMMENT '名称',
  `cnid` int(11) NULL COMMENT '工程节点ID',
  `workNum` int(11) NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 启用 , 1: 禁用',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`bpid`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌生产表';

DROP TABLE IF EXISTS `brandserver`;
CREATE TABLE `brandserver` (
  `bsid` int(11) NOT NULL AUTO_INCREMENT COMMENT '服务ID',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `cnid` int(11) NULL COMMENT '工程节点ID',
  `workNum` int(11) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 启用 , 1: 禁用',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`bsid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌服务表';

DROP TABLE IF EXISTS `chainpage`;
CREATE TABLE `chainpage` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `url` varchar(512) NOT NULL,
  `comment` varchar(256) NOT NULL,
  `companymark` tinyint(1) NOT NULL,
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `chating`;
CREATE TABLE `chating` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL DEFAULT '',
  `content` varchar(512) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL,
  `atttype` tinyint(1) NOT NULL,
  `path` varchar(256) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `color`;
CREATE TABLE `color` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=5530 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `constructionnode`;
CREATE TABLE `constructionnode` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `precheck` int(8) NULL DEFAULT 0,
  `postcheck` int(8) NULL DEFAULT 0,
  `stacheck` int(8) NULL DEFAULT 0,
  `fincheck` int(8) NULL DEFAULT 0,
  `startalk` varchar(128) NOT NULL COMMENT '开工话术',
  `endtalk` varchar(128) NOT NULL COMMENT '完工话术',
  `sstid` int(11) NULL COMMENT '开工调研模版ID',
  `estid` int(11) NULL COMMENT '完工调研模版ID',
  `timeLimit` int(6) NOT NULL COMMENT '工期',
  `process` tinyint(1) NOT NULL DEFAULT 0 COMMENT '进度 , 0: 标准 , 1: 基础完工',
  `sort` tinyint(2) NOT NULL DEFAULT 0,
  `proset` tinyint(1) NULL DEFAULT 0,
  `accessoryLimit` int(8) NULL DEFAULT 0 COMMENT '辅料总额限制',
  `salaryLimit` int(8) NULL DEFAULT 0 COMMENT '工费总额限制',
  `kino` varchar(32) NULL,
  `kiname` varchar(32) NULL,
  `mark` tinyint(1) NULL DEFAULT 0,
  `account` tinyint(1) NOT NULL DEFAULT 0 COMMENT '决算标识, 0:否, 1:是',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 启用, 1: 禁用',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cnid`),
  KEY `indexone` (`sort`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程节点表';

DROP TABLE IF EXISTS `constructionpace`;
CREATE TABLE `constructionpace` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL DEFAULT '',
  `typeness` tinyint(1) NULL DEFAULT -1,
  `upperArea` int(8) NOT NULL DEFAULT 0,
  `lowerArea` int(8) NOT NULL DEFAULT 0,
  `period` int(10) NOT NULL DEFAULT 0,
  `designPeriod` int(8) NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程计划';

DROP TABLE IF EXISTS `constructionpacenode`;
CREATE TABLE `constructionpacenode` (
  `cpnid` int(11) NOT NULL AUTO_INCREMENT COMMENT '计划ID',
  `cpid` int(11) NOT NULL,
  `cnid` int(11) NULL,
  `name` varchar(32) NOT NULL COMMENT '名称',
  `connum` int(11) NOT NULL DEFAULT 0 COMMENT '工程量',
  `comnum` int(11) NOT NULL COMMENT '主材量',
  `prenum` int(11) NOT NULL DEFAULT 0,
  `postnum` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '状态 0: 启用, 1: 禁用 0: 启用, 1: 禁用',
  `phase` varchar(64) NULL,
  `material` varchar(64) NULL,
  `period` varchar(64) NULL,
  `content` varchar(512) NOT NULL COMMENT ' 说明',
  `comment` varchar(512) NOT NULL COMMENT '备注',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cpnid`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='施工计划节点';

DROP TABLE IF EXISTS `constructionperiod`;
CREATE TABLE `constructionperiod` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL DEFAULT '',
  `typeness` tinyint(1) NULL DEFAULT -1,
  `upperArea` int(8) NOT NULL DEFAULT 0,
  `lowerArea` int(8) NOT NULL DEFAULT 0,
  `period` int(10) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程工期';

DROP TABLE IF EXISTS `constructionperiodnode`;
CREATE TABLE `constructionperiodnode` (
  `cpnid` int(11) NOT NULL AUTO_INCREMENT,
  `cpid` int(11) NOT NULL COMMENT '工期ID',
  `cnid` int(11) NOT NULL COMMENT '节点ID',
  `name` varchar(32) NULL DEFAULT '',
  `period` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cpnid`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程节点工期';

DROP TABLE IF EXISTS `contract`;
CREATE TABLE `contract` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(255) NOT NULL COMMENT '编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `title` varchar(32) NOT NULL COMMENT '标题',
  `page` varchar(128) NOT NULL DEFAULT '',
  `path` varchar(128) NOT NULL DEFAULT '',
  `videopath` varchar(128) NULL,
  `noticePath` varchar(512) NULL COMMENT '客户须知文件路径',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `atttype` tinyint(1) NOT NULL COMMENT '业务类型',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=311 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='合同模版';

DROP TABLE IF EXISTS `cormrice`;
CREATE TABLE `cormrice` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '定额工费id',
  `qcid` int(11) NOT NULL COMMENT '数据公共项id',
  `cnid` int(11) NOT NULL COMMENT '工程节点',
  `unit` varchar(10) NOT NULL COMMENT ' 定额单位',
  `trannum` int(8) NOT NULL DEFAULT 0 COMMENT '转换量',
  `salary` int(8) NOT NULL COMMENT '薪资',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 有效 , 1: 无效',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `decorationatttype`;
CREATE TABLE `decorationatttype` (
  `daid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(36) NOT NULL COMMENT '名称',
  `key` int(11) NOT NULL COMMENT '键值',
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 半包, 1: 整装, 2: 满减',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 启用 , 1: 禁用',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`daid`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修业务';

DROP TABLE IF EXISTS `decorationbusitype`;
CREATE TABLE `decorationbusitype` (
  `dbid` int(11) NOT NULL AUTO_INCREMENT,
  `fdbid` int(11) NULL,
  `no` int(11) NOT NULL,
  `name` varchar(36) NOT NULL COMMENT '名称',
  `alias` varchar(36) NULL,
  `notSalesmanRate` int(8) NOT NULL DEFAULT 0 COMMENT '非提比例',
  `outside` tinyint(1) NOT NULL,
  `isRefer` tinyint(1) NOT NULL DEFAULT 0 COMMENT '推荐标识 0: 无 , 1: 推荐',
  `isAward` tinyint(1) NOT NULL DEFAULT 0 COMMENT '奖励标识 0: 奖励 , 1: 无',
  `isMember` tinyint(1) NOT NULL DEFAULT 0 COMMENT '会员标识 0: 通用 , 1: 会员',
  `sort` int(10) NULL,
  `type` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态,0启用,1禁用',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`dbid`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='业务类型表';

DROP TABLE IF EXISTS `decorationmatching`;
CREATE TABLE `decorationmatching` (
  `dmid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `type` tinyint(1) NOT NULL,
  `typeness` tinyint(1) NOT NULL,
  `base` bigint(10) NOT NULL,
  `discount` int(5) NOT NULL,
  `discountType` tinyint(1) NOT NULL COMMENT '0: 固定, 1: 可改, 2: 最低',
  `material` bigint(10) NOT NULL,
  `service` bigint(10) NOT NULL,
  `vision` tinyint(1) NOT NULL,
  `isShow` tinyint(1) NOT NULL DEFAULT 0 COMMENT '默认显示',
  `trafficDiscount` tinyint(1) NOT NULL DEFAULT 0 COMMENT '车运费折扣',
  `manageDiscount` tinyint(1) NOT NULL DEFAULT 0 COMMENT '管理费折扣',
  `taxDiscount` tinyint(1) NOT NULL DEFAULT 0 COMMENT '税金折扣, 0: 管理税金, 1: 总额税金',
  `comment` varchar(128) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dmid`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修配比';

DROP TABLE IF EXISTS `decorationmeasurerule`;
CREATE TABLE `decorationmeasurerule` (
  `dmrid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `comment` varchar(128) NULL,
  PRIMARY KEY (`dmrid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='量尺规则表';

DROP TABLE IF EXISTS `decorationmeasureruleitem`;
CREATE TABLE `decorationmeasureruleitem` (
  `dmriid` int(11) NOT NULL AUTO_INCREMENT,
  `dmrid` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`dmriid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='量尺规则项目表';

DROP TABLE IF EXISTS `drawlinegroup`;
CREATE TABLE `drawlinegroup` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `content` varchar(128) NULL,
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='放线小组表';

DROP TABLE IF EXISTS `flowitem`;
CREATE TABLE `flowitem` (
  `fiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '节点ID',
  `fpid` int(11) NOT NULL COMMENT '流程ID',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `content` varchar(32) NULL COMMENT '内容',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型',
  `x` int(11) NOT NULL DEFAULT 0 COMMENT 'x坐标',
  `y` int(11) NOT NULL DEFAULT 0 COMMENT ' y坐标',
  `pfiid` int(11) NULL COMMENT '上级节点ID',
  `nfiid` int(11) NULL COMMENT '下级节点ID',
  PRIMARY KEY (`fiid`)
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `flowpath`;
CREATE TABLE `flowpath` (
  `fpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '流程ID',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `no` varchar(32) NOT NULL COMMENT '编号',
  `keyword` varchar(32) NOT NULL COMMENT '关键字',
  `type` tinyint(4) NOT NULL DEFAULT 0 COMMENT '类型',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 ',
  PRIMARY KEY (`fpid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `format`;
CREATE TABLE `format` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `info` varchar(64) NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`fid`),
  KEY `indexone` (`gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3159 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商品规格';

DROP TABLE IF EXISTS `functionareaoption`;
CREATE TABLE `functionareaoption` (
  `faoid` int(11) NOT NULL AUTO_INCREMENT COMMENT '功能区选项ID',
  `faiid` int(11) NOT NULL COMMENT '功能区项目ID',
  `faid` int(11) NOT NULL COMMENT '功能区ID',
  `title` varchar(32) NULL DEFAULT '',
  `checked` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`faoid`)
) ENGINE=InnoDB AUTO_INCREMENT=393 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='功能区选项';

DROP TABLE IF EXISTS `functionareaotem`;
CREATE TABLE `functionareaotem` (
  `faiid` int(11) NOT NULL AUTO_INCREMENT,
  `faid` int(11) NOT NULL COMMENT '功能区ID',
  `name` varchar(32) NULL DEFAULT '' COMMENT '名称',
  `type` tinyint(1) NULL COMMENT '类型 , 0文本/1输入框/2单选/3多选/4日期',
  `require` tinyint(1) NULL COMMENT '必填标识',
  `content` varchar(64) NULL DEFAULT '',
  PRIMARY KEY (`faiid`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `gpid` int(11) NULL,
  `no` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `alias` varchar(32) NULL COMMENT '别名',
  `pinyin` varchar(128) NOT NULL,
  `barcode` varchar(128) NOT NULL DEFAULT '' COMMENT '条形码',
  `category` varchar(32) NOT NULL,
  `bid` int(11) NOT NULL,
  `brand` varchar(32) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `purchase` int(8) NULL DEFAULT 0,
  `selling` int(8) NULL DEFAULT 0,
  `confine` int(8) NULL DEFAULT 0,
  `pieceNum` int(8) NOT NULL DEFAULT 0,
  `atid` int(11) NULL COMMENT '辅类ID',
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 基装 , 1: 整装',
  `zerokind` int(11) NULL,
  `onekind` int(11) NULL,
  `twokind` int(11) NULL,
  `thrkind` int(11) NULL,
  `path` varchar(256) NULL,
  `isShow` tinyint(1) NOT NULL COMMENT '是否出样 0: 已出, 1: 未出',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL,
  `series` varchar(64) NULL COMMENT '系列',
  `elevel` varchar(64) NULL COMMENT '环保级别',
  `material` varchar(64) NULL COMMENT '材质',
  `quality` varchar(64) NULL COMMENT '特性',
  `color` varchar(64) NULL COMMENT '颜色',
  `format` varchar(64) NULL COMMENT '规格',
  `model` varchar(64) NULL COMMENT '型号',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=15229 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `goodskind`;
CREATE TABLE `goodskind` (
  `gkid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(16) NOT NULL COMMENT '编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `level` tinyint(1) NOT NULL COMMENT '等级 1/2/3',
  `status` tinyint(1) NOT NULL COMMENT '状态 0: 启用, 1: 禁用',
  `fgkid` int(11) NULL COMMENT '上级类别',
  PRIMARY KEY (`gkid`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='类别信息管理';

DROP TABLE IF EXISTS `goodspackage`;
CREATE TABLE `goodspackage` (
  `gpid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL COMMENT '套餐ID,对应商品gid 被绑商品ID',
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `cid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `num` int(8) NOT NULL DEFAULT 0,
  `purchase` int(8) NULL DEFAULT 0 COMMENT '限价',
  `selling` int(8) NULL DEFAULT 0 COMMENT '售价',
  `confine` int(8) NULL DEFAULT 0 COMMENT '控价',
  `ctype` tinyint(1) NULL DEFAULT 0 COMMENT '结算类型',
  `cvalue` int(8) NULL DEFAULT 0 COMMENT '结算值',
  PRIMARY KEY (`gpid`),
  KEY `indexone` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='套餐';

DROP TABLE IF EXISTS `goodsrecord`;
CREATE TABLE `goodsrecord` (
  `grid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL COMMENT '商品ID',
  `sid` int(11) NOT NULL COMMENT '选材or辅材ID 选材&辅材ID',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0: 商品 1: 选材 2: 辅材 0: 商品, 1: 选材 , 2: 辅材',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `comment` varchar(256) NOT NULL COMMENT '说明',
  `goodsNum` int(8) NULL DEFAULT 0 COMMENT '商品数量',
  `path` varchar(256) NULL COMMENT '图片路径',
  PRIMARY KEY (`grid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='记录';

DROP TABLE IF EXISTS `holiday`;
CREATE TABLE `holiday` (
  `hdid` int(11) NOT NULL AUTO_INCREMENT,
  `period` varchar(16) NULL,
  `startTime` timestamp NULL,
  `endTime` timestamp NULL,
  `daynum` int(4) NULL DEFAULT 0,
  `atttype` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`hdid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='假期';

DROP TABLE IF EXISTS `inspect`;
CREATE TABLE `inspect` (
  `iid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL COMMENT '名称',
  `atttype` tinyint(1) NOT NULL COMMENT '业务类型',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `content` varchar(256) NOT NULL COMMENT '内容',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='自检';

DROP TABLE IF EXISTS `inspectitem`;
CREATE TABLE `inspectitem` (
  `iiid` int(11) NOT NULL AUTO_INCREMENT,
  `iid` int(11) NOT NULL COMMENT '自检ID',
  `title` varchar(64) NOT NULL COMMENT '标题',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `isRequire` tinyint(1) NOT NULL COMMENT '是否必填',
  PRIMARY KEY (`iiid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='自检项';

DROP TABLE IF EXISTS `materialmodel`;
CREATE TABLE `materialmodel` (
  `mmId` int(11) NOT NULL AUTO_INCREMENT,
  `materialModelNo` varchar(64) NOT NULL,
  `materialModelName` varchar(64) NOT NULL,
  `brandId` int(11) NOT NULL,
  `materialTypeName` varchar(30) NOT NULL DEFAULT '',
  `materialBrandName` varchar(30) NOT NULL DEFAULT '',
  `measurementUnitId` int(11) NOT NULL,
  `measurementUnitName` varchar(10) NOT NULL DEFAULT '',
  `materialUnitPrice` int(8) NOT NULL DEFAULT 0,
  `materialPurchasePrice` int(8) NOT NULL DEFAULT 0,
  `discount` int(5) NOT NULL DEFAULT 0,
  `calcType` tinyint(4) NOT NULL DEFAULT 0,
  `point` int(8) NOT NULL DEFAULT 0,
  `base` int(8) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`mmId`),
  KEY `indexone` (`materialModelName`) USING BTREE,
  KEY `indextwo` (`brandId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=621 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='型号表';

DROP TABLE IF EXISTS `noods`;
CREATE TABLE `noods` (
  `nid` int(11) NOT NULL AUTO_INCREMENT COMMENT '选材ID',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `selling` int(8) NULL DEFAULT 0 COMMENT '售价',
  `balance` int(8) NULL DEFAULT 0 COMMENT '结算价',
  `surplus` int(8) NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `calc` tinyint(1) NULL DEFAULT 0 COMMENT '计算标识',
  `company` int(11) NOT NULL COMMENT '公司ID',
  PRIMARY KEY (`nid`)
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='定材';

DROP TABLE IF EXISTS `normadd`;
CREATE TABLE `normadd` (
  `naid` int(11) NOT NULL AUTO_INCREMENT COMMENT '附加项ID',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `cnid` int(11) NOT NULL COMMENT '施工节点ID',
  `unit` varchar(10) NULL DEFAULT '' COMMENT '单位 单位',
  `price` int(8) NULL DEFAULT 0 COMMENT '单价 单价',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`naid`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `normood`;
CREATE TABLE `normood` (
  `ngid` int(11) NOT NULL AUTO_INCREMENT COMMENT '定额材料id 定定额材料id',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `qiid` int(11) NOT NULL COMMENT '数据报价项id',
  `gid` int(11) NULL COMMENT '商品id',
  `nid` int(11) NULL,
  `normunit` varchar(10) NOT NULL COMMENT '定额单位',
  `normnum` int(8) NOT NULL COMMENT '定额数量 定额数量',
  `storeunit` varchar(10) NOT NULL COMMENT '库房单位',
  `storenum` int(8) NOT NULL COMMENT '库房数量 库房数量',
  `price` int(11) NULL DEFAULT 0 COMMENT '价格',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态 状态',
  PRIMARY KEY (`ngid`),
  KEY `indexone` (`qiid`, `gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `normpack`;
CREATE TABLE `normpack` (
  `npid` int(11) NOT NULL AUTO_INCREMENT COMMENT '打包项id',
  `name` varchar(255) NOT NULL COMMENT '姓名',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`npid`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `normpackitem`;
CREATE TABLE `normpackitem` (
  `npiid` int(11) NOT NULL AUTO_INCREMENT,
  `npid` int(11) NOT NULL,
  `gid` int(11) NULL,
  `nid` int(11) NULL COMMENT '定材id',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `normunit` varchar(10) NOT NULL COMMENT '定额单位',
  `normnum` int(8) NOT NULL COMMENT '定额数量 定额数量',
  `storeunit` varchar(10) NOT NULL COMMENT '库房单位',
  `storenum` int(8) NOT NULL COMMENT '库房数量 库房数量',
  `price` int(11) NULL DEFAULT 0 COMMENT '价格',
  PRIMARY KEY (`npiid`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `normrice`;
CREATE TABLE `normrice` (
  `npid` int(11) NOT NULL AUTO_INCREMENT COMMENT '定额工费id 定额工费id',
  `qiid` int(11) NOT NULL COMMENT '数据报价项id',
  `cnid` int(11) NOT NULL COMMENT '工程节点',
  `unit` varchar(10) NOT NULL,
  `trannum` int(8) NOT NULL DEFAULT 0,
  `salary` int(8) NOT NULL COMMENT '工费金额 工费',
  `stuff` int(8) NOT NULL COMMENT '材料费',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态 状态',
  PRIMARY KEY (`npid`),
  KEY `indexone` (`qiid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=278 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `ossconfig`;
CREATE TABLE `ossconfig` (
  `ossId` int(11) NOT NULL AUTO_INCREMENT COMMENT '储存访问凭证ID',
  `name` varchar(64) NOT NULL,
  `accessKeyId` varchar(128) NOT NULL COMMENT '密钥ID',
  `accessKeySecret` varchar(128) NOT NULL COMMENT '密钥',
  `endpoint` varchar(64) NOT NULL COMMENT '端点',
  `bucket` varchar(32) NOT NULL COMMENT '桶',
  `dir` varchar(32) NULL DEFAULT '' COMMENT '目录',
  `expireTime` int(11) NOT NULL COMMENT '过期时长（秒）',
  `policy` varchar(255) NULL COMMENT '策略',
  `signature` varchar(255) NULL COMMENT '签名',
  `deadline` timestamp NULL COMMENT '截止时间',
  PRIMARY KEY (`ossId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='oss临时访问凭证';

DROP TABLE IF EXISTS `paymentscale`;
CREATE TABLE `paymentscale` (
  `psid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `typeness` tinyint(1) NULL DEFAULT -1,
  `dbid` int(11) NULL DEFAULT -1,
  `atttype` tinyint(1) NULL DEFAULT -1,
  `comment` varchar(128) NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态,0:有效,1无效',
  PRIMARY KEY (`psid`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='款项比例';

DROP TABLE IF EXISTS `paymentscaleitem`;
CREATE TABLE `paymentscaleitem` (
  `psiid` int(11) NOT NULL AUTO_INCREMENT,
  `psid` int(11) NOT NULL,
  `ptid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `scale` int(8) NOT NULL,
  `sort` tinyint(2) NOT NULL,
  PRIMARY KEY (`psiid`)
) ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=latin1_swedish_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `paymenttype`;
CREATE TABLE `paymenttype` (
  `ptid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(36) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `paytype` tinyint(1) NOT NULL,
  `bustype` tinyint(1) NOT NULL,
  `atttype` tinyint(1) NULL,
  `payScale` int(2) NOT NULL,
  `saleScale` int(2) NOT NULL,
  `code` tinyint(1) NULL,
  `taxrate` int(5) NULL,
  `kino` varchar(64) NULL,
  `kiname` varchar(64) NULL,
  `kibalance` varchar(64) NULL,
  `billType` varchar(16) NULL,
  `status` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`ptid`)
) ENGINE=InnoDB AUTO_INCREMENT=269 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='款项类型';

DROP TABLE IF EXISTS `price`;
CREATE TABLE `price` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `gid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `purchase` int(8) NOT NULL DEFAULT 0,
  `selling` int(8) NOT NULL DEFAULT 0,
  `confine` int(8) NULL DEFAULT 0,
  `ctype` tinyint(1) NOT NULL DEFAULT 0,
  `cvalue` int(8) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1814 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `receipttype`;
CREATE TABLE `receipttype` (
  `rtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(36) NOT NULL,
  `no` varchar(36) NOT NULL,
  `subjectName` varchar(64) NOT NULL,
  `oneCode` varchar(6) NOT NULL,
  `twoCode` varchar(4) NOT NULL,
  `thrCode` varchar(4) NOT NULL,
  `direction` tinyint(4) NOT NULL COMMENT '余额方向,借 1, 贷 -1',
  `type` tinyint(4) NOT NULL,
  `fund` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `company` int(4) NOT NULL,
  `grade` varchar(1) NOT NULL,
  `kino` varchar(36) NULL,
  `kiname` varchar(36) NULL,
  `kibalance` varchar(36) NULL,
  `bankno` varchar(36) NULL,
  `assistant` varchar(128) NULL DEFAULT '',
  `value` varchar(36) NULL,
  PRIMARY KEY (`rtid`)
) ENGINE=InnoDB AUTO_INCREMENT=2483 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='收据类型';

DROP TABLE IF EXISTS `receipttypeitem`;
CREATE TABLE `receipttypeitem` (
  `rtiid` int(11) NOT NULL AUTO_INCREMENT,
  `rtid` int(11) NOT NULL,
  `no` varchar(36) NOT NULL,
  `name` varchar(16) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `paytype` tinyint(1) NOT NULL,
  PRIMARY KEY (`rtiid`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='收据单据表';

DROP TABLE IF EXISTS `remeasureformat`;
CREATE TABLE `remeasureformat` (
  `rfid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL COMMENT '名称',
  `bid` int(11) NOT NULL COMMENT '品牌',
  `qiid` int(11) NULL COMMENT '报价项',
  `gid` int(11) NULL COMMENT '商品',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `value` int(10) NOT NULL COMMENT '数值',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`rfid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌回尺指标';

DROP TABLE IF EXISTS `salesmatching`;
CREATE TABLE `salesmatching` (
  `smid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `onecheck` int(5) NOT NULL DEFAULT 0,
  `twocheck` int(5) NOT NULL DEFAULT 0,
  `thrcheck` int(5) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(256) NULL,
  `company` int(11) NULL,
  PRIMARY KEY (`smid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `signet`;
CREATE TABLE `signet` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  `keyword` varchar(32) NOT NULL,
  `path` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  `signid` varchar(64) NULL DEFAULT '',
  `signno` varchar(64) NULL DEFAULT '',
  `token` varchar(255) NULL DEFAULT '',
  `authurl` varchar(320) NULL DEFAULT '',
  `type` tinyint(1) NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='签章';

DROP TABLE IF EXISTS `soods`;
CREATE TABLE `soods` (
  `sid` int(11) NOT NULL AUTO_INCREMENT COMMENT '选材ID',
  `name` varchar(32) NULL COMMENT '名称',
  `gid` int(11) NULL COMMENT '商品ID',
  `qiid` int(11) NULL COMMENT '报价项ID',
  `format` varchar(64) NULL DEFAULT '',
  `num` int(11) NOT NULL DEFAULT 0 COMMENT '数量',
  `selling` int(8) NULL DEFAULT 0 COMMENT '售价',
  `cost` int(11) NULL DEFAULT 0 COMMENT '成本',
  `balance` int(11) NULL DEFAULT 0 COMMENT '结算价',
  `path` varchar(255) NULL COMMENT '图片路径',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 有效 , 1: 无效',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 , 0: 通用 , 1: 费用',
  `company` int(11) NOT NULL DEFAULT 0 COMMENT '公司ID',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=455 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `soodsitem`;
CREATE TABLE `soodsitem` (
  `siid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `qiid` int(11) NOT NULL,
  `gid` int(11) NULL,
  `status` smallint(11) NOT NULL,
  PRIMARY KEY (`siid`),
  KEY `soodsitem` (`sid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=751 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `suppliersignet`;
CREATE TABLE `suppliersignet` (
  `ssid` int(11) NOT NULL AUTO_INCREMENT,
  `suid` int(11) NULL DEFAULT 0 COMMENT '厂商ID 厂商ID',
  `no` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  `corporation` varchar(64) NULL DEFAULT '',
  `taxNo` varchar(64) NULL DEFAULT '',
  `address` varchar(64) NULL DEFAULT '',
  `phone` varchar(64) NULL DEFAULT '',
  `bankName` varchar(64) NULL DEFAULT '',
  `bankNo` varchar(64) NULL DEFAULT '',
  `keyword` varchar(32) NOT NULL,
  `path` varchar(128) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL,
  `company` int(11) NOT NULL,
  `signid` varchar(64) NULL DEFAULT '',
  `signno` varchar(64) NULL DEFAULT '',
  `token` varchar(255) NULL DEFAULT '',
  `authurl` varchar(320) NULL DEFAULT '',
  `type` tinyint(1) NOT NULL,
  PRIMARY KEY (`ssid`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商签章';

DROP TABLE IF EXISTS `surveytemplate`;
CREATE TABLE `surveytemplate` (
  `stid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `status` tinyint(1) NULL,
  `isSend` tinyint(1) NOT NULL DEFAULT 0 COMMENT '推送标识, 0:手动, 1:自动',
  `company` int(11) NULL,
  PRIMARY KEY (`stid`)
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `surveytemplateitem`;
CREATE TABLE `surveytemplateitem` (
  `stiid` int(11) NOT NULL AUTO_INCREMENT,
  `stid` int(11) NULL,
  `name` varchar(128) NULL,
  `type` tinyint(1) NULL,
  `content` varchar(256) NULL,
  `require` tinyint(1) NULL DEFAULT 1 COMMENT '0: 必填 , 1: 选填',
  `sort` int(11) NULL COMMENT '排序',
  PRIMARY KEY (`stiid`)
) ENGINE=InnoDB AUTO_INCREMENT=3096 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `surveytemplateoption`;
CREATE TABLE `surveytemplateoption` (
  `stoid` int(11) NOT NULL AUTO_INCREMENT,
  `stiid` int(11) NULL,
  `stid` int(11) NULL,
  `title` varchar(32) NULL,
  PRIMARY KEY (`stoid`)
) ENGINE=InnoDB AUTO_INCREMENT=10233 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `talking`;
CREATE TABLE `talking` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `content` varchar(256) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `company` int(11) NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='合同话术';

DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `filepath` varchar(128) NOT NULL,
  `plugins` varchar(16) NULL DEFAULT '',
  `level` tinyint(1) NOT NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL,
  `handle` tinyint(1) NOT NULL,
  `server` int(11) NOT NULL DEFAULT 0 COMMENT '服务',
  `week` varchar(255) NULL DEFAULT '' COMMENT '星期',
  `day` varchar(255) NULL DEFAULT '' COMMENT '天数',
  `hour` varchar(255) NULL DEFAULT '' COMMENT '小时',
  `status` tinyint(1) NOT NULL,
  `isShow` tinyint(1) NOT NULL,
  `keyword` varchar(64) NULL,
  PRIMARY KEY (`tid`),
  UNIQUE KEY `keyword_UNIQUE` (`keyword`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `taskparam`;
CREATE TABLE `taskparam` (
  `tpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务字段ID',
  `tid` int(11) NULL DEFAULT 0,
  `name` varchar(32) NULL COMMENT '名称',
  `module` varchar(32) NOT NULL COMMENT '模块',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型',
  `oneType` tinyint(1) NOT NULL DEFAULT 0 COMMENT '文本/数值',
  `unionField` varchar(32) NOT NULL COMMENT '关联',
  `unionParam` int(11) NOT NULL DEFAULT 0 COMMENT '任务字段ID',
  `field` varchar(32) NOT NULL COMMENT '字段',
  `tableName` varchar(64) NOT NULL COMMENT '表名',
  `alias` varchar(16) NOT NULL COMMENT '别名',
  `ismain` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否重要',
  `handle` varchar(32) NULL COMMENT '处理过程',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `sort` tinyint(2) NULL DEFAULT 0 COMMENT '排序',
  `tablesort` tinyint(2) NULL DEFAULT 0 COMMENT '表排序',
  `comment` varchar(255) NULL COMMENT '备注',
  PRIMARY KEY (`tpid`)
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `taskroleright`;
CREATE TABLE `taskroleright` (
  `trrid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`trrid`)
) ENGINE=InnoDB AUTO_INCREMENT=2318 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;
