-- ============================================================
-- 阶段3：服务节点/任务参数/任务域常量数据迁移
-- 将 data.json 中的 serviceNodeType/attnode/taskParam*/task* 迁入 communion.constant
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
-- field 命名规范：{类别前缀}_{含义}_{类型后缀}
--   - 数字 key 用 _INT，字符串 key 用 _STR
--   - PO 已有常量名优先沿用（如 ServiceNodePO.SERVICE_TYPE_DECORTAION_INT）
--   - field 在前端被用作常量标识符（constant.js: constant[module][clazz][field]=key），
--     便于前端以 constant.data().serviceNode.SERVICE_TYPE_DECORTAION_INT 形式做值比较
--
-- 可重入：DELETE + INSERT
-- ============================================================

USE `communion`;

-- ============ data.serviceNode.type（服务节点类型） ============
-- 沿用 ServiceNodePO 常量名 SERVICE_TYPE_*_INT
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('装修','data','serviceNode','type','SERVICE_TYPE_DECORTAION_INT','0','装修',0),
('主材','data','serviceNode','type','SERVICE_TYPE_MATERIAL_INT','1','主材',0),
('工程','data','serviceNode','type','SERVICE_TYPE_CONSTRUCTION_INT','2','工程',0);

-- ============ data.serviceNode.attnode（服务节点关注节点） ============
-- ServiceNodePO 无 attnode 取值常量，按含义补造
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='attnode';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('创建','data','serviceNode','attnode','ATTNODE_CREATE_INT','0','创建',0),
('预签','data','serviceNode','attnode','ATTNODE_PRESIGN_INT','1','预签',0),
('签单','data','serviceNode','attnode','ATTNODE_SIGN_INT','2','签单',0),
('付款','data','serviceNode','attnode','ATTNODE_PAYMENT_INT','3','付款',0);

-- ============ data.task.level（任务等级） ============
-- 沿用 TaskPO 常量名；PO 中 LEVEL_MODEL_INT 误写为 0（应为 1），此处按 DB 真实 key
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='task' AND `type`='level';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('功能级','data','task','level','LEVEL_FUNCTION_INT','0','功能级',0),
('模块级','data','task','level','LEVEL_MODEL_INT','1','模块级',0);

-- ============ data.task.isShow（任务是否显示） ============
-- TaskPO 仅有 SHOW_ABLE_INT=0，补造不显示项
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='task' AND `type`='isShow';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('显示','data','task','isShow','SHOW_ABLE_INT','0','显示',0),
('不显示','data','task','isShow','SHOW_UNABLE_INT','1','不显示',0);

-- ============ data.taskParam.type（任务参数类型） ============
-- TaskParamPO 无 type 取值常量，按含义补造
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='taskParam' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('字段','data','taskParam','type','TYPE_FIELD_INT','0','字段',0),
('条件','data','taskParam','type','TYPE_CONDITION_INT','1','条件',0);

-- ============ data.taskParam.ismain（任务参数主次） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='taskParam' AND `type`='ismain';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('主要','data','taskParam','ismain','ISMAIN_MAIN_INT','0','主要',0),
('不主要','data','taskParam','ismain','ISMAIN_UNMAIN_INT','1','不主要',0);

-- ============ data.taskParam.oneType（任务参数一类） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='taskParam' AND `type`='oneType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('文本','data','taskParam','oneType','ONETYPE_TEXT_INT','0','文本',0),
('数值','data','taskParam','oneType','ONETYPE_NUMBER_INT','1','数值',0);

-- ============ data.taskParam.module（任务参数所属模块） ============
-- 原 data.json 结构为 {module,name}，constant 表统一为 key/value
-- key 为英文字符串，field 后缀 _STR
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='taskParam' AND `type`='module';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('装修','data','taskParam','module','MODULE_DECORATION_STR','decoration','装修',0),
('款项','data','taskParam','module','MODULE_PAYMENT_STR','payment','款项',0),
('销售','data','taskParam','module','MODULE_SALES_STR','sales','销售',0),
('仓储','data','taskParam','module','MODULE_INVENTORY_STR','inventory','仓储',0),
('工程','data','taskParam','module','MODULE_CONSTRUCTION_STR','construction','工程',0);
