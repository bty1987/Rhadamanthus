CREATE DATABASE IF NOT EXISTS `information`;
USE `information`;

-- Generated at 2026-01-06 08:11:02
-- Total tables: 23

DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `aId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `cuid` int(11) NULL,
  `status` tinyint(4) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `paytype` tinyint(1) NOT NULL COMMENT '款项类型',
  `atttype` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0(线下) 1(线上) (0:线下, 1:线上)',
  `defaults` tinyint(1) NOT NULL COMMENT '0:默认, 1:普通',
  `multiple` int(4) NOT NULL DEFAULT 0 COMMENT '倍数',
  `validays` int(8) NULL DEFAULT 0 COMMENT '有效天数',
  `exchange` int(8) NULL DEFAULT 0 COMMENT '兑换率',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(32) NULL DEFAULT '',
  `company` int(11) NOT NULL,
  PRIMARY KEY (`aId`)
) ENGINE=InnoDB AUTO_INCREMENT=758 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='活动表';

DROP TABLE IF EXISTS `activityitem`;
CREATE TABLE `activityitem` (
  `aiId` int(11) NOT NULL AUTO_INCREMENT,
  `aId` int(11) NOT NULL,
  `asid` int(11) NOT NULL,
  `activity` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `money` int(8) NOT NULL DEFAULT 0,
  `integral` int(11) NOT NULL DEFAULT 0 COMMENT '积分',
  PRIMARY KEY (`aiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1185 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='活动物品表';

