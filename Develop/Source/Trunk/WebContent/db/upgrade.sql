CREATE DATABASE  IF NOT EXISTS `upgrade`;
USE `upgrade`;

DROP TABLE IF EXISTS `upgrade`;

CREATE TABLE `upgrade` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `no` varchar(64) NOT NULL,
  `trialno` varchar(64) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `content` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `filesize` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8 COMMENT='更新版本表';

DROP TABLE IF EXISTS `version`;
CREATE TABLE `version` (
  `vid` int(11) NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `no` varchar(64) NOT NULL COMMENT '版本编号',
  `createTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建事件',
  `comment` text NOT NULL COMMENT '更新说明',
  `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;