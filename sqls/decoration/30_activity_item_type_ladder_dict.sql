-- ============================================================
-- 阶梯抽奖活动配置 SQL(活动/券 type=30 + activityrule ruleType=5 阶梯奖品行 + 等级字典)
-- 背景: 阶梯抽奖活动——装修单参与活动预占券(state=0), 签约按 awardstock 剩余量
--      沿优先级(sort)降级发放(一清零发二...), 全清零预占保持初始等领取; 每单一张。
-- 前置: 无; 字典改库即生效先于 jar 无硬依赖
-- 回滚: 文件尾回滚段(仅限未产生业务数据前)
-- 验证: SELECT * FROM communion.constant WHERE clazz IN ('decorationActivityItem','activityrule')
--      AND `key` IN ('30','5','1','2','3');
-- 幂等: NOT EXISTS 防重, 可重复执行
-- ============================================================

-- ---------- 1. 券类型字典: decorationactivityitem.type=30 阶梯抽奖券 ----------
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'type', 'TYPE_LADDER_LOTTERY_INT', '30', '阶梯抽奖券', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'type' AND field = 'TYPE_LADDER_LOTTERY_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'typeCommon', 'TYPE_LADDER_LOTTERY_INT', '30', '阶梯抽奖券', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'typeCommon' AND field = 'TYPE_LADDER_LOTTERY_INT'
);

-- ---------- 2. activityrule.ruleType=5 阶梯奖品行 字典 ----------
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动规则类型', 'information', 'activityrule', 'ruleType', 'RULETYPE_LADDER_PRIZE_INT', '5', '阶梯奖品', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'information' AND clazz = 'activityrule' AND type = 'ruleType' AND field = 'RULETYPE_LADDER_PRIZE_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动规则类型', 'information', 'activityrule', 'ruleTypeCommon', 'RULETYPE_LADDER_PRIZE_INT', '5', '阶梯奖品', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'information' AND clazz = 'activityrule' AND type = 'ruleTypeCommon' AND field = 'RULETYPE_LADDER_PRIZE_INT'
);

-- ---------- 3. activityrule.grade 等级字典(1/2/3=一二三等奖) ----------
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动规则等级', 'information', 'activityrule', 'grade', 'GRADE_FIRST_INT', '1', '一等奖', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'information' AND clazz = 'activityrule' AND type = 'grade' AND field = 'GRADE_FIRST_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动规则等级', 'information', 'activityrule', 'grade', 'GRADE_SECOND_INT', '2', '二等奖', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'information' AND clazz = 'activityrule' AND type = 'grade' AND field = 'GRADE_SECOND_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动规则等级', 'information', 'activityrule', 'grade', 'GRADE_THIRD_INT', '3', '三等奖', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'information' AND clazz = 'activityrule' AND type = 'grade' AND field = 'GRADE_THIRD_INT'
);

-- ---------- 回滚段(仅限未产生业务数据前) ----------
-- DELETE FROM communion.constant WHERE clazz IN ('decorationActivityItem','activityrule')
--   AND ((clazz='decorationActivityItem' AND type IN ('type','typeCommon') AND `key`='30')
--    OR (clazz='activityrule' AND field IN ('RULETYPE_LADDER_PRIZE_INT','GRADE_FIRST_INT','GRADE_SECOND_INT','GRADE_THIRD_INT')));
