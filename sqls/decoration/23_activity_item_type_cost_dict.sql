-- ============================================================
-- 优惠额度活动物品 type 字典(communion.constant)
-- 背景: information.activityitem.type 扩展 10/11/12 = 优惠额度的券/物品/红包
--      (ActivityItemPO.TYPE_COST_COUPON_INT/TYPE_COST_THING_INT/TYPE_COST_REDPACKAGE_INT,
--       对齐既有 0=券/1=物品/2=红包 语义); 落行 decorationactivityitem.type 同值,
--       type∈{10,11,12} 天然不进 couponCut/thingCut 金额口径(type 白名单排除)。
--      常量族(module=decoration, clazz=decorationActivityItem, field=TYPE_*),
--      对齐 15 积分商城 STATUSTYPE_* 字典先例(stateType+stateTypeCommon 双段)。
-- 前置: 无; 改库即生效(constant 表驱动前端字典), 先于 jar 无硬依赖
-- 回滚: DELETE FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem'
--      AND type IN ('type','typeCommon') AND `key` IN ('10','11','12');
-- 验证: SELECT * FROM communion.constant WHERE clazz='decorationActivityItem' AND `key` IN ('10','11','12');
-- 幂等: NOT EXISTS 防重, 可重复执行
-- ============================================================

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'type', 'TYPE_COST_COUPON_INT', '10', '优惠额度券', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'type' AND field = 'TYPE_COST_COUPON_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'type', 'TYPE_COST_THING_INT', '11', '优惠额度物品', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'type' AND field = 'TYPE_COST_THING_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'type', 'TYPE_COST_REDPACKAGE_INT', '12', '优惠额度红包', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'type' AND field = 'TYPE_COST_REDPACKAGE_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'typeCommon', 'TYPE_COST_COUPON_INT', '10', '优惠额度券', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'typeCommon' AND field = 'TYPE_COST_COUPON_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'typeCommon', 'TYPE_COST_THING_INT', '11', '优惠额度物品', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'typeCommon' AND field = 'TYPE_COST_THING_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'typeCommon', 'TYPE_COST_REDPACKAGE_INT', '12', '优惠额度红包', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'typeCommon' AND field = 'TYPE_COST_REDPACKAGE_INT'
);
