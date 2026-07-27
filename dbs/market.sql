CREATE DATABASE IF NOT EXISTS `market`;
USE `market`;

-- Generated at 2026-01-06 08:11:02
-- Total tables: 10

DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `caid` int(11) NOT NULL AUTO_INCREMENT COMMENT '名片ID',
  `cuid` int(11) NOT NULL COMMENT '用户ID',
  `userPhoto` varchar(255) NULL COMMENT '头像',
  `userName` varchar(255) NULL COMMENT '姓名',
  `phone` varchar(64) NULL COMMENT '手机号',
  `wechat` varchar(64) NULL COMMENT '微信号',
  `industry` varchar(64) NULL COMMENT '行业',
  `profession` varchar(64) NULL COMMENT '职业',
  `address` varchar(255) NULL COMMENT '地址',
  `info` varchar(255) NULL COMMENT '简介',
  PRIMARY KEY (`caid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='名片表';

DROP TABLE IF EXISTS `cardphoto`;
CREATE TABLE `cardphoto` (
  `cpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '照片墙ID',
  `caid` int(11) NOT NULL COMMENT '名片ID',
  `url` varchar(255) NULL COMMENT '图片',
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='照片墙';

DROP TABLE IF EXISTS `cnotice`;
CREATE TABLE `cnotice` (
  `cnid` int(11) NOT NULL AUTO_INCREMENT,
  `suid` int(11) NOT NULL COMMENT 'sender发起者',
  `ruid` int(11) NOT NULL COMMENT 'receiver接收者',
  `name` varchar(255) NULL COMMENT '预留的姓名',
  `phone` varchar(64) NULL COMMENT '预留的电话',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态(0未读,1已读)',
  `createTime` timestamp NULL COMMENT '创建时间',
  `comment` varchar(255) NULL COMMENT '备注',
  PRIMARY KEY (`cnid`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='消息事务表';

DROP TABLE IF EXISTS `cuser`;
CREATE TABLE `cuser` (
  `cuid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `unionId` varchar(64) NOT NULL COMMENT '用户unionID',
  PRIMARY KEY (`cuid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='微信用户';

DROP TABLE IF EXISTS `ecase`;
CREATE TABLE `ecase` (
  `cid` int(10) NOT NULL AUTO_INCREMENT,
  `cityId` int(11) NOT NULL,
  `villageName` varchar(255) NOT NULL COMMENT '楼盘名称',
  `duid` int(10) NULL COMMENT '设计师',
  `suid` int(10) NULL COMMENT '监理',
  `style` varchar(255) NULL COMMENT '风格',
  `type` int(2) NOT NULL COMMENT '0:  效果图  1:  施工图',
  `houseType` varchar(255) NULL COMMENT '户型',
  `area` decimal(10,2) NULL COMMENT '面积',
  `cycle` int(10) NULL DEFAULT 0 COMMENT '施工周期',
  `defaultUrl` varchar(255) NULL COMMENT '默认图片',
  `status` int(2) NULL DEFAULT 0 COMMENT '是否首页显示 0:不显示  1:显示',
  `comment` varchar(255) NULL COMMENT '备注说明',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `ecity`;
CREATE TABLE `ecity` (
  `ecid` int(11) NOT NULL AUTO_INCREMENT,
  `city` varchar(64) NOT NULL,
  `pinyin` varchar(64) NOT NULL,
  `x` double NOT NULL DEFAULT 0 COMMENT '经度',
  `y` double NOT NULL DEFAULT 0 COMMENT '纬度',
  PRIMARY KEY (`ecid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='城市表';

DROP TABLE IF EXISTS `ecustomer`;
CREATE TABLE `ecustomer` (
  `ecid` int(11) NOT NULL AUTO_INCREMENT,
  `cityId` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `villageName` varchar(64) NOT NULL,
  `area` decimal(10,2) NOT NULL,
  PRIMARY KEY (`ecid`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `eopinions`;
CREATE TABLE `eopinions` (
  `eoid` int(10) NOT NULL AUTO_INCREMENT,
  `ecid` int(10) NULL,
  `esid` int(10) NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT ' 类型：0: 朋友圈, 1: 锦旗, 2: 其他
',
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NULL,
  PRIMARY KEY (`eoid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `eperson`;
CREATE TABLE `eperson` (
  `euid` int(11) NOT NULL AUTO_INCREMENT,
  `cityId` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `pinyin` varchar(64) NOT NULL,
  `phone` varchar(128) NOT NULL,
  `experience` tinyint(2) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `imgUrl` varchar(255) NOT NULL,
  `info` varchar(255) NOT NULL,
  PRIMARY KEY (`euid`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `epicture`;
CREATE TABLE `epicture` (
  `epid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '案例id',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 0:案例 1:口碑',
  `url` varchar(64) NOT NULL COMMENT '图片地址',
  PRIMARY KEY (`epid`)
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='图片表';

DROP TABLE IF EXISTS `marketcampaign`;
CREATE TABLE `marketcampaign` (
  `mcid` int(11) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `name` varchar(128) NOT NULL COMMENT '活动名称',
  `type` tinyint(2) NOT NULL DEFAULT 0 COMMENT '活动类型',
  `regionId` int(11) NOT NULL DEFAULT 0 COMMENT '区域ID',
  `ownerId` int(11) NOT NULL DEFAULT 0 COMMENT '负责人ID',
  `budget` decimal(10,2) NULL COMMENT '预算',
  `startTime` timestamp NULL COMMENT '开始时间',
  `endTime` timestamp NULL COMMENT '结束时间',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态:0草稿,1预热,2进行中,3暂停,4结束,5归档',
  `comment` varchar(255) NULL COMMENT '备注',
  `createTime` timestamp NULL COMMENT '创建时间',
  `updateTime` timestamp NULL COMMENT '更新时间',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`mcid`),
  KEY `indexone` (`company`, `status`),
  KEY `indextwo` (`ownerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='营销活动';

DROP TABLE IF EXISTS `marketchannel`;
CREATE TABLE `marketchannel` (
  `mchid` int(11) NOT NULL AUTO_INCREMENT COMMENT '渠道ID',
  `name` varchar(64) NOT NULL COMMENT '渠道名称',
  `type` tinyint(2) NOT NULL DEFAULT 0 COMMENT '渠道类型',
  `platform` varchar(64) NULL COMMENT '平台',
  `ownerId` int(11) NOT NULL DEFAULT 0 COMMENT '负责人ID',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态:0启用,1禁用',
  `comment` varchar(255) NULL COMMENT '备注',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`mchid`),
  KEY `indexone` (`company`, `status`),
  KEY `indextwo` (`ownerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='营销渠道';

DROP TABLE IF EXISTS `marketsource`;
CREATE TABLE `marketsource` (
  `msid` int(11) NOT NULL AUTO_INCREMENT COMMENT '来源ID',
  `channelId` int(11) NOT NULL COMMENT '渠道ID',
  `campaignId` int(11) NOT NULL COMMENT '活动ID',
  `profileId` int(11) NOT NULL DEFAULT 0 COMMENT '人员/门店/名片ID',
  `code` varchar(64) NOT NULL COMMENT '来源码',
  `url` varchar(255) NULL COMMENT '推广链接',
  `qrcode` varchar(255) NULL COMMENT '二维码',
  `utmSource` varchar(64) NULL COMMENT 'UTM source',
  `utmMedium` varchar(64) NULL COMMENT 'UTM medium',
  `utmCampaign` varchar(64) NULL COMMENT 'UTM campaign',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态:0启用,1禁用',
  `createTime` timestamp NULL COMMENT '创建时间',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`msid`),
  UNIQUE KEY `uniqueone` (`company`, `code`),
  KEY `indexone` (`company`, `campaignId`),
  KEY `indextwo` (`company`, `channelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='营销来源';

DROP TABLE IF EXISTS `marketinbound`;
CREATE TABLE `marketinbound` (
  `miid` int(11) NOT NULL AUTO_INCREMENT COMMENT '入站ID',
  `inboundNo` varchar(64) NOT NULL COMMENT '入站编号',
  `name` varchar(64) NULL COMMENT '姓名/称呼',
  `phone` varchar(255) NULL COMMENT '手机号密文',
  `phoneHash` varchar(64) NULL COMMENT '手机号哈希',
  `wechat` varchar(64) NULL COMMENT '微信号',
  `email` varchar(128) NULL COMMENT '邮箱',
  `companyName` varchar(128) NULL COMMENT '企业/组织名称',
  `demand` varchar(255) NULL COMMENT '需求描述',
  `cityId` int(11) NOT NULL DEFAULT 0 COMMENT '城市/区域ID',
  `channelId` int(11) NOT NULL COMMENT '渠道ID',
  `sourceId` int(11) NOT NULL COMMENT '来源ID',
  `campaignId` int(11) NOT NULL COMMENT '活动ID',
  `csid` int(11) NOT NULL DEFAULT 0 COMMENT 'CustomerSource ID',
  `ccid` int(11) NOT NULL DEFAULT 0 COMMENT 'CustomerChance ID',
  `orderId` varchar(15) NULL COMMENT '订单ID',
  `idempotentKey` varchar(64) NOT NULL COMMENT '幂等键',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态:0待承接,1成功,2失败,3重试中,4忽略',
  `errorMsg` varchar(255) NULL COMMENT '失败原因',
  `createTime` timestamp NULL COMMENT '创建时间',
  `updateTime` timestamp NULL COMMENT '更新时间',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`miid`),
  UNIQUE KEY `uniqueone` (`company`, `inboundNo`),
  UNIQUE KEY `uniquetwo` (`company`, `idempotentKey`),
  KEY `indexone` (`company`, `campaignId`, `status`),
  KEY `indextwo` (`company`, `channelId`, `status`),
  KEY `indexthree` (`company`, `csid`),
  KEY `indexfour` (`company`, `ccid`),
  KEY `indexfive` (`phoneHash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='营销入站';

DROP TABLE IF EXISTS `marketinbounditem`;
CREATE TABLE `marketinbounditem` (
  `miiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '入站扩展项ID',
  `miid` int(11) NOT NULL COMMENT '入站ID',
  `fieldKey` varchar(64) NOT NULL COMMENT '字段键',
  `fieldValue` varchar(255) NULL COMMENT '字段值',
  PRIMARY KEY (`miiid`),
  KEY `indexone` (`miid`),
  KEY `indextwo` (`fieldKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='营销入站扩展字段';

DROP TABLE IF EXISTS `marketattribution`;
CREATE TABLE `marketattribution` (
  `maid` int(11) NOT NULL AUTO_INCREMENT COMMENT '归因ID',
  `campaignId` int(11) NOT NULL DEFAULT 0 COMMENT '活动ID',
  `sourceId` int(11) NOT NULL DEFAULT 0 COMMENT '来源ID',
  `miid` int(11) NOT NULL DEFAULT 0 COMMENT '入站ID',
  `csid` int(11) NOT NULL DEFAULT 0 COMMENT 'CustomerSource ID',
  `ccid` int(11) NOT NULL DEFAULT 0 COMMENT 'CustomerChance ID',
  `orderId` varchar(15) NULL COMMENT '订单ID',
  `eventType` tinyint(2) NOT NULL DEFAULT 0 COMMENT '事件类型:0提交,1客资,2机会,3订单',
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态',
  `createTime` timestamp NULL COMMENT '创建时间',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`maid`),
  KEY `indexone` (`company`, `campaignId`),
  KEY `indextwo` (`company`, `sourceId`),
  KEY `indexthree` (`company`, `miid`),
  KEY `indexfour` (`company`, `csid`),
  KEY `indexfive` (`company`, `ccid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='营销归因';
