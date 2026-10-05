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
-- 正向推导口径(2026-10-05 按财务提供的 64 单清单逐行比对):
--   应有行 = 64 单的销售项(排除孤儿套餐行 psiid=0且type=1——与 preSalesBalance 口径一致)
--   实有行 = 购货结算单(onetype=0/type=0/status=0)下已存在的 salesbalanceitem
--   缺失   = 应有 - 实有, 逐行补齐; 盘点结果 108 行/47 单, 全部 total=0/num=0(零金额风险),
--            且与 gid 反推口径结果完全一致(交叉验证无其他商品缺行)。
-- 2603210898 的结算单为 status=1(厂商结算中), 不在本段范围, 见 C1b。
INSERT INTO sales.salesbalanceitem (sbid, siid, rawCtype, rawCvalue, ctype, cvalue, num, total)
SELECT sb.sbid, si.siid, si.rawCtype, si.rawCvalue, si.ctype, si.cvalue, si.num, si.total
FROM sales.sales s
JOIN sales.salesitem si ON si.sid = s.sid AND NOT (si.psiid = 0 AND si.type = 1)
JOIN sales.salesbalance sb ON sb.sid = s.sid AND sb.onetype = 0 AND sb.type = 0 AND sb.status = 0
LEFT JOIN sales.salesbalanceitem sbi ON sbi.sbid = sb.sbid AND sbi.siid = si.siid
WHERE s.no IN (
    '2603210594', '2603210624', '2603210665', '2603210720', '2603210741',
    '2603210769', '2603210796', '2603210817', '2603210827', '2603210842',
    '2603210846', '2603210868', '2603210884', '2603210898', '2603210919',
    '2603210928', '2603211003', '2603211006', '2603211021', '2603250437',
    '2603280968', '2603290112', '2603290130', '2603290151', '2603290161',
    '2603290194', '2603290203', '2603290213', '2603290216', '2603290285',
    '2603290408', '2603290772', '2603300108', '2603300124', '2603300135',
    '2603300157', '2603300170', '2603300184', '2603300188', '2603300198',
    '2603300229', '2603300243', '2603300254', '2603300315', '2603300322',
    '2603300329', '2603300543', '2603300591', '2603300608', '2603311055',
    '2603311102', '2604010080', '2604020089', '2604030393', '2604040409',
    '2604120066', '2604140073', '2604140338', '2604210211', '2604230350',
    '2604240131', '2604250086', '2605010329', '2605040353', '2605120514',
    '2605130062', '2605130109'
) AND sbi.sbiid IS NULL;

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
-- JOIN sales.salesitem si ON si.sid = s.sid AND NOT (si.psiid = 0 AND si.type = 1)
-- JOIN sales.salesbalance sb ON sb.sid = s.sid AND sb.onetype = 0 AND sb.type = 0
-- LEFT JOIN sales.salesbalanceitem sbi ON sbi.sbid = sb.sbid AND sbi.siid = si.siid
-- WHERE s.no IN (
--     '2603210594', '2603210624', '2603210665', '2603210720', '2603210741',
--     '2603210769', '2603210796', '2603210817', '2603210827', '2603210842',
--     '2603210846', '2603210868', '2603210884', '2603210898', '2603210919',
--     '2603210928', '2603211003', '2603211006', '2603211021', '2603250437',
--     '2603280968', '2603290112', '2603290130', '2603290151', '2603290161',
--     '2603290194', '2603290203', '2603290213', '2603290216', '2603290285',
--     '2603290408', '2603290772', '2603300108', '2603300124', '2603300135',
--     '2603300157', '2603300170', '2603300184', '2603300188', '2603300198',
--     '2603300229', '2603300243', '2603300254', '2603300315', '2603300322',
--     '2603300329', '2603300543', '2603300591', '2603300608', '2603311055',
--     '2603311102', '2604010080', '2604020089', '2604030393', '2604040409',
--     '2604120066', '2604140073', '2604140338', '2604210211', '2604230350',
--     '2604240131', '2604250086', '2605010329', '2605040353', '2605120514',
--     '2605130062', '2605130109'
-- ) AND sbi.sbiid IS NULL;

