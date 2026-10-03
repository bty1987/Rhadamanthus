-- =====================================================================
-- 北京三公司施工节点"放线"之后插"精工画线"
-- 公司:91 北京方林装饰 / 92 北京方林整装 / 93 北京方林大宅(1918系)
--      (94 北京分总非装修公司,不在范围)
-- 位置:三家节点序列一致(铲大白5/放线6/拆除7/力工8/...),放线 sort=6 无空隙,
--      → 精工画线插入 sort=7,原 sort>=7 的节点 +1(拆除7→8/力工8→9/...;
--        92 的踢脚线安装 23→24)。
-- 字段:完全复制本公司"放线"行(60000/60000 段款、salaryLimit=50000、
--      accessoryLimit=99999000、proset=1 等),仅改 name/sort。
--      同"拆除"先例(2026-09-10 已执行):kino/kiname 原样带放线行
--      (kino=3/kiname='放线',画线属放线性质工种),不另设值。
--
-- 与先例脚本的关系:均按锚点节点当前 sort 动态取位,执行顺序无关——
--   · CONSTRUCTIONNODE_DEMOLITION_INSERT.sql(拆除,同锚点放线,已执行)
--   · CONSTRUCTIONNODE_SKIRTING_INSERT.sql(踢脚线安装,锚点木门安装,已执行)
--
-- 🔴 七表挪位(同踢脚线/拆除先例模式):construction.schedule(当前进度)、
--      constructionschedule/constructiondrawing/constructer/addreduce/
--      accessories/workersalary 的 schedule 为节点 sort 活引用(非快照),
--      必须同步 +1,否则存量数据位置错乱(进度 7 原指拆除,挪后变精工画线)。
--      存量施工单不自动出现精工画线节点行(进度跳过,先例同此)。
--      9 月新增 construction.materialplan 仅存 cnid(节点主键)不存 sort,
--      不受挪位影响(且三家现 0 行,2026-10-03 预演时核过)。
--
-- 只读库预演行数(2026-10-03,阈值=7):
--   node:挪位 48 行(91:14/92:20/93:14);插入 3 行
--   construction 28 / constructionschedule 1127 / constructiondrawing 226
--   constructer 0 / addreduce 0 / accessories 308 / workersalary 56
--   (业务表合计约 1745 行,量小,无需刻意低峰)
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
      AND NOT EXISTS (SELECT 1 FROM data.constructionnode k WHERE k.company = d.company AND k.name = '精工画线')
) t ON n.company = t.company
SET n.sort = n.sort + 1
WHERE n.sort >= t.newsort;

-- 2. 节点插入:复制本公司放线行,改名"精工画线",sort=放线sort+1
INSERT INTO data.constructionnode
    (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid,
     timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname,
     mark, account, status, company)
SELECT
    '精工画线', d.precheck, d.postcheck, d.stacheck, d.fincheck, d.startalk, d.endtalk, d.sstid, d.estid,
    d.timeLimit, d.accessoryLimit, d.salaryLimit, d.process, d.sort + 1, d.proset, d.kino, d.kiname,
    d.mark, d.account, d.status, d.company
FROM data.constructionnode d
WHERE d.name = '放线' AND d.status = 0 AND d.company IN (91, 92, 93)
  AND NOT EXISTS (SELECT 1 FROM data.constructionnode k WHERE k.company = d.company AND k.name = '精工画线');

-- 3. 七张业务表 schedule 引用同步挪位(阈值=本公司精工画线行 sort)
UPDATE construction.construction c
JOIN decoration.decoration d ON c.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '精工画线' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET c.schedule = c.schedule + 1
WHERE c.schedule >= t.newsort;

UPDATE construction.constructionschedule cs
JOIN decoration.decoration d ON cs.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '精工画线' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET cs.schedule = cs.schedule + 1
WHERE cs.schedule >= t.newsort;

UPDATE construction.constructiondrawing cd
JOIN construction.construction c ON cd.cid = c.cid
JOIN decoration.decoration d ON c.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '精工画线' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET cd.schedule = cd.schedule + 1
WHERE cd.schedule >= t.newsort;

UPDATE construction.constructer cu
JOIN decoration.decoration d ON cu.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '精工画线' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET cu.schedule = cu.schedule + 1
WHERE cu.schedule >= t.newsort;

UPDATE quotation.addreduce ar
JOIN decoration.decoration d ON ar.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '精工画线' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET ar.schedule = ar.schedule + 1
WHERE ar.schedule >= t.newsort;

UPDATE inventory.accessories a
JOIN decoration.decoration d ON a.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '精工画线' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET a.schedule = a.schedule + 1
WHERE a.schedule >= t.newsort;

UPDATE salary.workersalary ws
JOIN decoration.decoration d ON ws.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '精工画线' AND x.company IN (91, 92, 93)) t ON t.company = d.company
SET ws.schedule = ws.schedule + 1
WHERE ws.schedule >= t.newsort;

COMMIT;

-- ---------------------------------------------------------------------
-- 验证(只读)
-- ---------------------------------------------------------------------
-- 4.1 应返回 3(三家均配精工画线)
-- SELECT COUNT(*) FROM data.constructionnode WHERE name='精工画线' AND company IN (91,92,93);
--
-- 4.2 抽查序列连续性(如公司 91,期望 ...铲大白5/放线6/精工画线7/拆除8/力工9/...)
-- SELECT cnid,name,sort FROM data.constructionnode WHERE company=91 AND status=0 ORDER BY sort;
--
-- 4.3 新插入行(应 3 行,sort=7)
-- SELECT cnid,company,sort,precheck,postcheck,salaryLimit,proset FROM data.constructionnode WHERE name='精工画线' AND company IN (91,92,93);

-- ---------------------------------------------------------------------
-- 回滚(如需,逆序:先回挪业务表,再删节点行,再回挪 node)
-- ---------------------------------------------------------------------
-- 七表把 +1 改 -1(阈值同式),然后:
-- DELETE FROM data.constructionnode WHERE name='精工画线' AND company IN (91,92,93);
-- UPDATE data.constructionnode n
-- JOIN (SELECT d.company, d.sort+1 AS newsort FROM data.constructionnode d WHERE d.name='放线' AND d.company IN (91,92,93)) t
--   ON n.company=t.company
-- SET n.sort=n.sort-1 WHERE n.sort>t.newsort;
