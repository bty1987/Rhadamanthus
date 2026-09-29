-- =====================================================================
-- NOODS_FAMILY_NID_DRIFT_REPAIR.sql
-- 定材(noods)公司归属漂移修复 —— normooditem 同族改绑
-- =====================================================================
-- 背景:
--   2607190121(未央方林69) 创建辅料单报 260082"辅料项总额已达上限"。
--   根因: data.normood 定材铺法是全局共享配置(按报价项模板 qiid 挂),
--   未央的报价项铺法绑定的是西安方林(50)的定材实例(706/707/1210等),
--   makeNormtion 生成 quotation.normooditem 时原样继承铺法的 nid;
--   而 aoods(工程辅材,按 bompany=69 过滤)绑定的是未央自己的定材行
--   (1217/1218/1219等)。领用校验 checkAccessoriesItem 按 aoods 传来的
--   nid 统计 normooditem 定额量 → nid 对不上 → 定额量=0 → 只剩浮动量,
--   正常领用被 260082 拦截。
--
-- 修复策略(只动订单侧明细,不动共享基础数据):
--   ① quotation.normooditem: 公司69在途单里挂"其他公司实例"的行,
--      按 pnid 族改绑到本公司同族实例(幂等,改完不再命中)。
--   ② 两边都是自建行(pnid=0,无集团行可桥)的 3 个 nid 按显式映射改绑。
--   ③ data.normood / data.noods / data.aoods 不动:
--      - data.normood 铺法被多公司共享(本例 qiid=141260 被西安98单引用),
--        改绑会污染西安方林的定额生成,绝对不动;
--      - data.noods 公司69配置齐全(25行,pnid无重复),无需修;
--      - data.aoods bompany=69 已绑 nid 的行零漂移,无需修
--        (625行 nid 为空不参与定材校验,属后续人工治理项)。
--
-- 执行顺序: 先于 fanglin-quotation / fanglin-inventory 新 jar(含pnid族
--   归一,SQL 不依赖 jar,但 jar 上线后重做定额再生成的 706 行也能过校验)。
-- 执行窗口: 无锁风险。执行计划已 EXPLAIN 验证(normooditem 1627万行):
--   decoration(company=69, 3291行) → quotation(qid PK) → normooditem
--   (qid 索引, 单报价约124行) → noods(PK/pnid索引), 全程索引驱动无全扫。
-- 幂等性: ①② 均幂等,可重复执行。
--
-- 🔴 注意: SQL 执行后、pnid 族归一 jar 上线前,不要对 2607190121 重做
--   定额(makeNormtion 按(sid,quoteld,ngid)复活旧明细行,铺法仍是西安
--   实例,会把 nid 复活回 706;jar 上线后则无所谓)。
-- =====================================================================

-- ---------------------------------------------------------------------
-- ⓪ 执行前盘点:列出公司69当前漂移行(预期 50 行/1 单/12 个 nid;
--    若未来出现新 qid,①按公司维度仍可覆盖,执行计划已验证全索引驱动)
-- ---------------------------------------------------------------------
SELECT q.orderId, ni.nid, w.name AS wrong_name, w.company AS wrong_co, COUNT(*) AS cnt
FROM quotation.normooditem ni
JOIN quotation.quotation q ON q.qid = ni.qid
JOIN decoration.decoration d ON d.orderId = q.orderId AND d.company = 69
JOIN data.noods w ON w.nid = ni.nid
WHERE w.company <> 69
GROUP BY q.orderId, ni.nid, w.name, w.company
ORDER BY q.orderId, ni.nid;

-- ---------------------------------------------------------------------
-- ① 公司69在途单:同族(pnid)改绑 —— 挂其他公司实例 → 改绑本公司实例
--    当前生产命中: 47 行,全部在 qid=952164(2607190121)
--    映射依据: 同一 pnid 集团族下 company=69 的启用实例
--    (706→1217, 707→1218, 708→1223, 709→1222, 715→1213, 716→1212,
--     1203→1224, 1204→1229, 1206→1221)
-- ---------------------------------------------------------------------
UPDATE quotation.normooditem ni
JOIN quotation.quotation q ON q.qid = ni.qid
JOIN decoration.decoration d ON d.orderId = q.orderId AND d.company = 69
JOIN data.noods w ON w.nid = ni.nid
JOIN data.noods r ON r.company = 69 AND r.status = 0 AND r.pnid = w.pnid
SET ni.nid = r.nid
WHERE w.company <> 69
  AND w.pnid <> 0;

-- ---------------------------------------------------------------------
-- ② 自建对显式改绑(两边 pnid=0,无集团行,按既定映射一对一)
--    1207 4分等电位内牙(西安) → 1225 4分等电位内牙(未央)
--    1208 4分内牙弯头(西安)   → 1226 4分内牙弯头(未央)
--    1210 6平方线(西安)       → 1219 6平方线(未央)
-- ---------------------------------------------------------------------
UPDATE quotation.normooditem SET nid = 1225 WHERE qid = 952164 AND nid = 1207;
UPDATE quotation.normooditem SET nid = 1226 WHERE qid = 952164 AND nid = 1208;
UPDATE quotation.normooditem SET nid = 1219 WHERE qid = 952164 AND nid = 1210;

-- ---------------------------------------------------------------------
-- ③ 验证
-- ---------------------------------------------------------------------
-- 3.1 公司69应不再有挂其他公司实例的明细(预期 0 行)
SELECT COUNT(*) AS leftover_drift
FROM quotation.normooditem ni
JOIN quotation.quotation q ON q.qid = ni.qid
JOIN decoration.decoration d ON d.orderId = q.orderId AND d.company = 69
JOIN data.noods w ON w.nid = ni.nid
WHERE w.company <> 69;

-- 3.2 本单(qid=952164)定材明细按 nid 汇总,2.5平方线(1217)应为 1277880
SELECT ni.nid, w.name, w.company, COUNT(*) AS cnt, SUM(ni.storenum) AS total_storenum
FROM quotation.normooditem ni
JOIN data.noods w ON w.nid = ni.nid
WHERE ni.qid = 952164
GROUP BY ni.nid, w.name, w.company
ORDER BY ni.nid;

-- 3.3 修复后校验口径复核(260082 闸门,应不再拦截):
--     定额量 normamount = 3.2 中 nid=1217 的 total_storenum = 1277880
--     浮动量 surplus    = data.noods 1217.surplus = 100000
--     已领量 acceamount = 1300(仅 AO2609282047 出货行 13000×100000÷1000000,
--                              AO2609281597 已撤销 status=3 不计)
--     线上公式 acceamount + num > normamount + surplus 才拦:
--     1300 + 13000 = 14300 < 1377880 → 放行 ✓
SELECT nid, surplus, calc, status FROM data.noods WHERE nid IN (1217, 1218, 1219);
