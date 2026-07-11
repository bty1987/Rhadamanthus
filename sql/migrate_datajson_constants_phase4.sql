-- ============================================================
-- 阶段4：签章/图表/谈单/辅材/聊天域常量数据迁移（field 语义化修正版）
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
-- field 命名规范：{类别前缀}_{含义}_{类型后缀}
--   - 数字 key 用 _INT，字符串 key 用 _STR
--   - PO 已有常量名优先沿用（如 SignetPO.STATUS_INIT_INT）
--   - PO 无常量或 PO 常量缺失的项，按规则补造
--   - field 在前端被用作常量标识符（constant.js: constant[module][clazz][field]=key），
--     便于前端以 constant.data().signet.STATUS_INIT_INT 形式做值比较
--
-- 本脚本为 field 修正版：数据已通过初版 DELETE+INSERT 入生产库，
-- 此处改为 UPDATE 精确修正 field 列，可重入。
-- ============================================================

USE `communion`;

-- ============ data.signet.status（签章状态） ============
-- 沿用 SignetPO 常量名；PO 缺 key=4（签章）常量，补造 STATUS_SIGN_INT
UPDATE `constant` SET `field`='STATUS_INIT_INT'    WHERE `module`='data' AND `clazz`='signet' AND `type`='status' AND `key`='0';
UPDATE `constant` SET `field`='STATUS_REGIST_INT'  WHERE `module`='data' AND `clazz`='signet' AND `type`='status' AND `key`='1';
UPDATE `constant` SET `field`='STATUS_AUTH_INT'    WHERE `module`='data' AND `clazz`='signet' AND `type`='status' AND `key`='2';
UPDATE `constant` SET `field`='STATUS_CONFIRM_INT' WHERE `module`='data' AND `clazz`='signet' AND `type`='status' AND `key`='3';
UPDATE `constant` SET `field`='STATUS_SIGN_INT'    WHERE `module`='data' AND `clazz`='signet' AND `type`='status' AND `key`='4';
UPDATE `constant` SET `field`='STATUS_CANCEL_INT'  WHERE `module`='data' AND `clazz`='signet' AND `type`='status' AND `key`='5';

-- ============ data.signet.type（签章类型） ============
-- SignetPO 无 type 取值常量，按含义补造
UPDATE `constant` SET `field`='TYPE_CONTRACT_INT' WHERE `module`='data' AND `clazz`='signet' AND `type`='type' AND `key`='0';
UPDATE `constant` SET `field`='TYPE_PAYMENT_INT'  WHERE `module`='data' AND `clazz`='signet' AND `type`='type' AND `key`='1';
UPDATE `constant` SET `field`='TYPE_HR_INT'       WHERE `module`='data' AND `clazz`='signet' AND `type`='type' AND `key`='2';
UPDATE `constant` SET `field`='TYPE_VENDER_INT'   WHERE `module`='data' AND `clazz`='signet' AND `type`='type' AND `key`='3';

-- ============ data.chart.type（图表类型） ============
-- ChartPO 无取值常量，按含义补造
UPDATE `constant` SET `field`='TYPE_DECORATION_INT'    WHERE `module`='data' AND `clazz`='chart' AND `type`='type' AND `key`='1';
UPDATE `constant` SET `field`='TYPE_SALES_INT'         WHERE `module`='data' AND `clazz`='chart' AND `type`='type' AND `key`='2';
UPDATE `constant` SET `field`='TYPE_CONSTRUCTION_INT'  WHERE `module`='data' AND `clazz`='chart' AND `type`='type' AND `key`='3';
UPDATE `constant` SET `field`='TYPE_PAYMENT_INT'       WHERE `module`='data' AND `clazz`='chart' AND `type`='type' AND `key`='4';

