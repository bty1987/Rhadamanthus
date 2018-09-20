CREATE DATABASE IF NOT EXISTS `customer`;
USE `customer`;

DROP TABLE IF EXISTS `decoration`;
CREATE TABLE `decoration`  (
  `doId` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `orderId` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `address` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `defaultFlag` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`doId`) USING BTREE,
  INDEX `indexone`(`unionId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户订单信息' ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `emember`;
CREATE TABLE `emember`  (
  `emid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `phone` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `address` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `unionId` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ticket` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`emid`) USING BTREE,
  UNIQUE INDEX `uniqueone`(`no`) USING BTREE,
  INDEX `indexone`(`unionId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '电子会员' ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback`  (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `createTime` bigint(20) NULL DEFAULT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '类型 , 0:微信',
  `picture` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`fid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '反馈信息表' ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group`  (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `opengid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `orderId` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `content` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`gid`) USING BTREE,
  INDEX `indexone`(`opengid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '群信息' ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `groupuser`;
CREATE TABLE `groupuser`  (
  `guid` int(11) NOT NULL AUTO_INCREMENT,
  `openGid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `uid` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`guid`) USING BTREE,
  INDEX `indexone`(`openGid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '群用户信息' ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `decorationcircle`;
CREATE TABLE `decorationcircle`  (
  `dcid` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `cuid` int(11) NOT NULL,
  `content` varchar(255),
  `createTime` timestamp NOT NULL,
  `like` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`dcid`),
  INDEX `oneindex`(`orderId`) USING BTREE
)ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '服务圈' ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `decorationcirclepicture`;
CREATE TABLE `decorationcirclepicture`  (
  `dcpid` int(11) NOT NULL AUTO_INCREMENT,
  `dcid` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`dcpid`),
  INDEX `oneindex`(`dcid`) USING BTREE
)ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '服务圈图片' ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `decorationcirclebackground`;
CREATE TABLE `decorationcirclebackground`  (
  `dcbid` int(11) NOT NULL AUTO_INCREMENT,
  `unionId` varchar(64) NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`dcbid`),
  UNIQUE INDEX `oneindex`(`unionId`) USING BTREE
)ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '服务圈背景图片' ROW_FORMAT = Compact;