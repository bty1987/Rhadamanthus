-- ============================================================
-- awardstock/activityitem 页面化配置优惠额度类型字典 (communion.constant)
-- 用途: information.awardStock 与 information.activityItem 两族 type 字典补
--      10/11/12 = 优惠额度的券/物品/红包 (对齐 23 号 decoration.decorationActivityItem
--      既有三键), 使奖品库存页 type 下拉可直接配置额度类奖品, 活动物品页落行
--      type=10/11/12 → 校验链 isCostItem(type>=10) 自然生效; 零后端改动
--      (addAwardStock/updateAwardStock/addActivityItem 对 type 均无白名单校验)
-- 前置: 无; 改库即生效 (constant 表驱动前端字典与下拉绑定)
-- 回滚: DELETE FROM communion.constant WHERE module='information' AND clazz IN ('awardStock','activityItem')
--      AND type='type' AND field LIKE 'TYPE_COST_%';
-- 验证: SELECT clazz, field, \`key\`, value FROM communion.constant
--      WHERE module='information' AND type='type' AND field LIKE 'TYPE_COST_%'; 应 6 行
-- 幂等: NOT EXISTS 防重, 可重复执行
-- ============================================================

-- awardStock 族 (field 命名对齐本族既有 TYPE_REDPACK_INT, 无 PACKAGE)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '优惠额度券(类型)', 'information', 'awardStock', 'type', 'TYPE_COST_COUPON_INT', '10', '优惠额度券', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='awardStock' AND type='type' AND field='TYPE_COST_COUPON_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '优惠额度物品(类型)', 'information', 'awardStock', 'type', 'TYPE_COST_THING_INT', '11', '优惠额度物品', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='awardStock' AND type='type' AND field='TYPE_COST_THING_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '优惠额度红包(类型)', 'information', 'awardStock', 'type', 'TYPE_COST_REDPACK_INT', '12', '优惠额度红包', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='awardStock' AND type='type' AND field='TYPE_COST_REDPACK_INT'
);

-- activityItem 族 (field 命名对齐本族既有 TYPE_REDPACKAGE_INT, 带 PACKAGE)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '优惠额度券(类型)', 'information', 'activityItem', 'type', 'TYPE_COST_COUPON_INT', '10', '优惠额度券', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='activityItem' AND type='type' AND field='TYPE_COST_COUPON_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '优惠额度物品(类型)', 'information', 'activityItem', 'type', 'TYPE_COST_THING_INT', '11', '优惠额度物品', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='activityItem' AND type='type' AND field='TYPE_COST_THING_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '优惠额度红包(类型)', 'information', 'activityItem', 'type', 'TYPE_COST_REDPACKAGE_INT', '12', '优惠额度红包', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='activityItem' AND type='type' AND field='TYPE_COST_REDPACKAGE_INT'
);
