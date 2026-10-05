-- data.goods.type=1(空配置套装) 开单后被购货结算/配送"孤儿套餐明细"过滤误杀 存量修复（待生产）
-- 机制(2026-10-05 诊断, 2603210594 实证)：
--   4个奥普直播商品(gid 679438/679439/679441/679443) data.goods.type=1(套装) 但 goodspackage 配置 0 条(空套装);
--   开单把 goods.type 原样拷入 salesitem.type → 主项 type=1, psiid=0, 无展开子项;
--   购货结算发起(SalesBalanceServiceImpl.preSalesBalance:486)与配送(SalesDeliveryServiceImpl:341)的
--   "跳过孤儿套餐明细(psiid=0且type=1)"过滤把主项误杀 → 配送/购货结算缺行; 退货链不过滤 → 购货缺退货有的不对称。
-- 盘点(2026-10-05 生产)：
--   缺明细行 108 行(全部 si.total=0/num=0, 纯展示行, 补行零金额风险——故无金额重算步骤);
--   涉及购货结算单均 status=0(预结算), 另 2603210898 一单 status=1(厂商结算中)缺 2 行单独拍板;
--   19 单无购货结算单(balanceStatus=1), 回退后由业务在页面重新发起结算(修复后代码生成正确)。
-- 本脚本全部语句可直接执行, 无占位; 顺序执行 A→B→C1→C3。幂等: UPDATE 天然幂等, INSERT 带 NOT EXISTS 防重。

-- ========== A. 商品数据修正(治本, 未来开单恢复正常) ==========
UPDATE data.goods SET type = 0 WHERE gid IN (679438, 679439, 679441, 679443) AND type = 1;

-- ========== B. 存量销售项修正(仍为 type=1 psiid=0 的行, 盘点 14 行/6 单) ==========
UPDATE sales.salesitem si
JOIN data.goods g ON g.gid = si.gid
SET si.type = 0
WHERE g.gid IN (679438, 679439, 679441, 679443) AND si.type = 1 AND si.psiid = 0;

-- ========== C1. 补购货结算明细行(108 行, status=0 结算单; 补行金额全 0 不动单头) ==========
INSERT INTO sales.salesbalanceitem (sbid, siid, rawCtype, rawCvalue, ctype, cvalue, num, total)
SELECT sb.sbid, si.siid, si.rawCtype, si.rawCvalue, si.ctype, si.cvalue, si.num, si.total
FROM sales.sales s
JOIN sales.salesitem si ON si.sid = s.sid AND si.type = 0 AND si.psiid = 0
JOIN data.goods g ON g.gid = si.gid AND g.gid IN (679438, 679439, 679441, 679443)
JOIN sales.salesbalance sb ON sb.sid = s.sid AND sb.onetype = 0 AND sb.type = 0 AND sb.status = 0
LEFT JOIN sales.salesbalanceitem sbi ON sbi.sbid = sb.sbid AND sbi.siid = si.siid
WHERE sbi.sbiid IS NULL;

-- ========== C1b. 2603210898(结算单 1623301 status=1 厂商结算中)缺 2 行——拍板后执行 ==========
-- 行金额同为 0, 补行不改金额; 但该单已进入厂商结算环节, 厂商端会看到新增行, 执行前知会厂商。
-- INSERT INTO sales.salesbalanceitem (sbid, siid, rawCtype, rawCvalue, ctype, cvalue, num, total)
-- SELECT sb.sbid, si.siid, si.rawCtype, si.rawCvalue, si.ctype, si.cvalue, si.num, si.total
-- FROM sales.sales s
-- JOIN sales.salesitem si ON si.sid = s.sid AND si.type = 0 AND si.psiid = 0
-- JOIN data.goods g ON g.gid = si.gid AND g.gid IN (679438, 679439, 679441, 679443)
-- JOIN sales.salesbalance sb ON sb.sid = s.sid AND sb.onetype = 0 AND sb.type = 0 AND sb.status = 1 AND sb.sbid = 1623301
-- LEFT JOIN sales.salesbalanceitem sbi ON sbi.sbid = sb.sbid AND sbi.siid = si.siid
-- WHERE sbi.sbiid IS NULL;

-- ========== C3. 19 单无购货结算单: 经确认不处理(2026-10-05 拍板) ==========
-- 核验: 19 单全部销售项 total=0(0元套装赠品单), 补建结算单无财务意义;
--       回退 balanceStatus 重发亦无业务价值, 保持现状(报表显示"无购货结算明细"即真实状态)。
--       原回退语句撤销, 不执行。

-- ========== 核验(执行后人工核对, 预期: missing=0) ==========
-- SELECT COUNT(*) AS missing FROM sales.sales s
-- JOIN sales.salesitem si ON si.sid = s.sid AND si.type = 0 AND si.psiid = 0
-- JOIN data.goods g ON g.gid = si.gid AND g.gid IN (679438, 679439, 679441, 679443)
-- JOIN sales.salesbalance sb ON sb.sid = s.sid AND sb.onetype = 0 AND sb.type = 0
-- LEFT JOIN sales.salesbalanceitem sbi ON sbi.sbid = sb.sbid AND sbi.siid = si.siid
-- WHERE sbi.sbiid IS NULL;

-- ========== D. 退货侧不对称/重复(2603300254 购货无但退货多两条重复)单独甄别, 勿在本脚本盲改 ==========
