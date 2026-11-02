-- ============================================================================
-- 文件: PRODUCTION_LOTTERY_BACKFILL.sql
-- 用途: 抽奖券存量补齐——直接 INSERT 券行+轨迹行+编码回填(不走API, 用户要求)
-- 口径: 2026-11-01 00:00 起签约/主材收款至当前, 净额>0 且尚无有效 LT 券的订单;
--       每单应得 = 签约赠(窗口内签约+1) + 每满(floor(净额/门槛)); 门槛厘: 方林屿林30000000/恩林爱林20000000/1918别墅60000000
-- 结构: ①数字辅助表(临时) ②INSERT 券行(按应得数逐张展开) ③no 编码回填 ④INSERT 轨迹行 ⑤辅助表清理 ⑥预检/验证
-- 安全: NOT EXISTS 防重(已发有效券的单整单跳过); 执行前跑【预检】确认行数;
-- 注意: 单最大应得实测 8 张, 辅助表取 1~20 冗余; no 编码依赖第③段(第②段插入后 no 为空);
--       cuid=34(FL-00479); 补完建议抽查 content 与轨迹行数量
-- 回滚: DELETE FROM decoration.decorationactivityitem WHERE no LIKE 'LT%' AND content LIKE '%存量补齐%';
--       DELETE FROM decoration.decorationactivityrecord WHERE operate/comment LIKE '%存量补齐%' (按 daiId IN 上行回滚范围);
-- ============================================================================

-- ① 数字辅助表(1~20)
DROP TABLE IF EXISTS information._tmp_seq;
CREATE TABLE information._tmp_seq (N INT PRIMARY KEY);
INSERT INTO information._tmp_seq VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20);

-- ② INSERT 券行(按应得数逐张展开; 不含现存有效券的单整单进入)
INSERT INTO decoration.decorationactivityitem
  (aid, asid, orderId, activityName, activityItemName, type, state, atttype, num, money, expendPrice, discountPrice, isStock, isPrefor, isPayment, isAffirm, content, cuid, createTime)
SELECT
  a.aid,
  r2.asid,
  t.orderId,
  '双人海外玩翻天',
  '双人海外玩翻天抽奖券',
  0,
  0,
  1,
  1,
  0,
  0,
  0,
  aw.isStock,
  1,
  0,
  0,
  CONCAT('双人海外玩翻天：存量补齐(上线前应发未发)',
         CASE WHEN t.signed = 1 THEN '；签约赠1张' ELSE '' END,
         '；预存主材款每满', CAST(r2.perAmount / 100000000 AS DECIMAL(10,2)), '万元赠1张',
         '；活动期内主材预存净额', CAST(t.net / 100000000 AS DECIMAL(10,2)), '万元'),
  34,
  NOW()
FROM (
  SELECT p.orderId, d.company, d.contractTime,
         SUM(CASE WHEN p.type = 1 THEN p.recharge WHEN p.type = 0 THEN -p.recharge ELSE 0 END) AS net,
         MAX(CASE WHEN d.contractTime >= '2026-11-01 00:00:00' THEN 1 ELSE 0 END) AS signed
  FROM payment.payment p
  JOIN decoration.decoration d ON d.orderId = p.orderId
  WHERE p.paymentType = 2 AND p.status IN (1, 2)
    AND p.createTime >= '2026-11-01 00:00:00'
    AND d.contractTime IS NOT NULL AND d.status NOT IN (5, 6)
    AND d.company IN (SELECT cid FROM communion.company
                      WHERE (name LIKE '%方林%' OR name LIKE '%爱林%' OR name LIKE '%恩林%' OR name LIKE '%屿林%' OR name LIKE '%1918%') AND cid > 0)
  GROUP BY p.orderId, d.company, d.contractTime
  HAVING net > 0
    AND NOT EXISTS (SELECT 1 FROM decoration.decorationactivityitem i
                    WHERE i.orderId = p.orderId AND i.no LIKE 'LT%' AND i.state <> 1)
) t
JOIN communion.company c ON c.cid = t.company
JOIN information.activity a ON a.company = t.company AND a.type = 20 AND a.status = 0 AND a.name = '双人海外玩翻天'
JOIN information.activityrule r1 ON r1.aid = a.aid AND r1.ruleType = 1
JOIN information.activityrule r2 ON r2.aid = a.aid AND r2.ruleType = 2
JOIN information.awardstock aw ON aw.`no` = '2026110101'
JOIN information._tmp_seq seq ON seq.N <= (FLOOR(t.net / r2.perAmount) + t.signed)
WHERE FLOOR(t.net / r2.perAmount) + t.signed > 0;

