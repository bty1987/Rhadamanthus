-- ============================================================================
-- 文件: 41_lottery_init_national.sql
-- 库表: information.awardstock / information.activity / information.activityrule
-- 用途: 双人海外玩翻天抽奖券——全国初始化数据(参战范围=五板块全部公司, 用户拍板 2026-11-01):
--       ① awardstock 奖品档案 1 条(全局共享, 券品"双人海外玩翻天抽奖券", isStock=1不计库存口径同存量礼品券)
--       ② activity 每参战公司 1 条(type=20 抽奖券活动, 窗口 2026-11-01~12-31, status=0 有效)
--       ③ activityrule 每公司 2 行(签约赠 tickets=1 / 预存每满 tickets=1):
--          门槛(厘): 方林/屿林=30000000(3万) 恩林/爱林=20000000(2万) 1918别墅=60000000(6万), 按公司名 LIKE 匹配
--       参战公司口径: communion.company name 匹配 方林/爱林/恩林/屿林/1918 且 cid>0 (生产实测 67 家, 排除 cid=0 方林集团壳)
-- 执行前置条件:
--   ① 40 号建表已执行(information.activityrule);
--   ② 部署顺序无依赖(引擎读不到活动则 return 0), 但发券生效需 jar 已部署+本数据已执行;
--   ③ 验证现状: SELECT COUNT(*) FROM information.activity WHERE type=20; 期望=0(首跑)
-- 回滚方式(先删规则再删活动, 奖品档案保留可复用):
--   DELETE FROM information.activityrule WHERE aid IN (SELECT aid FROM information.activity WHERE type=20 AND name='双人海外玩翻天');
--   DELETE FROM information.activity WHERE type=20 AND name='双人海外玩翻天';
--   DELETE FROM information.awardstock WHERE no='2026110101' AND name='双人海外玩翻天抽奖券';
--   (回滚不影响已发券行 decorationactivityitem; 引擎后续触发因无活动 return 0)
-- 幂等性: 三段均 NOT EXISTS 守卫, 可重复执行
-- ============================================================================

-- 1. awardstock 奖品档案(全局 1 条, company=1 档案归属, asid 自增供规则行引用)
INSERT INTO information.awardstock
  (`no`, `name`, `purchase`, `selling`, `num`, `status`, `type`, `subtype`, `storeroom`, `format`, `unitPrice`, `isStock`, `isPrefor`, `isPayment`, `content`, `company`)
SELECT '2026110101', '双人海外玩翻天抽奖券', 0, 0, 0, 1, 0, 8, 0, '', 0, 1, 0, 0, '双人海外玩翻天线上抽奖活动抽奖券', 1
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM information.awardstock WHERE `no` = '2026110101' AND name = '双人海外玩翻天抽奖券'
);

-- 2. activity 每参战公司 1 条(type=20 抽奖券活动)
INSERT INTO information.activity
  (`name`, `cuid`, `status`, `type`, `paytype`, `atttype`, `defaults`, `multiple`, `validays`, `exchange`, `createTime`, `startTime`, `endTime`, `content`, `company`)
SELECT
  '双人海外玩翻天', 34, 0, 20, 0, 1, 1, 0, 0, 0,
  NOW(), '2026-11-01 00:00:00', '2026-12-31 23:59:59',
  '双人海外玩翻天抽奖券活动', c.`cid`
FROM communion.`company` c
WHERE (c.`name` LIKE '%方林%' OR c.`name` LIKE '%爱林%' OR c.`name` LIKE '%恩林%' OR c.`name` LIKE '%屿林%' OR c.`name` LIKE '%1918%')
  AND c.`cid` > 0
  AND NOT EXISTS (
    SELECT 1 FROM information.activity a
    WHERE a.company = c.`cid` AND a.type = 20 AND a.name = '双人海外玩翻天'
      AND a.startTime = '2026-11-01 00:00:00' AND a.endTime = '2026-12-31 23:59:59'
);

-- 3. activityrule 每公司 2 行(签约赠 + 预存每满, 门槛按板块匹配, asid 全局指向奖品档案)
INSERT INTO information.activityrule
  (`aid`, `ruleType`, `asid`, `threshold`, `perAmount`, `tickets`, `maxTickets`, `sort`, `status`, `createTime`)
SELECT
  a.`aid`, 1, (SELECT asid FROM information.awardstock WHERE `no` = '2026110101' LIMIT 1),
  0, NULL, 1, 0, 1, 0, NOW()
FROM information.`activity` a
WHERE a.type = 20 AND a.name = '双人海外玩翻天' AND a.status = 0
  AND NOT EXISTS (
    SELECT 1 FROM information.activityrule r WHERE r.aid = a.`aid` AND r.ruleType = 1
  );

INSERT INTO information.activityrule
  (`aid`, `ruleType`, `asid`, `threshold`, `perAmount`, `tickets`, `maxTickets`, `sort`, `status`, `createTime`)
SELECT
  a.`aid`, 2, (SELECT asid FROM information.awardstock WHERE `no` = '2026110101' LIMIT 1),
  0,
  CASE
    WHEN c.`name` LIKE '%恩林%' OR c.`name` LIKE '%爱林%' THEN 20000000
    WHEN c.`name` LIKE '%1918%' THEN 60000000
    ELSE 30000000
  END,
  1, 0, 2, 0, NOW()
FROM information.`activity` a
JOIN communion.`company` c ON c.`cid` = a.company
WHERE a.type = 20 AND a.name = '双人海外玩翻天' AND a.status = 0
  AND NOT EXISTS (
    SELECT 1 FROM information.activityrule r WHERE r.aid = a.`aid` AND r.ruleType = 2
  );

-- 4. 验证
-- SELECT COUNT(*) FROM information.awardstock WHERE `no`='2026110101';                              -- 期望 1
-- SELECT COUNT(*) FROM information.activity WHERE type=20 AND name='双人海外玩翻天';                -- 期望 67(生产口径)
-- SELECT COUNT(*) FROM information.activityrule WHERE aid IN (SELECT aid FROM information.activity WHERE type=20); -- 期望 活动数×2
