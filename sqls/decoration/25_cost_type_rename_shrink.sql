-- ============================================================
-- 优惠额度类型收敛: type=10 更名"额度券", 11(物品)/12(红包)字典收回
-- 用途: ①三族字典(information.awardStock/information.activityItem/decoration.decorationActivityItem)
--      中 type=10 显示名 优惠额度券→额度券; ②删除 11/12 两值的字典行
--      (下拉/前端字典不再出现, Java/JS 代码分支保留不删——常量不支持但代码兼容)
-- 前置: 23/24 号 SQL 已执行
-- 回滚: 重放 23/24 号 SQL 的对应 INSERT(幂等可重跑)即可找回 11/12 行与旧名手工 UPDATE 回置
-- 验证: SELECT module, clazz, type, \`key\`, value FROM communion.constant
--      WHERE field LIKE 'TYPE_COST_%' ORDER BY module, clazz, \`key\`;
--      应仅剩 value='额度券' 的行: awardStock/activityItem type=10 各1行 + decorationActivityItem type/typeCommon=10 各1行, 共4行
-- 幂等: UPDATE 条件带旧值防重; DELETE 天然幂等, 可重复执行
-- ============================================================

-- 1) type=10 更名: 额度券
UPDATE communion.constant SET value = '额度券', name = '额度券(类型)'
WHERE module = 'information' AND clazz = 'awardStock' AND type = 'type' AND field = 'TYPE_COST_COUPON_INT' AND value <> '额度券';

UPDATE communion.constant SET value = '额度券', name = '额度券(类型)'
WHERE module = 'information' AND clazz = 'activityItem' AND type = 'type' AND field = 'TYPE_COST_COUPON_INT' AND value <> '额度券';

UPDATE communion.constant SET value = '额度券'
WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND field = 'TYPE_COST_COUPON_INT' AND value <> '额度券';

-- 2) 11/12 字典行收回(三族全删, 代码分支保留)
DELETE FROM communion.constant
WHERE module = 'information' AND clazz = 'awardStock' AND type = 'type' AND field IN ('TYPE_COST_THING_INT', 'TYPE_COST_REDPACK_INT');

DELETE FROM communion.constant
WHERE module = 'information' AND clazz = 'activityItem' AND type = 'type' AND field IN ('TYPE_COST_THING_INT', 'TYPE_COST_REDPACKAGE_INT');

DELETE FROM communion.constant
WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type IN ('type', 'typeCommon') AND field IN ('TYPE_COST_THING_INT', 'TYPE_COST_REDPACKAGE_INT');
