-- ============================================================
-- 阶梯奖品并入常规活动(type=1)+activityitem.type=30 物品模型——配置侧字典
-- 背景: 用户2026-11-08拍板推翻"activity.type=30独立活动"模型——阶梯活动=常规type=1活动
--      挂多个 activityitem.type=30 物品(面值money降序即奖级, 每行挂awardstock计数量),
--      参与走常规加物品流程生成 decorationactivityitem.type=30 券行(不进makeDecorationPayment抵扣,
--      进salespayment收款抵扣); 30号SQL的 activityrule ruleType=5/grade 字典行随模型作废(留存无害)
-- 前置: 无(纯字典); awardStock.type=30 行供奖品库建 type=30 奖品(带数量), activityItem.type=30 行供活动物品配置页渲染
-- 回滚: 文件尾回滚段(仅限未产生 type=30 奖品/物品数据前)
-- 验证: SELECT * FROM communion.constant WHERE clazz IN ('awardStock','activityItem') AND `key`='30';
-- 幂等: NOT EXISTS 防重, 可重复执行
-- ============================================================

-- ---------- 1. awardStock.type=30 (奖品库建阶梯奖品用, awardstock页类型下拉字典驱动) ----------
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '奖品类型', 'information', 'awardStock', 'type', 'TYPE_LADDER_LOTTERY_INT', '30', '限量奖品', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='awardStock' AND type='type' AND field='TYPE_LADDER_LOTTERY_INT'
);

-- ---------- 2. activityItem.type=30 (活动物品配置页渲染分支) ----------
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'information', 'activityItem', 'type', 'TYPE_LADDER_LOTTERY_INT', '30', '限量奖品', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='activityItem' AND type='type' AND field='TYPE_LADDER_LOTTERY_INT'
);

-- ---------- 回滚段(仅限未产生数据前) ----------
-- DELETE FROM communion.constant WHERE module='information' AND clazz IN ('awardStock','activityItem') AND field='TYPE_LADDER_LOTTERY_INT';
