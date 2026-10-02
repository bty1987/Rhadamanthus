-- =====================================================================
-- CUSTOMERDEPTRULE_SUPERVISION_GROUPS.sql
-- 客源部门规则(customer.customerdeptrule): 各城市监理组 × 各业务公司"工程返单客源"配置
--
-- 参考样板(2026-08 北京手工插入):
--   cdrid 4958: did=4217 北京方林监理组, dbid=2497, type=2, atttype=1, focus=0, company=91(北京方林装饰)
--   cdrid 4959: 同上 company=92(北京方林整装)
--
-- 运行时语义(CustomerSourceServiceImpl.issueCustomerChance):
--   发放客源时按 (创建人部门did, 客源业务类型dbid) 查本表, 命中则用行内 atttype 覆盖分配方式;
--   atttype: 0=自动轮训设计师 1=指派到人 2=指派部门 3=分区。
--   即: 监理组的人发放"工程返单客源"时改为【指派到人】。
--
-- 现状缺口(2026-09-24 生产核实):
--   工程公司(73)名下 39 个城市监理组, 除北京 4217 外全部只有 (组did, dbid=2130 工程公司自用) 行,
--   对各城市业务公司自己的工程返单客源(dbid=5/26/46/...)无规则, 发放时走系统默认。
--
-- 本脚本: 每个监理组 × 其对应业务公司 × 该公司自己的"工程返单客源"dbid, 共 38 行。
--   注意: 目标 dbid 一律取【业务公司自己的】返单客源类型(生产实证 c47/c55/c91/c92 客源均主用自家dbid);
--         北京样板 4959(c92→2497) 经查 c92 客源从未使用过 2497(2528 才是 92 自家返单类型), 疑为笔误, 见文末待拍板项。
--
-- 执行时机: 随时可执行, 纯配置, 零代码依赖(运行时代码已支持)
-- 幂等性: 可重复执行(NOT EXISTS 防重)
-- 影响面: 仅新增 customerdeptrule 行, 不改动存量行
-- =====================================================================

-- ---------- 验证前置(执行前跑一次, 应返回 2 行即仅北京) ----------
-- SELECT r.cdrid, r.did, d.name, r.dbid, r.company
--   FROM customer.customerdeptrule r JOIN communion.department d ON d.did = r.did
--  WHERE r.did IN (SELECT did FROM communion.department WHERE company = 73 AND name LIKE '%监理组%' AND status = 1)
--    AND r.dbid NOT IN (2130);

-- ---------- 沈阳 ----------
-- 沈阳方林监理组(3647) × 沈阳方林装饰(1) 返单5
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 5, 0, 1, 30823, NOW() FROM communion.department d
WHERE d.did = 3647 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3647 AND x.dbid = 5);

-- 沈阳1918监理组(3611) × 沈阳1918装饰(2) 返单26
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 26, 0, 2, 30823, NOW() FROM communion.department d
WHERE d.did = 3611 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3611 AND x.dbid = 26);

-- 沈阳屿林监理组(3657) × 沈阳屿林装饰(3) 返单46
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 46, 0, 3, 30823, NOW() FROM communion.department d
WHERE d.did = 3657 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3657 AND x.dbid = 46);

-- 沈阳恩林监理组(3632) × 恩林房翻新(9) 返单166
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 166, 0, 9, 30823, NOW() FROM communion.department d
WHERE d.did = 3632 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3632 AND x.dbid = 166);

-- 沈阳爱林监理组(3853) × 沈阳爱林装饰(12) 返单226
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 226, 0, 12, 30823, NOW() FROM communion.department d
WHERE d.did = 3853 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3853 AND x.dbid = 226);

-- ---------- 辽宁其他 ----------
-- 鞍山爱林监理组(3497) × 鞍山爱林装饰(46) 返单1089
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1089, 0, 46, 30823, NOW() FROM communion.department d
WHERE d.did = 3497 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3497 AND x.dbid = 1089);

-- 鞍山方林监理组(4371) × 鞍山方林装饰(95) 返单2622
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 2622, 0, 95, 30823, NOW() FROM communion.department d
WHERE d.did = 4371 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 4371 AND x.dbid = 2622);

-- 本溪方林监理组(3507) × 本溪方林装饰(35) 返单686
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 686, 0, 35, 30823, NOW() FROM communion.department d
WHERE d.did = 3507 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3507 AND x.dbid = 686);

-- 朝阳方林监理组(3517) × 朝阳方林装饰(31) 返单606
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 606, 0, 31, 30823, NOW() FROM communion.department d
WHERE d.did = 3517 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3517 AND x.dbid = 606);

