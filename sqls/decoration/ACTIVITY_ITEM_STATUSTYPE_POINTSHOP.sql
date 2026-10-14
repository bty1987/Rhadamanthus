-- 积分商城活动物品 办理类型常量（待生产）
-- 背景：makeMemberOrderItem(积分商城同步)产生的 decorationactivityitem 需落
--       type=0券(字典已有) / stateType=15积分商城 / state=2已领；
--       stateType 常量族(communion.constant, module=decoration, clazz=decorationActivityItem,
--       field=STATUSTYPE_*)原 0~14 无"积分商城", 新增 15。
--       state(state=2已领)/type 字典已有, 无需新增。
-- 幂等：可重复执行(NOT EXISTS 防重)。改库即生效(constant 表驱动前端字典), 先于 jar 无硬依赖。

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品办理类型', 'decoration', 'decorationActivityItem', 'stateType', 'STATUSTYPE_POINTSHOP_INT', '15', '积分商城', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'stateType' AND field = 'STATUSTYPE_POINTSHOP_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品办理类型', 'decoration', 'decorationActivityItem', 'stateTypeCommon', 'STATUSTYPE_POINTSHOP_INT', '15', '积分商城', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'stateTypeCommon' AND field = 'STATUSTYPE_POINTSHOP_INT'
);
