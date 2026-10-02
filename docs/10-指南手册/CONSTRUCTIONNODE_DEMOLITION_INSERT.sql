-- =====================================================================
-- 北京三公司施工节点"放线"之后插"拆除"
-- 公司:91 北京方林装饰 / 92 北京方林整装 / 93 北京方林大宅
--      (94 北京分总非装修公司,不在范围)
-- 位置:三家节点序列一致(铲大白5/放线6/力工7/...),放线 sort=6 无空隙,
--      → 拆除插入 sort=7,原 sort>=7 的节点 +1。
-- 字段:完全复制本公司"放线"行(60000/60000 段款、salaryLimit=50000、
--      accessoryLimit=99999000、proset=1 等),仅改 name/sort。
--      放线之后同段同性质(施工前期),无既有"拆除"参照,不另设值。
--
-- 🔴 七表挪位(同踢脚线脚本/历史先例模式):construction.schedule(当前
--      进度)、constructionschedule/constructiondrawing/constructer/
--      addreduce/accessories/workersalary 的 schedule 为节点 sort 活引用,
--      必须同步 +1。存量施工单不自动出现拆除节点行(进度跳过,先例同此)。
--
-- 与 CONSTRUCTIONNODE_SKIRTING_INSERT.sql(踢脚线)顺序无关:两者均按
--      锚点节点当前 sort 动态取位,先后执行结果一致。
--      (92 北京方林整装同时命中两脚本,节点最终形态:...放线6/拆除7/力工8/
--        .../木门21→22/踢脚线22→23/...)
--
-- 只读库预演行数(2026-09-10,阈值=7):
--   node:挪位 44 行(91:13/92:18/93:13);插入 3 行
--   construction 11 / constructionschedule 339 / constructiondrawing 71
--   constructer 0 / addreduce 0 / accessories 88 / workersalary 29
--
-- ⚠️ 整体单事务一次性执行;第 3 步业务表挪位不可单独重跑,
--    重跑前先执行 4.1 验证(应返回 3),为 3 则不要再执行。
-- =====================================================================

START TRANSACTION;

-- 1. 节点挪位:三家公司放线(sort+1)之后的节点 sort+1
UPDATE data.constructionnode n
JOIN (
    SELECT d.company, d.sort + 1 AS newsort
    FROM data.constructionnode d
    WHERE d.name = '放线' AND d.status = 0 AND d.company IN (91, 92, 93)
      AND NOT EXISTS (SELECT 1 FROM data.constructionnode k WHERE k.company = d.company AND k.name = '拆除')
) t ON n.company = t.company
SET n.sort = n.sort + 1
WHERE n.sort >= t.newsort;

-- 2. 节点插入:复制本公司放线行,改名"拆除",sort=放线sort+1
INSERT INTO data.constructionnode
    (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid,
     timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname,
     mark, account, status, company)
SELECT
    '拆除', d.precheck, d.postcheck, d.stacheck, d.fincheck, d.startalk, d.endtalk, d.sstid, d.estid,
    d.timeLimit, d.accessoryLimit, d.salaryLimit, d.process, d.sort + 1, d.proset, d.kino, d.kiname,
    d.mark, d.account, d.status, d.company
FROM data.constructionnode d
WHERE d.name = '放线' AND d.status = 0 AND d.company IN (91, 92, 93)
  AND NOT EXISTS (SELECT 1 FROM data.constructionnode k WHERE k.company = d.company AND k.name = '拆除');

-- 3. 七张业务表 schedule 引用同步挪位(阈值=本公司拆除行 sort)
UPDATE construction.construction c
JOIN decoration.decoration d ON c.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '拆除' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET c.schedule = c.schedule + 1
WHERE c.schedule >= t.newsort;

UPDATE construction.constructionschedule cs
JOIN decoration.decoration d ON cs.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '拆除' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET cs.schedule = cs.schedule + 1
WHERE cs.schedule >= t.newsort;

UPDATE construction.constructiondrawing cd
JOIN construction.construction c ON cd.cid = c.cid
JOIN decoration.decoration d ON c.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '拆除' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET cd.schedule = cd.schedule + 1
WHERE cd.schedule >= t.newsort;

UPDATE construction.constructer cu
JOIN decoration.decoration d ON cu.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '拆除' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET cu.schedule = cu.schedule + 1
WHERE cu.schedule >= t.newsort;

UPDATE quotation.addreduce ar
JOIN decoration.decoration d ON ar.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '拆除' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET ar.schedule = ar.schedule + 1
WHERE ar.schedule >= t.newsort;

UPDATE inventory.accessories a
JOIN decoration.decoration d ON a.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '拆除' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET a.schedule = a.schedule + 1
WHERE a.schedule >= t.newsort;

UPDATE salary.workersalary ws
JOIN decoration.decoration d ON ws.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '拆除' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET ws.schedule = ws.schedule + 1
WHERE ws.schedule >= t.newsort;

COMMIT;

-- ---------------------------------------------------------------------
-- 验证(只读)
-- ---------------------------------------------------------------------
-- 4.1 应返回 3(三家均配拆除)
-- SELECT COUNT(*) FROM data.constructionnode WHERE name='拆除' AND company IN (91,92,93);
--
-- 4.2 抽查序列连续性(如公司 91)
-- SELECT cnid,name,sort FROM data.constructionnode WHERE company=91 AND status=0 ORDER BY sort;
--
-- 4.3 新插入行(应 3 行,sort=7)
-- SELECT cnid,company,sort,precheck,postcheck,salaryLimit,proset FROM data.constructionnode WHERE name='拆除' AND company IN (91,92,93);

-- ---------------------------------------------------------------------
-- 回滚(如需,逆序:先回挪业务表,再删节点行,再回挪 node)
-- ---------------------------------------------------------------------
-- 七表把 +1 改 -1(阈值同式),然后:
-- DELETE FROM data.constructionnode WHERE name='拆除' AND company IN (91,92,93);
-- UPDATE data.constructionnode n
-- JOIN (SELECT d.company, d.sort+1 AS newsort FROM data.constructionnode d WHERE d.name='放线' AND d.company IN (91,92,93)) t
--   ON n.company=t.company
-- SET n.sort=n.sort-1 WHERE n.sort>t.newsort;
