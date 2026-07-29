-- 报价名称规则表
-- 库: data
-- 全集团共用，无company字段
CREATE TABLE `quotationnamingrule` (
  `qnrid` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '规则名称（标准名称）',
  `pinyin` varchar(200) DEFAULT NULL COMMENT '拼音（用于模糊搜索）',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '类型: 3=附加项, 其他预留',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态: 0=启用, 1=禁用',
  `comment` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`qnrid`),
  KEY `idx_type_status` (`type`, `status`),
  KEY `idx_name_type` (`name`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价名称规则';

-- 初始数据: 附加项名称规则 (type=3)
-- 拼音格式: 连写全拼 (与 PinYin4Util.getPinyin 产出一致, 便于前缀模糊搜索)
INSERT INTO `quotationnamingrule` (`name`, `pinyin`, `type`, `sort`, `status`, `comment`) VALUES
('垃圾清运费', 'lajiqingyunfei', 3, 1, 0, '垃圾清运'),
('材料搬运费', 'cailiaobanyunfei', 3, 2, 0, '材料搬运上楼'),
('成品保护费', 'chengpinbaohufei', 3, 3, 0, '成品保护'),
('水电增补费', 'shuidianzengbufei', 3, 4, 0, '水电改造增补'),
('防水增补费', 'fangshuizengbufei', 3, 5, 0, '防水工程增补'),
('设计变更费', 'shejibiangefei', 3, 6, 0, '设计变更产生的附加费'),
('工期加急费', 'gongqijiajifei', 3, 7, 0, '工期加急'),
('高空作业费', 'gaokongzuoyefei', 3, 8, 0, '高空作业附加'),
('夜间施工费', 'yejianshigongfei', 3, 9, 0, '夜间施工附加');

-- 历史数据迁移: 将旧的带空格全拼统一为连写全拼
-- 适用场景: 升级到连写全拼后, 修复已存在的 pinyin 数据
UPDATE `quotationnamingrule` SET `pinyin` = REPLACE(`pinyin`, ' ', '') WHERE `pinyin` LIKE '% %';
