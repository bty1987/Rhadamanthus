CREATE DATABASE IF NOT EXISTS `communion`;
USE `communion`;

-- Generated at 2026-01-06 08:11:02
-- Total tables: 97

DROP TABLE IF EXISTS `assistance`;
CREATE TABLE `assistance` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `keyword` varchar(128) NOT NULL,
  `atttype` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='帮助表';

DROP TABLE IF EXISTS `assistanceitem`;
CREATE TABLE `assistanceitem` (
  `aiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NULL,
  `title` varchar(64) NULL,
  `content` varchar(1024) NULL,
  `sort` int(4) NULL,
  PRIMARY KEY (`aiid`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='帮助项表';

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL DEFAULT 6508,
  `month` int(6) NOT NULL,
  `a1` int(2) NOT NULL DEFAULT 40,
  `a2` int(2) NOT NULL DEFAULT 40,
  `a3` int(2) NOT NULL DEFAULT 40,
  `a4` int(2) NOT NULL DEFAULT 40,
  `a5` int(2) NOT NULL DEFAULT 40,
  `a6` int(2) NOT NULL DEFAULT 40,
  `a7` int(2) NOT NULL DEFAULT 40,
  `a8` int(2) NOT NULL DEFAULT 40,
  `a9` int(2) NOT NULL DEFAULT 40,
  `a10` int(2) NOT NULL DEFAULT 40,
  `a11` int(2) NOT NULL DEFAULT 40,
  `a12` int(2) NOT NULL DEFAULT 40,
  `a13` int(2) NOT NULL DEFAULT 40,
  `a14` int(2) NOT NULL DEFAULT 40,
  `a15` int(2) NOT NULL DEFAULT 40,
  `a16` int(2) NOT NULL DEFAULT 40,
  `a17` int(2) NOT NULL DEFAULT 40,
  `a18` int(2) NOT NULL DEFAULT 40,
  `a19` int(2) NOT NULL DEFAULT 40,
  `a20` int(2) NOT NULL DEFAULT 40,
  `a21` int(2) NOT NULL DEFAULT 40,
  `a22` int(2) NOT NULL DEFAULT 40,
  `a23` int(2) NOT NULL DEFAULT 40,
  `a24` int(2) NOT NULL DEFAULT 40,
  `a25` int(2) NOT NULL DEFAULT 40,
  `a26` int(2) NOT NULL DEFAULT 40,
  `a27` int(2) NOT NULL DEFAULT 40,
  `a28` int(2) NOT NULL DEFAULT 40,
  `a29` int(2) NOT NULL DEFAULT 40,
  `a30` int(2) NOT NULL DEFAULT 40,
  `a31` int(2) NOT NULL DEFAULT 40,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=31487 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='考勤表';

DROP TABLE IF EXISTS `balancecutpay`;
CREATE TABLE `balancecutpay` (
  `bcid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `bid` int(11) NULL,
  `bdid` int(11) NULL,
  `bccid` int(11) NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 , 0: 扣款 , 1: 返款',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 , 0: 初始 , 1: 绑定',
  `ouid` int(11) NOT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `money` bigint(10) NOT NULL DEFAULT 0,
  `total` int(11) NOT NULL DEFAULT 0 COMMENT '总额',
  `comment` varchar(128) NULL,
  PRIMARY KEY (`bcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `brand`;
CREATE TABLE `brand` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `bpid` int(11) NULL,
  `no` varchar(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `pinyin` varchar(216) NOT NULL,
  `agentName` varchar(32) NULL,
  `agentPhone` varchar(32) NULL,
  `ocuid` int(11) NULL,
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '业务类型 , 0: 内销 , 1: 外销',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态：0(启用), 1(禁用)',
  `numtype` tinyint(1) NULL DEFAULT 0 COMMENT '选材量类型：0: 实用量 , 1: 退货量',
  `kino` varchar(36) NULL,
  `kiname` varchar(36) NULL,
  `comment` varchar(128) NULL,
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`bid`),
  KEY `indexone` (`cid`) USING BTREE,
  KEY `indextwo` (`name`, `pinyin`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=421 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌表';

DROP TABLE IF EXISTS `brandinstorer`;
CREATE TABLE `brandinstorer` (
  `biid` int(11) NOT NULL AUTO_INCREMENT,
  `iuid` int(11) NOT NULL COMMENT '驻店id',
  `bid` int(11) NOT NULL COMMENT '品牌id',
  `agentName` varchar(32) NULL COMMENT '代理',
  `agentPhone` varchar(32) NULL COMMENT '电话',
  PRIMARY KEY (`biid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `brandpool`;
CREATE TABLE `brandpool` (
  `bpid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `no` varchar(10) NOT NULL,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(216) NOT NULL,
  `kino` varchar(16) NULL DEFAULT '',
  `kiname` varchar(32) NULL DEFAULT '',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态：0(启用), 1(禁用)',
  `comment` varchar(256) NULL DEFAULT '',
  PRIMARY KEY (`bpid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌池表';

DROP TABLE IF EXISTS `brandsupplier`;
CREATE TABLE `brandsupplier` (
  `buid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '厂商ID',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  PRIMARY KEY (`buid`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `branduserright`;
CREATE TABLE `branduserright` (
  `burId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NULL,
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  PRIMARY KEY (`burId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品牌用户权限表';

DROP TABLE IF EXISTS `buildingnamerule`;
CREATE TABLE `buildingnamerule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingNameRuleId` varchar(32) NOT NULL,
  `rule` varchar(128) NOT NULL,
  `ruleExample` varchar(64) NOT NULL,
  `ruleContent` varchar(64) NOT NULL,
  `rulefill` varchar(64) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `buildingNameRuleId_UNIQUE` (`buildingNameRuleId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='建筑命名规则';

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(32) NOT NULL,
  `type` tinyint(1) NULL DEFAULT 0 COMMENT '类型 , 0: 普通 , 1: 统计',
  `isCoupon` tinyint(1) NULL DEFAULT 0 COMMENT '券标识 , 0: 优惠 , 1: 标准',
  `isCount` tinyint(1) NULL DEFAULT 0 COMMENT '统计标识 , 0: 统计 , 1: 标准',
  `isLimit` tinyint(1) NULL DEFAULT 0,
  `kino` varchar(16) NULL DEFAULT '',
  `kiname` varchar(32) NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='品类表';

DROP TABLE IF EXISTS `chart`;
CREATE TABLE `chart` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(32) NOT NULL COMMENT '编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `type` tinyint(1) NOT NULL COMMENT '类型 , 1: 装修 , 2: 销售 , 3: 工程 , 4: 款项',
  `level` tinyint(1) NOT NULL COMMENT '等级 , 0: 集团 , 1: 公司 , 2: 大区 , 3: 部门',
  `api` varchar(50) NOT NULL COMMENT '接口',
  `method` varchar(32) NOT NULL COMMENT '方法',
  `param` varchar(255) NULL COMMENT '参数',
  `style` varchar(255) NULL COMMENT '样式',
  `clazz` varchar(255) NULL COMMENT '类型',
  `sort` int(255) NOT NULL COMMENT '排序',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `city`;
CREATE TABLE `city` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `no` varchar(10) NOT NULL,
  `name` varchar(64) NOT NULL,
  `province` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` int(10) NOT NULL DEFAULT 0,
  `y` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cid`),
  UNIQUE KEY `uniqueone` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='城市表';

DROP TABLE IF EXISTS `cityproper`;
CREATE TABLE `cityproper` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NULL,
  `no` varchar(10) NOT NULL,
  `name` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` int(10) NOT NULL DEFAULT 0,
  `y` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cpid`),
  UNIQUE KEY `cityProperId_UNIQUE` (`no`) USING BTREE,
  KEY `indexone` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='城市表';

DROP TABLE IF EXISTS `cityproperpartner`;
CREATE TABLE `cityproperpartner` (
  `cppid` int(11) NOT NULL AUTO_INCREMENT,
  `cpid` int(11) NOT NULL COMMENT '部门ID',
  `puid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 业务 , 1: 设计 , 2: 销售 , 3: 工程 , 4: 服务',
  `status` tinyint(1) NOT NULL COMMENT '0: 有效 , 1: 无效',
  `company` int(11) NOT NULL COMMENT '公司ID',
  PRIMARY KEY (`cppid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='城区合作';

DROP TABLE IF EXISTS `colorpool`;
CREATE TABLE `colorpool` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `gpid` int(11) NOT NULL COMMENT '商品池ID',
  `name` varchar(32) NOT NULL COMMENT '名字',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=5414 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='颜色池';

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(16) NOT NULL,
  `code` varchar(10) NOT NULL DEFAULT '',
  `name` varchar(16) NOT NULL,
  `shortname` varchar(8) NOT NULL DEFAULT '',
  `fullname` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `corporation` varchar(8) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `doid` int(11) NULL,
  `soid` int(11) NULL,
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 集团 , 1: 装修 , 2: 家居 , 3: 工程 , 4: 建材 , 5: 房产 , 6: 科技 , 7: 其他',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `block` tinyint(1) NULL DEFAULT 0 COMMENT '0:通用 ,1:方林 ,2:1918 ,3:宜家 ,4:爱林 ,5:恩林',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='公司表';

DROP TABLE IF EXISTS `constant`;
CREATE TABLE `constant` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '常量ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `module` varchar(64) NULL COMMENT '模块',
  `clazz` varchar(64) NULL DEFAULT '' COMMENT '对象',
  `type` varchar(64) NULL COMMENT '类型',
  `field` varchar(64) NULL COMMENT '字段名',
  `key` varchar(64) NULL COMMENT '键',
  `value` varchar(64) NULL COMMENT '值',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1926 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='常量表';

DROP TABLE IF EXISTS `constantback`;
CREATE TABLE `constantback` (
  `cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '常量ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `module` varchar(64) NULL COMMENT '模块',
  `clazz` varchar(64) NULL DEFAULT '' COMMENT '对象',
  `type` varchar(64) NULL COMMENT '类型',
  `field` varchar(64) NULL COMMENT '字段名',
  `key` varchar(64) NULL COMMENT '键',
  `value` varchar(64) NULL COMMENT '值',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1977 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='常量表';

DROP TABLE IF EXISTS `construction`;
CREATE TABLE `construction` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL DEFAULT '',
  `cnid` int(11) NULL DEFAULT 0,
  `schedule` tinyint(1) NULL DEFAULT 0,
  `process` tinyint(1) NULL DEFAULT 0,
  `period` int(8) NULL DEFAULT 0,
  `startTime` timestamp NULL,
  `endTime` timestamp NULL,
  `accessory` tinyint(1) NULL DEFAULT 0,
  `suid` int(11) NULL,
  `luid` int(11) NULL,
  `buid` int(11) NULL,
  `accessoryLimit` bigint(10) NULL DEFAULT 0,
  `accessoryTotal` bigint(10) NULL DEFAULT 0,
  `salaryLimit` bigint(10) NULL DEFAULT 0,
  `salaryLimitTotal` int(8) NULL DEFAULT 0,
  `salaryTotal` bigint(10) NULL DEFAULT 0,
  `createTime` timestamp NULL,
  `finishTime` timestamp NULL,
  `processTime` timestamp NULL,
  `lockTime` timestamp NULL,
  `balanceTime` timestamp NULL,
  `workStatus` tinyint(1) NULL DEFAULT 0,
  `scheduleStatus` tinyint(1) NULL DEFAULT 0,
  `balanceStatus` tinyint(1) NULL DEFAULT 0,
  `terminalStatus` tinyint(1) NULL COMMENT '终止状态',
  PRIMARY KEY (`cid`),
  KEY `indexone` (`orderId`) USING BTREE,
  KEY `indexthr` (`schedule`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程进度表';

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
  `kino` varchar(32) NULL,
  `kiname` varchar(32) NULL,
  `mark` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 启用, 1: 禁用',
  `company` int(11) NOT NULL,
  `accessoryLimit` int(8) NULL DEFAULT 0 COMMENT '辅料总额限制',
  `salaryLimit` int(8) NULL DEFAULT 0 COMMENT '工费总额限制',
  PRIMARY KEY (`cnid`),
  KEY `indexone` (`sort`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工程节点表';

DROP TABLE IF EXISTS `counting`;
CREATE TABLE `counting` (
  `date` varchar(8) NOT NULL,
  `type` int(11) NOT NULL,
  `company` int(11) NOT NULL DEFAULT 0,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`company`, `date`, `type`),
  KEY `indexone` (`date`, `type`, `company`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='统计数表';

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(32) NOT NULL,
  `pinyinAB` varchar(50) NOT NULL,
  `pinyinAll` varchar(50) NOT NULL,
  `gender` varchar(50) NULL,
  `qq` varchar(15) NULL,
  `wechat` varchar(15) NULL,
  `email` varchar(32) NULL,
  `career` varchar(32) NULL,
  `address` varchar(128) NULL,
  `relationshipType` varchar(40) NULL,
  `officer` varchar(32) NULL,
  `passport` varchar(32) NULL,
  `passhkm` varchar(32) NULL COMMENT '港澳通行证',
  `identity` varchar(32) NULL,
  `company` int(11) NULL DEFAULT 0,
  `phone` varchar(32) NULL,
  `token` varchar(255) NULL,
  `signno` varchar(64) NULL,
  `status` tinyint(1) NULL DEFAULT 0,
  `photoPath` varchar(256) NULL,
  `signPath` varchar(256) NULL DEFAULT NULL,
  `identityPathF` varchar(256) NULL,
  `identityPathB` varchar(256) NULL,
  `authurl` varchar(320) NULL,
  `type` int(11) NULL DEFAULT 0 COMMENT '类型 , 0: 个人 , 1: 公司',
  `companyNo` varchar(256) NULL COMMENT ' 编号 , 统一社会信用代码',
  `companyName` varchar(256) NULL COMMENT '公司名',
  `companyAddr` varchar(256) NULL COMMENT '公司地址',
  `companyPhone` varchar(256) NULL COMMENT '公司电话',
  `companyBank` varchar(256) NULL COMMENT '开户行',
  `companyBankno` varchar(256) NULL COMMENT '开户账号',
  PRIMARY KEY (`cid`),
  KEY `indexfor` (`phone`) USING BTREE,
  KEY `indexone` (`name`) USING BTREE,
  KEY `indexthree` (`pinyinAll`) USING BTREE,
  KEY `indextwo` (`pinyinAB`) USING BTREE,
  UNIQUE KEY `uniqueone` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=67278 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户表';

DROP TABLE IF EXISTS `customerphone`;
CREATE TABLE `customerphone` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `phone` varchar(128) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `defaults` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0:非默认,1:默认',
  PRIMARY KEY (`cpid`),
  KEY `indexone` (`phone`) USING BTREE,
  KEY `indextwo` (`cid`) USING BTREE,
  UNIQUE KEY `uniqueone` (`cid`, `phone`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=33156 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户电话';

DROP TABLE IF EXISTS `customerrecord`;
CREATE TABLE `customerrecord` (
  `crid` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `cid` int(11) NULL COMMENT '客户ID',
  `cpid` int(11) NULL COMMENT '客户电话ID',
  `ouid` int(11) NULL COMMENT '操作人',
  `operateTime` timestamp NULL COMMENT '操作时间',
  `type` tinyint(1) NULL DEFAULT 0 COMMENT '类型 , 0: 电话查询',
  `comment` varchar(255) NULL DEFAULT '' COMMENT '说明',
  PRIMARY KEY (`crid`),
  KEY `indexone` (`cid`) USING BTREE,
  KEY `indextwo` (`operateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=128092 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='客户记录';

DROP TABLE IF EXISTS `custype`;
CREATE TABLE `custype` (
  `ctid` int(11) NOT NULL AUTO_INCREMENT COMMENT '商户id',
  `name` varchar(32) NOT NULL COMMENT '名称 名称',
  `no` varchar(32) NOT NULL COMMENT '商户号 商户号',
  `agent` varchar(32) NOT NULL COMMENT '机构号 机构号',
  `phone` varchar(11) NOT NULL COMMENT '商户手机号 商户手机号',
  `wxapp` varchar(32) NOT NULL COMMENT '小程序appid wx小程序appid',
  `rtid` int(11) NULL,
  `platform` tinyint(1) NULL DEFAULT 0 COMMENT '支付方式 0：pos 1: wxpay',
  `atttype` tinyint(1) NOT NULL COMMENT '业务类型 业务类型: 0预付 , 1装修 , 2主材/占位 , 3销售 , 4服务',
  `dgrade` varchar(1) NULL COMMENT '装修等级 装修单等级: A/B/C',
  `sgrade` varchar(1) NULL COMMENT '销售等级 销售单等级: A/B/C',
  `status` tinyint(1) NOT NULL COMMENT '状态 0:启用 1:禁用',
  `company` int(11) NOT NULL COMMENT '公司 公司',
  PRIMARY KEY (`ctid`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商户表';

DROP TABLE IF EXISTS `custype_off`;
CREATE TABLE `custype_off` (
  `ctid` int(11) NOT NULL AUTO_INCREMENT COMMENT '商户id',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `no` varchar(32) NOT NULL COMMENT '商户号',
  `agent` varchar(32) NOT NULL COMMENT '机构号',
  `phone` varchar(11) NOT NULL COMMENT '商户手机号',
  `wxapp` varchar(32) NOT NULL COMMENT '小程序appid',
  `rtid` int(11) NULL,
  `platform` tinyint(1) NULL DEFAULT 0,
  `atttype` tinyint(1) NOT NULL COMMENT '业务类型',
  `dgrade` varchar(1) NULL COMMENT '装修等级',
  `sgrade` varchar(1) NULL COMMENT '销售等级',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`ctid`)
) ENGINE=InnoDB AUTO_INCREMENT=854 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商户表';

DROP TABLE IF EXISTS `datadrawing`;
CREATE TABLE `datadrawing` (
  `ddid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '资源ID',
  `name` varchar(64) NULL COMMENT '图片名称',
  `drawingUrl` varchar(256) NOT NULL COMMENT '图片路径',
  `drawingType` tinyint(1) NOT NULL COMMENT '图片类型 0:信息平台 1:钉钉',
  `type` tinyint(1) NOT NULL COMMENT '类型 0:village 1:customer',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 0:启用 1:禁用',
  PRIMARY KEY (`ddid`)
) ENGINE=InnoDB AUTO_INCREMENT=926 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='数据图片';

DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL COMMENT '部门编号',
  `code` varchar(32) NULL,
  `fdid` int(11) NULL COMMENT '上级部门ID',
  `name` varchar(32) NOT NULL COMMENT '部门名称',
  `pinyin` varchar(128) NOT NULL,
  `alias` varchar(32) NULL DEFAULT '',
  `type` varchar(10) NOT NULL COMMENT '部门类型',
  `subType` varchar(10) NULL COMMENT '二级部门分类',
  `contractPrefix` varchar(32) NULL COMMENT '设计部门合同前缀(独有)',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `isdet` int(11) NOT NULL DEFAULT 0,
  `limits` int(11) NULL DEFAULT 0 COMMENT '数量上限',
  `kino` varchar(32) NULL,
  `kiname` varchar(32) NULL,
  `muid` int(11) NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `comment` varchar(128) NULL COMMENT '表述',
  `company` int(11) NOT NULL,
  `aompany` int(11) NULL DEFAULT 0 COMMENT '业绩公司',
  PRIMARY KEY (`did`),
  UNIQUE KEY `deptId_UNIQUE` (`no`) USING BTREE,
  KEY `indexone` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=554 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='部门表';

DROP TABLE IF EXISTS `departmentpartner`;
CREATE TABLE `departmentpartner` (
  `dpid` int(11) NOT NULL AUTO_INCREMENT,
  `did` int(11) NOT NULL COMMENT '部门ID',
  `puid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 业务 , 1: 设计 , 2: 主材 , 3: 工程',
  `status` tinyint(1) NOT NULL COMMENT '0: 有效 , 1: 无效',
  `company` int(11) NOT NULL COMMENT '公司ID',
  PRIMARY KEY (`dpid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='部门合作';

DROP TABLE IF EXISTS `departmenttype`;
CREATE TABLE `departmenttype` (
  `dtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`dtid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `dutment`;
CREATE TABLE `dutment` (
  `did` int(11) NOT NULL AUTO_INCREMENT COMMENT '定岗ID',
  `deptId` int(11) NOT NULL COMMENT '部门ID',
  `dutyId` int(11) NOT NULL COMMENT '职位ID',
  `limits` int(11) NOT NULL DEFAULT 0 COMMENT '人员上限',
  `num` int(11) NOT NULL DEFAULT 0 COMMENT '人员数量',
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `duty`;
CREATE TABLE `duty` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `departmentType` int(11) NULL,
  `type` int(11) NOT NULL,
  `lead` int(11) NOT NULL,
  `pinYin` varchar(64) NOT NULL,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='职位表';

DROP TABLE IF EXISTS `formatpool`;
CREATE TABLE `formatpool` (
  `fpid` int(11) NOT NULL AUTO_INCREMENT,
  `gpid` int(11) NOT NULL COMMENT '商品池ID',
  `info` varchar(64) NOT NULL COMMENT '信息',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`fpid`)
) ENGINE=InnoDB AUTO_INCREMENT=3058 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='规格池';

DROP TABLE IF EXISTS `goodspool`;
CREATE TABLE `goodspool` (
  `gpid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL COMMENT '编号',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `alias` varchar(32) NULL COMMENT '别名',
  `pinyin` varchar(128) NOT NULL COMMENT '拼音',
  `barcode` varchar(128) NOT NULL COMMENT '条形码',
  `category` varchar(32) NOT NULL COMMENT '品类',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `brand` varchar(32) NOT NULL COMMENT '品牌',
  `measurementUnit` varchar(10) NOT NULL COMMENT '单位',
  `purchase` int(8) NULL COMMENT '进价',
  `selling` int(8) NULL COMMENT '售价',
  `confine` int(8) NULL COMMENT '限价',
  `pieceNum` int(8) NOT NULL COMMENT '件数',
  `atid` int(11) NULL COMMENT '辅类ID',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `zerokind` int(11) NULL,
  `onekind` int(11) NULL COMMENT '一类',
  `twokind` int(11) NULL COMMENT '二类',
  `thrkind` int(11) NULL COMMENT '三类',
  `path` varchar(256) NULL COMMENT '图片',
  `colorcascade` tinyint(1) NOT NULL COMMENT '颜色级联 1:级联控制 2:级联不控制 4:不级联不控制 8:不级联控制 1:级联 2:不级联 4:控制 8:不控制',
  `formatcascade` tinyint(1) NOT NULL COMMENT '规格级联 1:级联控制 2:级联不控制 4:不级联不控制 8:不级联控制 1:级联 2:不级联 4:控制 8:不控制',
  `pricecascade` tinyint(1) NOT NULL COMMENT '价格级联 1:级联控制 2:级联不控制 4:不级联不控制 8:不级联控制 16:价格控制 1:级联 2:不级联 4:控制 8:不控制 16:价格控制',
  `picturecascade` tinyint(1) NOT NULL COMMENT '照片级联 1:级联控制 2:级联不控制 4:不级联不控制 8:不级联控制 1:级联 2:不级联 4:控制 8:不控制',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `series` varchar(64) NULL COMMENT '系列',
  `elevel` varchar(64) NULL COMMENT '环保级别',
  `material` varchar(64) NULL COMMENT '材质',
  `quality` varchar(64) NULL COMMENT '特性',
  `color` varchar(64) NULL COMMENT '颜色',
  `format` varchar(64) NULL COMMENT '规格',
  `model` varchar(64) NULL COMMENT '型号',
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT ' 0: 基装 , 1: 整装',
  PRIMARY KEY (`gpid`)
) ENGINE=InnoDB AUTO_INCREMENT=15131 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='商品池';

DROP TABLE IF EXISTS `house`;
CREATE TABLE `house` (
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `vid` int(11) NOT NULL COMMENT '楼盘ID',
  `houseNumber` varchar(32) NOT NULL COMMENT '楼牌号',
  `built` varchar(32) NULL COMMENT '楼号',
  `unit` varchar(32) NULL COMMENT '单元',
  `floor` smallint(3) NULL DEFAULT 0 COMMENT '楼层',
  `door` smallint(3) NULL DEFAULT 0 COMMENT '门号',
  `innerFloor` smallint(3) NULL DEFAULT 0,
  `type` tinyint(2) NULL DEFAULT 0 COMMENT '房产类型',
  `buildArea` int(8) NOT NULL DEFAULT 0 COMMENT '建筑面积',
  `freeArea` int(8) NOT NULL DEFAULT 0 COMMENT '赠送面积',
  `innerArea` int(8) NOT NULL DEFAULT 0 COMMENT '套内面积',
  `quoteArea` int(8) NOT NULL DEFAULT 0 COMMENT '报价面积',
  `totalArea` int(8) NOT NULL DEFAULT 0 COMMENT '总面积',
  `maxFloor` smallint(3) NULL DEFAULT 0 COMMENT '最高楼层',
  `through` tinyint(1) NULL DEFAULT 0 COMMENT '是否越层',
  `roomNum` smallint(2) NULL DEFAULT 1 COMMENT '房间数量',
  `houseType` varchar(16) NULL DEFAULT '0' COMMENT '户型',
  `orientation` tinyint(2) NULL DEFAULT 0 COMMENT '房屋朝向',
  `feature` varchar(256) NULL COMMENT '三不',
  `waterVapour` tinyint(1) NULL DEFAULT 0 COMMENT '水气设施',
  `parlourType` tinyint(1) NULL DEFAULT 0 COMMENT '客厅类型',
  `heatingType` tinyint(1) NULL DEFAULT 0 COMMENT '供暖类型',
  `islift` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(1) NULL DEFAULT 0,
  `company` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`hid`),
  UNIQUE KEY `index` (`houseNumber`, `vid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12924 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='房产';

DROP TABLE IF EXISTS `houselayout`;
CREATE TABLE `houselayout` (
  `hlid` int(11) NOT NULL AUTO_INCREMENT,
  `vid` int(11) NULL,
  `name` varchar(32) NULL,
  `layout` varchar(32) NULL,
  `houseType` varchar(16) NULL,
  `comment` varchar(200) NULL,
  `area` int(11) NOT NULL,
  PRIMARY KEY (`hlid`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `keyvalue`;
CREATE TABLE `keyvalue` (
  `kvid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `module` varchar(32) NOT NULL,
  `type` varchar(32) NOT NULL,
  `key` varchar(32) NOT NULL,
  `value` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`kvid`),
  KEY `indexone` (`module`, `type`, `key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='字典表';

DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `lid` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `name` varchar(15) NOT NULL COMMENT '标签名字',
  `scale` int(11) NOT NULL,
  `type` int(2) NOT NULL,
  `status` int(2) NOT NULL,
  `isShow` int(2) NOT NULL,
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='计量单位表';

DROP TABLE IF EXISTS `measurementunit`;
CREATE TABLE `measurementunit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `unitDes` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='计量单位表';

DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `fatherModuleId` int(11) NULL,
  `name` varchar(32) NOT NULL,
  `alias` varchar(32) NULL,
  `module` varchar(32) NULL DEFAULT '',
  `icon` varchar(36) NOT NULL DEFAULT '',
  `url` varchar(256) NOT NULL DEFAULT '',
  `level` tinyint(4) NOT NULL,
  `system` tinyint(4) NOT NULL,
  `order` tinyint(4) NOT NULL DEFAULT 0,
  `helpKey` varchar(32) NULL COMMENT '帮助文档的key值',
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=921 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='模块表';

DROP TABLE IF EXISTS `moduleback`;
CREATE TABLE `moduleback` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `fatherModuleId` int(11) NULL,
  `name` varchar(32) NOT NULL,
  `alias` varchar(32) NULL,
  `module` varchar(32) NULL DEFAULT '',
  `icon` varchar(36) NOT NULL DEFAULT '',
  `url` varchar(256) NOT NULL DEFAULT '',
  `level` tinyint(4) NOT NULL,
  `system` tinyint(4) NOT NULL,
  `order` tinyint(4) NOT NULL DEFAULT 0,
  `helpKey` varchar(32) NULL COMMENT '帮助文档的key值',
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=883 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='模块表';

DROP TABLE IF EXISTS `operation`;
CREATE TABLE `operation` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `moduleId` int(11) NULL,
  `name` varchar(32) NOT NULL DEFAULT '',
  `operation` varchar(64) NOT NULL,
  `system` tinyint(4) NOT NULL,
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态 , 0:启用, 1:禁用',
  `through` tinyint(1) NULL DEFAULT 0 COMMENT '通过标记 , 0: 验证, 1: 通过',
  `type` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`oid`),
  KEY `indexone` (`operation`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='操作';

DROP TABLE IF EXISTS `organization`;
CREATE TABLE `organization` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `company` int(11) NULL,
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='组织';

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
  PRIMARY KEY (`ptid`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='款项类型';

DROP TABLE IF EXISTS `performance`;
CREATE TABLE `performance` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户',
  `type` tinyint(4) NOT NULL COMMENT '类型, 0: 任务, 1: 代码 , 2: 文档 , 3: 测试用例 , 4: bug , 5: 延期 , 6: 失误 , 7: 考勤 , 8: 加班',
  `value` int(11) NOT NULL COMMENT '评价',
  `level` tinyint(4) NOT NULL COMMENT '水平',
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '结束时间',
  `work` varchar(32) NOT NULL COMMENT '工作',
  `content` varchar(64) NULL COMMENT '备注',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='绩效';

DROP TABLE IF EXISTS `pricepool`;
CREATE TABLE `pricepool` (
  `ppid` int(11) NOT NULL AUTO_INCREMENT,
  `gpid` int(11) NOT NULL COMMENT '商品池ID',
  `name` varchar(32) NOT NULL COMMENT '名字',
  `type` tinyint(1) NOT NULL COMMENT '类型 0: 正价 1:特价',
  `purchase` int(8) NOT NULL COMMENT '进价',
  `selling` int(8) NOT NULL COMMENT '售价',
  `confine` int(8) NULL COMMENT '限价',
  `ctype` tinyint(1) NOT NULL COMMENT '结算类型 0: 底价 1: 点位',
  `cvalue` int(8) NOT NULL COMMENT '结算值',
  `status` tinyint(1) NOT NULL COMMENT '状态 0: 启用 1: 禁用',
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=1769 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='价格池';

DROP TABLE IF EXISTS `quotationbigcategory`;
CREATE TABLE `quotationbigcategory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  `quotationType` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `indexone` (`name`, `quotationType`) USING BTREE,
  KEY `indextwo` (`quotationType`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价项大类表';

DROP TABLE IF EXISTS `quotationclassification`;
CREATE TABLE `quotationclassification` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价项分类表';

DROP TABLE IF EXISTS `quotationfunctionareaitem2`;
CREATE TABLE `quotationfunctionareaitem2` (
  `qfaiId` int(11) NOT NULL AUTO_INCREMENT,
  `itemName` varchar(192) NOT NULL,
  `measurementUnit` varchar(10) NOT NULL,
  `workType` varchar(15) NOT NULL,
  `unitPrice` int(8) NOT NULL DEFAULT 0,
  `addPrice` int(8) NULL DEFAULT 0 COMMENT '增补价',
  `subPrice` int(8) NULL DEFAULT 0 COMMENT '退减价',
  `formula` varchar(16) NOT NULL DEFAULT '0',
  `initNum` int(8) NOT NULL DEFAULT 0 COMMENT '原数',
  `num` int(8) NOT NULL DEFAULT 0,
  `discount` tinyint(4) NOT NULL DEFAULT 1,
  `type` tinyint(4) NOT NULL,
  `subtype` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0生成项目,1工程,2主材',
  `quotationFunctionAreaId` bigint(20) NOT NULL,
  `quotationItemId` bigint(20) NULL,
  `content` varchar(256) NULL,
  `index` int(11) NOT NULL DEFAULT 0 COMMENT '索引',
  PRIMARY KEY (`qfaiId`),
  KEY `indexone` (`quotationFunctionAreaId`) USING BTREE,
  KEY `indextwo` (`quotationItemId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价功能区报价表';

DROP TABLE IF EXISTS `quotationsmallcategory`;
CREATE TABLE `quotationsmallcategory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL DEFAULT '',
  `quotationType` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `indexone` (`name`, `quotationType`) USING BTREE,
  KEY `indextwo` (`quotationType`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价项小类表';

DROP TABLE IF EXISTS `quotationtype`;
CREATE TABLE `quotationtype` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='报价项类型表';

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
) ENGINE=InnoDB AUTO_INCREMENT=1547 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `receipttypeitem`;
CREATE TABLE `receipttypeitem` (
  `rtiid` int(11) NOT NULL AUTO_INCREMENT,
  `rtid` int(11) NOT NULL,
  `no` varchar(36) NOT NULL,
  `name` varchar(16) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `paytype` tinyint(1) NOT NULL,
  PRIMARY KEY (`rtiid`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='收据单据表';

DROP TABLE IF EXISTS `recruitment`;
CREATE TABLE `recruitment` (
  `rid` int(11) NOT NULL AUTO_INCREMENT COMMENT '招聘ID',
  `name` varchar(32) NOT NULL COMMENT '姓名',
  `identity` varchar(21) NOT NULL COMMENT '身份证号',
  `nation` varchar(50) NULL COMMENT '民族',
  `place` varchar(32) NOT NULL COMMENT '地址',
  `weight` int(11) NULL COMMENT '体重',
  `height` int(11) NULL COMMENT '身高',
  `employWay` tinyint(1) NULL DEFAULT 0 COMMENT '应聘方式',
  `householdType` tinyint(1) NULL DEFAULT 0 COMMENT '户口类型',
  `political` tinyint(1) NULL DEFAULT 0 COMMENT '政治面貌',
  `education` tinyint(1) NULL DEFAULT 0 COMMENT '学历',
  `phone` varchar(128) NOT NULL COMMENT '电话',
  `wechat` varchar(20) NULL COMMENT '微信号',
  `qq` varchar(15) NULL COMMENT 'QQ号',
  `address` varchar(128) NULL COMMENT '现住址',
  `nativePlace` varchar(128) NULL COMMENT '籍贯',
  `hometownPlace` varchar(32) NULL COMMENT '户籍地',
  `specialty` varchar(32) NULL COMMENT '专业',
  `emergencyMan` varchar(32) NULL COMMENT '紧急联系人',
  `emergencyPhone` varchar(15) NULL COMMENT '紧急联系人电话',
  `isMarried` tinyint(1) NULL DEFAULT 0 COMMENT '婚姻状况',
  `isBirth` tinyint(1) NULL DEFAULT 0 COMMENT '生育状况',
  `isHouse` tinyint(1) NULL DEFAULT 0 COMMENT '是否有独立住房',
  `isCar` tinyint(1) NULL DEFAULT 0 COMMENT '是否有独立车辆',
  `isHouseLoan` tinyint(1) NULL DEFAULT 0 COMMENT '是否有房贷',
  `isCarLoan` tinyint(1) NULL DEFAULT 0 COMMENT '是否有车贷',
  `isCarID` tinyint(1) NULL DEFAULT 0 COMMENT '是否有驾照',
  `isPassID` tinyint(1) NULL DEFAULT 0 COMMENT '是否有护照',
  `isHMID` tinyint(1) NULL DEFAULT 0 COMMENT '是否有港澳通行证',
  `isTWID` tinyint(1) NULL DEFAULT 0 COMMENT '是否有台湾通行证',
  `isContract` tinyint(1) NULL DEFAULT 0 COMMENT '是否与原单位签订劳动合同',
  `isSnsurance` tinyint(1) NULL DEFAULT 0 COMMENT '是否已缴纳社会保险',
  `isFire` tinyint(1) NULL DEFAULT 0 COMMENT '是否已经与其它单位解除了劳动关系',
  `isCnsurance` tinyint(1) NULL DEFAULT 0 COMMENT '是否缴纳其他商业保险',
  `isCompete` tinyint(1) NULL DEFAULT 0 COMMENT '现在是否还在竟业限制期内',
  `isTrain` tinyint(1) NULL DEFAULT 0 COMMENT '公司提供培训机会时，是否同意并签订协议',
  `isCriminal` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否曾有前科劣迹、行政/邢事拘留等经历',
  `isDisease` tinyint(1) NULL DEFAULT 0 COMMENT '是否患有精神系统疾病、传染性疾病、家族遗传病史、既往重病史',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '状态',
  `photoPath` varchar(255) NULL COMMENT '头像照片',
  `identityPathF` varchar(255) NULL COMMENT '身份证正面图片',
  `identityPathB` varchar(255) NULL COMMENT '身份证背面图片',
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=329 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `recruitmenteducation`;
CREATE TABLE `recruitmenteducation` (
  `reid` int(11) NOT NULL AUTO_INCREMENT COMMENT '教育ID',
  `rid` int(11) NOT NULL COMMENT '招聘ID',
  `beginTime` date NULL COMMENT '开始时间',
  `endTime` date NULL COMMENT '结束时间',
  `createTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  `content` varchar(255) NULL COMMENT '培训内容',
  `organ` varchar(32) NOT NULL COMMENT '学校名称',
  `specialty` varchar(32) NOT NULL COMMENT '专业',
  `certificate` varchar(32) NULL COMMENT '取得证书',
  PRIMARY KEY (`reid`)
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `recruitmentoperation`;
CREATE TABLE `recruitmentoperation` (
  `roid` int(11) NOT NULL AUTO_INCREMENT COMMENT '工作ID',
  `rid` int(11) NOT NULL COMMENT '招聘ID',
  `beginTime` date NULL COMMENT '开始时间',
  `endTime` date NULL COMMENT '结束时间',
  `createTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  `company` varchar(32) NULL COMMENT '单位名称',
  `trade` varchar(32) NULL COMMENT '所属行业',
  `duty` varchar(32) NULL COMMENT '职务',
  `salary` int(11) NOT NULL COMMENT '薪金',
  `comment` varchar(255) NULL COMMENT '离职原因',
  PRIMARY KEY (`roid`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `region`;
CREATE TABLE `region` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(64) NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` double NOT NULL DEFAULT 0,
  `y` double NOT NULL DEFAULT 0,
  PRIMARY KEY (`rid`),
  UNIQUE KEY `regionId_UNIQUE` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='大区表';

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(8) NOT NULL,
  `pinyin` varchar(64) NULL,
  `level` tinyint(1) NOT NULL DEFAULT 0,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(20) NULL,
  `company` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`rid`),
  KEY `indexone` (`no`) USING BTREE,
  UNIQUE KEY `roleId_UNIQUE` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='角色表';

DROP TABLE IF EXISTS `rolechart`;
CREATE TABLE `rolechart` (
  `rcid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  PRIMARY KEY (`rcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `rolemodule`;
CREATE TABLE `rolemodule` (
  `rmid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `link` tinyint(1) NOT NULL DEFAULT 1,
  `access` tinyint(1) NULL DEFAULT 0,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`rmid`),
  KEY `indexone` (`rid`) USING BTREE,
  KEY `indextwo` (`mid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13670 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='角色模块';

DROP TABLE IF EXISTS `roleoperation`;
CREATE TABLE `roleoperation` (
  `roid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `oid` int(11) NOT NULL,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`roid`)
) ENGINE=InnoDB AUTO_INCREMENT=2683 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='角色操作';

DROP TABLE IF EXISTS `roletask`;
CREATE TABLE `roletask` (
  `trrid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `cuid` int(11) NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`trrid`),
  KEY `indexone` (`rid`, `company`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17559 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `server`;
CREATE TABLE `server` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `host` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `backup` tinyint(1) NOT NULL DEFAULT 0,
  `master` tinyint(1) NOT NULL DEFAULT 0,
  `slave` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(64) NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='服务信息';

DROP TABLE IF EXISTS `servicenode`;
CREATE TABLE `servicenode` (
  `snid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL COMMENT '名称',
  `detail` varchar(64) NOT NULL COMMENT '详述',
  `type` tinyint(1) NOT NULL COMMENT '类型:0装修,1主材,2工程',
  `status` tinyint(1) NOT NULL COMMENT '状态:0启用1禁用',
  `company` tinyint(4) NOT NULL COMMENT '公司',
  `psnid` int(11) NULL DEFAULT 0 COMMENT '上级节点ID',
  `attnode` tinyint(1) NULL DEFAULT 0 COMMENT '业务节点 , 0: 创建 , 1: 预签 , 2: 签单 , 3: 付款',
  `blankNum` int(8) NULL DEFAULT 0 COMMENT '间隔天数',
  `workNum` int(8) NULL DEFAULT 0 COMMENT '工期天数',
  `loop` tinyint(1) NULL DEFAULT 0 COMMENT '是否循环',
  `userType` tinyint(1) NULL DEFAULT 0 COMMENT '人员类型',
  PRIMARY KEY (`snid`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='服务节点表';

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `loginId` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL,
  `isLogin` tinyint(4) NULL COMMENT '是否允许登陆',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='供应商';

DROP TABLE IF EXISTS `supplierbrand`;
CREATE TABLE `supplierbrand` (
  `sbid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cid` int(11) NULL COMMENT '合同ID',
  `bid` int(11) NULL DEFAULT 0 COMMENT '品牌ID',
  `suid` int(11) NULL DEFAULT 0 COMMENT '厂商ID',
  `paymentTerms` tinyint(1) NULL DEFAULT 0 COMMENT '结算方式0现金；1银行卡；2微信；3支付宝',
  `lowPrice` int(11) NULL DEFAULT 0 COMMENT '低价',
  `point` int(8) NULL DEFAULT 0 COMMENT '点位',
  `liquidatedDamages` int(11) NULL DEFAULT 0 COMMENT '违约金',
  `createTime` timestamp NULL,
  PRIMARY KEY (`sbid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商品牌表';

DROP TABLE IF EXISTS `suppliercontract`;
CREATE TABLE `suppliercontract` (
  `scId` int(11) NOT NULL AUTO_INCREMENT COMMENT '合同ID',
  `uid` int(11) NULL COMMENT '员工ID',
  `no` varchar(255) NULL COMMENT '合同编号',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `title` varchar(64) NULL DEFAULT '',
  `signTime` date NULL COMMENT '签订时间',
  `startTime` date NULL COMMENT '开始时间',
  `endTime` date NULL COMMENT '结束时间',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `cid` int(11) NULL DEFAULT 0,
  `download` varchar(255) NULL,
  `viewpdf` varchar(255) NULL,
  `filesize` int(11) NULL,
  `cuid` int(11) NULL,
  `suid` int(11) NULL,
  `comsignTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cussignTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 0:有效,1:无效',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`scId`)
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商合同表';

DROP TABLE IF EXISTS `suppliercontractbrand`;
CREATE TABLE `suppliercontractbrand` (
  `scbid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `bid` int(11) NULL DEFAULT 0 COMMENT '品牌ID',
  `name` varchar(255) NULL COMMENT '名称',
  `warranTime` int(8) NULL DEFAULT 0 COMMENT '质保期',
  `scid` int(11) NULL DEFAULT 0 COMMENT '合同ID',
  `sid` int(11) NULL DEFAULT 0 COMMENT '厂商ID',
  `ctype` tinyint(1) NULL DEFAULT 0 COMMENT '结算类型 , 0: 底价 , 1: 点位',
  `cvalue` int(11) NULL DEFAULT 0 COMMENT '结算值',
  `breakpay` int(11) NULL DEFAULT 0 COMMENT '违约金',
  `servicePrice` varchar(500) NULL COMMENT '服务费数组',
  PRIMARY KEY (`scbid`)
) ENGINE=InnoDB AUTO_INCREMENT=292 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商品牌合同表';

DROP TABLE IF EXISTS `suppliercontractcategory`;
CREATE TABLE `suppliercontractcategory` (
  `sccid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `scbid` int(11) NULL DEFAULT 0 COMMENT '厂商品牌ID',
  `ctype` tinyint(1) NULL DEFAULT 0 COMMENT '结算类型 , 0: 底价 , 1: 点位',
  `cvalue` varchar(32) NOT NULL COMMENT '结算值',
  `breakpay` int(11) NULL DEFAULT 0 COMMENT '违约金',
  `name` varchar(255) NULL COMMENT '名称',
  PRIMARY KEY (`sccid`)
) ENGINE=InnoDB AUTO_INCREMENT=314 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商品牌产品表';

DROP TABLE IF EXISTS `suppliercontractgoods`;
CREATE TABLE `suppliercontractgoods` (
  `scgId` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `scid` int(11) NULL COMMENT '合同ID',
  `gid` int(11) NULL COMMENT '商品ID',
  `price` int(8) NULL COMMENT '价格',
  `balance` int(8) NULL COMMENT '结算价',
  PRIMARY KEY (`scgId`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `suppliercontractproduct`;
CREATE TABLE `suppliercontractproduct` (
  `scpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `scid` int(11) NULL DEFAULT 0 COMMENT '厂商品牌ID',
  `name` varchar(255) NULL COMMENT '名称',
  `category` varchar(255) NULL COMMENT '品类',
  `brand` varchar(255) NULL COMMENT '品牌',
  `warranTime` varchar(255) NULL COMMENT '质保期',
  PRIMARY KEY (`scpid`)
) ENGINE=InnoDB AUTO_INCREMENT=679 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商品牌产品表';

DROP TABLE IF EXISTS `suppliercontractservice`;
CREATE TABLE `suppliercontractservice` (
  `scsid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `sid` int(11) NULL DEFAULT 0 COMMENT '厂商ID',
  `name` varchar(255) NULL COMMENT '名称',
  `type` tinyint(1) NULL DEFAULT 0 COMMENT '0: 常规 , 1: 特价 , 2: 专供',
  `servicePrice` varchar(500) NULL COMMENT '服务费数组',
  PRIMARY KEY (`scsid`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='厂商服务费表';

DROP TABLE IF EXISTS `supplieruserright`;
CREATE TABLE `supplieruserright` (
  `surid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `userId` varchar(64) NULL,
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`surid`)
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='供应商用户权限';

DROP TABLE IF EXISTS `systemconfig`;
CREATE TABLE `systemconfig` (
  `scid` int(11) NOT NULL AUTO_INCREMENT,
  `group` varchar(64) NULL DEFAULT '',
  `key` varchar(64) NOT NULL,
  `value` varchar(256) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(128) NULL,
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`scid`)
) ENGINE=InnoDB AUTO_INCREMENT=276 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='系统配置表';

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
  `comment` varchar(512) NULL COMMENT '说明',
  `keyword` varchar(64) NULL,
  PRIMARY KEY (`tid`),
  UNIQUE KEY `keyword_UNIQUE` (`keyword`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

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
) ENGINE=InnoDB AUTO_INCREMENT=2303 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `token`;
CREATE TABLE `token` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tid`),
  KEY `indexone` (`key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='token表';

DROP TABLE IF EXISTS `upgrade`;
CREATE TABLE `upgrade` (
  `ugid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `trialno` varchar(64) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `filesize` bigint(64) NOT NULL,
  `isRestart` tinyint(1) NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ugid`)
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL COMMENT '员工号',
  `oldUserId` varchar(32) NULL COMMENT '旧员工号',
  `type` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `roleId` int(11) unsigned NULL COMMENT '角色ID',
  `deptId` varchar(10) NOT NULL COMMENT '部门ID',
  `company` tinyint(4) NOT NULL COMMENT '人员所属公司',
  `loginId` varchar(32) NOT NULL COMMENT '登录用户名',
  `password` varchar(32) NULL COMMENT '密码',
  `userName` varchar(32) NOT NULL COMMENT '真实姓名',
  `pinYin` varchar(64) NOT NULL COMMENT '真实姓名全拼',
  `currentName` varchar(32) NOT NULL COMMENT '现用名',
  `did` int(11) unsigned NULL COMMENT '职位ID',
  `gender` varchar(2) NOT NULL COMMENT '性别',
  `identity` varchar(21) NOT NULL COMMENT '身份证号',
  `phone` varchar(128) NOT NULL COMMENT '手机号',
  `userPhoto` varchar(128) NULL COMMENT '用户图片',
  `identityPathF` varchar(255) NULL COMMENT '身份证正面图片',
  `identityPathB` varchar(255) NULL COMMENT '身份证背面图片',
  `status` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '人员状态(在职,离职..)',
  `isLogin` tinyint(4) unsigned NULL COMMENT '是否允许登陆',
  `extranet` tinyint(4) unsigned NOT NULL DEFAULT 0,
  `freedom` tinyint(4) unsigned NOT NULL DEFAULT 0 COMMENT '特权 , 1 超时 , 2 操作黑名单',
  `isUpdate` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `authStatus` tinyint(1) unsigned NULL DEFAULT 0,
  `authUrl` varchar(255) NULL,
  `signNo` varchar(255) NULL,
  `token` varchar(255) NULL,
  PRIMARY KEY (`uid`),
  KEY `indexone` (`userId`, `company`) USING BTREE,
  KEY `indextwo` (`pinYin`, `userName`) USING BTREE,
  UNIQUE KEY `uniqueone` (`loginId`) USING BTREE,
  UNIQUE KEY `userId_UNIQUE` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7324 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='用户表';

DROP TABLE IF EXISTS `usercompany`;
CREATE TABLE `usercompany` (
  `ucid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  `cuid` int(11) NOT NULL DEFAULT 0,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ucid`)
) ENGINE=InnoDB AUTO_INCREMENT=2381 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='用户-公司表';

DROP TABLE IF EXISTS `usercontract`;
CREATE TABLE `usercontract` (
  `ucId` int(11) NOT NULL AUTO_INCREMENT COMMENT '合同ID',
  `uid` int(11) NULL COMMENT '员工ID',
  `no` varchar(255) NULL COMMENT '合同编号',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `title` varchar(64) NULL DEFAULT '',
  `signTime` date NULL COMMENT '签订时间',
  `startTime` date NULL COMMENT '开始时间',
  `endTime` date NULL COMMENT '结束时间',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `cid` int(11) NULL DEFAULT 0,
  `download` varchar(255) NULL,
  `viewpdf` varchar(255) NULL,
  `filesize` int(11) NULL,
  `cuid` int(11) NULL,
  `suid` int(11) NULL,
  `comsignTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cussignTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 0:有效,1:无效',
  `comment` varchar(255) NULL COMMENT '说明',
  PRIMARY KEY (`ucId`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='用户合同表';

DROP TABLE IF EXISTS `usereducation`;
CREATE TABLE `usereducation` (
  `ueid` int(11) NOT NULL AUTO_INCREMENT COMMENT '教育ID',
  `uid` int(11) NOT NULL COMMENT '人员ID',
  `organ` varchar(50) NOT NULL COMMENT '机构',
  `certificate` varchar(50) NULL COMMENT '证书',
  `beginTime` date NULL COMMENT '开始时间',
  `endTime` date NULL COMMENT '结束时间',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `specialty` varchar(32) NOT NULL COMMENT '专业',
  `content` varchar(255) NULL COMMENT '内容',
  PRIMARY KEY (`ueid`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `userexperience`;
CREATE TABLE `userexperience` (
  `upid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(15) NOT NULL,
  `type` varchar(10) NOT NULL,
  `isPrefor` tinyint(1) NULL DEFAULT 0 COMMENT '0: 计算 , 1: 不计算',
  `ouid` int(11) NOT NULL DEFAULT 0,
  `ocid` int(11) NULL COMMENT '原公司ID',
  `tcid` int(11) NULL COMMENT '目标公司ID',
  `odid` int(11) NULL COMMENT '原部门ID',
  `tdid` int(11) NULL COMMENT '目标部门ID',
  `orid` int(11) NULL COMMENT '原角色ID',
  `trid` int(11) NULL COMMENT '目标角色ID',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(128) NOT NULL,
  PRIMARY KEY (`upid`)
) ENGINE=InnoDB AUTO_INCREMENT=2099 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工作经历表';

DROP TABLE IF EXISTS `userfunction`;
CREATE TABLE `userfunction` (
  `ufid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `key` varchar(64) NOT NULL,
  `value` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `subtype` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `sort` int(4) NOT NULL,
  `comment` varchar(255) NULL,
  PRIMARY KEY (`ufid`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='人员功能配置表';

DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `uiid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `ranks` varchar(10) NULL COMMENT '级别',
  `form` tinyint(1) NULL DEFAULT 0 COMMENT '岗位类型: 0:产值 1:非产值',
  `employWay` tinyint(4) NULL DEFAULT 0 COMMENT '招聘渠道',
  `recommendMan` varchar(32) NULL COMMENT '推荐人',
  `jobYears` int(2) NULL DEFAULT 0 COMMENT '工作年限',
  `employType` tinyint(1) NULL DEFAULT 1 COMMENT '录用类型',
  `entryTime` date NULL COMMENT '入职时间',
  `boardTime` date NULL,
  `employTime` date NULL COMMENT '转正时间',
  `political` tinyint(1) NULL DEFAULT 0 COMMENT '政治面貌',
  `emergencyMan` varchar(32) NULL COMMENT '紧急联系人',
  `emergencyPhone` varchar(15) NULL COMMENT '紧急联系人电话',
  `isPresentGraduate` tinyint(1) NULL DEFAULT 1 COMMENT '是否是应届生',
  `graduateTime` date NULL COMMENT '毕业时间',
  `school` varchar(32) NULL COMMENT '毕业学校',
  `education` tinyint(1) NULL DEFAULT 0 COMMENT '学历',
  `specialty` varchar(32) NULL COMMENT '最高学历专业',
  `isMarried` tinyint(1) NULL DEFAULT 1 COMMENT '婚姻状况',
  `isBirth` tinyint(1) NULL DEFAULT 1 COMMENT '生育状况',
  `isHouseLoan` tinyint(1) NULL DEFAULT 1 COMMENT '是否有房贷',
  `isCarLoan` tinyint(1) NULL DEFAULT 1 COMMENT '是否有车贷',
  `householdType` tinyint(1) NULL DEFAULT 0 COMMENT '户口类型',
  `hometownPlace` varchar(32) NULL COMMENT '户籍所在地',
  `hometownAddress` varchar(128) NULL COMMENT '户籍地址',
  `address` varchar(128) NULL COMMENT '现住地址',
  `isContract` tinyint(1) NULL DEFAULT 1 COMMENT '是否签订劳动合同',
  `isInsurance` tinyint(1) NULL DEFAULT 1 COMMENT '是否上保险',
  `insuranceTime` date NULL COMMENT '保险起始时间',
  `pensionNum` varchar(32) NULL COMMENT '养老金编号',
  `medicalNum` varchar(32) NULL COMMENT '医疗编号',
  `salary` varchar(32) NOT NULL DEFAULT '0' COMMENT '工资',
  `lover` varchar(32) NULL COMMENT '爱人',
  `bank` varchar(10) NULL COMMENT '开户行',
  `bankCardNum` varchar(32) NULL COMMENT '银行卡号',
  `qq` varchar(15) NULL COMMENT 'QQ',
  `wechat` varchar(15) NULL COMMENT '微信',
  `email` varchar(50) NULL COMMENT '邮箱',
  `level` tinyint(1) NOT NULL DEFAULT 0 COMMENT '职级 0:员工 1:核心员工 2:主管 3:经理 4:总监及以上',
  `gender` tinyint(1) NOT NULL DEFAULT 0 COMMENT '性别 0:女 1:男',
  `height` int(3) NULL DEFAULT 0 COMMENT '身高',
  `weight` int(3) NULL DEFAULT 0 COMMENT '体重',
  `nation` varchar(50) NULL COMMENT '民族',
  `hobby` varchar(70) NULL COMMENT '爱好',
  `isCarID` tinyint(1) NULL DEFAULT 1 COMMENT '是否有驾照 0:有 1:无',
  `isPassID` tinyint(1) NULL DEFAULT 1 COMMENT '是否有护照 0:有 1:无',
  `isHMID` tinyint(1) NULL DEFAULT 1 COMMENT '是否港澳通行证 0:有 1:无',
  `isTWID` tinyint(1) NULL DEFAULT 1 COMMENT '是否有台湾通行证 0:有 1:无',
  `claner` varchar(32) NULL COMMENT '直系亲属',
  `clanerCom` varchar(32) NULL COMMENT '直系亲属公司',
  `fuid` int(11) NULL COMMENT '方林家属id',
  `firstTime` date NULL COMMENT '入司时间',
  `signTime` date NULL COMMENT '签合同日期',
  `eignTime` date NULL COMMENT '合同结束日期',
  `fignTime` date NULL COMMENT '首次合同时间',
  `hireTime` timestamp NULL COMMENT '入职时间',
  `fireTime` timestamp NULL COMMENT '离职时间',
  `tranTime` timestamp NULL COMMENT '调职时间',
  `signNum` int(2) NULL DEFAULT 0 COMMENT '续签合同次数',
  `preformNum` varchar(32) NULL DEFAULT '0' COMMENT '试用期限',
  `formTime` date NULL COMMENT '转正日期',
  `insuranceType` tinyint(1) NULL DEFAULT 0 COMMENT '保险类型 0:社保 1:商业保险',
  `publicNum` varchar(32) NULL COMMENT '公积金号',
  `palary` varchar(32) NULL DEFAULT '0' COMMENT '试用工资',
  `comment` varchar(255) NULL COMMENT '备注',
  PRIMARY KEY (`uiid`)
) ENGINE=InnoDB AUTO_INCREMENT=4932 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='用户信息表';

DROP TABLE IF EXISTS `userlabel`;
CREATE TABLE `userlabel` (
  `ulid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `lid` int(11) NOT NULL,
  `scope` int(11) NOT NULL,
  PRIMARY KEY (`ulid`),
  KEY `lid` (`lid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=512 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `useroperation`;
CREATE TABLE `useroperation` (
  `uoid` int(11) NOT NULL AUTO_INCREMENT COMMENT '工作ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `company` varchar(32) NULL COMMENT '公司',
  `trade` varchar(32) NULL COMMENT '行业',
  `duty` varchar(32) NULL COMMENT '职位',
  `beginTime` date NULL COMMENT '开始时间',
  `endTime` date NULL COMMENT '结束时间',
  `salary` bigint(10) NOT NULL DEFAULT 0 COMMENT '薪资',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `comment` varchar(255) NULL COMMENT '描述',
  PRIMARY KEY (`uoid`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `userpartner`;
CREATE TABLE `userpartner` (
  `upid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '合作人ID',
  `puid` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0: 业务 , 1: 设计 , 2: 主材 , 3: 工程',
  `status` tinyint(1) NOT NULL COMMENT '0: 有效 , 1: 无效',
  `company` int(11) NOT NULL COMMENT '公司ID',
  PRIMARY KEY (`upid`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='装修活动记录';

DROP TABLE IF EXISTS `userrequire`;
CREATE TABLE `userrequire` (
  `urid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `cdid` int(11) NULL COMMENT '创建部门ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `ruid` int(11) NULL COMMENT '接收人ID',
  `content` varchar(255) NULL COMMENT '备注',
  `approveTime` timestamp NULL COMMENT '审批时间',
  `finishTime` timestamp NULL COMMENT '完成时间',
  `status` tinyint(4) NOT NULL COMMENT '0初始,1通过,2拒绝,3完成',
  `type` tinyint(4) NOT NULL COMMENT '类型',
  PRIMARY KEY (`urid`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `userrole`;
CREATE TABLE `userrole` (
  `urid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `uid` int(11) NOT NULL COMMENT '员工ID',
  `rid` int(11) NOT NULL COMMENT '角色ID',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`urid`)
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `version`;
CREATE TABLE `version` (
  `vid` int(11) NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `no` varchar(64) NOT NULL COMMENT '版本编号',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建事件',
  `comment` text NOT NULL COMMENT '更新说明',
  `status` tinyint(2) NOT NULL DEFAULT 1 COMMENT '状态',
  PRIMARY KEY (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `village`;
CREATE TABLE `village` (
  `vid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(13) NOT NULL,
  `name` varchar(20) NOT NULL,
  `pinyinAB` varchar(256) NULL,
  `pinyinAll` varchar(256) NULL,
  `cityProperId` int(11) NULL,
  `cid` int(11) NULL COMMENT '城市ID',
  `cpid` int(11) NULL DEFAULT 0,
  `pvid` int(11) NULL,
  `bnrid` int(11) NULL DEFAULT 0,
  `developer` varchar(20) NULL,
  `salesPhone` varchar(15) NULL,
  `deliveryTime` date NULL,
  `url` varchar(256) NULL,
  `rule` varchar(64) NULL,
  `mileage` int(10) NULL DEFAULT 0,
  `x` int(10) NOT NULL DEFAULT 0,
  `y` int(10) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `content` varchar(512) NULL,
  `company` int(11) NULL DEFAULT 0,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`vid`),
  KEY `indexfor` (`status`, `pinyinAB`) USING BTREE,
  KEY `indexone` (`cityProperId`) USING BTREE,
  KEY `indexthr` (`x`, `y`) USING BTREE,
  KEY `indextwo` (`no`, `cityProperId`) USING BTREE,
  UNIQUE KEY `villageId_UNIQUE` (`no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6263 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='楼盘表';

DROP TABLE IF EXISTS `villagerule`;
CREATE TABLE `villagerule` (
  `vrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '规则ID',
  `vid` int(11) NULL COMMENT '楼盘ID',
  `brid` int(11) NOT NULL COMMENT '建筑规则id',
  `rule` varchar(255) NULL COMMENT '规则',
  PRIMARY KEY (`brid`, `vrid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='楼盘规则';

DROP TABLE IF EXISTS `worktype`;
CREATE TABLE `worktype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `workTypeDes` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工种表';
