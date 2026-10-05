-- data.goods.type=1(空配置套装) 开单后被购货结算/配送"孤儿套餐明细"过滤误杀 存量修复（待生产, 分段拍板执行）
-- 机制(2026-10-05 诊断, 2603210594 实证)：
--   1) 4个奥普直播商品(gid 679438/679439/679441/679443) data.goods.type=1(套装) 但 data.goodspackage 配置为 0 条(空套装);
--   2) 开单(SalesServiceImpl/SalesItemServiceImpl)把 goods.type 原样拷入 salesitem.type → 主项 type=1, psiid=0, 无展开子项;
--   3) 购货结算发起(SalesBalanceServiceImpl.preSalesBalance:486)与配送(SalesDeliveryServiceImpl:341)的
--      "跳过孤儿套餐明细(psiid=0且type=TYPE_PACKAGE=1)"过滤把该主项误杀 → 配送/购货结算缺行;
--      同品牌仅此商品时整个购货结算单不生成("没有购货结算明细"), 否则结算单在而缺行("少N条子项");
--   4) 退货链不过此过滤 → 退货有行而购货无行(不对称); 2603300254 购货无/退货重复两行为同源衍生, 需单独甄别。
-- 受影响面(2026-10-05 核验)：64单中 47单有购货结算单(缺行)/19单无结算单, balanceStatus 1预结算×66 + 2×1;
--   4 gid 全历史 salesitem 仍为 type=1 psiid=0 的行仅 14 行/6 单(其余各行后续被编辑重置为0)。

-- ========== A. 商品数据修正(治本, 未来开单恢复正常; 执行后新开单不再依赖代码防御) ==========
UPDATE data.goods SET type = 0 WHERE gid IN (679438, 679439, 679441, 679443) AND type = 1;

-- ========== B. 存量销售项修正(现仍为 type=1 psiid=0 的 14 行/6 单) ==========
UPDATE sales.salesitem si
JOIN data.goods g ON g.gid = si.gid
SET si.type = 0
WHERE g.gid IN (679438, 679439, 679441, 679443) AND si.type = 1 AND si.psiid = 0;

-- ========== C. 存量购货结算补行(复杂, 执行前须逐单核对, 建议先跑查询段人工过目) ==========
-- C0. 盘点: 各单缺失的结算行(有购货结算单但缺对应 salesbalanceitem 的)
-- SELECT s.no, sb.sbid, si.siid, g.name
-- FROM sales.sales s
-- JOIN sales.salesitem si ON si.sid = s.sid AND si.type = 0 AND si.psiid = 0
-- JOIN data.goods g ON g.gid = si.gid AND g.gid IN (679438, 679439, 679441, 679443)
-- JOIN sales.salesbalance sb ON sb.sid = s.sid AND sb.onetype = 0 AND sb.type = 0
-- LEFT JOIN sales.salesbalanceitem sbi ON sbi.sbid = sb.sbid AND sbi.siid = si.siid
-- WHERE sbi.sbiid IS NULL;

-- C1. 补明细行(以 C0 盘点结果为准; num/total 取自销售项, 金额口径与 preSalesBalance:578-592 一致)
-- INSERT INTO sales.salesbalanceitem (sbid, siid, ctype, cvalue, num, total)
-- SELECT sb.sbid, si.siid, si.ctype, si.cvalue, si.num, si.total
-- FROM sales.sales s
-- JOIN sales.salesitem si ON si.sid = s.sid AND si.type = 0 AND si.psiid = 0
-- JOIN sales.salesbalance sb ON sb.sid = s.sid AND sb.onetype = 0 AND sb.type = 0
-- LEFT JOIN sales.salesbalanceitem sbi ON sbi.sbid = sb.sbid AND sbi.siid = si.siid
-- WHERE s.no IN ( /* 64单清单 */ ) AND sbi.sbiid IS NULL;

-- C2. 结算单金额重算(补行后 total/pbalance/vbalance 需按品牌重算, 口径同 preSalesBalance:525-572;
--     ⚠️ 涉及已付款/已确认金额, 须与财务核对后执行, 建议逐单 UPDATE 人工确认)

-- C3. 19单"没有购货结算明细": balanceStatus=1(预结算)不满足 preSalesBalance 重发闸(要求初始),
--     需人工评估: 回退 balanceStatus 后重发, 或按 preSalesBalance 口径手工补建结算单+明细。

-- ========== D. 退货不对称/重复(2603300254 等)单独甄别, 勿在本脚本盲改 ==========
