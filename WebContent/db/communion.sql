CREATE DATABASE  IF NOT EXISTS `communion`;
USE `communion`;

DROP TABLE IF EXISTS `brand`;
CREATE TABLE `brand` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `no` varchar(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `pinyin` varchar(216) NOT NULL,
  `company` int(11) NOT NULL,
  `kino` varchar(16) DEFAULT '',
  `kiname` varchar(32) DEFAULT '',
  PRIMARY KEY (`bid`),
  KEY `indexone` (`cid`),
  KEY `indextwo` (`name`,`pinyin`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌表';

DROP TABLE IF EXISTS `branduserright`;
CREATE TABLE `branduserright` (
  `burid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `brandId` varchar(128) NOT NULL COMMENT '品牌 , 格式bid#bid',
  PRIMARY KEY (`burid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='品牌用户权限表';

DROP TABLE IF EXISTS `buildingnamerule`;
CREATE TABLE `buildingnamerule` (
  `bnrid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(32) NOT NULL,
  `rule` varchar(128) NOT NULL,
  `rulefill` varchar(64) DEFAULT '',
  `example` varchar(64) NOT NULL,
  `content` varchar(64) NOT NULL,
  PRIMARY KEY (`bnrid`),
  UNIQUE KEY `uniqueone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='建筑命名规则';

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(32) NOT NULL,
  `kino` varchar(16) DEFAULT '',
  `kiname` varchar(32) DEFAULT '',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品类表';

DROP TABLE IF EXISTS `city`;
CREATE TABLE `city` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL COMMENT '大区ID',
  `no` varchar(10) NOT NULL,
  `name` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`cid`),
  UNIQUE KEY `uniqueone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='城市表';

DROP TABLE IF EXISTS `cityproper`;
CREATE TABLE `cityproper` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `no` varchar(10) NOT NULL,
  `name` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`cpid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='城市表';

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` int(11) NOT NULL,
  `name` varchar(16) NOT NULL,
  `fullname` varchar(32),
  `address` varchar(64),
  `corporation` varchar(8),
  `phone` varchar(16),
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `shortname` varchar(8) NOT NULL DEFAULT '',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公司表';

DROP TABLE IF EXISTS `constructionnode`;
CREATE TABLE `constructionnode` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0: 启用, 1: 禁用',
  `sort` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cnid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程节点表';

DROP TABLE IF EXISTS `constructionnodecompany`;
CREATE TABLE `constructionnodecompany` (
  `cncid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '公司ID',
  `cnid` int(11) NOT NULL COMMENT '工程节点ID',
  PRIMARY KEY (`cncid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工程节点-公司表';

DROP TABLE IF EXISTS `counting`;
CREATE TABLE `counting` (
  `date` varchar(8) NOT NULL,
  `type` int(11) NOT NULL,
  `company` int(11) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL,
  PRIMARY KEY (`date`,`type`),
  KEY `indexone` (`date`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='统计数表';

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(32) NOT NULL,
  `pinyinAB` varchar(50) NOT NULL,
  `pinyinAll` varchar(50) NOT NULL,
  `gender` varchar(2) NOT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `qq` varchar(15) NOT NULL,
  `wechat` varchar(15) NOT NULL,
  `email` varchar(32) NOT NULL,
  `address` varchar(128) NOT NULL,
  `relationshipType` varchar(40) NOT NULL,
  `officer` varchar(32) DEFAULT NULL,
  `passport` varchar(32) DEFAULT NULL,
  `identity` varchar(32) DEFAULT NULL,
  `company` int(11) DEFAULT '0',
  PRIMARY KEY (`cid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`name`),
  KEY `indextwo` (`pinyinAB`),
  KEY `indexthree` (`pinyinAll`)

) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户表';

DROP TABLE IF EXISTS `customerphone`;
CREATE TABLE `customerphone` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `defaults` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:非默认,1:默认',
  PRIMARY KEY (`cpid`),
  KEY `indexone` (`phone`),
  KEY `indextwo` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户电话';

DROP TABLE IF EXISTS `datadrawing`;
CREATE TABLE `datadrawing` (
  `ddid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '资源ID',
  `name` varchar(64) DEFAULT NULL COMMENT '图片名称',
  `drawingUrl` varchar(256) NOT NULL COMMENT '图片路径',
  `drawingType` tinyint(1) NOT NULL COMMENT '图片类型',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `defaults` tinyint(1) NOT NULL COMMENT '默认状态',
  PRIMARY KEY (`ddid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='数据图片';

DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `deptId` varchar(10) NOT NULL COMMENT '部门ID',
  `fatherDeptId` varchar(10) DEFAULT NULL COMMENT '上级部门ID',
  `cityProperId` int(11) DEFAULT NULL COMMENT '所属城区ID',
  `deptName` varchar(32) NOT NULL COMMENT '部门名称',
  `pinyin` varchar(128) NOT NULL,
  `type` varchar(10) NOT NULL COMMENT '部门类型',
  `subType` varchar(10) DEFAULT NULL COMMENT '二级部门分类',
  `createTime` date NOT NULL COMMENT '创建时间',
  `contractPrefix` varchar(32) DEFAULT NULL COMMENT '设计部门合同前缀(独有)',
  `company` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `des` varchar(128) DEFAULT NULL COMMENT '表述',
  `kino` varchar(16) DEFAULT '',
  `kiname` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`did`),
  UNIQUE KEY `uniqueone` (`deptId`),
  KEY `indexone` (`deptId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='部门表';

DROP TABLE IF EXISTS `departmenttype`;
CREATE TABLE `departmenttype` (
  `dtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`dtid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='部门类型';

DROP TABLE IF EXISTS `duty`;
CREATE TABLE `duty` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `departmentType` int(11),
  `type` int(11) NOT NULL,
  `lead` tinyint(1) NOT NULL,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='职位表';

DROP TABLE IF EXISTS `house`;
CREATE TABLE `house` (
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `vid` int(11) NOT NULL COMMENT '楼盘ID',
  `houseNumber` varchar(32) NOT NULL COMMENT '楼牌号',
  `built` varchar(32) DEFAULT NULL COMMENT '楼号',
  `unit` varchar(32) DEFAULT NULL COMMENT '单元',
  `floor` smallint(3) DEFAULT NULL COMMENT '楼层',
  `door` smallint(3) DEFAULT NULL COMMENT '门号',
  `type` tinyint(2) DEFAULT '0' COMMENT '房产类型',
  `buildArea` decimal(10,2) NOT NULL COMMENT '建筑面积',
  `maxFloor` smallint(3) DEFAULT '0' COMMENT '最高楼层',
  `through` tinyint(1) DEFAULT '0' COMMENT '是否越层',
  `roomNum` smallint(2) DEFAULT '1' COMMENT '房间数量',
  `houseType` varchar(16) DEFAULT '0' COMMENT '户型',
  `orientation` tinyint(2) DEFAULT '0' COMMENT '房屋朝向',
  `feature` varchar(256) DEFAULT NULL COMMENT '三不',
  `waterVapour` tinyint(1) DEFAULT '0' COMMENT '水气设施',
  `parlourType` tinyint(1) DEFAULT '0' COMMENT '客厅类型',
  `heatingType` tinyint(1) DEFAULT '0' COMMENT '供暖类型',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) DEFAULT '0',
  PRIMARY KEY (`hid`),
  KEY `indexone` (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='房产';

DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `lid` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `name` varchar(15) NOT NULL COMMENT '标签名字',
  `scale` tinyint(1) NOT NULL COMMENT '值',
  `type` tinyint(1) NOT NULL,
  `isShow` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='标签';

DROP TABLE IF EXISTS `measurementunit`;
CREATE TABLE `measurementunit` (
  `muid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `comment` varchar(30) NOT NULL,
  PRIMARY KEY (`muid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计量单位表';

DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `fatherModuleId` int(11) DEFAULT NULL,
  `name` varchar(32) NOT NULL DEFAULT '',
  `alias` varchar(32) DEFAULT NULL,
  `icon` varchar(20) DEFAULT NULL,
  `url` varchar(256) DEFAULT NULL,
  `level` tinyint(1) NOT NULL,
  `system` tinyint(1) NOT NULL,
  `order` tinyint(2) NOT NULL DEFAULT '99',
  `helpKey` varchar(32) DEFAULT NULL COMMENT '帮助文档的key值',
  PRIMARY KEY (`mid`),
  KEY `indexone` (`fatherModuleId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='模块表';

DROP TABLE IF EXISTS `operation`;
CREATE TABLE `operation` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `moduleId` int(11) DEFAULT NULL,
  `name` varchar(32) NOT NULL DEFAULT '',
  `operation` varchar(128) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态, 0: 启用, 1: 禁用',
  `through` tinyint(1) NOT NULL DEFAULT '0' COMMENT '通过验证 , 0: 控制 , 1: 通过',
  PRIMARY KEY (`oid`),
  KEY `indexone` (`operation`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='操作';

DROP TABLE IF EXISTS `quotationbigcategory`;
CREATE TABLE `quotationbigcategory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `quotationType` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项大类表';

DROP TABLE IF EXISTS `quotationclassification`;
CREATE TABLE `quotationclassification` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项分类表';

DROP TABLE IF EXISTS `quotationsmallcategory`;
CREATE TABLE `quotationsmallcategory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `quotationType` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项小类表';

DROP TABLE IF EXISTS `quotationtype`;
CREATE TABLE `quotationtype` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项类型表';

DROP TABLE IF EXISTS `receipttype`;
CREATE TABLE `receipttype` (
  `rtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(36) NOT NULL,
  `no` varchar(36) NOT NULL,
  `subjectName` varchar(64) NOT NULL,
  `oneCode` varchar(6) NOT NULL,
  `twoCode` varchar(4) NOT NULL,
  `thrCode` varchar(4) NOT NULL,
  `direction` tinyint(1) NOT NULL COMMENT '余额方向,借 1, 贷 -1',
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  `kino` varchar(16) DEFAULT '' COMMENT '金蝶编号',
  `kiname` varchar(32) DEFAULT '' COMMENT '金蝶名称',
  `assistant` varchar(128) DEFAULT '' COMMENT '辅助核算项目',
  PRIMARY KEY (`rtid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='收据类型表';

DROP TABLE IF EXISTS `region`;
CREATE TABLE `region` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`rid`),
  UNIQUE KEY `uniqueone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大区表';

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(8) NOT NULL,
  `content` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`rid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色表';
DROP TABLE IF EXISTS `rolemodule`;
CREATE TABLE `rolemodule` (
  `rmid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  PRIMARY KEY (`rmid`),
  KEY `indexone` (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色-模块表';

DROP TABLE IF EXISTS `roleoperation`;
CREATE TABLE `roleoperation` (
  `roid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `oid` int(11) NOT NULL,
  PRIMARY KEY (`roid`),
  KEY `indexone` (`rid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色操作';

DROP TABLE IF EXISTS `servicenode`;
CREATE TABLE `servicenode` (
  `snid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL COMMENT '名称',
  `detail` varchar(128) NOT NULL COMMENT '详述',
  `type` tinyint(1) NOT NULL COMMENT '类型:0装修,1主材,2工程',
  `status` tinyint(1) NOT NULL COMMENT '状态:0启用1禁用',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`snid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务节点表';

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `loginId` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL,
  `isLogin` tinyint(4) DEFAULT NULL COMMENT '是否允许登陆',
  PRIMARY KEY (`sid`),
  KEY `indexone` (`loginId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='供应商';

DROP TABLE IF EXISTS `supplieruserright`;
CREATE TABLE `supplieruserright` (
  `surid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`surid`),
  KEY `indexone` (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='供应商用户权限';

DROP TABLE IF EXISTS `systemconfig`;
CREATE TABLE `systemconfig` (
  `scid` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL,
  `value` varchar(128) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(128),
  `company` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`scid`),
  UNIQUE KEY `uniqueone` (`key`,`company`),
  KEY `indexone` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='系统配置表';

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL COMMENT '员工号',
  `oldUserId` varchar(32) DEFAULT NULL COMMENT '旧员工号',
  `roleId` int(11) DEFAULT NULL COMMENT '角色ID',
  `deptId` int(11) NOT NULL COMMENT '部门ID',
  `company` int(11) NOT NULL COMMENT '公司ID',
  `loginId` varchar(32) NOT NULL COMMENT '登录用户名',
  `password` varchar(32) DEFAULT NULL COMMENT '密码',
  `userName` varchar(32) NOT NULL COMMENT '真实姓名',
  `pinyin` varchar(64) NOT NULL COMMENT '真实姓名全拼',
  `currentName` varchar(32) DEFAULT NULL COMMENT '现用名',
  `status` tinyint(1) NOT NULL COMMENT '0:在职,1:离职,2:停薪留职',
  `dtid` int(11) NOT NULL COMMENT '部门类型ID',
  `did` int(11) NOT NULL COMMENT '职位类型',
  `gender` varchar(2) NOT NULL COMMENT '性别',
  `birthday` date NOT NULL COMMENT '出生日期',
  `identity` varchar(21) NOT NULL COMMENT '身份证号',
  `phone` varchar(128) NOT NULL COMMENT '手机号',
  `userPhoto` varchar(128) DEFAULT NULL COMMENT '用户图片',
  `isLogin` tinyint(1) DEFAULT NULL COMMENT '是否允许登陆',
  `extranet` tinyint(1) NOT NULL DEFAULT '0' COMMENT '外网登陆权限',
  `freedom` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uniqueone` (`loginId`),
  UNIQUE KEY `uniquetwo` (`userId`),
  KEY `indexone` (`userId`,`company`),
  KEY `indextwo` (`userName`),
  KEY `indexthr` (`pinyin`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户表';

DROP TABLE IF EXISTS `usercompany`;
CREATE TABLE `usercompany` (
  `ucid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  PRIMARY KEY (`ucid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户-公司表';

DROP TABLE IF EXISTS `usercontract`;
CREATE TABLE `usercontract` (
  `ucid` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `contractId` varchar(32) NOT NULL,
  `startTime` date NOT NULL,
  `endTime` date NOT NULL,
  `createTime` datetime NOT NULL,
  `des` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ucid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户合同表';

DROP TABLE IF EXISTS `userexperience`;
CREATE TABLE `userexperience` (
  `upid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(15) NOT NULL,
  `type` varchar(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(128) NOT NULL,
  PRIMARY KEY (`upid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工作经历表';

DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `uiid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `employWay` varchar(10) DEFAULT 'Null' COMMENT '招聘渠道',
  `recommendMan` varchar(32) DEFAULT NULL COMMENT '推荐人',
  `jobYears` int(2) DEFAULT NULL COMMENT '工作年限',
  `employType` varchar(10) DEFAULT NULL COMMENT '录用类型',
  `entryTime` date DEFAULT NULL COMMENT '入职时间',
  `employTime` date DEFAULT NULL COMMENT '转正时间',
  `serviceYears` int(2) DEFAULT NULL COMMENT '服务年限',
  `age` int(2) NOT NULL DEFAULT '0' COMMENT '年龄',
  `political` varchar(10) DEFAULT NULL COMMENT '政治面貌',
  `emergencyMan` varchar(32) DEFAULT NULL COMMENT '紧急联系人',
  `emergencyPhone` varchar(15) DEFAULT NULL COMMENT '紧急联系人电话',
  `isPresentGraduate` varchar(2) DEFAULT NULL COMMENT '是否是应届生',
  `graduateTime` date DEFAULT NULL COMMENT '毕业时间',
  `school` varchar(32) DEFAULT NULL COMMENT '毕业学校',
  `education` varchar(10) DEFAULT NULL COMMENT '学历',
  `specialty` varchar(32) DEFAULT NULL COMMENT '最高学历专业',
  `isMarried` varchar(2) DEFAULT NULL COMMENT '婚姻状况',
  `isBirth` varchar(2) DEFAULT NULL COMMENT '生育状况',
  `isHouseLoan` varchar(2) DEFAULT NULL COMMENT '是否有房贷',
  `isCarLoan` varchar(2) DEFAULT NULL COMMENT '是否有车贷',
  `houseType` varchar(32) DEFAULT NULL COMMENT '房屋类型',
  `householdType` varchar(10) DEFAULT NULL COMMENT '户口类型',
  `hometownAddress` varchar(128) DEFAULT NULL COMMENT '户籍地址',
  `address` varchar(128) DEFAULT NULL COMMENT '现住地址',
  `isContract` varchar(2) DEFAULT NULL COMMENT '是否签订劳动合同',
  `isInsurance` varchar(2) DEFAULT NULL COMMENT '是否上保险',
  `insuranceTime` date DEFAULT NULL COMMENT '保险起始时间',
  `pensionNum` varchar(32) DEFAULT NULL COMMENT '养老金编号',
  `medicalNum` varchar(32) DEFAULT NULL COMMENT '医疗编号',
  `salary` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '工资',
  `lover` varchar(32) DEFAULT NULL COMMENT '爱人',
  `bank` varchar(10) DEFAULT NULL COMMENT '开户行',
  `bankCardNum` varchar(32) DEFAULT NULL COMMENT '银行卡号',
  `qq` varchar(15) DEFAULT NULL COMMENT 'QQ',
  `wechat` varchar(15) DEFAULT NULL COMMENT '微信',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `profiles` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`uiid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户信息表';

DROP TABLE IF EXISTS `userlabel`;
CREATE TABLE `userlabel` (
  `ulid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `lid` int(11) NOT NULL,
  `scope` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ulid`),
  KEY `lid` (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员标签';

DROP TABLE IF EXISTS `version`;
CREATE TABLE `version` (
  `vid` int(11) NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `no` varchar(64) NOT NULL COMMENT '版本编号',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建事件',
  `comment` text NOT NULL COMMENT '更新说明',
  `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `village`;
CREATE TABLE `village` (
  `vid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `pinyinAB` varchar(64) DEFAULT NULL,
  `pinyinAll` varchar(64) DEFAULT NULL,
  `cityProperId` int(11) NOT NULL,
  `developer` varchar(20) DEFAULT NULL,
  `salesPhone` varchar(15) DEFAULT NULL,
  `deliveryTime` date DEFAULT NULL,
  `rule` varchar(64) DEFAULT NULL,
  `content` varchar(128) DEFAULT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  `company` int(11) DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `url` varchar(256) DEFAULT NULL COMMENT '楼盘默认图片',
  PRIMARY KEY (`vId`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`no`),
  KEY `indextwo` (`name`),
  KEY `indexthr` (`pinyinAB`),
  KEY `indexfor` (`pinyinAll`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='楼盘表';



DROP TABLE IF EXISTS `worktype`;
CREATE TABLE `worktype` (
  `wtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `comment` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工种表';

