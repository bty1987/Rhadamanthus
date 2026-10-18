-- =====================================================================
-- data.brandinstall 品牌安装表建表(生产缺失补建)
-- =====================================================================
-- 背景: 品牌安装功能(data模块 BrandInstallAction/Service/Dao/PO)自
--       v8.3.013.018 起随 jar 发版, 但生产 data 库从未建表——打开品牌
--       安装管理页即抛 could not execute query
--       (生产实证 2026-10-18 11:20 FL-22625, BrandInstallDaoImpl:23)。
--       dev(5.21)同结构表在且功能正常(7行配置数据)。
-- 修复: 按dev库同构建表(IF NOT EXISTS幂等); 生产从空表起步, 由业务在
--       品牌安装页面配置数据。
-- ⚠️ 纯建表, 零数据迁移, 幂等可重复执行; 无需重启/发版。
-- 核验: 建表后重新打开品牌安装页面, 不再报错且列表为空;
--   SHOW TABLES FROM data LIKE 'brandinstall';
-- =====================================================================

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
