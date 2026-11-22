-- 2610260110 补发"双人海外玩翻天"抽奖券(签约赠1张)
-- 根因: 该单 11-10 18:36 首签, 当时生产 decoration jar 尚无首签插桩(fab5a51cc 11-10 17:18 提交, 部署晚于签约)
-- 口径: 复刻 issueDecorationActivityItemByOrderId 引擎发放(参照 2611110028 同活动券行逐字段对齐)
-- 幂等: 同单同活动 type=20 券行已存在则跳过

INSERT INTO decoration.decorationactivityitem
(aId, orderId, no, asid, activityName, activityItemName, num, money, expendPrice, discountPrice, cuid, createTime, type, stateType, isStock, isPrefor, isPayment, isAffirm, state, atttype, content, comment)
SELECT 3579, '2610260110', NULL, 12672, '双人海外玩翻天', '双人海外玩翻天抽奖券', 1, 0, 0, 0, 18441, '2026-11-10 18:36:13', 20, 0, 1, 1, 1, 0, 0, 0, '双人海外玩翻天：签约赠1张；活动期内主材预存净额0元', ''
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM decoration.decorationactivityitem WHERE orderId = '2610260110' AND aId = 3579 AND type = 20);

UPDATE decoration.decorationactivityitem
SET no = CONCAT('LT', LPAD(daiId, 8, '0'))
WHERE orderId = '2610260110' AND aId = 3579 AND type = 20 AND no IS NULL;

INSERT INTO decoration.decorationactivityrecord (daid, daiid, ouid, operateTime, type, comment)
SELECT 3579, d.daiId, 18441, '2026-11-10 18:36:13', 0, '抽奖券自动发放'
FROM decoration.decorationactivityitem d
WHERE d.orderId = '2610260110' AND d.aId = 3579 AND d.type = 20
  AND NOT EXISTS (SELECT 1 FROM decoration.decorationactivityrecord r WHERE r.daiid = d.daiId AND r.type = 0);
