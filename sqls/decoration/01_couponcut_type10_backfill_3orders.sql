-- =============================================================
-- 用途: couponCut 列回填 type=10 额度券漏加金额(对齐签单链实扣值)
-- 背景: ApprovalDecorationActivityServiceImpl 审批落行金额累加只认
--       type=0(券)/1(物品), type=10 额度券两分支都不命中, couponCut 漏加;
--       签单链 paymentMoney=sumMoney-2参DAO(券族口径)已按完整优惠扣减,
--       故 orderTotalPrice-factPrice=券族正确值, 本脚本将 couponCut 列对齐之
-- 范围: 3 单(2026-11-20 生产实测, couponCut列=type0-only和 且 orderTotalPrice
--       -factPrice=券族值, 三单全部吻合)
--       2610290187  11235000→13235000(+2000元)  status=3签约
--       2611060262   3084000→ 6084000(+3000元)  status=3签约
--       2611200048  11000000→13000000(+2000元)  status=1定金
-- 前置: 无jar依赖(代码修复=approval jar 券族累加, 独立部署互不阻塞);
--       备份表最先建; 值级守卫(现值不符=0行可见, 不误伤)
-- 回滚: UPDATE decoration.decoration SET couponCut=<现值> WHERE orderId=<单号>;
--       (现值见 tempbase.bak_20261120_couponcut_3orders)
-- 验证: SELECT orderId, couponCut, orderTotalPrice-factPrice AS cut_implied,
--              couponCut=(orderTotalPrice-factPrice) AS ok
--       FROM decoration.decoration
--       WHERE orderId IN ('2610290187','2611060262','2611200048');  -- 预期 ok 全=1
-- 幂等: 守卫现值, 重跑 0 行无副作用
-- =============================================================

-- ① 备份(最先建, 回报行数应为3)
CREATE TABLE IF NOT EXISTS tempbase.bak_20261120_couponcut_3orders AS
SELECT orderId, couponCut, orderTotalPrice, factPrice, NOW() AS bakTime
FROM decoration.decoration
WHERE orderId IN ('2610290187', '2611060262', '2611200048');

-- ② 定向修复(每单现值守卫, 预期各影响1行, 共3行)
UPDATE decoration.decoration SET couponCut = 13235000 WHERE orderId = '2610290187' AND couponCut = 11235000;
UPDATE decoration.decoration SET couponCut =  6084000 WHERE orderId = '2611060262' AND couponCut =  3084000;
UPDATE decoration.decoration SET couponCut = 13000000 WHERE orderId = '2611200048' AND couponCut = 11000000;

-- ③ 终验(预期 ok 全=1)
SELECT orderId, couponCut, orderTotalPrice - factPrice AS cut_implied,
       couponCut = orderTotalPrice - factPrice AS ok
FROM decoration.decoration
WHERE orderId IN ('2610290187', '2611060262', '2611200048');
