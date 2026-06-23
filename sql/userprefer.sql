CREATE TABLE `communion`.`userprefer` (
  `upid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户偏好ID',
  `userId` varchar(32) NOT NULL COMMENT '用户编号',
  `module` varchar(64) NOT NULL COMMENT '模块',
  `page` varchar(128) NOT NULL COMMENT '页面标识',
  `pkey` varchar(64) NOT NULL COMMENT '偏好键',
  `pvalue` varchar(255) DEFAULT NULL COMMENT '偏好值',
  `company` int(11) NOT NULL COMMENT '公司',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`upid`),
  UNIQUE KEY `unique_userprefer` (`userId`, `module`, `page`, `pkey`, `company`),
  KEY `index_userprefer_userId` (`userId`),
  KEY `index_userprefer_page` (`module`, `page`, `pkey`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户偏好';
