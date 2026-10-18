-- =====================================================================
-- data 库缺失表补建(2026-10-18 排查: dev与生产data库全表差集)
-- =====================================================================
-- 背景: queryBrandInstall/queryBrandServer 生产报 could not execute query,
--   排查发现 data 库整批建表从未在生产执行, dev与生产差集共9张,
--   均为配置/字典类表, 生产从空表起步, 由各管理页面自行配置数据。
-- 来源: dev(5.21)同构SHOW CREATE TABLE, 去AUTO_INCREMENT起点+IF NOT EXISTS。
-- ⚠️ 幂等(IF NOT EXISTS); 纯建表零数据迁移, 免重启免发版。
-- =====================================================================

CREATE TABLE IF NOT EXISTS `data`.`assistance` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `keyword` varchar(32) DEFAULT NULL,
  `atttype` tinyint(1) DEFAULT '0',
  `status` tinyint(1) DEFAULT '0',
  `cuid` int(11) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `data`.`assistanceitem` (
  `aiid` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) DEFAULT NULL,
  `title` varchar(32) DEFAULT NULL,
  `content` varchar(64) DEFAULT NULL,
  `sort` int(4) DEFAULT NULL,
  `ddid` int(11) DEFAULT NULL,
  PRIMARY KEY (`aiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `data`.`branddeliver` (
  `bdid` int(11) NOT NULL AUTO_INCREMENT COMMENT '交付ID',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `cnid` int(11) DEFAULT NULL COMMENT '工程节点ID',
  `workNum` int(11) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0: 启用 , 1: 禁用',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`bdid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌交付表';

CREATE TABLE IF NOT EXISTS `data`.`brandinstall` (
  `biid` int(11) NOT NULL AUTO_INCREMENT COMMENT '安装ID',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `cnid` int(11) DEFAULT NULL COMMENT '工程节点ID',
  `workNum` int(11) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0: 启用 , 1: 禁用',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`biid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='品牌安装表';

CREATE TABLE IF NOT EXISTS `data`.`brandproduct` (
  `bpid` int(11) NOT NULL AUTO_INCREMENT COMMENT '生产ID',
  `bid` int(11) DEFAULT NULL COMMENT '品牌ID',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `cnid` int(11) DEFAULT NULL COMMENT '工程节点ID',
  `workNum` int(11) DEFAULT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL COMMENT '状态 , 0: 启用 , 1: 禁用',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`bpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌生产表';

CREATE TABLE IF NOT EXISTS `data`.`brandserver` (
  `bsid` int(11) NOT NULL AUTO_INCREMENT COMMENT '服务ID',
  `bid` int(11) NOT NULL COMMENT '品牌ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `cnid` int(11) DEFAULT NULL COMMENT '工程节点ID',
  `workNum` int(11) NOT NULL COMMENT '工期',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态 , 0: 启用 , 1: 禁用',
  `comment` varchar(255) DEFAULT NULL COMMENT '说明',
  PRIMARY KEY (`bsid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='品牌服务表';

CREATE TABLE IF NOT EXISTS `data`.`ossconfig` (
  `ossId` int(11) NOT NULL AUTO_INCREMENT COMMENT '储存访问凭证ID',
  `name` varchar(64) NOT NULL,
  `accessKeyId` varchar(128) NOT NULL COMMENT '密钥ID',
  `accessKeySecret` varchar(128) NOT NULL COMMENT '密钥',
  `endpoint` varchar(64) NOT NULL COMMENT '端点',
  `bucket` varchar(32) NOT NULL COMMENT '桶',
  `dir` varchar(32) DEFAULT '' COMMENT '目录',
  `expireTime` int(11) NOT NULL COMMENT '过期时长（秒）',
  `policy` varchar(255) DEFAULT NULL COMMENT '策略',
  `signature` varchar(255) DEFAULT NULL COMMENT '签名',
  `deadline` timestamp NULL DEFAULT NULL COMMENT '截止时间',
  PRIMARY KEY (`ossId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='oss临时访问凭证';

CREATE TABLE IF NOT EXISTS `data`.`quotationnamerule` (
  `qnrid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '规则名称（标准名称）',
  `pinyin` varchar(200) DEFAULT NULL COMMENT '拼音（用于模糊搜索）',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '类型: 0=通用, 其他预留',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序（升序）',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态: 0=启用, 1=禁用',
  `comment` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`qnrid`),
  KEY `idx_type_status` (`type`,`status`),
  KEY `idx_name_type` (`name`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价名称规则';

CREATE TABLE IF NOT EXISTS `data`.`salesmatching` (
  `smid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `onecheck` int(5) NOT NULL DEFAULT '0',
  `twocheck` int(5) NOT NULL DEFAULT '0',
  `thrcheck` int(5) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(256) DEFAULT NULL,
  `company` int(11) DEFAULT NULL,
  PRIMARY KEY (`smid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
