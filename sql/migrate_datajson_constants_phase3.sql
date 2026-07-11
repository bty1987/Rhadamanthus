-- ============================================================
-- 阶段3：服务节点/任务参数/任务域常量数据迁移（field 语义化修正版）
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
-- 本脚本为 field 修正版：数据已通过初版 DELETE+INSERT 入生产库，
-- 此处改为 UPDATE 精确修正 field 列，可重入。
-- ============================================================

USE `communion`;

-- ============ data.serviceNode.type（服务节点类型） ============
-- 沿用 ServiceNodePO 常量名 SERVICE_TYPE_*_INT
UPDATE `constant` SET `field`='SERVICE_TYPE_DECORTAION_INT'   WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='type' AND `key`='0';
UPDATE `constant` SET `field`='SERVICE_TYPE_MATERIAL_INT'     WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='type' AND `key`='1';
UPDATE `constant` SET `field`='SERVICE_TYPE_CONSTRUCTION_INT' WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='type' AND `key`='2';

-- ============ data.serviceNode.attnode（服务节点关注节点） ============
-- ServiceNodePO 无 attnode 取值常量，按含义补造
UPDATE `constant` SET `field`='ATTNODE_CREATE_INT'  WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='attnode' AND `key`='0';
UPDATE `constant` SET `field`='ATTNODE_PRESIGN_INT' WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='attnode' AND `key`='1';
UPDATE `constant` SET `field`='ATTNODE_SIGN_INT'    WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='attnode' AND `key`='2';
UPDATE `constant` SET `field`='ATTNODE_PAYMENT_INT' WHERE `module`='data' AND `clazz`='serviceNode' AND `type`='attnode' AND `key`='3';

-- ============ data.task.level（任务等级） ============
-- 沿用 TaskPO 常量名；PO 中 LEVEL_MODEL_INT 误写为 0（应为 1），此处按 DB 真实 key 修正
UPDATE `constant` SET `field`='LEVEL_FUNCTION_INT' WHERE `module`='data' AND `clazz`='task' AND `type`='level' AND `key`='0';
UPDATE `constant` SET `field`='LEVEL_MODEL_INT'    WHERE `module`='data' AND `clazz`='task' AND `type`='level' AND `key`='1';

-- ============ data.task.isShow（任务是否显示） ============
-- TaskPO 仅有 SHOW_ABLE_INT=0，补造不显示项
UPDATE `constant` SET `field`='SHOW_ABLE_INT'   WHERE `module`='data' AND `clazz`='task' AND `type`='isShow' AND `key`='0';
UPDATE `constant` SET `field`='SHOW_UNABLE_INT' WHERE `module`='data' AND `clazz`='task' AND `type`='isShow' AND `key`='1';

-- ============ data.taskParam.type（任务参数类型） ============
-- TaskParamPO 无 type 取值常量，按含义补造
UPDATE `constant` SET `field`='TYPE_FIELD_INT'     WHERE `module`='data' AND `clazz`='taskParam' AND `type`='type' AND `key`='0';
UPDATE `constant` SET `field`='TYPE_CONDITION_INT' WHERE `module`='data' AND `clazz`='taskParam' AND `type`='type' AND `key`='1';

-- ============ data.taskParam.ismain（任务参数主次） ============
UPDATE `constant` SET `field`='ISMAIN_MAIN_INT'   WHERE `module`='data' AND `clazz`='taskParam' AND `type`='ismain' AND `key`='0';
UPDATE `constant` SET `field`='ISMAIN_UNMAIN_INT' WHERE `module`='data' AND `clazz`='taskParam' AND `type`='ismain' AND `key`='1';

-- ============ data.taskParam.oneType（任务参数一类） ============
UPDATE `constant` SET `field`='ONETYPE_TEXT_INT'   WHERE `module`='data' AND `clazz`='taskParam' AND `type`='oneType' AND `key`='0';
UPDATE `constant` SET `field`='ONETYPE_NUMBER_INT' WHERE `module`='data' AND `clazz`='taskParam' AND `type`='oneType' AND `key`='1';

-- ============ data.taskParam.module（任务参数所属模块） ============
-- 原 data.json 结构为 {module,name}，constant 表统一为 key/value
-- key 为英文字符串，field 后缀 _STR
UPDATE `constant` SET `field`='MODULE_DECORATION_STR'   WHERE `module`='data' AND `clazz`='taskParam' AND `type`='module' AND `key`='decoration';
UPDATE `constant` SET `field`='MODULE_PAYMENT_STR'     WHERE `module`='data' AND `clazz`='taskParam' AND `type`='module' AND `key`='payment';
UPDATE `constant` SET `field`='MODULE_SALES_STR'       WHERE `module`='data' AND `clazz`='taskParam' AND `type`='module' AND `key`='sales';
UPDATE `constant` SET `field`='MODULE_INVENTORY_STR'   WHERE `module`='data' AND `clazz`='taskParam' AND `type`='module' AND `key`='inventory';
UPDATE `constant` SET `field`='MODULE_CONSTRUCTION_STR' WHERE `module`='data' AND `clazz`='taskParam' AND `type`='module' AND `key`='construction';
