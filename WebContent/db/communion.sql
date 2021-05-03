CREATE DATABASE  IF NOT EXISTS `communion`;
USE `communion`;

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `month` int(6) NOT NULL,
  `a1` int(2) NOT NULL DEFAULT '40',
  `a2` int(2) NOT NULL DEFAULT '40',
  `a3` int(2) NOT NULL DEFAULT '40',
  `a4` int(2) NOT NULL DEFAULT '40',
  `a5` int(2) NOT NULL DEFAULT '40',
  `a6` int(2) NOT NULL DEFAULT '40',
  `a7` int(2) NOT NULL DEFAULT '40',
  `a8` int(2) NOT NULL DEFAULT '40',
  `a9` int(2) NOT NULL DEFAULT '40',
  `a10` int(2) NOT NULL DEFAULT '40',
  `a11` int(2) NOT NULL DEFAULT '40',
  `a12` int(2) NOT NULL DEFAULT '40',
  `a13` int(2) NOT NULL DEFAULT '40',
  `a14` int(2) NOT NULL DEFAULT '40',
  `a15` int(2) NOT NULL DEFAULT '40',
  `a16` int(2) NOT NULL DEFAULT '40',
  `a17` int(2) NOT NULL DEFAULT '40',
  `a18` int(2) NOT NULL DEFAULT '40',
  `a19` int(2) NOT NULL DEFAULT '40',
  `a20` int(2) NOT NULL DEFAULT '40',
  `a21` int(2) NOT NULL DEFAULT '40',
  `a22` int(2) NOT NULL DEFAULT '40',
  `a23` int(2) NOT NULL DEFAULT '40',
  `a24` int(2) NOT NULL DEFAULT '40',
  `a25` int(2) NOT NULL DEFAULT '40',
  `a26` int(2) NOT NULL DEFAULT '40',
  `a27` int(2) NOT NULL DEFAULT '40',
  `a28` int(2) NOT NULL DEFAULT '40',
  `a29` int(2) NOT NULL DEFAULT '40',
  `a30` int(2) NOT NULL DEFAULT '40',
  `a31` int(2) NOT NULL DEFAULT '40',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='考勤表';

