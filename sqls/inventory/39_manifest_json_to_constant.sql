-- =====================================================================
-- 39号: ds/manifest.json 枚举字典全量迁入 communion.constant
--
-- 用途:
--   前端 WebContent/ds/manifest.json(库存域枚举, 18组)内容迁入常量表,
--   前台 20 处消费点(10业务页 + condition/inventory.js 10处 + condition/data.js 1处)
--   全部改读 constant.inventory() / constant.data() / constant.sales(), json 文件作废删除。
--   迁移口径 = UI 零变化(4处文案分叉经用户拍板取 json 现网口径, 见 UPDATE 段)。
--
-- 与既有库存字典批次的关系:
--   30号(manifest/manifestTemplate status)/60号(accessories 8已结算)/
--   100号(accessories 9已配送, 🔴该脚本 INSERT 漏 name 列执行必炸1364, 本脚本
--   已带 name 补插同参行, 100号届时 NOT EXISTS 空跑可作废)的已插行均不动,
--   本脚本只补缺 + 按拍板对齐文案。
--
-- 分叉拍板(2026-11-12, 用户4/4采纳"UI零变化"推荐):
--   1. (occessories,isEnter)   constant'可/不' → 对齐 json '是/否'
--   2. (manifest,type) key=7   constant'辅料出库' → 对齐 json '辅料'(256万行显示口径)
--   3. (purchaseBalance,status) constant'初始/已付款' → 对齐 json '初始/结算/完结'(表空无存量风险)
--   4. (sales,salesActivityItem,state) 7消耗/8折现 → 对齐 json '补款/抵现'(7有2394行/8有5266行)
--   另: (occessories,status) key=5 '完成' 生产数据零行(json也无) → 置 status=1 禁用,
--       前端条件/显示不再出现; loadFloor '2三层' 生产有6行数据 → 保留(json落后不加回)。
--
-- 既有行核对(2026-11-12 生产实查 47行): manifestStatus/accessoriesType/isLift/isExceed/
--   isAttic/isCostType 6组与 json 完全一致零改动;
--   priceTypes→(data,price,ctype)/正价特价→(data,price,type)/statusType→(data,goods,status)/
--   salesActivityItemType→(sales,salesActivityItem,state) 均已有字典, 前端直切零新插。
--
-- 执行前置条件:
--   无依赖(全部 NOT EXISTS 幂等守卫, 可重复执行; 与100号无顺序依赖)
--
-- 回滚方式:
--   -- 文案回滚(如需恢复 constant 原文案):
--   UPDATE communion.constant SET value='可',  name='可(入库标记)'  WHERE module='inventory' AND clazz='occessories' AND type='isEnter' AND `key`=0;
--   UPDATE communion.constant SET value='不',  name='不(入库标记)'  WHERE module='inventory' AND clazz='occessories' AND type='isEnter' AND `key`=1;
--   UPDATE communion.constant SET value='辅料出库', name='辅料出库(清单类型)' WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`=7;
--   UPDATE communion.constant SET value='已付款', name='已付款(采购结算状态)' WHERE module='inventory' AND clazz='purchaseBalance' AND type='status' AND `key`=1;
--   UPDATE communion.constant SET value='消耗', name='消耗(活动物品状态)' WHERE module='sales' AND clazz='salesActivityItem' AND type='state' AND `key`=7;
--   UPDATE communion.constant SET value='折现', name='折现(活动物品状态)' WHERE module='sales' AND clazz='salesActivityItem' AND type='state' AND `key`=8;
--   -- 禁用行恢复:
--   UPDATE communion.constant SET status=0 WHERE module='inventory' AND clazz='occessories' AND type='status' AND `key`=5;
--   -- 新插行回滚(确认前端已切回旧版/无引用后):
--   DELETE FROM communion.constant WHERE module='inventory' AND clazz IN ('manifest','purchase') AND type IN ('type','createType','status') AND field IN ('TYPE_STOCKIN_INT','TYPE_STOCKIN_RETURN_INT','TYPE_STOCKOUT_INT','TYPE_STOCKOUT_RETURN_INT','TYPE_ALLOT_INT','TYPE_PURCHASE_INT','TYPE_AS_RETURN_INT','TYPE_COMBINE_INT','TYPE_SPLIT_INT','TYPE_PROFIT_INT','TYPE_LOSS_INT','CREATE_TYPE_STOCKIN_INT','CREATE_TYPE_STOCKOUT_INT','STATUS_PARTIAL_INT','STATUS_ALL_INT');
--   DELETE FROM communion.constant WHERE module='inventory' AND clazz='purchaseBalance' AND type='status' AND `key`=2;
--   DELETE FROM communion.constant WHERE module='inventory' AND clazz='accessories' AND type='status' AND `key`=9;
--
-- 验证语句:
--   SELECT clazz, type, `key`, value, status FROM communion.constant
--   WHERE module='inventory' AND clazz IN ('manifest','purchase','purchaseBalance','accessories','occessories')
--   ORDER BY clazz, type, `key`+0;
--   期望: manifest.type 12行(7=辅料)/manifest.createType 2行/purchase.status 3行/
--         purchaseBalance.status 3行(1=结算,2=完结)/accessories.status 10行(含9已配送)/
--         occcessories.status 5完成行 status=1/isEnter 两行=是,否
--   SELECT `key`, value FROM communion.constant WHERE module='sales' AND clazz='salesActivityItem' AND type='state' AND `key` IN (7,8);
--   期望: 7=补款, 8=抵现
-- =====================================================================

-- ---------------------------------------------------------------------
-- ① 补插缺失行(全部带 name, NOT EXISTS 幂等)
-- ---------------------------------------------------------------------

-- 1.1 manifest.type 清单类型(json manifestType 全 12 键; key=7 已存在不动由③改文案)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '进货(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_STOCKIN_INT', '1', '进货', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='1');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '进退(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_STOCKIN_RETURN_INT', '2', '进退', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='2');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '出货(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_STOCKOUT_INT', '3', '出货', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='3');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '出返(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_STOCKOUT_RETURN_INT', '4', '出返', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='4');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '调拨(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_ALLOT_INT', '5', '调拨', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='5');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '采购(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_PURCHASE_INT', '6', '采购', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='6');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '辅退(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_AS_RETURN_INT', '8', '辅退', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='8');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '套合(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_COMBINE_INT', '9', '套合', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='9');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '套拆(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_SPLIT_INT', '10', '套拆', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='10');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '盘盈(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_PROFIT_INT', '11', '盘盈', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='11');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '盘亏(清单类型)', 'inventory', 'manifest', 'type', 'TYPE_LOSS_INT', '12', '盘亏', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='12');

-- 1.2 manifest.createType 可创建清单类型(json createManifestTypes: 仅1进货/3出货)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '进货(可创建清单类型)', 'inventory', 'manifest', 'createType', 'CREATE_TYPE_STOCKIN_INT', '1', '进货', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='createType' AND `key`='1');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '出货(可创建清单类型)', 'inventory', 'manifest', 'createType', 'CREATE_TYPE_STOCKOUT_INT', '3', '出货', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='manifest' AND type='createType' AND `key`='3');

-- 1.3 purchase.status 采购单状态(json purchaseStatus; 生产此前无此组)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '初始(采购状态)', 'inventory', 'purchase', 'status', 'STATUS_INIT_INT', '0', '初始', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='purchase' AND type='status' AND `key`='0');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '部分入库(采购状态)', 'inventory', 'purchase', 'status', 'STATUS_PARTIAL_INT', '1', '部分入库', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='purchase' AND type='status' AND `key`='1');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '全部入库(采购状态)', 'inventory', 'purchase', 'status', 'STATUS_ALL_INT', '2', '全部入库', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='purchase' AND type='status' AND `key`='2');

-- 1.4 purchaseBalance.status 补 2完结(json purchaseBalanceStatus; 1结算由②改文案)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '完结(采购结算状态)', 'inventory', 'purchaseBalance', 'status', 'STATUS_FINISH_INT', '2', '完结', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='purchaseBalance' AND type='status' AND `key`='2');

-- 1.5 accessories.status 补 9已配送(与100号同参但带name, 100号漏name列执行必炸1364,
--     本行插后100号 NOT EXISTS 空跑, 100号可作废)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '已配送(辅料单状态)', 'inventory', 'accessories', 'status', 'STATUS_DELIVERED_INT', '9', '已配送', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='inventory' AND clazz='accessories' AND type='status' AND `key`='9');

-- ---------------------------------------------------------------------
-- ② 拍板文案对齐(json 现网口径, UI 零变化; UPDATE 天然幂等)
-- ---------------------------------------------------------------------
UPDATE communion.constant SET value='是', name='是(入库标记)' WHERE module='inventory' AND clazz='occessories' AND type='isEnter' AND `key`='0';
UPDATE communion.constant SET value='否', name='否(入库标记)' WHERE module='inventory' AND clazz='occessories' AND type='isEnter' AND `key`='1';
UPDATE communion.constant SET value='辅料', name='辅料(清单类型)' WHERE module='inventory' AND clazz='manifest' AND type='type' AND `key`='7';
UPDATE communion.constant SET value='结算', name='结算(采购结算状态)' WHERE module='inventory' AND clazz='purchaseBalance' AND type='status' AND `key`='1';
UPDATE communion.constant SET value='补款', name='补款(活动物品状态)' WHERE module='sales' AND clazz='salesActivityItem' AND type='state' AND `key`='7';
UPDATE communion.constant SET value='抵现', name='抵现(活动物品状态)' WHERE module='sales' AND clazz='salesActivityItem' AND type='state' AND `key`='8';

-- ---------------------------------------------------------------------
-- ③ 历史遗留禁用: (occessories,status) 5=完成 生产数据零行 json 也无 → 禁用不再下发
-- ---------------------------------------------------------------------
UPDATE communion.constant SET status=1 WHERE module='inventory' AND clazz='occessories' AND type='status' AND `key`='5' AND status=0;
