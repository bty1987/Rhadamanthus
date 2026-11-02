-- ============================================================
-- awardStock type 字典补 20=抽奖券 (communion.constant)
-- 用途: 抽奖引擎发放的装修活动物品行 type 由 0(券) 切换为 20(抽奖券,
--      DecorationActivityItemPO.TYPE_LOTTERY_ACTIVITY_ITEM, 与活动 type=20 对应);
--      装修单详情会员活动物品区完整卡的类型标签取 constant.information().awardStock.type.keys,
--      缺本字典行 type=20 会显示 "undefined" (先例: 10=优惠额度券, cid=2648, 24号SQL)
-- 前置: 无; 改库即生效 (constant 表驱动前端字典)
-- 回滚: DELETE FROM communion.constant WHERE module='information' AND clazz='awardStock'
--      AND type='type' AND field='TYPE_LOTTERY_INT';
-- 验证: SELECT field, `key`, value FROM communion.constant
--      WHERE module='information' AND clazz='awardStock' AND type='type' AND field='TYPE_LOTTERY_INT'; 应 1 行
-- 幂等: NOT EXISTS 防重, 可重复执行
-- ============================================================

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '抽奖券(类型)', 'information', 'awardStock', 'type', 'TYPE_LOTTERY_INT', '20', '抽奖券', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='awardStock' AND type='type' AND field='TYPE_LOTTERY_INT'
);
