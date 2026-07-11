-- ============================================================
-- 阶段4：签章/图表/谈单/辅材/聊天域常量数据迁移
-- 将 data.json 中的 signet*/chart*/talking*/aoodsAtttype/chating* 迁入 communion.constant
--
-- 说明：
--   - signetStatus（初始/注册/认证/确认/签章/作废）、signetType（合同/款项/人资/厂商）
--   - chartType（装修/销售/工程/款项）、chartLevel（集团/公司/大区/部门）
--   - talkingType（工程补充条款/工程追加条款/...）共10条
--   - aoodsAtttype（标准/外辅）
--   - chatingType（文本/应用）、chatingAtttype（客户/装修/主材/工程/款项/其他）
--   - chatingStatus（启用/禁用）复用 data.common.status，此处不建
--   - talkingStatus（启用/禁用）复用 data.common.status，阶段1已处理
--
-- 可重入：DELETE + INSERT
-- ============================================================

USE `communion`;

-- ============ data.signet.status（签章状态） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='signet' AND `type`='status';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('初始','data','signet','status','status','0','初始',0),
('注册','data','signet','status','status','1','注册',0),
('认证','data','signet','status','status','2','认证',0),
('确认','data','signet','status','status','3','确认',0),
('签章','data','signet','status','status','4','签章',0),
('作废','data','signet','status','status','5','作废',0);

-- ============ data.signet.type（签章类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='signet' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('合同','data','signet','type','type','0','合同',0),
('款项','data','signet','type','type','1','款项',0),
('人资','data','signet','type','type','2','人资',0),
('厂商','data','signet','type','type','3','厂商',0);

-- ============ data.chart.type（图表类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='chart' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('装修','data','chart','type','type','1','装修',0),
('销售','data','chart','type','type','2','销售',0),
('工程','data','chart','type','type','3','工程',0),
('款项','data','chart','type','type','4','款项',0);

-- ============ data.chart.level（图表等级） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='chart' AND `type`='level';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('集团','data','chart','level','level','0','集团',0),
('公司','data','chart','level','level','1','公司',0),
('大区','data','chart','level','level','2','大区',0),
('部门','data','chart','level','level','3','部门',0);

-- ============ data.talking.type（谈单类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='talking' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('工程补充条款','data','talking','type','type','0','工程补充条款',0),
('工程追加条款','data','talking','type','type','1','工程追加条款',0),
('未含项目','data','talking','type','type','2','未含项目',0),
('工程活动优惠','data','talking','type','type','3','工程活动优惠',0),
('主材活动优惠','data','talking','type','type','4','主材活动优惠',0),
('其他','data','talking','type','type','5','其他',0),
('主材打印说明','data','talking','type','type','6','主材打印说明',0),
('决算打印说明','data','talking','type','type','7','决算打印说明',0),
('国补打印说明','data','talking','type','type','8','国补打印说明',0),
('结算销售打印','data','talking','type','type','9','结算销售打印',0);

-- ============ data.aoods.atttype（辅材归属类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='aoods' AND `type`='atttype';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('标准','data','aoods','atttype','atttype','0','标准',0),
('外辅','data','aoods','atttype','atttype','1','外辅',0);

-- ============ data.chating.type（聊天类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='chating' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('文本','data','chating','type','type','0','文本',0),
('应用','data','chating','type','type','2','应用',0);

-- ============ data.chating.atttype（聊天归属类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='chating' AND `type`='atttype';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('客户','data','chating','atttype','atttype','0','客户',0),
('装修','data','chating','atttype','atttype','1','装修',0),
('主材','data','chating','atttype','atttype','2','主材',0),
('工程','data','chating','atttype','atttype','3','工程',0),
('款项','data','chating','atttype','atttype','4','款项',0),
('其他','data','chating','atttype','atttype','5','其他',0);