-- ========== D. 退货结算孤儿单/重复单 修复（2026-10-05 盘点定稿） ==========
-- 两类问题：
--   D-孤儿: 退货单(salesrefunds)已不存在但其退货结算单(salesbalance onetype=3)仍挂账——2603300254 的
--           1704351(rid=410700)/1704352(rid=410698) 即此类(退货单已被物理删除, 结算单成孤儿);
--           全库盘点孤儿共 2 张, 均 status=0(预结算)无下游。
--   D-重复: 同一 rid 生成多张退货结算单(refundSalesBalance 原无防重, 重复提交所致), 全库 4 组:
--           rid=412916 → 1706678(0) / 1706679(0)          保留 MIN(1706678)
--           rid=417789 → 1728898(2已结算) / 1728899(0)     保留已结算(1728898)
--           rid=417801 → 1728969(2已结算) / 1728970(0)     保留已结算(1728969)
--           rid=417819 → 1729046(0) / 1729047(0)          保留 MIN(1729046)
-- 代码防重已补(refundSalesBalance 同 rid 已存在抛 370033, error.md 已登记), 新数据不再产生。

-- D-V1 验证: 孤儿退货结算单(执行修改前后均可跑, 修改后预期 0 行)
-- SELECT sb.sbid, sb.rid, sb.status, sb.total, sb.createTime
-- FROM sales.salesbalance sb
-- LEFT JOIN sales.salesrefunds r ON r.rid = sb.rid
-- WHERE sb.onetype = 3 AND sb.rid > 0 AND r.rid IS NULL;

-- D-V2 验证: 同 rid 重复退货结算单(修改后预期 0 行)
-- SELECT sb.rid, COUNT(*) AS cnt, GROUP_CONCAT(sb.sbid) AS sbids, GROUP_CONCAT(sb.status) AS statuses
-- FROM sales.salesbalance sb WHERE sb.onetype = 3 AND sb.rid > 0
-- GROUP BY sb.rid HAVING cnt > 1;

-- D1. 删除孤儿退货结算明细+单头(1704351/1704352, 退货单 410700/410698 已不存在)
DELETE FROM sales.salesbalanceitem WHERE sbid IN (1704351, 1704352);
DELETE FROM sales.salesbalance WHERE sbid IN (1704351, 1704352);

-- D2. 删除重复退货结算(保留规则: 组内有已结算(status=2)留之, 否则留 MIN(sbid); 只删 status=0 的)
-- D2a. rid=417789 / 417801: 保留已结算的 1728898 / 1728969, 删未结算的 1728899 / 1728970
DELETE FROM sales.salesbalanceitem WHERE sbid IN (1728899, 1728970);
DELETE FROM sales.salesbalance WHERE sbid IN (1728899, 1728970);

-- D2b. rid=412916 / 417819: 两张均预结算, 各留 MIN(sbid)=1706678 / 1729046
DELETE sbi FROM sales.salesbalanceitem sbi
JOIN sales.salesbalance sb ON sb.sbid = sbi.sbid
WHERE sb.onetype = 3 AND sb.rid IN (412916, 417819)
  AND sb.sbid NOT IN (
      SELECT k.sbid FROM (
          SELECT MIN(sbid) AS sbid FROM sales.salesbalance
          WHERE onetype = 3 AND rid IN (412916, 417819) GROUP BY rid
      ) k
  );

DELETE sb FROM sales.salesbalance sb
WHERE sb.onetype = 3 AND sb.rid IN (412916, 417819)
  AND sb.sbid NOT IN (
      SELECT k.sbid FROM (
          SELECT MIN(sbid) AS sbid FROM sales.salesbalance
          WHERE onetype = 3 AND rid IN (412916, 417819) GROUP BY rid
      ) k
  );

-- ⚠️ 执行前请复核 D-V1/D-V2 输出与本脚本写死的 sbid 一致(生产数据可能再变化);
--    若有新增孤儿/重复行, 按同样保留规则扩展。