DROP TABLE IF EXISTS `brand`;
CREATE TABLE `brand` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `ocuid` int(11) DEFAULT NULL,
  `no` varchar(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `pinyin` varchar(216) NOT NULL,
  `company` int(11) NOT NULL,
  `kino` varchar(16) DEFAULT '',
  `kiname` varchar(32) DEFAULT '',
  PRIMARY KEY (`bid`),
  KEY `indexone` (`cid`),
  KEY `indextwo` (`name`,`pinyin`),
  KEY `indexthr` (`ocuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌表';

DROP TABLE IF EXISTS `branduserright`;
CREATE TABLE `branduserright` (
  `burid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  PRIMARY KEY (`burid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌用户权限表';

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
  `type` tinyint(1) DEFAULT '0' COMMENT '类型 , 0: 普通 , 1: 统计',
  `kino` varchar(16) DEFAULT '',
  `kiname` varchar(32) DEFAULT '',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品类表';

DROP TABLE IF EXISTS `chart`;
CREATE TABLE `chart` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(32) NOT NULL COMMENT '编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `api` varchar(64) NOT NULL COMMENT '接口',
  `method` varchar(32) NOT NULL COMMENT '方法',
  `param` varchar(255) DEFAULT NULL COMMENT '参数',
  `style` varchar(255) DEFAULT NULL COMMENT '样式',
  `clazz` varchar(255) DEFAULT NULL COMMENT '类型',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='图表基础数据表';

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
  `fullname` varchar(32) DEFAULT '',
  `address` varchar(64) DEFAULT '',
  `corporation` varchar(8) DEFAULT '',
  `phone` varchar(16) DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `shortname` varchar(8) NOT NULL DEFAULT '',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='公司表';

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

DROP TABLE IF EXISTS `contract`;
CREATE TABLE `contract` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(255) NOT NULL COMMENT '编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `title` varchar(32) NOT NULL COMMENT '标题',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='合同模版';

DROP TABLE IF EXISTS `counting`;
CREATE TABLE `counting` (
  `date` varchar(8) NOT NULL,
  `type` int(11) NOT NULL,
  `company` int(11) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL,
  PRIMARY KEY (`date`,`type`,`company`),
  KEY `indexone` (`date`,`type`,`company`)
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
  `token` varchar(64) DEFAULT NULL COMMENT '签名标识',
  `signno` varchar(64) DEFAULT NULL COMMENT '签章编号',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态',
  `photoPath` varchar(256) DEFAULT NULL COMMENT '图片路径',
  `identityPathF` varchar(256) DEFAULT NULL COMMENT '证件照片',
  `identityPathB` varchar(256) DEFAULT NULL COMMENT '证件照片',
  `authurl` varchar(512) DEFAULT NULL,
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
  UNIQUE KEY `uniqueone` (`cid`,`phone`),
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
  `no` varchar(10) NOT NULL COMMENT '部门ID',
  `fdid` varchar(10) DEFAULT NULL COMMENT '上级部门ID',
  `muid` int(11) DEFAULT NULL,
  `name` varchar(32) NOT NULL COMMENT '部门名称',
  `pinyin` varchar(128) NOT NULL,
  `type` varchar(10) NOT NULL COMMENT '部门类型',
  `subType` varchar(10) DEFAULT NULL COMMENT '二级部门分类',
  `createTime` date NOT NULL COMMENT '创建时间',
  `contractPrefix` varchar(32) DEFAULT NULL COMMENT '设计部门合同前缀(独有)',
  `company` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `comment` varchar(128) DEFAULT NULL COMMENT '表述',
  `kino` varchar(16) DEFAULT '',
  `kiname` varchar(32) DEFAULT '',
  PRIMARY KEY (`did`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='部门表';

DROP TABLE IF EXISTS `departmenttype`;
CREATE TABLE `departmenttype` (
  `dtid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`dtid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='部门类型';

DROP TABLE IF EXISTS `dutment`;
CREATE TABLE `dutment` (
  `did` int(11) NOT NULL AUTO_INCREMENT COMMENT '定岗ID',
  `deptId` int(11) NOT NULL COMMENT '部门ID',
  `dutyId` int(11) NOT NULL COMMENT '职位ID',
  `limits` int(11) NOT NULL DEFAULT '0' COMMENT '人员上限',
  `num` int(11) NOT NULL DEFAULT '0' COMMENT '人员数量',
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='定岗表';

DROP TABLE IF EXISTS `duty`;
CREATE TABLE `duty` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(64) NOT NULL,
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
  `buildArea` int(8) NOT NULL DEFAULT '0' COMMENT '建筑面积',
  `freeArea` int(8) NOT NULL DEFAULT '0' COMMENT '赠送面积',
  `innerArea` int(8) NOT NULL DEFAULT '0' COMMENT '套内面积',
  `totalArea` int(8) NOT NULL DEFAULT '0' COMMENT '总面积',
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
  UNIQUE KEY `uniqueone` (`vid`,`houseNumber`),
  KEY `indexone` (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='房产';

DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `lid` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `name` varchar(15) NOT NULL COMMENT '标签名字',
  `scale` tinyint(1) NOT NULL COMMENT '值',
  `type` tinyint(1) NOT NULL,
  `isShow` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='标签';

DROP TABLE IF EXISTS `macontrol`;
CREATE TABLE `macontrol` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  `mac` varchar(12) NOT NULL,
  `ip` varchar(20) NOT NULL,
  `buid` int(11) NOT NULL COMMENT '归属人ID',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态, 0启用, 1禁用',
  `comment` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='权限控制';

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

DROP TABLE IF EXISTS `performance`;
CREATE TABLE `performance` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户',
  `type` tinyint(1) NOT NULL COMMENT '类型, 0: 任务, 1: 代码 , 2: 文档 , 3: 测试用例 , 4: bug , 5: 延期 , 6: 失误 , 7: 考勤 , 8: 加班',
  `value` int(11) NOT NULL COMMENT '评价',
  `level` tinyint(1) NOT NULL COMMENT '水平',
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '结束时间',
  `work` varchar(32) NOT NULL COMMENT '工作',
  `content` varchar(64) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='绩效';

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
  `name` varchar(32) NOT NULL,
  `no` varchar(16) NOT NULL,
  `subjectName` varchar(64) NOT NULL,
  `oneCode` varchar(6) NOT NULL,
  `twoCode` varchar(4) NOT NULL,
  `thrCode` varchar(4) NOT NULL,
  `direction` tinyint(1) NOT NULL COMMENT '余额方向,借 1, 贷 -1',
  `grade` varchar(1) DEFAULT '',
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `company` int(11) NOT NULL,
  `kino` varchar(16) DEFAULT '' COMMENT '金蝶编号',
  `kiname` varchar(32) DEFAULT '' COMMENT '金蝶名称',
  `assistant` varchar(128) DEFAULT '' COMMENT '辅助核算项目',
  `value` varchar(36) DEFAULT NULL COMMENT '硬件值, 例如POS',
  PRIMARY KEY (`rtid`),
  KEY `uniqueone` (`no`,`company`)
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
  `pinyin` varchar(64) DEFAULT NULL COMMENT '拼音',
  `level` tinyint(1) NOT NULL DEFAULT '0',
  `content` varchar(20) DEFAULT NULL,
  `company` int(11) DEFAULT '0',
  PRIMARY KEY (`rid`),
  UNIQUE KEY `uniqueone` (`no`),
  KEY `indexone` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='角色表';

DROP TABLE IF EXISTS `rolechart`;
CREATE TABLE `rolechart` (
  `rcid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  PRIMARY KEY (`rcid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='图表与角色关系表';

DROP TABLE IF EXISTS `rolemodule`;
CREATE TABLE `rolemodule` (
  `rmid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `link` tinyint(1) NOT NULL DEFAULT '1',
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

DROP TABLE IF EXISTS `signet`;
CREATE TABLE `signet` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(125) NOT NULL COMMENT '编号',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `keyword` varchar(64) NOT NULL COMMENT '关键字',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='签章';

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
  KEY `indexone` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='系统配置表';

DROP TABLE IF EXISTS `talking`;
CREATE TABLE `talking` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '类型 , 0: 工程合同附加信息',
  `content` varchar(256) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0: 启用 , 1: 禁用',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='话术表';

DROP TABLE IF EXISTS `upgrade`;
CREATE TABLE `upgrade` (
  `ugid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `trialno` varchar(64) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `filesize` int(11) NOT NULL,
  PRIMARY KEY (`ugid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='升级表';

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NOT NULL COMMENT '员工号',
  `oldUserId` varchar(32) DEFAULT NULL COMMENT '旧员工号',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `roleId` int(11) DEFAULT NULL COMMENT '角色ID',
  `deptId` int(11) NOT NULL COMMENT '部门ID',
  `company` int(11) NOT NULL COMMENT '公司ID',
  `loginId` varchar(32) NOT NULL COMMENT '登录用户名',
  `password` varchar(32) DEFAULT NULL COMMENT '密码',
  `userName` varchar(32) NOT NULL COMMENT '真实姓名',
  `pinyin` varchar(64) NOT NULL COMMENT '真实姓名全拼',
  `currentName` varchar(32) DEFAULT NULL COMMENT '现用名',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:在职,1:离职,2:停薪留职',
  `did` int(11) DEFAULT NULL COMMENT '职位类型',
  `gender` varchar(2) NOT NULL COMMENT '性别',
  `identity` varchar(21) NOT NULL COMMENT '身份证号',
  `phone` varchar(128) NOT NULL COMMENT '手机号',
  `userPhoto` varchar(128) DEFAULT NULL COMMENT '用户图片',
  `isLogin` tinyint(1) DEFAULT NULL COMMENT '是否允许登陆',
  `extranet` tinyint(1) NOT NULL DEFAULT '0' COMMENT '外网登陆权限',
  `freedom` tinyint(1) NOT NULL DEFAULT '0',
  `isUpdate` tinyint(1) DEFAULT '0',
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
  PRIMARY KEY (`ucid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户-公司表';

DROP TABLE IF EXISTS `usercontract`;
CREATE TABLE `usercontract` (
  `ucId` int(11) NOT NULL AUTO_INCREMENT COMMENT '合同ID',
  `uid` int(11) NOT NULL COMMENT '员工ID',
  `no` varchar(255) NOT NULL COMMENT '合同编号',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `signTime` date NOT NULL,
  `startTime` date NOT NULL COMMENT '签订时间',
  `endTime` date NOT NULL COMMENT '结束时间',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 0:有效,1:无效',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`ucId`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户合同表';

DROP TABLE IF EXISTS `usereducation`;
CREATE TABLE `usereducation` (
  `ueid` int(11) NOT NULL AUTO_INCREMENT COMMENT '教育ID',
  `uid` int(11) NOT NULL COMMENT '人员ID',
  `organ` varchar(50) NOT NULL COMMENT '机构',
  `certificate` varchar(50) DEFAULT NULL COMMENT '证书',
  `specialty` varchar(32) NOT NULL DEFAULT '' COMMENT '专业',
  `beginTime` date DEFAULT NULL COMMENT '开始时间',
  `endTime` date DEFAULT NULL COMMENT '结束时间',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `content` varchar(255) DEFAULT NULL COMMENT '内容',
  PRIMARY KEY (`ueid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员教育信息表';

DROP TABLE IF EXISTS `userexperience`;
CREATE TABLE `userexperience` (
  `upid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(15) NOT NULL,
  `type` varchar(10) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` varchar(128) NOT NULL,
  PRIMARY KEY (`upid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='工作经历表';

DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `uiid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `ranks` varchar(16) DEFAULT 'P1' COMMENT '级别',
  `form` tinyint(1) DEFAULT '0' COMMENT '岗位类型: 0:产值 1:非产值',
  `employWay` tinyint(4) DEFAULT '0' COMMENT '招聘渠道',
  `recommendMan` varchar(32) DEFAULT NULL COMMENT '推荐人',
  `jobYears` int(2) DEFAULT '0' COMMENT '工作年限',
  `employType` tinyint(1) DEFAULT '1' COMMENT '录用类型',
  `entryTime` date DEFAULT NULL COMMENT '入职时间',
  `employTime` date DEFAULT NULL COMMENT '转正时间',
  `political` tinyint(1) DEFAULT '0' COMMENT '政治面貌',
  `emergencyMan` varchar(32) DEFAULT NULL COMMENT '紧急联系人',
  `emergencyPhone` varchar(15) DEFAULT NULL COMMENT '紧急联系人电话',
  `isPresentGraduate` tinyint(1) DEFAULT '1' COMMENT '是否是应届生',
  `graduateTime` date DEFAULT NULL COMMENT '毕业时间',
  `school` varchar(32) DEFAULT NULL COMMENT '毕业学校',
  `education` tinyint(1) DEFAULT '0' COMMENT '学历',
  `specialty` varchar(32) DEFAULT NULL COMMENT '最高学历专业',
  `isMarried` tinyint(1) DEFAULT '1' COMMENT '婚姻状况',
  `isBirth` tinyint(1) DEFAULT '1' COMMENT '生育状况',
  `isHouseLoan` tinyint(1) DEFAULT '1' COMMENT '是否有房贷',
  `isCarLoan` tinyint(1) DEFAULT '1' COMMENT '是否有车贷',
  `householdType` tinyint(1) DEFAULT '0' COMMENT '户口类型',
  `hometownPlace` varchar(32) DEFAULT '' COMMENT '户籍所在地',
  `hometownAddress` varchar(128) DEFAULT NULL COMMENT '户籍地址',
  `address` varchar(128) DEFAULT NULL COMMENT '现住地址',
  `isContract` tinyint(1) DEFAULT '1' COMMENT '是否签订劳动合同',
  `isInsurance` tinyint(1) DEFAULT '1' COMMENT '是否上保险',
  `insuranceTime` date DEFAULT NULL COMMENT '保险起始时间',
  `pensionNum` varchar(32) DEFAULT NULL COMMENT '养老金编号',
  `medicalNum` varchar(32) DEFAULT NULL COMMENT '医疗编号',
  `salary` varchar(32) NOT NULL DEFAULT '' COMMENT '工资',
  `lover` varchar(32) DEFAULT NULL COMMENT '爱人',
  `bank` varchar(10) DEFAULT NULL COMMENT '开户行',
  `bankCardNum` varchar(32) DEFAULT NULL COMMENT '银行卡号',
  `qq` varchar(15) DEFAULT NULL COMMENT 'QQ',
  `wechat` varchar(15) DEFAULT NULL COMMENT '微信',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `level` tinyint(1) NOT NULL DEFAULT '0' COMMENT '职级 0:员工 1:核心员工 2:主管 3:经理 4:总监及以上',
  `gender` tinyint(1) NOT NULL DEFAULT '0' COMMENT '性别 0:女 1:男',
  `height` int(3) DEFAULT '0' COMMENT '身高',
  `weight` int(3) DEFAULT '0' COMMENT '体重',
  `nation` varchar(50) DEFAULT NULL COMMENT '民族',
  `hobby` varchar(70) DEFAULT NULL COMMENT '爱好',
  `isCarID` tinyint(1) DEFAULT '1' COMMENT '是否有驾照 0:有 1:无',
  `isPassID` tinyint(1) DEFAULT '1' COMMENT '是否有护照 0:有 1:无',
  `isHMID` tinyint(1) DEFAULT '1' COMMENT '是否港澳通行证 0:有 1:无',
  `isTWID` tinyint(1) DEFAULT '1' COMMENT '是否有台湾通行证 0:有 1:无',
  `claner` varchar(32) DEFAULT NULL COMMENT '直系亲属',
  `clanerCom` varchar(32) DEFAULT NULL COMMENT '直系亲属公司',
  `fuid` int(11) DEFAULT NULL COMMENT '方林家属id',
  `firstTime` date DEFAULT NULL COMMENT '入司时间',
  `signTime` date DEFAULT NULL COMMENT '签合同日期',
  `eignTime` date DEFAULT NULL COMMENT '合同结束日期',
  `fignTime` date DEFAULT NULL COMMENT '首次合同时间',
  `signNum` int(2) DEFAULT '0' COMMENT '续签合同次数',
  `preformNum` varchar(32) DEFAULT '' COMMENT '试用期限',
  `formTime` date DEFAULT NULL COMMENT '转正日期',
  `insuranceType` tinyint(1) DEFAULT '0' COMMENT '保险类型 0:社保 1:商业保险',
  `publicNum` varchar(32) DEFAULT NULL COMMENT '公积金号',
  `palary` varchar(32) DEFAULT '' COMMENT '试用工资',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`uiid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户信息表';

DROP TABLE IF EXISTS `userlabel`;
CREATE TABLE `userlabel` (
  `ulid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `lid` int(11) NOT NULL,
  `scope` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ulid`),
  KEY `lid` (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员标签';

DROP TABLE IF EXISTS `useroperation`;
CREATE TABLE `useroperation` (
  `uoid` int(11) NOT NULL AUTO_INCREMENT COMMENT '工作ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `company` varchar(32) DEFAULT NULL COMMENT '公司',
  `trade` varchar(32) DEFAULT NULL COMMENT '行业',
  `duty` varchar(32) DEFAULT NULL COMMENT '职位',
  `beginTime` date DEFAULT NULL COMMENT '开始时间',
  `endTime` date DEFAULT NULL COMMENT '结束时间',
  `salary` bigint(10) NOT NULL DEFAULT '0' COMMENT '薪资',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `comment` varchar(255) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`uoid`),
  KEY `indexone` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员过往公司信息表';

DROP TABLE IF EXISTS `userrequire`;
CREATE TABLE `userrequire` (
  `urid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `cdid` int(11) DEFAULT NULL COMMENT '创建部门ID',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `ruid` int(11) DEFAULT NULL COMMENT '接收人ID',
  `content` varchar(255) DEFAULT NULL COMMENT '备注',
  `approveTime` timestamp NULL DEFAULT NULL COMMENT '审批时间',
  `finishTime` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  `status` tinyint(1) NOT NULL COMMENT '0初始,1通过,2拒绝,3完成',
  `type` tinyint(1) NOT NULL COMMENT '0招聘,1培训',
  PRIMARY KEY (`urid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='人员需求';

DROP TABLE IF EXISTS `version`;
CREATE TABLE `version` (
  `vid` int(11) NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `no` varchar(64) NOT NULL COMMENT '版本编号',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建事件',
  `comment` text NOT NULL COMMENT '更新说明',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `village`;
CREATE TABLE `village` (
  `vid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) NOT NULL,
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