-- ============ data.chart.level（图表等级） ============
-- ChartPO 无取值常量，按含义补造
UPDATE `constant` SET `field`='LEVEL_GROUP_INT'   WHERE `module`='data' AND `clazz`='chart' AND `type`='level' AND `key`='0';
UPDATE `constant` SET `field`='LEVEL_COMPANY_INT' WHERE `module`='data' AND `clazz`='chart' AND `type`='level' AND `key`='1';
UPDATE `constant` SET `field`='LEVEL_REGION_INT'  WHERE `module`='data' AND `clazz`='chart' AND `type`='level' AND `key`='2';
UPDATE `constant` SET `field`='LEVEL_DEPT_INT'    WHERE `module`='data' AND `clazz`='chart' AND `type`='level' AND `key`='3';

-- ============ data.talking.type（谈单类型） ============
-- TalkingPO 仅有 status 取值常量，type 无常量；按 value 关键词补造
UPDATE `constant` SET `field`='TYPE_SUPPLEMENTAL_INT'           WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='0';
UPDATE `constant` SET `field`='TYPE_ADDITIONAL_INT'             WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='1';
UPDATE `constant` SET `field`='TYPE_UNINCLUDED_INT'             WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='2';
UPDATE `constant` SET `field`='TYPE_ENGINEERINGPROMO_INT'       WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='3';
UPDATE `constant` SET `field`='TYPE_MATERIALPROMO_INT'          WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='4';
UPDATE `constant` SET `field`='TYPE_OTHER_INT'                  WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='5';
UPDATE `constant` SET `field`='TYPE_MATERIALPRINT_INT'          WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='6';
UPDATE `constant` SET `field`='TYPE_FINALPRINT_INT'             WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='7';
UPDATE `constant` SET `field`='TYPE_NATIONALSUBSIDYPRINT_INT'   WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='8';
UPDATE `constant` SET `field`='TYPE_SETTLEPRINT_INT'            WHERE `module`='data' AND `clazz`='talking' AND `type`='type' AND `key`='9';

-- ============ data.aoods.atttype（辅材归属类型） ============
-- AoodsPO 仅有列名常量 COLUMN_STATUS_ATTTYPE，无取值常量，按含义补造
UPDATE `constant` SET `field`='ATTTYPE_STANDARD_INT' WHERE `module`='data' AND `clazz`='aoods' AND `type`='atttype' AND `key`='0';
UPDATE `constant` SET `field`='ATTTYPE_EXTERNAL_INT' WHERE `module`='data' AND `clazz`='aoods' AND `type`='atttype' AND `key`='1';

-- ============ data.chating.type（聊天类型） ============
-- ChatingPO 无取值常量，按含义补造（注意：无 key=1）
UPDATE `constant` SET `field`='TYPE_TEXT_INT' WHERE `module`='data' AND `clazz`='chating' AND `type`='type' AND `key`='0';
UPDATE `constant` SET `field`='TYPE_APP_INT'  WHERE `module`='data' AND `clazz`='chating' AND `type`='type' AND `key`='2';

-- ============ data.chating.atttype（聊天归属类型） ============
-- ChatingPO 无取值常量，按含义补造
UPDATE `constant` SET `field`='ATTTYPE_CUSTOMER_INT'      WHERE `module`='data' AND `clazz`='chating' AND `type`='atttype' AND `key`='0';
UPDATE `constant` SET `field`='ATTTYPE_DECORATION_INT'    WHERE `module`='data' AND `clazz`='chating' AND `type`='atttype' AND `key`='1';
UPDATE `constant` SET `field`='ATTTYPE_MATERIAL_INT'      WHERE `module`='data' AND `clazz`='chating' AND `type`='atttype' AND `key`='2';
UPDATE `constant` SET `field`='ATTTYPE_CONSTRUCTION_INT'  WHERE `module`='data' AND `clazz`='chating' AND `type`='atttype' AND `key`='3';
UPDATE `constant` SET `field`='ATTTYPE_PAYMENT_INT'       WHERE `module`='data' AND `clazz`='chating' AND `type`='atttype' AND `key`='4';
UPDATE `constant` SET `field`='ATTTYPE_OTHER_INT'         WHERE `module`='data' AND `clazz`='chating' AND `type`='atttype' AND `key`='5';
