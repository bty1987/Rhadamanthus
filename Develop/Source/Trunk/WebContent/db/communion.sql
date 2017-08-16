CREATE DATABASE  IF NOT EXISTS `communion`;
USE `communion`;

DROP TABLE IF EXISTS `brand`;
CREATE TABLE `brand` (
  `bId` int(11) NOT NULL AUTO_INCREMENT,
  `cId` int(11) NOT NULL,
  `brandId` varchar(10) NOT NULL,
  `brandName` varchar(30) NOT NULL,
  `brandNamePinyin` varchar(216) NOT NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`bId`),
  KEY `indexone` (`cId`),
  KEY `indextwo` (`brandName`,`brandNamePinyin`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌表';

DROP TABLE IF EXISTS `branduserright`;
CREATE TABLE `branduserright` (
  `burId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `bid` int(11) NOT NULL,
  PRIMARY KEY (`burId`),
  KEY `indexone` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='品牌用户权限表';

DROP TABLE IF EXISTS `buildingnamerule`;
CREATE TABLE `buildingnamerule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingNameRuleId` varchar(32) NOT NULL,
  `rule` varchar(128) NOT NULL,
  `ruleExample` varchar(64) NOT NULL,
  `ruleContent` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqueone` (`buildingNameRuleId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='建筑命名规则';

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `cId` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` varchar(10) NOT NULL,
  `categoryName` varchar(32) NOT NULL,
  PRIMARY KEY (`cId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品类表';

DROP TABLE IF EXISTS `city`;
CREATE TABLE `city` (
  `cId` int(11) NOT NULL AUTO_INCREMENT,
  `cityRegionId` varchar(10) NOT NULL,
  `cityId` varchar(10) NOT NULL,
  `cityName` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`cId`),
  UNIQUE KEY `uniqueone` (`cityId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='城市表';

DROP TABLE IF EXISTS `cityproper`;
CREATE TABLE `cityproper` (
  `cpId` int(11) NOT NULL AUTO_INCREMENT,
  `cityId` varchar(10) NOT NULL,
  `cityProperId` varchar(10) NOT NULL,
  `cityProperName` varchar(64) NOT NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`cpId`),
  UNIQUE KEY `uniqueone` (`cityProperId`),
  KEY `indexone` (`cityProperId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='城市表';

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` tinyint(2) NOT NULL,
  `name` varchar(16) NOT NULL,
  `fullname` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `corporation` varchar(8) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公司表';

DROP TABLE IF EXISTS `constructionnode`;
CREATE TABLE `constructionnode` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 启用, 1: 禁用',
  `sort` tinyint(2) NOT NULL DEFAULT 0,
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
  `count` int(11) NOT NULL,
  PRIMARY KEY (`date`,`type`),
  KEY `indexone` (`date`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='统计数表';

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` varchar(10) NOT NULL,
  `customerName` varchar(32) NOT NULL,
  `customerNamePYAll` varchar(50) NOT NULL,
  `customerNamePYAB` varchar(50) NOT NULL,
  `gender` varchar(2) NOT NULL,
  `phone` varchar(64) NOT NULL,
  `qq` varchar(15) NOT NULL,
  `wechat` varchar(15) NOT NULL,
  `email` varchar(32) NOT NULL,
  `address` varchar(128) NOT NULL,
  `relationshipType` varchar(40) NOT NULL,
  `approveStatus` tinyint(2) DEFAULT '0'
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqueone` (`customerId`),
  UNIQUE KEY `uniquetwo` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户表';

DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `dId` int(11) NOT NULL AUTO_INCREMENT,
  `deptId` varchar(10) NOT NULL COMMENT '部门ID',
  `fatherDeptId` varchar(10) DEFAULT NULL COMMENT '上级部门ID',
  `cityProperId` varchar(10) DEFAULT NULL COMMENT '所属城区',
  `deptName` varchar(32) NOT NULL COMMENT '部门名称',
  `pinyin` varchar(128) NOT NULL,
  `type` varchar(10) NOT NULL COMMENT '部门类型',
  `subType` varchar(10) DEFAULT NULL COMMENT '二级部门分类',
  `createTime` date NOT NULL COMMENT '创建时间',
  `des` varchar(128) DEFAULT NULL COMMENT '表述',
  `contractPrefix` varchar(32) DEFAULT NULL COMMENT '设计部门合同前缀(独有)',
  `company` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`dId`),
  UNIQUE KEY `uniqueone` (`deptId`),
  KEY `indexone` (`deptId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='部门表';

DROP TABLE IF EXISTS `duty`;
CREATE TABLE `duty` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='职位表';

DROP TABLE IF EXISTS `logininfo`;
CREATE TABLE `logininfo` (
  `liId` int(11) NOT NULL AUTO_INCREMENT,
  `loginFlag` varchar(32) NOT NULL,
  `code` int(11) NOT NULL DEFAULT '-1' COMMENT '-1 无确认, 0 成功 , 其他错误码',
  `message` varchar(64) NOT NULL DEFAULT '',
  `authentication` varchar(512) NOT NULL DEFAULT '',
  `optime` bigint(20) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`liId`),
  KEY `indexone` (`loginFlag`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='二维码登陆信息';

DROP TABLE IF EXISTS `measurementunit`;
CREATE TABLE `measurementunit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `unitDes` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='计量单位表';

DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `mId` int(10) NOT NULL AUTO_INCREMENT,
  `fatherModuleId` int(11) DEFAULT NULL,
  `name` varchar(32) NOT NULL DEFAULT '',
  `icon` varchar(15) DEFAULT NULL,
  `url` varchar(256) DEFAULT NULL,
  `level` tinyint(4) NOT NULL,
  `system` tinyint(4) NOT NULL,
  `order` tinyint(2) NOT NULL DEFAULT '99',
  PRIMARY KEY (`mId`),
  KEY `indexone` (`fatherModuleId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='模块表';

DROP TABLE IF EXISTS `operation`;
CREATE TABLE `operation` (
  `oId` int(11) NOT NULL AUTO_INCREMENT,
  `moduleId` int(11) DEFAULT NULL,
  `name` varchar(32) NOT NULL DEFAULT '',
  `operation` varchar(128) NOT NULL,
  `system` tinyint(4) NOT NULL,
  PRIMARY KEY (`oId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='操作';

DROP TABLE IF EXISTS `quotationbigcategory`;
CREATE TABLE `quotationbigcategory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `quotationType` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项大类表';

DROP TABLE IF EXISTS `quotationclassification`;
CREATE TABLE `quotationclassification` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项分类表';

DROP TABLE IF EXISTS `quotationsmallcategory`;
CREATE TABLE `quotationsmallcategory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT '',
  `quotationType` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项小类表';

DROP TABLE IF EXISTS `quotationtype`;
CREATE TABLE `quotationtype` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价项类型表';

DROP TABLE IF EXISTS `receipttype`;
CREATE TABLE `receipttype` (
  `rtId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(36) NOT NULL,
  `key` varchar(36) NOT NULL,
  `subjectName` varchar(64) NOT NULL,
  `oneCode` varchar(6) NOT NULL,
  `twoCode` varchar(4) NOT NULL,
  `thrCode` varchar(4) NOT NULL,
  `direction` tinyint(4) NOT NULL COMMENT '余额方向,借 1, 贷 -1',
  `type` varchar(32) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`rtId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `region`;
CREATE TABLE `region` (
  `rId` int(11) NOT NULL AUTO_INCREMENT,
  `regionId` varchar(10) NOT NULL,
  `regionName` varchar(64) DEFAULT NULL,
  `pinyin` varchar(128) NOT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`rId`),
  UNIQUE KEY `uniqueone` (`regionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='大区表';

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `rId` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` varchar(10) NOT NULL,
  `roleName` varchar(8) NOT NULL,
  `roleDes` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`rId`),
  UNIQUE KEY `uniqueone` (`roleId`),
  KEY `indexone` (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色表';

DROP TABLE IF EXISTS `roleaction`;
CREATE TABLE `roleaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` varchar(10) NOT NULL,
  `actionId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index` (`roleId`,`actionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

DROP TABLE IF EXISTS `rolemodule`;
CREATE TABLE `rolemodule` (
  `rmId` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `mId` int(11) NOT NULL,
  PRIMARY KEY (`rmId`),
  KEY `indexone` (`rId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色模块';

DROP TABLE IF EXISTS `roleoperation`;
CREATE TABLE `roleoperation` (
  `roId` int(11) NOT NULL AUTO_INCREMENT,
  `rId` int(11) NOT NULL,
  `oId` int(11) NOT NULL,
  PRIMARY KEY (`roId`),
  KEY `indexone` (`rId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色操作';

DROP TABLE IF EXISTS `server`;
CREATE TABLE `server` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `host` varchar(64) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `backup` tinyint(1) NOT NULL DEFAULT '0',
  `master` tinyint(1) NOT NULL DEFAULT '0',
  `slave` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(64),
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='服务信息';

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `sId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `loginId` varchar(64) NOT NULL,
  `password` varchar(32) NOT NULL,
  `isLogin` tinyint(4) DEFAULT NULL COMMENT '是否允许登陆',
  PRIMARY KEY (`sId`),
  KEY `indexone` (`loginId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='供应商';

DROP TABLE IF EXISTS `supplieruserright`;
CREATE TABLE `supplieruserright` (
  `surId` int(11) NOT NULL AUTO_INCREMENT,
  `sId` int(11) NOT NULL,
  `userId` varchar(64) NOT NULL,
  PRIMARY KEY (`surId`),
  KEY `indexone` (`sId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='供应商用户权限';

DROP TABLE IF EXISTS `systemconfig`;
CREATE TABLE `systemconfig` (
  `scid` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL,
  `value` varchar(128) NOT NULL,
  `cuid` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comment` varchar(128),
  `company` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`scid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='系统配置表';

DROP TABLE IF EXISTS `token`;
CREATE TABLE `token` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`tid`),
  KEY `indexone` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='token表';

DROP TABLE IF EXISTS `trackpoint`;
CREATE TABLE `trackpoint` (
  `tpId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `createTime` timestamp NULL NOT NULL,
  PRIMARY KEY (`tpId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='轨迹点表';

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL COMMENT '员工号',
  `oldUserId` varchar(32) DEFAULT NULL COMMENT '旧员工号',
  `roleId` varchar(10) DEFAULT NULL COMMENT '角色ID',
  `deptId` varchar(10) NOT NULL COMMENT '部门ID',
  `company` int(11) NOT NULL COMMENT '公司ID',
  `loginId` varchar(32) NOT NULL COMMENT '登录用户名',
  `password` varchar(32) DEFAULT NULL COMMENT '密码',
  `userName` varchar(32) NOT NULL COMMENT '真实姓名',
  `userNamePinYin` varchar(64) NOT NULL COMMENT '真实姓名全拼',
  `currentName` varchar(32) DEFAULT NULL COMMENT '现用名',
  `status` varchar(10) NOT NULL COMMENT '人员状态(在职,离职..)',
  `deptType` varchar(10) NOT NULL COMMENT '部门类型',
  `duty` varchar(256) NOT NULL COMMENT '职位',
  `gender` varchar(2) NOT NULL COMMENT '性别',
  `birthday` date NOT NULL COMMENT '出生日期',
  `identity` varchar(21) NOT NULL COMMENT '身份证号',
  `phone` varchar(128) NOT NULL COMMENT '手机号',
  `userPhoto` varchar(128) DEFAULT NULL COMMENT '用户图片',
  `isLogin` tinyint(4) DEFAULT NULL COMMENT '是否允许登陆',
  `extranet` tinyint(4) NOT NULL DEFAULT '0' COMMENT '外网登陆权限',
  `freedom` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uId`),
  UNIQUE KEY `uniqueone` (`loginId`),
  UNIQUE KEY `uniquetwo` (`userId`),
  KEY `indexone` (`userId`,`company`)
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
  `ucId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `contractId` varchar(32) NOT NULL,
  `startTime` date NOT NULL,
  `endTime` date NOT NULL,
  `createTime` datetime NOT NULL,
  `des` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ucId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户合同表';

DROP TABLE IF EXISTS `userexperience`;
CREATE TABLE `userexperience` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL,
  `type` varchar(10) NOT NULL,
  `startTime` date NOT NULL,
  `endTime` date NOT NULL,
  `company` varchar(32) NOT NULL,
  `position` varchar(32) NOT NULL,
  `createTime` datetime NOT NULL,
  `des` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工作经历表';

DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `uiid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `employWay` varchar(10) NOT NULL COMMENT '招聘渠道',
  `recommendMan` varchar(32) DEFAULT NULL COMMENT '推荐人',
  `jobYears` int(2) DEFAULT NULL COMMENT '工作年限',
  `employType` varchar(10) DEFAULT NULL COMMENT '录用类型',
  `entryTime` date NOT NULL COMMENT '入职时间',
  `employTime` date DEFAULT NULL COMMENT '转正时间',
  `serviceYears` int(2) DEFAULT NULL COMMENT '服务年限',
  `age` int(2) NOT NULL COMMENT '年龄',
  `political` varchar(10) NOT NULL COMMENT '政治面貌',
  `emergencyMan` varchar(32) DEFAULT NULL COMMENT '紧急联系人',
  `emergencyPhone` varchar(15) DEFAULT NULL COMMENT '紧急联系人电话',
  `isPresentGraduate` varchar(2) DEFAULT NULL COMMENT '是否是应届生',
  `graduateTime` date DEFAULT NULL COMMENT '毕业时间',
  `school` varchar(32) DEFAULT NULL COMMENT '毕业学校',
  `education` varchar(10) DEFAULT NULL COMMENT '学历',
  `specialty` varchar(32) DEFAULT NULL COMMENT '最高学历专业',
  `isMarried` varchar(2) NOT NULL COMMENT '婚姻状况',
  `isBirth` varchar(2) NOT NULL COMMENT '生育状况',
  `isHouseLoan` varchar(2) NOT NULL COMMENT '是否有房贷',
  `isCarLoan` varchar(2) NOT NULL COMMENT '是否有车贷',
  `houseType` varchar(32) DEFAULT NULL COMMENT '房屋类型',
  `householdType` varchar(10) NOT NULL COMMENT '户口类型',
  `hometownAddress` varchar(128) NOT NULL COMMENT '户籍地址',
  `address` varchar(128) NOT NULL COMMENT '现住地址',
  `isContract` varchar(2) NOT NULL COMMENT '是否签订劳动合同',
  `isInsurance` varchar(2) NOT NULL COMMENT '是否上保险',
  `insuranceTime` date DEFAULT NULL COMMENT '保险起始时间',
  `pensionNum` varchar(32) DEFAULT NULL COMMENT '养老金编号',
  `medicalNum` varchar(32) DEFAULT NULL COMMENT '医疗编号',
  `salary` decimal(10,3) NOT NULL COMMENT '工资',
  `lover` varchar(32) DEFAULT NULL COMMENT '爱人',
  `bank` varchar(10) NOT NULL COMMENT '开户行',
  `bankCardNum` varchar(32) NOT NULL COMMENT '银行卡号',
  `qq` varchar(15) DEFAULT NULL COMMENT 'QQ',
  `wechat` varchar(15) DEFAULT NULL COMMENT '微信',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  PRIMARY KEY (`uiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户信息表';

DROP TABLE IF EXISTS `village`;
CREATE TABLE `village` (
  `vId` int(11) NOT NULL AUTO_INCREMENT,
  `villageId` varchar(10) NOT NULL,
  `buildingNameRuleId` varchar(10) NOT NULL,
  `villageName` varchar(20) NOT NULL,
  `villageNamePinYinAB` varchar(256) DEFAULT NULL,
  `villageNamePinYinAll` varchar(256) DEFAULT NULL,
  `cityProperId` varchar(10) NOT NULL,
  `developer` varchar(20) DEFAULT NULL,
  `salesPhone` varchar(15) DEFAULT NULL,
  `deliveryTime` date DEFAULT NULL,
  `villageContent` varchar(512) DEFAULT NULL,
  `x` double NOT NULL DEFAULT '0',
  `y` double NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`vId`),
  UNIQUE KEY `uniqueone` (`villageId`),
  KEY `indexone` (`buildingNameRuleId`,`cityProperId`),
  KEY `indextwo` (`villageId`,`cityProperId`,`buildingNameRuleId`),
  KEY `indexthr` (`x`,`y`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='报价版本表';

DROP TABLE IF EXISTS `worktype`;
CREATE TABLE `worktype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `workTypeDes` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工种表';