DROP TABLE IF EXISTS `assassin`;
CREATE TABLE `assassin` (
  `asId` int(11) NOT NULL AUTO_INCREMENT,
  `api` varchar(64) NOT NULL,
  `params` varchar(512) NOT NULL,
  `server` varchar(32) NOT NULL,
  `errorcode` int(11) NOT NULL,
  `errormes` varchar(255) NOT NULL,
  `ouid` int(11) NOT NULL DEFAULT 0,
  `operateTime` timestamp NULL,
  PRIMARY KEY (`asId`)
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='代理表';

DROP TABLE IF EXISTS `awardpurchase`;
CREATE TABLE `awardpurchase` (
  `apid` int(11) NOT NULL AUTO_INCREMENT,
  `fapid` int(11) NULL DEFAULT 0,
  `asid` int(11) NULL,
  `inprice` bigint(10) NULL COMMENT '采购价',
  `baprice` bigint(10) NULL COMMENT '结算价',
  `num` int(8) NULL,
  `surplus` int(8) NOT NULL DEFAULT 0,
  `cuid` int(11) NULL COMMENT '创建人编号',
  `puid` int(11) NULL COMMENT '采购员编号',
  `inid` int(11) NULL COMMENT '入库员编号',
  `activity` varchar(16) NULL,
  `dept` varchar(16) NULL,
  `comment` varchar(64) NULL,
  `createTime` timestamp NULL,
  `purchaseTime` timestamp NULL,
  `instoreTime` timestamp NULL,
  `balanceTime` timestamp NULL,
  `status` tinyint(1) NOT NULL COMMENT '0:初始',
  `company` int(11) NULL,
  PRIMARY KEY (`apid`)
) ENGINE=InnoDB AUTO_INCREMENT=345 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `awardrecord`;
CREATE TABLE `awardrecord` (
  `arid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL,
  `asid` int(11) NOT NULL COMMENT '奖品ID',
  `type` tinyint(1) NOT NULL COMMENT '类型,0:入库,1:出库,2:盘盈,3:盘亏',
  `isStock` tinyint(1) NOT NULL DEFAULT 0,
  `num` int(8) NOT NULL DEFAULT 0 COMMENT '数量',
  `totalPrice` bigint(10) NOT NULL DEFAULT 0 COMMENT '总价',
  `unitPrice` int(8) NOT NULL DEFAULT 0 COMMENT '单价',
  `ouid` int(11) NOT NULL COMMENT '操作人',
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'operateTime',
  `content` varchar(64) NULL COMMENT '备注',
  `onetype` tinyint(1) NOT NULL COMMENT '0:无, 1:装修, 2:销售, 3:主材',
  `subtype` tinyint(1) NULL DEFAULT 0 COMMENT '0:入库, 1:出库, 2:盘盈, 3:盘亏, 5:领取, 6:退货, 7:配送, 8:采购, 9:赔偿, 10:公司回库',
  PRIMARY KEY (`arid`)
) ENGINE=InnoDB AUTO_INCREMENT=2598 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='库存信息';

DROP TABLE IF EXISTS `awardstock`;
CREATE TABLE `awardstock` (
  `asid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL COMMENT '编号',
  `name` varchar(64) NOT NULL COMMENT '名称',
  `purchase` int(8) NOT NULL DEFAULT 0 COMMENT '进价',
  `selling` int(8) NOT NULL DEFAULT 0 COMMENT '售价',
  `num` int(8) NOT NULL DEFAULT 0 COMMENT '数量',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  `type` tinyint(1) NOT NULL COMMENT '类型',
  `subtype` tinyint(1) NOT NULL COMMENT '0:床上用品, 1:电器, 2:厨具, 3:日用品, 4:现金资产, 5:食品, 6:洁具, 7:工具, 8:其他',
  `storeroom` tinyint(1) NOT NULL COMMENT '1:装修, 2:销售, 3:主材',
  `format` varchar(32) NULL DEFAULT '',
  `unitPrice` int(8) NULL DEFAULT 0,
  `isStock` tinyint(1) NOT NULL,
  `isPrefor` tinyint(1) NOT NULL,
  `isPayment` tinyint(1) NOT NULL,
  `content` varchar(64) NULL COMMENT '备注',
  `company` int(11) NOT NULL COMMENT '公司',
  PRIMARY KEY (`asid`)
) ENGINE=InnoDB AUTO_INCREMENT=703 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='奖品库存';

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `eId` bigint(20) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL,
  `title` varchar(64) NOT NULL,
  `content` varchar(256) NOT NULL DEFAULT '',
  `createrId` varchar(15) NULL,
  `holderId` varchar(15) NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `huid` int(11) NOT NULL COMMENT '持有人ID',
  `createTime` timestamp NULL,
  `deptId` varchar(10) NULL,
  `regionId` varchar(10) NULL,
  `did` int(11) NULL COMMENT '归属部门ID',
  `rid` int(11) NULL COMMENT '归属分区ID',
  `showDate` int(15) NOT NULL,
  `showDate1` int(8) NULL,
  `type` tinyint(4) NOT NULL,
  `atttype` tinyint(1) NULL,
  `isSend` tinyint(1) NULL,
  PRIMARY KEY (`eId`),
  KEY `indexone` (`holderId`, `showDate`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1494 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='事件表';

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `ruid` int(11) NOT NULL COMMENT '接收人ID',
  `suid` int(11) NULL COMMENT '发送人ID',
  `group` int(11) NULL,
  `type` tinyint(1) NOT NULL COMMENT '类别',
  `subtype` tinyint(1) NOT NULL COMMENT '1:辅料单',
  `ident` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL COMMENT '未读,已读,未发',
  `contents` varchar(256) NOT NULL,
  `args` varchar(1024) NULL,
  `dresult` tinyint(1) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`mid`),
  KEY `indexone` (`status`, `type`, `createTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8144 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='信息';

DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(15) NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人ID',
  `deptId` varchar(10) NOT NULL DEFAULT '',
  `theme` varchar(64) NOT NULL DEFAULT '',
  `type` tinyint(1) NOT NULL COMMENT '1: 通知, 2: 活动',
  `priority` tinyint(1) NOT NULL COMMENT '优先级 , 0: 普通, 1: 重要, 2: 紧急 (0:普通, 1:重要, 2:紧急)',
  `startTime` date NOT NULL,
  `endTime` date NOT NULL,
  `publishTime` date NOT NULL,
  `isPublic` tinyint(1) NOT NULL COMMENT '公开, 0: 公开, 1: 非公开',
  `exPublic` tinyint(1) NOT NULL COMMENT '0: 公开 , 1: 隐藏',
  `contents` varchar(1024) NOT NULL,
  `filePath` varchar(128) NULL,
  `company` int(11) NOT NULL,
  `depts` varchar(255) NULL COMMENT '部门范围',
  `fileName` varchar(255) NULL COMMENT '文件名称',
  PRIMARY KEY (`nid`),
  KEY `indexone` (`type`, `deptId`, `isPublic`, `startTime`, `endTime`, `publishTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=542 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='公告';

DROP TABLE IF EXISTS `noticedepartment`;
CREATE TABLE `noticedepartment` (
  `ndid` int(11) NOT NULL AUTO_INCREMENT,
  `nid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  PRIMARY KEY (`ndid`)
) ENGINE=InnoDB AUTO_INCREMENT=605 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='公告部门表';

DROP TABLE IF EXISTS `phonecall`;
CREATE TABLE `phonecall` (
  `pcid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(15) NULL COMMENT '订单编号',
  `ouid` int(11) NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `callbackId` varchar(64) NULL,
  `caller` varchar(32) NOT NULL COMMENT '主叫号码',
  `callee` varchar(32) NOT NULL COMMENT '被叫号码',
  `startTime` bigint(20) NULL DEFAULT 0 COMMENT '开始时间',
  `endTime` bigint(20) NULL DEFAULT 0 COMMENT '结束时间',
  `stopReason` int(11) NULL COMMENT '挂断原因',
  `duration` int(11) NULL COMMENT '时长',
  PRIMARY KEY (`pcid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `phonecallrecord`;
CREATE TABLE `phonecallrecord` (
  `pcrid` int(11) NOT NULL AUTO_INCREMENT,
  `pcid` int(11) NOT NULL,
  `recordType` int(11) NOT NULL COMMENT '录音类型 0:初始,1:本地,2:线上,3:失败',
  `recordUrl` varchar(255) NULL COMMENT '录音地址',
  PRIMARY KEY (`pcrid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1_swedish_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `plan`;
CREATE TABLE `plan` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `args` varchar(128) NULL COMMENT '参数',
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `executetime` varchar(48) NULL COMMENT '执行时间',
  `resultfilepath` varchar(128) NULL,
  `resultfilesize` int(10) NULL DEFAULT 0 COMMENT '结果文件大小',
  `infofilepath` varchar(128) NULL,
  `infofilesize` int(10) NULL DEFAULT 0 COMMENT '信息文件大小',
  `schedule` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '''状态,0:初始,1:取消,2:成功,3:失败,4:执行'',',
  `info` varchar(20) NULL,
  `company` int(11) NOT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=5077 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `planparam`;
CREATE TABLE `planparam` (
  `ppid` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `fields` varchar(255) NOT NULL,
  `conditions` varchar(255) NOT NULL,
  PRIMARY KEY (`ppid`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `filepath` varchar(128) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `plugins` varchar(100) NULL,
  `keyWord` varchar(32) NULL,
  `handle` int(1) NOT NULL,
  `server` int(11) NOT NULL DEFAULT 0 COMMENT '服务',
  `week` varchar(255) NOT NULL DEFAULT '' COMMENT '星期',
  `day` varchar(255) NOT NULL DEFAULT '' COMMENT '天数',
  `hour` varchar(255) NOT NULL DEFAULT '' COMMENT '小时',
  `status` tinyint(1) NOT NULL,
  `isShow` tinyint(1) NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `upgrade`;
CREATE TABLE `upgrade` (
  `ugid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `trialno` varchar(64) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `filesize` bigint(64) NOT NULL,
  PRIMARY KEY (`ugid`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `vactivity`;
CREATE TABLE `vactivity` (
  `vaid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`vaid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='大活动';

DROP TABLE IF EXISTS `vaward`;
CREATE TABLE `vaward` (
  `vaid` int(11) NOT NULL AUTO_INCREMENT,
  `vpid` int(11) NOT NULL,
  `no` varchar(15) NOT NULL,
  `name` varchar(32) NOT NULL,
  `price` int(8) NOT NULL DEFAULT 0,
  `num` int(8) NOT NULL DEFAULT 0,
  `unit` varchar(8) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`vaid`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='活动奖品';

DROP TABLE IF EXISTS `vpayment`;
CREATE TABLE `vpayment` (
  `vpid` int(11) NOT NULL AUTO_INCREMENT,
  `mno` varchar(15) NOT NULL COMMENT '会员号',
  `orderId` varchar(32) NULL COMMENT '票号',
  `createrId` int(11) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` tinyint(2) NOT NULL COMMENT '类型 , 0: 装修款 , 1: 装修定金 , 2: 主材款 , 3: 主材定金',
  `category` varchar(32) NULL DEFAULT '',
  `brand` varchar(32) NULL COMMENT '品牌 品牌',
  `money` bigint(10) NOT NULL DEFAULT 0 COMMENT '金额',
  `comment` varchar(255) NULL COMMENT '备注',
  `vrid` int(11) NULL,
  `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态 (0:未付款)',
  `expire` tinyint(1) NOT NULL COMMENT '0:有效, 1:到期',
  `vaid` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`vpid`)
) ENGINE=InnoDB AUTO_INCREMENT=429 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `vprize`;
CREATE TABLE `vprize` (
  `vpid` int(11) NOT NULL AUTO_INCREMENT,
  `vaid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `price` int(8) NOT NULL DEFAULT 0,
  `unit` varchar(8) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`vpid`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='奖品';

DROP TABLE IF EXISTS `vreceipt`;
CREATE TABLE `vreceipt` (
  `vrid` int(11) NOT NULL AUTO_INCREMENT COMMENT '活动收据ID 活动收据ID',
  `cluid` int(11) NOT NULL COMMENT '收款人ID',
  `collectTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收款时间',
  `cash` bigint(10) NOT NULL DEFAULT 0 COMMENT '现金 现金',
  `bank` bigint(10) NOT NULL DEFAULT 0 COMMENT '刷卡 刷卡',
  `bankInfo` varchar(255) NOT NULL COMMENT '刷卡信息',
  `coupon` bigint(10) NOT NULL DEFAULT 0 COMMENT '券值 券值',
  `couponInfo` varchar(255) NOT NULL COMMENT '券信息',
  `comment` varchar(255) NULL COMMENT '说明 说明',
  PRIMARY KEY (`vrid`)
) ENGINE=InnoDB AUTO_INCREMENT=478 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `vticket`;
CREATE TABLE `vticket` (
  `vtid` int(11) NOT NULL AUTO_INCREMENT COMMENT '活动票ID',
  `tno` varchar(15) NOT NULL COMMENT '活动票号',
  `vaid` int(11) NULL DEFAULT 0,
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `buid` int(11) NULL COMMENT '归属人',
  `did` int(11) NULL COMMENT '归属部门',
  `rid` int(11) NULL COMMENT '归属分区',
  `orderId` varchar(15) NULL COMMENT '装修单号',
  `name` varchar(15) NULL COMMENT '姓名',
  `phone` varchar(32) NULL COMMENT '电话',
  `address` varchar(128) NULL COMMENT '地址',
  `isregist` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否注册',
  `iscome` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否到场',
  `expire` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`vtid`),
  UNIQUE KEY `indexone` (`tno`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact;

DROP TABLE IF EXISTS `worksheet`;
CREATE TABLE `worksheet` (
  `wsid` int(11) NOT NULL AUTO_INCREMENT COMMENT '工单ID',
  `code` varchar(256) NULL COMMENT '单号',
  `module` varchar(256) NOT NULL COMMENT '模块',
  `content` varchar(256) NOT NULL COMMENT '内容',
  `path` varchar(128) NULL,
  `cuid` int(11) NOT NULL COMMENT '创建人',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 (0:初始)',
  `huid` int(11) NULL COMMENT '处理人',
  `handTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '处理时间',
  `result` varchar(256) NULL COMMENT '结果',
  PRIMARY KEY (`wsid`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8_general_ci ROW_FORMAT=Compact COMMENT='工单';
