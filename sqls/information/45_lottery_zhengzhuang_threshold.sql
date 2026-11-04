-- ============================================================================
-- 文件: 45_lottery_zhengzhuang_threshold.sql
-- 库表: information.activityrule
-- 用途: 双人海外玩翻天——沈阳方林整装(3592, company=55)主材预存每满门槛按爱林模式调整:
--       30000000(3万)→20000000(2万), 用户拍板 2026-11-04
--       (当年 41 号播种按公司名 LIKE 分档, "方林整装"含"方林"落入 3万档, 业务口径应归爱林 2万档)
--       范围=场内每满(ruleType=2, arId=168) + 场外标记行(ruleType=4, arId=277, 43号已执行随场内同步)
--       沈北爱林装饰(3594)播种时名字含"爱林"已落 20000000, 两条均已符合, 本脚本不触碰
-- 执行前置条件:
--   ① 段0自检期望值全部通过
--   ② 影响面已核(2026-11-04 只读库): 已发券 2 单零变化
--     - 2609220048 净1.2万: 纯签约赠, 2万/3万档每满均不达标, 应得不变
--     - 2610170269 净3.6万: floor(3.6/3)=1 = floor(3.6/2)=1, 已发1张每满对齐, 应得不变
--     - 2万~3万档新达标无券存量单 = 0 单 → 无补发无回收, 纯门槛数据调整
-- 回滚方式: UPDATE information.activityrule SET perAmount=30000000 WHERE aid=3592 AND ruleType IN (2,4) AND perAmount=20000000;
-- 幂等性: WHERE perAmount=30000000 守卫, 重复执行影响0行
-- ============================================================================

-- 段0: 自检(只读)
-- 0.1 期望4行: 3592两条=30000000, 3594两条=20000000
SELECT ar.aid, ar.arId, ar.ruleType, ar.perAmount
FROM information.activityrule ar WHERE ar.aid IN (3592, 3594) AND ar.ruleType IN (2, 4)
ORDER BY ar.aid, ar.ruleType;

-- 段1: 调整沈阳方林整装每满门槛(场内+场外两行, 期望影响2行)
UPDATE information.activityrule
SET perAmount = 20000000
WHERE aid = 3592
  AND ruleType IN (2, 4)
  AND perAmount = 30000000;

-- 段2: 验证
-- 2.1 期望 aid=3592 与 aid=3594 四行全部 perAmount=20000000(两活动口径一致)
SELECT ar.aid, ar.arId, ar.ruleType, ar.perAmount
FROM information.activityrule ar WHERE ar.aid IN (3592, 3594) AND ar.ruleType IN (2, 4)
ORDER BY ar.aid, ar.ruleType;