-- 大连方林监理组(3526) × 大连方林装饰(41) 返单1057
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1057, 0, 41, 30823, NOW() FROM communion.department d
WHERE d.did = 3526 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3526 AND x.dbid = 1057);

-- 大连1918监理组(3524) × 大连1918装饰(42) 返单1065
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1065, 0, 42, 30823, NOW() FROM communion.department d
WHERE d.did = 3524 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3524 AND x.dbid = 1065);

-- 丹东方林监理组(3535) × 丹东方林装饰(37) 返单726
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 726, 0, 37, 30823, NOW() FROM communion.department d
WHERE d.did = 3535 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3535 AND x.dbid = 726);

-- 葫芦岛方林监理组(3572) × 葫芦岛方林装饰(38) 返单746
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 746, 0, 38, 30823, NOW() FROM communion.department d
WHERE d.did = 3572 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3572 AND x.dbid = 746);

-- 盘锦方林监理组(3596) × 盘锦方林装饰(36) 返单706
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 706, 0, 36, 30823, NOW() FROM communion.department d
WHERE d.did = 3596 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3596 AND x.dbid = 706);

-- ---------- 吉林/黑龙江 ----------
-- 长春方林监理组(3705) × 长春方林装饰(16) 返单306
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 306, 0, 16, 30823, NOW() FROM communion.department d
WHERE d.did = 3705 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3705 AND x.dbid = 306);

-- 长春爱林监理组(3860) × 长春爱林装饰(21) 返单406
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 406, 0, 21, 30823, NOW() FROM communion.department d
WHERE d.did = 3860 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3860 AND x.dbid = 406);

-- 哈尔滨方林监理组(3546) × 哈尔滨方林装饰(29) 返单566
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 566, 0, 29, 30823, NOW() FROM communion.department d
WHERE d.did = 3546 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3546 AND x.dbid = 566);

-- 哈尔滨爱林监理组(3838) × 哈尔滨爱林装饰(30) 返单586
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 586, 0, 30, 30823, NOW() FROM communion.department d
WHERE d.did = 3838 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3838 AND x.dbid = 586);

-- ---------- 华北 ----------
-- 天津方林监理组(3661) × 天津方林装饰(66) 返单1706
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1706, 0, 66, 30823, NOW() FROM communion.department d
WHERE d.did = 3661 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3661 AND x.dbid = 1706);

-- 天津爱林监理组(3660) × 天津爱林装饰(67) 返单1722
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1722, 0, 67, 30823, NOW() FROM communion.department d
WHERE d.did = 3660 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3660 AND x.dbid = 1722);

-- 青岛方林监理组(4106) × 青岛方林装饰(79) 返单2165
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 2165, 0, 79, 30823, NOW() FROM communion.department d
WHERE d.did = 4106 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 4106 AND x.dbid = 2165);

-- 青岛爱林监理组(4107) × 青岛爱林装饰(80) 返单2180
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 2180, 0, 80, 30823, NOW() FROM communion.department d
WHERE d.did = 4107 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 4107 AND x.dbid = 2180);

-- ---------- 华东 ----------
-- 南京方林监理组(3582) × 南京方林装饰(47) 返单1073
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1073, 0, 47, 30823, NOW() FROM communion.department d
WHERE d.did = 3582 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3582 AND x.dbid = 1073);

-- 南京爱林监理组(3591) × 南京爱林装饰(48) 返单1081
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1081, 0, 48, 30823, NOW() FROM communion.department d
WHERE d.did = 3591 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3591 AND x.dbid = 1081);

-- 合肥方林监理组(3557) × 合肥方林装饰(7) 返单126
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 126, 0, 7, 30823, NOW() FROM communion.department d
WHERE d.did = 3557 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3557 AND x.dbid = 126);

-- 合肥爱林监理组(3560) × 合肥爱林装饰(20) 返单386
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 386, 0, 20, 30823, NOW() FROM communion.department d
WHERE d.did = 3560 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3560 AND x.dbid = 386);

-- 合肥1918监理组(3833) × 合肥1918装饰(56) 返单1196
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1196, 0, 56, 30823, NOW() FROM communion.department d
WHERE d.did = 3833 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3833 AND x.dbid = 1196);

-- 安庆方林监理组(4088) × 安庆方林装饰(82) 返单2195
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 2195, 0, 82, 30823, NOW() FROM communion.department d
WHERE d.did = 4088 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 4088 AND x.dbid = 2195);

-- ---------- 中西部 ----------
-- 武汉方林监理组(3671) × 武汉方林装饰(8) 返单146
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 146, 0, 8, 30823, NOW() FROM communion.department d
WHERE d.did = 3671 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3671 AND x.dbid = 146);

