-- =============================================
-- 其他销售单项目明细表 (oalesitem)
-- 对应实体: OalesItemPO.java
-- 职责: 存储外销单的商品明细信息
-- =============================================

USE `sales`;

-- 删除已存在的表（如果需要）
DROP TABLE IF EXISTS `oalesitem`;

-- 创建表
CREATE TABLE `oalesitem` (
  `oiid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `oid` int(11) NOT NULL COMMENT '外销单ID（关联oales.oid）',
  `name` varchar(200) NOT NULL COMMENT '商品名称',
  `format` varchar(100) DEFAULT NULL COMMENT '规格',
  `color` varchar(100) DEFAULT NULL COMMENT '颜色',
  `model` varchar(100) DEFAULT NULL COMMENT '型号',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '价格（单位：分）',
  `num` bigint(10) NOT NULL DEFAULT '0' COMMENT '数量',
  `total` bigint(10) NOT NULL DEFAULT '0' COMMENT '小计（价格×数量，单位：分）',
  `comment` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`oiid`),
  KEY `index_oid` (`oid`) COMMENT '外销单ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='外销单项目明细表';

-- 添加外键约束（可选，根据实际需求决定是否启用）
-- ALTER TABLE `oalesitem`
--   ADD CONSTRAINT `fk_oalesitem_oid` FOREIGN KEY (`oid`) REFERENCES `oales` (`oid`) ON DELETE CASCADE;
