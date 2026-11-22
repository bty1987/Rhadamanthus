-- ============================================================
-- 29_activity_item_lottery_backfill_2610310484.sql 抽奖券补发 (decoration.decorationactivityitem)
-- 用途: 2610310484(屿林cid=3, 雅居乐花园, 设计师吴薇, 签约王艳玲)漏发2张抽奖券补发:
--      应得 = 签约赠1(签约11-10 10:16在窗, 命中规则ruleType=1) + 预存每满1(30000元/每满30000=1,
--      收款11-09 22:49在窗已确认, 命中ruleType=2) = 2张
-- 根因: 首次签约链signDecorationContract无引擎插桩(重签链有L924), 收款时未签约仅可发每满但
--      22:49时段引擎未触达(待深查), 签约时点无触发 → 2张均漏; 代码修复随decoration jar批
-- 补发行严格仿引擎产物: type=20(抽奖券)/atttype=0/state=0(初始)/stateType=0/isPrefor=1/
--      isStock=1/isPayment=1/num=1张/money=0/content发放说明/no=LT+daiId回填(引擎同款格式);
--      引擎countDecorationActivityItemForLottery按type=20计数会认账, 部署新jar后重触发不重复补
-- 前置: 段0自检应返回0张(补发前); 备份表可空(纯INSERT)
-- 回滚: DELETE FROM decoration.decorationactivityitem WHERE orderId='2610310484' AND no IN ('LT00523311','LT00523312');
-- 验证: 补发后 SELECT COUNT(*) 应=2; no序列=LT00523311/12(当前最大LT00523310顺延)
-- 幂等: NOT EXISTS按orderId+no守卫
-- ============================================================

-- ---------- 段0: 前置自检(期望0行) ----------
SELECT daiId, no FROM decoration.decorationactivityitem WHERE orderId = '2610310484' AND no LIKE 'LT%';

-- ---------- 补发: 签约赠1张 ----------
INSERT INTO decoration.decorationactivityitem
    (aid, asid, orderId, activityName, activityItemName, type, atttype, state, stateType,
     num, money, expendPrice, discountPrice, isPrefor, isStock, isPayment, isAffirm,
     cuid, createTime, content, expireTime)
SELECT 3554, 12672, '2610310484', '双人海外玩翻天', '双人海外玩翻天抽奖券', 20, 0, 0, 0,
       1, 0, 0, 0, 1, 1, 1, 0,
       15774, NOW(), '双人海外玩翻天：签约赠1张；活动期内主材预存净额30000元（补发: 首签链插桩缺口, 2026-11-10）',
       DATE_ADD(NOW(), INTERVAL 60 DAY)
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationactivityitem WHERE orderId = '2610310484' AND no IS NOT NULL AND no LIKE 'LT%' AND content LIKE '%签约赠%'
);

-- ---------- 补发: 预存每满1张 ----------
INSERT INTO decoration.decorationactivityitem
    (aid, asid, orderId, activityName, activityItemName, type, atttype, state, stateType,
     num, money, expendPrice, discountPrice, isPrefor, isStock, isPayment, isAffirm,
     cuid, createTime, content, expireTime)
SELECT 3554, 12672, '2610310484', '双人海外玩翻天', '双人海外玩翻天抽奖券', 20, 0, 0, 0,
       1, 0, 0, 0, 1, 1, 1, 0,
       15774, NOW(), '双人海外玩翻天：预存主材款每满30000元赠1张；活动期内主材预存净额30000元（补发: 首签链插桩缺口, 2026-11-10）',
       DATE_ADD(NOW(), INTERVAL 60 DAY)
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationactivityitem WHERE orderId = '2610310484' AND no IS NOT NULL AND no LIKE 'LT%' AND content LIKE '%每满%'
);

-- ---------- no回填(LT+daiId, 引擎同款) ----------
UPDATE decoration.decorationactivityitem
SET no = CONCAT('LT', LPAD(daiId, 8, '0'))
WHERE orderId = '2610310484' AND no IS NULL AND type = 20;

-- ---------- 验证 ----------
SELECT daiId, no, content, state, createTime FROM decoration.decorationactivityitem
WHERE orderId = '2610310484' AND no LIKE 'LT%';
-- 期望: 2行(LT00523311签约赠/LT00523312每满, 或序随并发顺延), state=0初始
