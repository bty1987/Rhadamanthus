-- ============================================================
-- 32_materialplan_create.sql 主材计划两表建表 (test环境补建, 生产勿需已存在)
-- 用途: 主材计划功能(construction.MaterialPlanAction族)依赖两表: construction.materialplan(订单级实例)/data.materialplannode(公司级规则字典); test库缺表致页面/Table construction.materialplan does not exist 报错(2026-11-09 test实证补建)
-- 前置: 无; IF NOT EXISTS 幂等, 已有表零影响
-- 回滚: DROP TABLE(空表起步, 无数据风险)
-- 验证: SELECT table_schema, table_name FROM information_schema.tables WHERE table_name IN ('materialplan','materialplannode'); 应2行
-- ============================================================
CREATE TABLE IF NOT EXISTS `construction`.`materialplan` (
  `mpid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cid` bigint(20) NOT NULL DEFAULT '0' COMMENT '工程id(construction.construction.cid, 生成时取自schedule行)',
  `orderId` varchar(16) NOT NULL COMMENT '装修单号',
  `ruleId` bigint(20) NOT NULL DEFAULT '0' COMMENT '来源规则mpnid, 手工添加行=0',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '维度快照: 0品类 1品牌',
  `categoryId` bigint(20) NOT NULL DEFAULT '0' COMMENT '品类id快照',
  `categoryName` varchar(64) NOT NULL DEFAULT '' COMMENT '品类名快照(品牌行=品牌所属品类)',
  `brandId` bigint(20) NOT NULL DEFAULT '0' COMMENT '品牌id快照(品类行=0)',
  `brandName` varchar(64) NOT NULL DEFAULT '' COMMENT '品牌名快照(品类行=空)',
  `cnid` bigint(20) NOT NULL COMMENT '锚点施工节点id',
  `nodeName` varchar(64) NOT NULL DEFAULT '' COMMENT '节点名快照(优先取该单schedule.name)',
  `action` tinyint(4) NOT NULL DEFAULT '0' COMMENT '动作快照: 0下单 1配送 2到货',
  `anchor` tinyint(4) NOT NULL DEFAULT '0' COMMENT '锚点快照: 0计划开工 1计划完工 2实际开工 3实际完工',
  `offsetDay` int(11) NOT NULL DEFAULT '0' COMMENT '偏移天数快照',
  `manualTime` datetime DEFAULT NULL COMMENT '手工指定的计划时点(NULL=按锚点+偏移推算)',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未完成 1已完成(手工) 2已取消',
  `actualTime` datetime DEFAULT NULL COMMENT '手工完成时间',
  `operater` bigint(20) NOT NULL DEFAULT '0' COMMENT '操作人uid(完成/取消)',
  `comment` varchar(128) NOT NULL DEFAULT '' COMMENT '说明',
  `company` int(11) NOT NULL DEFAULT '0' COMMENT '公司快照(生成时取decoration.company)',
  `createTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`mpid`),
  KEY `idx_orderId` (`orderId`),
  KEY `idx_company_status` (`company`,`status`),
  KEY `idx_cnid` (`cnid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='主材计划表(订单级实例)';

CREATE TABLE IF NOT EXISTS `data`.`materialplannode` (
  `mpnid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '维度: 0品类 1品牌',
  `cid` bigint(20) NOT NULL DEFAULT '0' COMMENT '品类id(communion.category.cid), type=0时有效',
  `bid` bigint(20) NOT NULL DEFAULT '0' COMMENT '品牌id(communion.brand.bid), type=1时有效',
  `categoryName` varchar(64) NOT NULL DEFAULT '' COMMENT '品类名快照',
  `brandName` varchar(64) NOT NULL DEFAULT '' COMMENT '品牌名快照',
  `cnid` bigint(20) NOT NULL COMMENT '锚点施工节点(data.constructionnode.cnid)',
  `nodeName` varchar(64) NOT NULL DEFAULT '' COMMENT '节点名快照',
  `action` tinyint(4) NOT NULL DEFAULT '0' COMMENT '动作: 0下单 1配送 2到货',
  `anchor` tinyint(4) NOT NULL DEFAULT '0' COMMENT '锚点: 0计划开工 1计划完工 2实际开工 3实际完工',
  `offsetDay` int(11) NOT NULL DEFAULT '0' COMMENT '偏移天数: 负=锚点前N天 0=当日 正=锚点后N天',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0启用 1停用',
  `comment` varchar(128) NOT NULL DEFAULT '' COMMENT '说明',
  `creater` bigint(20) NOT NULL DEFAULT '0' COMMENT '创建人uid',
  `company` int(11) NOT NULL DEFAULT '0' COMMENT '公司cid',
  `createTime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`mpnid`),
  KEY `idx_company_status` (`company`,`status`),
  KEY `idx_cnid` (`cnid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='主材计划规则表(公司级字典)';
