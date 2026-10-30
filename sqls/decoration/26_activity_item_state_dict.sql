-- =====================================================================
-- 用途: 活动物品 state 状态字典补数据(decoration.decorationActivityItem 的 state 列翻译)
--   背景: MemberServiceImpl 积分商城同步产 2026-10-30 起直写 state=10(核销, STATUS_VERIFY_INT,
--         提交 3946330d9 两处), 且生产存量核验已有 state=10 真实数据 7 行(atttype=1);
--         而 communion.constant 中 (decoration, decorationActivityItem, state) 组三环境均为 0 行,
--         状态展示翻译无值。本脚本按 DecorationActivityItemPO 权威常量补全 0~10 完整组。
-- 执行前置条件: 无(纯字典行, 改库即生效, 页面刷新字典缓存随加载更新, 免重启)
-- 回滚方式:
--   DELETE FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state';
-- 验证语句:
--   SELECT `key`, value, status FROM communion.constant
--    WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' ORDER BY `key`+0;
--   -- 应见 key=0~10 共 11 行
-- 幂等性: 幂等(NOT EXISTS 守卫, 可重复执行)
-- =====================================================================

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_INIT_INT', '0', '初始', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='0');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_UNVALID_INT', '1', '失效', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='1');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_RECEIVE_INT', '2', '已领', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='2');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_RETREAT_INT', '3', '退货', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='3');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_DELIVERY_INT', '4', '配送', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='4');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_WAIT_INT', '5', '未退', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='5');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_UPGRADE_INT', '6', '升级', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='6');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_CONSUME_INT', '7', '消耗', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='7');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_DISCOUNT_INT', '8', '抵现', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='8');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_PURCHER_INT', '9', '采购', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='9');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品状态', 'decoration', 'decorationActivityItem', 'state', 'STATUS_VERIFY_INT', '10', '核销', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem' AND type='state' AND `key`='10');
