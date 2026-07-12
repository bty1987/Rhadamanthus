-- ============================================================================
-- 报价名称规则表（quotationnamerule）
-- ============================================================================
-- 库  : data
-- 说明: 全集团共用，无 company 字段；与 quotationnamingrule 区分，
--       本表用于维护"报价名称"维度的统一规则字典（如标准名称、拼音、排序、启用状态）。
-- 命名约定参考: decorationmeasurerule / quotationnamingrule
-- ============================================================================
CREATE TABLE IF NOT EXISTS `quotationnamerule` (
  `qnrid`   bigint(20)   NOT NULL AUTO_INCREMENT              COMMENT '主键ID',
  `name`    varchar(100) NOT NULL                             COMMENT '规则名称（标准名称）',
  `pinyin`  varchar(200) DEFAULT NULL                         COMMENT '拼音（用于模糊搜索）',
  `type`    tinyint(4)   NOT NULL DEFAULT '0'                 COMMENT '类型: 0=通用, 其他预留',
  `sort`    int(11)      NOT NULL DEFAULT '0'                 COMMENT '排序（升序）',
  `status`  tinyint(4)   NOT NULL DEFAULT '0'                 COMMENT '状态: 0=启用, 1=禁用',
  `comment` varchar(200) DEFAULT NULL                         COMMENT '备注',
  PRIMARY KEY (`qnrid`),
  KEY `idx_type_status` (`type`, `status`),
  KEY `idx_name_type`   (`name`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价名称规则';

-- ============================================================================
-- 初始数据（可选）：通用名称规则示例（type=0）
-- ============================================================================
INSERT INTO `quotationnamerule` (`name`, `pinyin`, `type`, `sort`, `status`, `comment`) VALUES
('基础装修',     'jichu zhuangxiu',     0, 1, 0, '基础装修报价名称'),
('主材代购',     'zhucai daigou',       0, 2, 0, '主材代购报价名称'),
('软装配套',     'ruanzhuang peitao',   0, 3, 0, '软装配套报价名称'),
('家具家电',     'jiaju jiadian',       0, 4, 0, '家具家电报价名称'),
('智能家居',     'zhineng jiaju',       0, 5, 0, '智能家居报价名称');
