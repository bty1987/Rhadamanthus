-- =============================================================================
-- 济南基础数据对齐青岛 SQL (2026-10-02)
--
-- 范围: 济南方林装饰(98) <- 青岛方林装饰(79) / 济南爱林装饰(99) <- 青岛爱林装饰(80)
--       data.constructionnode(工程节点) / data.paymenttype(款项类型) / data.decorationbusitype(业务类型)
--
-- 前置核查(2026-10-02 生产只读库):
--   * 98/99 三表均为 0 行——9-20 济南建司脚本(sqls/misc/济南三公司数据创建SQL.sql)的
--     "四、data 基础数据三表"段从未在生产执行, 本脚本为首次灌入, 纯 INSERT 无需 DELETE;
--   * 98/99 无客源/无订单/无排期, 无业务数据引用风险;
--   * 关联列核查: busitype.fdbid 源公司全空, node.estid 仅 28/29(源公司共用的全局引用,
--     两家青岛公司同值且已投产), paymenttype.bustype/atttype/type/paytype 均为枚举非外键
--     → 直接 INSERT...SELECT 无需 id 重映射;
--   * 列清单含 09-29 新增的 constructionnode.salaryFloor(青岛两司当前全 0, 照抄)。
--
-- 安检(执行前逐条核对):
--   SELECT cid,name,block FROM communion.company WHERE cid IN (79,80,98,99);
--   -- 应= 79青岛方林装饰(block1) / 80青岛爱林装饰(block4) / 98济南方林装饰(block1) / 99济南爱林装饰(block4)
--   SELECT COUNT(*) FROM data.constructionnode WHERE company IN (98,99);
--   SELECT COUNT(*) FROM data.paymenttype      WHERE company IN (98,99);
--   SELECT COUNT(*) FROM data.decorationbusitype WHERE company IN (98,99);
--   -- 三条均应 = 0(非 0 说明已灌过, 停止执行并人工核对来源)
--
-- 馃敶 防重提示: 本脚本执行后, 勿再补跑 济南三公司数据创建SQL.sql 的"四、data 基础数据三表"段
--    (其 98/99 腿源为北京 91/92, 补跑会与青岛版重复)。
--
-- 执行后核验(见文件尾), 预期: node 98=23/99=23, ptype 98=65/99=65, busitype 98=16/99=16
-- =============================================================================

START TRANSACTION;

-- ----------------------------------------------------------------------------
-- 一、济南方林装饰 (company=98) <- 青岛方林装饰 (company=79)
-- ----------------------------------------------------------------------------

-- 1. 工程节点 (23 行)
INSERT INTO data.constructionnode (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, company, salaryFloor)
SELECT name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, 98, salaryFloor
FROM data.constructionnode WHERE company = 79;

-- 2. 款项类型 (65 行)
INSERT INTO data.paymenttype (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company)
SELECT name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, 98
FROM data.paymenttype WHERE company = 79;

-- 3. 装修业务类型 (16 行)
INSERT INTO data.decorationbusitype (no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, isMember, status, company)
SELECT no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, isMember, status, 98
FROM data.decorationbusitype WHERE company = 79;

-- ----------------------------------------------------------------------------
-- 二、济南爱林装饰 (company=99) <- 青岛爱林装饰 (company=80)
-- ----------------------------------------------------------------------------

-- 1. 工程节点 (23 行)
INSERT INTO data.constructionnode (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, company, salaryFloor)
SELECT name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid, timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, status, 99, salaryFloor
FROM data.constructionnode WHERE company = 80;

-- 2. 款项类型 (65 行)
INSERT INTO data.paymenttype (name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, company)
SELECT name, type, paytype, bustype, atttype, payScale, saleScale, code, taxrate, kino, kiname, kibalance, billType, status, 99
FROM data.paymenttype WHERE company = 80;

-- 3. 装修业务类型 (16 行)
INSERT INTO data.decorationbusitype (no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, isMember, status, company)
SELECT no, name, alias, fdbid, outside, sort, type, isRefer, notSalesmanRate, isAward, isMember, status, 99
FROM data.decorationbusitype WHERE company = 80;

COMMIT;

-- ============================================================================
-- 执行后核验
-- ============================================================================
-- 1. 行数(预期: 98=79 的 23/65/16, 99=80 的 23/65/16)
-- SELECT 'node' t, company, COUNT(*) FROM data.constructionnode WHERE company IN (79,80,98,99) GROUP BY company
-- UNION ALL SELECT 'ptype', company, COUNT(*) FROM data.paymenttype WHERE company IN (79,80,98,99) GROUP BY company
-- UNION ALL SELECT 'busitype', company, COUNT(*) FROM data.decorationbusitype WHERE company IN (79,80,98,99) GROUP BY company;
--
-- 2. 名单一致性(两两应均 = 0)
-- SELECT COUNT(*) FROM data.constructionnode s WHERE s.company=79
--   AND NOT EXISTS (SELECT 1 FROM data.constructionnode t WHERE t.company=98 AND t.name=s.name AND t.sort=s.sort)
-- UNION ALL SELECT COUNT(*) FROM data.constructionnode s WHERE s.company=80
--   AND NOT EXISTS (SELECT 1 FROM data.constructionnode t WHERE t.company=99 AND t.name=s.name AND t.sort=s.sort)
-- UNION ALL SELECT COUNT(*) FROM data.paymenttype s WHERE s.company=79
--   AND NOT EXISTS (SELECT 1 FROM data.paymenttype t WHERE t.company=98 AND t.name=s.name AND t.type=s.type AND t.atttype=s.atttype)
-- UNION ALL SELECT COUNT(*) FROM data.paymenttype s WHERE s.company=80
--   AND NOT EXISTS (SELECT 1 FROM data.paymenttype t WHERE t.company=99 AND t.name=s.name AND t.type=s.type AND t.atttype=s.atttype)
-- UNION ALL SELECT COUNT(*) FROM data.decorationbusitype s WHERE s.company=79
--   AND NOT EXISTS (SELECT 1 FROM data.decorationbusitype t WHERE t.company=98 AND t.no=s.no AND t.name=s.name)
-- UNION ALL SELECT COUNT(*) FROM data.decorationbusitype s WHERE s.company=80
--   AND NOT EXISTS (SELECT 1 FROM data.decorationbusitype t WHERE t.company=99 AND t.no=s.no AND t.name=s.name);
-- ============================================================================
