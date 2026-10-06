-- =============================================================================
-- constructionNode 工程节点 集团主数据 归纳/播种/挂接(一次性)
-- 日期: 2026-10-06
-- 前置: CONSTRUCTIONNODE_ADD_PCNID.sql 已执行(pcnid 列已存在)
-- 方案: docs/01-方案设计/工程节点集团版与分子公司关联方案.md §4
-- ⚠️ 执行序: ①盘点(只读) → ②业务确认合集清单 → ③播种(填入确认后的 name 清单) → ④挂接 → ⑤核验
--    ②③④ 独立于发版,可后置;不强制全量挂接,挂不上的保持自治(现状行为不变)
-- 幂等: 播种前按 name 查重防重复插行;挂接 WHERE pcnid = 0 重跑自动跳过已挂行
-- =============================================================================

-- ---------- ① 盘点(只读,出合集清单供业务确认) ----------

-- 1a. 节点名合集 + 覆盖公司数(集团主数据候选底稿,覆盖面倒序)
SELECT name, COUNT(DISTINCT company) AS companyCnt, MIN(cnid) AS sampleCnid
FROM data.constructionnode WHERE company > 0
GROUP BY name ORDER BY companyCnt DESC, name;

-- 1b. 核验: 同公司内 name 唯一性(挂接键唯一性前提,有行则需人工先处理)
SELECT company, name, COUNT(*) AS cnt
FROM data.constructionnode WHERE company > 0
GROUP BY company, name HAVING COUNT(*) > 1;

-- 1c. 核验: company=0 集团段现状(播种前应为空或仅占位行)
SELECT cnid, name, status, sort FROM data.constructionnode WHERE company = 0;

-- ---------- ② 集团行播种(业务确认合集后,把 name 清单填入 IN 列表) ----------
-- 代表行取覆盖面最大公司(本模板以 company=66 为例,可按 1a 的 sampleCnid 所在公司替换);
-- 直接 SQL 播种绕过消息队列 NODE_CREATED 事件 —— 集团行非业务行,外部系统无需感知(备注留痕)。

-- 2a. 防重预检:待播 name 在 company=0 已存在时跳过该行(幂等)
-- 2b. 播种(⚠️ IN 清单必须来自业务确认,禁止整表照搬)
-- INSERT INTO data.constructionnode
--   (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid,
--    timeLimit, accessoryLimit, salaryLimit, salaryFloor, process, sort, proset, kino, kiname, mark, status, company)
-- SELECT name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid,
--        timeLimit, accessoryLimit, salaryLimit, salaryFloor, process, sort, proset, kino, kiname, mark, status, 0
-- FROM data.constructionnode
-- WHERE company = 66
--   AND name IN (/* 逐行列出业务确认的节点名,如 '拆除','砌墙',... */)
--   AND name NOT IN (SELECT name FROM data.constructionnode WHERE company = 0);
--
-- 2c. 播种核验: 行数应=IN 清单行数;集团行 pcnid 恒 0(勿手工赋值)
-- SELECT cnid, name, sort, status FROM data.constructionnode WHERE company = 0 ORDER BY sort;

-- ---------- ③ 挂接(name 匹配,一条 UPDATE JOIN 全量挂,幂等) ----------

-- 3a. 挂接(仅未关联行;集团行自身 pcnid 恒 0 不参与)
-- UPDATE data.constructionnode c
-- JOIN data.constructionnode g ON g.company = 0 AND g.name = c.name
-- SET c.pcnid = g.cnid
-- WHERE c.company > 0 AND c.pcnid = 0;

-- 3b. 未挂接清单(同名异写/一词多节点的例外行,人工拍板逐行 UPDATE,参照 NOODS_PNID_GROUP_MAPPING_UPDATE.sql 先例)
-- SELECT c.cnid, c.company, c.name
-- FROM data.constructionnode c
-- WHERE c.company > 0 AND c.pcnid = 0
--   AND c.name NOT IN (SELECT name FROM data.constructionnode WHERE company = 0);

-- ---------- ④ 核验收口 ----------

-- 4a. 分布:应≈每个集团行一组(pcnid=0 组=未挂接自治行,允许存在)
-- SELECT pcnid, COUNT(*) AS cnt FROM data.constructionnode WHERE company > 0 GROUP BY pcnid ORDER BY cnt DESC;

-- 4b. 抽查:随机 5 个集团行,列出其挂接的公司行
-- SELECT g.cnid AS gcnid, g.name AS gname, c.cnid, c.company, c.name
-- FROM data.constructionnode g
-- LEFT JOIN data.constructionnode c ON c.pcnid = g.cnid
-- WHERE g.company = 0 ORDER BY g.cnid LIMIT 50;
