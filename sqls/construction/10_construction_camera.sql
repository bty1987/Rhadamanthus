-- =============================================================================
-- 施工摄像头接入 P0 表结构与配置项
-- 说明:
--   1. 三张核心表先支撑设备绑定、直播、抓图、图片集播放。
--   2. 萤石真实 AppSecret 不要写入仓库; 部署时由运维写入 communion.systemconfig。
--   3. verifyCode 入库前由后端 AES 加密。
-- =============================================================================

CREATE TABLE IF NOT EXISTS `construction`.`camera` (
  `ccid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `orderId` VARCHAR(32) NOT NULL COMMENT '装修单号',
  `constructionId` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '施工单ID, 对应 construction.cid',
  `provider` VARCHAR(32) NOT NULL DEFAULT 'ys7' COMMENT '厂商: ys7/hikvision/dahua',
  `deviceSerial` VARCHAR(128) NOT NULL COMMENT '设备序列号',
  `channelNo` INT(11) NOT NULL DEFAULT 1 COMMENT '通道号',
  `name` VARCHAR(64) DEFAULT NULL COMMENT '摄像头名称',
  `verifyCode` VARCHAR(256) DEFAULT NULL COMMENT '设备验证码, AES加密存储',
  `status` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '状态: 0停用, 1启用',
  `onlineStatus` TINYINT(4) NOT NULL DEFAULT 0 COMMENT '在线状态: 0未知/离线, 1在线',
  `openLive` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '客户是否可看直播',
  `openCapture` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '客户是否可抓图/刷新图片',
  `openPlayback` TINYINT(4) NOT NULL DEFAULT 0 COMMENT '客户是否可看回放',
  `openAlbum` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '客户是否可看图片集/影集',
  `visibleStart` VARCHAR(8) DEFAULT '08:00' COMMENT '每日可见开始时间',
  `visibleEnd` VARCHAR(8) DEFAULT '18:00' COMMENT '每日可见结束时间',
  `company` INT(11) NOT NULL DEFAULT 0 COMMENT '公司',
  `createTime` DATETIME NOT NULL COMMENT '创建时间',
  `updateTime` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`ccid`),
  KEY `idx_camera_orderId` (`orderId`),
  KEY `idx_camera_constructionId` (`constructionId`),
  KEY `idx_camera_provider_device` (`provider`, `deviceSerial`, `channelNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='施工摄像头设备表';

CREATE TABLE IF NOT EXISTS `construction`.`cameramedia` (
  `ccmid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `orderId` VARCHAR(32) NOT NULL COMMENT '装修单号',
  `constructionId` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '施工单ID',
  `cameraId` BIGINT(20) NOT NULL COMMENT '摄像头ID',
  `csid` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '施工节点ID',
  `cnid` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '施工节点类型ID',
  `mediaType` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '媒体类型: 1图片, 2视频',
  `source` TINYINT(4) NOT NULL DEFAULT 0 COMMENT '来源: 0系统, 1客户, 2内部人员, 3定时, 4节点, 5告警',
  `originUrl` VARCHAR(512) DEFAULT NULL COMMENT '厂商原始URL',
  `mediaUrl` VARCHAR(512) NOT NULL COMMENT '系统可访问URL, 后续推荐OSS地址',
  `coverUrl` VARCHAR(512) DEFAULT NULL COMMENT '封面图',
  `captureTime` DATETIME NOT NULL COMMENT '抓图/采集时间',
  `visible` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '客户是否可见',
  `status` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '状态: 0无效, 1有效',
  `company` INT(11) NOT NULL DEFAULT 0 COMMENT '公司',
  `createTime` DATETIME NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`ccmid`),
  KEY `idx_cameramedia_order_time` (`orderId`, `captureTime`),
  KEY `idx_cameramedia_camera_time` (`cameraId`, `captureTime`),
  KEY `idx_cameramedia_node` (`csid`, `cnid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='摄像头图片/视频素材表';

CREATE TABLE IF NOT EXISTS `construction`.`cameraaccess` (
  `ccaid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `orderId` VARCHAR(32) NOT NULL COMMENT '装修单号',
  `cameraId` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '摄像头ID',
  `viewerType` TINYINT(4) NOT NULL COMMENT '访问人类型: 1客户, 2内部员工, 3分享访客',
  `viewerId` VARCHAR(64) DEFAULT NULL COMMENT '客户/员工/openId/unionId/分享标识',
  `action` VARCHAR(32) NOT NULL COMMENT 'live/capture/album/playback/video/share',
  `result` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '结果: 0失败, 1成功',
  `message` VARCHAR(256) DEFAULT NULL COMMENT '失败原因或备注',
  `ip` VARCHAR(64) DEFAULT NULL COMMENT 'IP',
  `userAgent` VARCHAR(256) DEFAULT NULL COMMENT 'User-Agent',
  `createTime` DATETIME NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`ccaid`),
  KEY `idx_cameraaccess_order_time` (`orderId`, `createTime`),
  KEY `idx_cameraaccess_viewer` (`viewerType`, `viewerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='摄像头访问日志表';

-- 配置项样例: 按公司写入真实值, 不要把真实 Secret 提交到仓库。
INSERT IGNORE INTO `communion`.`systemconfig` (`group`, `key`, `value`, `company`, `comment`)
VALUES ('camera', 'YS7_OPEN_HOST_STR', 'https://open.ys7.com', 0, '萤石开放平台API域名');

-- INSERT INTO `communion`.`systemconfig` (`group`, `key`, `value`, `company`, `comment`) VALUES
--   ('camera', 'YS7_APPKEY_STR', '<APP_KEY>', <COMPANY>, '萤石开放平台AppKey'),
--   ('camera', 'YS7_APPSECRET_STR', '<APP_SECRET>', <COMPANY>, '萤石开放平台AppSecret');