-- ③ no 编码回填: 本批次新增的空 no 行 → LT+8位daiId
UPDATE decoration.decorationactivityitem
SET no = CONCAT('LT', LPAD(daiId, 8, '0'))
WHERE no IS NULL
  AND type = 0
  AND activityName = '双人海外玩翻天'
  AND content LIKE '%存量补齐%';

-- ④ 轨迹行(与券行一一对应, 按orderId+content关联本批新增)
INSERT INTO decoration.decorationactivityrecord
  (aid, daiId, type, operaterUid, operateTime, comment)
SELECT
  i.aid, i.daiId, 0, 34, i.createTime, '抽奖券存量补齐(上线前应发未发)'
FROM decoration.decorationactivityitem i
WHERE i.no LIKE 'LT%' AND i.content LIKE '%存量补齐%'
  AND NOT EXISTS (SELECT 1 FROM decoration.decorationactivityrecord r WHERE r.daiId = i.daiId);

-- ⑤ 辅助表清理
DROP TABLE IF EXISTS information._tmp_seq;

-- ============================================================================
-- 【预检】执行前先跑: 确认待补订单数与总张数(与②的实际 affected 对比)
-- SELECT COUNT(*) AS orders, SUM(need) AS tickets FROM (
--   SELECT t.orderId, FLOOR(t.net / CASE
--     WHEN c.name LIKE '%恩林%' OR c.name LIKE '%爱林%' THEN 20000000
--     WHEN c.name LIKE '%1918%' THEN 60000000
--     ELSE 30000000 END) + t.signed AS need
--   FROM (
--     SELECT p.orderId, d.company, d.contractTime,
--            SUM(CASE WHEN p.type = 1 THEN p.recharge WHEN p.type = 0 THEN -p.recharge ELSE 0 END) AS net,
--            MAX(CASE WHEN d.contractTime >= '2026-11-01 00:00:00' THEN 1 ELSE 0 END) AS signed
--     FROM payment.payment p
--     JOIN decoration.decoration d ON d.orderId = p.orderId
--     WHERE p.paymentType = 2 AND p.status IN (1, 2)
--       AND p.createTime >= '2026-11-01 00:00:00'
--       AND d.contractTime IS NOT NULL AND d.status NOT IN (5, 6)
--       AND d.company IN (SELECT cid FROM communion.company
--                         WHERE (name LIKE '%方林%' OR name LIKE '%爱林%' OR name LIKE '%恩林%' OR name LIKE '%屿林%' OR name LIKE '%1918%') AND cid > 0)
--     GROUP BY p.orderId, d.company, d.contractTime
--     HAVING net > 0
--       AND NOT EXISTS (SELECT 1 FROM decoration.decorationactivityitem i
--                       WHERE i.orderId = p.orderId AND i.no LIKE 'LT%' AND i.state <> 1)
--   ) t
--   JOIN communion.company c ON c.cid = t.company
-- ) x;
-- ============================================================================
-- 【验证】执行后:
-- SELECT COUNT(*) AS total, SUM(state=0) AS valid FROM decoration.decorationactivityitem WHERE no LIKE 'LT%' AND content LIKE '%存量补齐%';
-- SELECT COUNT(*) FROM decoration.decorationactivityrecord r JOIN decoration.decorationactivityitem i ON i.daiId = r.daiId WHERE i.content LIKE '%存量补齐%';
-- 抽样: SELECT orderId, no, state, content FROM decoration.decorationactivityitem WHERE content LIKE '%存量补齐%' ORDER BY daiId DESC LIMIT 10;