-- 武汉爱林监理组(3675) × 武汉爱林装饰(22) 返单426
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 426, 0, 22, 30823, NOW() FROM communion.department d
WHERE d.did = 3675 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3675 AND x.dbid = 426);

-- 武汉1918监理组(3845) × 武汉1918装饰(34) 返单666
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 666, 0, 34, 30823, NOW() FROM communion.department d
WHERE d.did = 3845 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3845 AND x.dbid = 666);

-- 西安方林监理组(3679) × 西安方林装饰(50) 返单1105
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1105, 0, 50, 30823, NOW() FROM communion.department d
WHERE d.did = 3679 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3679 AND x.dbid = 1105);

-- 西安爱林监理组(3856) × 西安爱林装饰(52) 返单1129
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1129, 0, 52, 30823, NOW() FROM communion.department d
WHERE d.did = 3856 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3856 AND x.dbid = 1129);

-- 宜昌爱林监理组(3702) × 宜昌爱林装饰(51) 返单1113
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1113, 0, 51, 30823, NOW() FROM communion.department d
WHERE d.did = 3702 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3702 AND x.dbid = 1113);

-- 重庆方林监理组(3711) × 重庆方林装饰(44) 返单1121
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1121, 0, 44, 30823, NOW() FROM communion.department d
WHERE d.did = 3711 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3711 AND x.dbid = 1121);

-- 重庆爱林监理组(3715) × 重庆爱林装饰(49) 返单1097
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 1097, 0, 49, 30823, NOW() FROM communion.department d
WHERE d.did = 3715 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 3715 AND x.dbid = 1097);

-- 成都方林监理组(4070) × 成都方林装饰(75) 返单2135
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 2135, 0, 75, 30823, NOW() FROM communion.department d
WHERE d.did = 4070 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 4070 AND x.dbid = 2135);

-- 成都爱林监理组(4071) × 成都爱林装饰(76) 返单2150
INSERT INTO customer.customerdeptrule (name, did, type, atttype, dbid, focus, company, cuid, createTime)
SELECT d.name, d.did, 2, 1, 2150, 0, 76, 30823, NOW() FROM communion.department d
WHERE d.did = 4071 AND NOT EXISTS (SELECT 1 FROM customer.customerdeptrule x WHERE x.did = 4071 AND x.dbid = 2150);

-- ---------- 执行后复核(应返回 38 行) ----------
-- SELECT r.cdrid, r.did, d.name AS dept_name, r.dbid, b.name AS busitype_name, r.company
--   FROM customer.customerdeptrule r
--   JOIN communion.department d ON d.did = r.did
--   JOIN data.decorationbusitype b ON b.dbid = r.dbid
--  WHERE r.type = 2 AND r.atttype = 1 AND r.did IN
--        (SELECT did FROM communion.department WHERE company = 73 AND name LIKE '%监理组%' AND status = 1)
--    AND r.dbid NOT IN (2130, 2497)
--  ORDER BY r.company;

-- =====================================================================
-- 待拍板项(不在本脚本内, 由业务确认后单独执行)
-- =====================================================================
-- 1. 北京样板疑似笔误: cdrid 4959 (c92 北京方林整装) 的 dbid=2497 是 c91 的返单类型,
--    生产实证 c92 客源从未使用 2497(自家返单为 2528, 仅用过 1 次), 该行永远不会命中。
--    若确认意图是"整装也走指派到人", 应改为:
--    UPDATE customer.customerdeptrule SET dbid = 2528 WHERE cdrid = 4959;
--
-- 2. 归属不明的两个监理组(未配置, 需业务确认服务对象):
--    - 沈阳铁西爱林监理组(3621): 疑服务 沈北爱林装饰(57, 返单1204), 但"铁西"与"沈北"区域名不一致
--      INSERT 模板: (did=3621, dbid=1204, company=57)
--    - 安庆爱林监理组(4089): 无"安庆爱林"公司, 疑服务 安庆方林整装(83, 返单2210)
--      INSERT 模板: (did=4089, dbid=2210, company=83)
--
-- 3. 有自己的工程返单客源但无专属监理组的公司(是否由同城监理组兼管, 需业务确认):
--    盘锦爱林24/本溪爱林25/葫芦岛爱林26/丹东爱林27/朝阳爱林28/哈尔滨1918 39/长春1918 40/
--    盘锦宜家43/沈阳方林整装55/汉口方林68/未央方林69/海城方林70/宜昌方林72/安庆方林整装83/
--    秦皇岛方林87/营口方林88/辽阳方林89/阜新方林90(返单类型重复两条2280+2357需先清理)/
--    北京方林大宅93/北京分总94(连返单客源类型都没有)
--    这些公司现依赖老式"监理部"行(部门在业务公司内)或无任何规则。
