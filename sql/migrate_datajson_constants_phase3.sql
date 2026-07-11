-- ============================================================
-- 阶段3：服务节点/任务参数/任务域常量数据迁移
-- 将 data.json 中的 serviceNodeType/attnode/taskParam*/task*/ 迁入 communion.constant
--
-- 说明：
--   - category.type（标准/统计）：生产库已有 data.category.type，无需新增
--   - decorationMatching.vision（报价折扣/计算/生成款项/决算计算）：已有，无需新增
--   - price ctypes（底价/点位）：已有 data.price.ctype，无需新增
--   - taskParamStatus：data.json 有重复定义（有效/无效 vs 启用/禁用），
--     JSON 同名 key 后者覆盖，实际生效为"启用/禁用"，统一用 data.common.status（阶段1）
--     此处不再为 taskParam 建独立 status，前端直接引用 common.status
--   - taskParamModule：原结构 {module,name}，统一为 key/value
--
-- 可重入：DELETE + INSERT
-- ============================================================

USE `communion`;

-- ============ data.serviceNode.type（服务节点类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('装修','data','serviceNode','type','type','0','装修',0),
('主材','data','serviceNode','type','type','1','主材',0),
('工程','data','serviceNode','type','type','2','工程',0);

-- ============ data.serviceNode.attnode（服务节点关注节点） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='attnode';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('创建','data','serviceNode','attnode','attnode','0','创建',0),
('预签','data','serviceNode','attnode','attnode','1','预签',0),
('签单','data','serviceNode','attnode','attnode','2','签单',0),
('付款','data','serviceNode','attnode','attnode','3','付款',0);

-- ============ data.task.level（任务等级） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='task' AND `type`='level';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('功能级','data','task','level','level','0','功能级',0),
('模块级','data','task','level','level','1','模块级',0);

-- ============ data.task.isShow（任务是否显示） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='task' AND `type`='isShow';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('显示','data','task','isShow','isShow','0','显示',0),
('不显示','data','task','isShow','isShow','1','不显示',0);

-- ============ data.taskParam.type（任务参数类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='taskParam' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('字段','data','taskParam','type','type','0','字段',0),
('条件','data','taskParam','type','type','1','条件',0);

-- ============ data.taskParam.ismain（任务参数主次） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='taskParam' AND `type`='ismain';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('主要','data','taskParam','ismain','ismain','0','主要',0),
('不主要','data','taskParam','ismain','ismain','1','不主要',0);

-- ============ data.taskParam.oneType（任务参数一类） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='taskParam' AND `type`='oneType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('文本','data','taskParam','oneType','oneType','0','文本',0),
('数值','data','taskParam','oneType','oneType','1','数值',0);

-- ============ data.taskParam.module（任务参数所属模块） ============
-- 原 data.json 结构为 {module,name}，constant 表统一为 key/value
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='taskParam' AND `type`='module';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('装修','data','taskParam','module','module','decoration','装修',0),
('款项','data','taskParam','module','module','payment','款项',0),
('销售','data','taskParam','module','module','sales','销售',0),
('仓储','data','taskParam','module','module','inventory','仓储',0),
('工程','data','taskParam','module','module','construction','工程',0);
