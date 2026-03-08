-- ============================================
-- 创建标准工期定额表 (data.normtime)
-- 参考 data.normrice 结构，删除 salary/stuff，增加 workdays 字段
-- ============================================

CREATE TABLE IF NOT EXISTS `data`.`normtime` (
  `ntid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '定额工期ID',
  `qiid` BIGINT(20) DEFAULT NULL COMMENT '关联报价项ID',
  `cnid` BIGINT(20) DEFAULT NULL COMMENT '关联施工节点ID',
  `unit` VARCHAR(50) DEFAULT NULL COMMENT '计量单位',
  `trannum` INT(11) DEFAULT 0 COMMENT '转化数量',
  `workdays` DECIMAL(10,2) DEFAULT 0.00 COMMENT '工时天数',
  `status` SMALLINT(6) DEFAULT 0 COMMENT '状态（0:有效, 1:无效）',
  PRIMARY KEY (`ntid`),
  KEY `idx_qiid` (`qiid`),
  KEY `idx_cnid` (`cnid`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标准工期定额表';

-- ============================================
-- 创建报价单工期明细表 (quotation.normtimeitem)
-- 参考 quotation.normriceitem 结构，删除 salary，增加 workdays 字段
-- ============================================

CREATE TABLE IF NOT EXISTS `quotation`.`normtimeitem` (
  `ntiid` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '工期明细ID',
  `qid` BIGINT(20) DEFAULT NULL COMMENT '报价单ID',
  `sid` BIGINT(20) DEFAULT NULL COMMENT '报价版本ID',
  `areald` BIGINT(20) DEFAULT NULL COMMENT '功能区ID',
  `quoteld` BIGINT(20) DEFAULT NULL COMMENT '报价项ID',
  `qiid` BIGINT(20) DEFAULT NULL COMMENT '报价子项ID',
  `ntid` BIGINT(20) DEFAULT NULL COMMENT '关联标准工期定额ID',
  `type` SMALLINT(6) DEFAULT 0 COMMENT '类型（0:报价, 1:增项, 2:增减, 3:定额）',
  `normtype` SMALLINT(6) DEFAULT 0 COMMENT '定额类型（0:工期, 1:附加）',
  `atttype` SMALLINT(6) DEFAULT 0 COMMENT '属性类型（0:计入, 1:扣减）',
  `cnid` BIGINT(20) DEFAULT NULL COMMENT '施工节点ID',
  `name` VARCHAR(255) DEFAULT NULL COMMENT '项目名称',
  `unit` VARCHAR(50) DEFAULT NULL COMMENT '计量单位',
  `trannum` INT(11) DEFAULT 0 COMMENT '转化数量',
  `workdays` DECIMAL(10,2) DEFAULT 0.00 COMMENT '工时天数',
  `num` INT(11) DEFAULT 0 COMMENT '数量',
  `status` SMALLINT(6) DEFAULT 0 COMMENT '状态（0:初始, 1:禁用）',
  PRIMARY KEY (`ntiid`),
  KEY `idx_qid` (`qid`),
  KEY `idx_sid` (`sid`),
  KEY `idx_areald` (`areald`),
  KEY `idx_qiid` (`qiid`),
  KEY `idx_ntid` (`ntid`),
  KEY `idx_cnid` (`cnid`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价单工期明细表';
