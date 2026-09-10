-- =====================================================================
-- 全国整装公司施工节点补插"踢脚线安装"(木门安装之后)
-- 依照历史先例 SQL 模式(node 挪位插入 + 七张业务表 schedule 引用同步挪位)。
--
-- 背景:公司12(沈阳爱林)/55(沈阳方林整装)/57(沈北爱林)已有"踢脚线安装"
--       (cnid 1542/1543/1544,紧随木门安装,即参照模板),本脚本推广到其余
--       25 家有"木门安装"节点的整装公司。
-- 范围:block=1 外埠方林 10 家 + block=4 爱林整装系 18 家共 28 家有"木门安装";
--       扣除已配 3 家(12/55/57),实插 25 家。无"木门安装"的公司不插(无锚点)。
--
-- 🔴 七表挪位原理:construction.schedule(当前进度位置)、
--       constructionschedule/constructiondrawing/constructer/addreduce/
--       accessories/workersalary 的 schedule 列均存"节点 sort 的活引用"
--       (非快照),node 挪位后这些引用必须同步 +1,否则存量数据位置错乱
--       (如施工单进度 22 原指木门,挪后变踢脚线)。存量施工单不会自动
--       出现踢脚线节点行(先例同此,进度跳过该节点)。
--
-- 只读库预演行数(2026-09-10,供生产执行后核对):
--   node 挪位 79 / node 插入 25
--   construction        11289
--   constructionschedule 66527
--   constructiondrawing  52352
--   constructer           1894
--   addreduce                0
--   accessories           6175
--   workersalary         25723
-- 建议低峰执行。
--
-- ⚠️ 执行方式:整体单事务一次性执行(脚本已包 START TRANSACTION/COMMIT)。
--    第 1/2 步幂等(NOT EXISTS 自动跳过已配公司);第 3 步业务表挪位
--    【不可单独重跑】——重复执行会对已挪位数据二次 +1。重跑前先跑
--    4.1 验证,结果为 28 则说明已执行过,整个脚本不要再跑。
-- =====================================================================

START TRANSACTION;

-- 1. 节点挪位:25 家公司木门安装(sort)之后的节点 sort+1
UPDATE data.constructionnode n
JOIN (
    SELECT d.company, d.sort + 1 AS newsort
    FROM data.constructionnode d
    WHERE d.name = '木门安装' AND d.status = 0
      AND NOT EXISTS (SELECT 1 FROM data.constructionnode k WHERE k.company = d.company AND k.name = '踢脚线安装')
) t ON n.company = t.company
SET n.sort = n.sort + 1
WHERE n.sort >= t.newsort;

-- 2. 节点插入:复制本公司木门安装行,改名"踢脚线安装",sort=木门sort+1,
--    salaryLimit/accessoryLimit 置 99999000(无上限,与既有三家形式一致)
INSERT INTO data.constructionnode
    (name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid,
     timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname,
     mark, account, status, company)
SELECT
    '踢脚线安装', d.precheck, d.postcheck, 0, 0, d.startalk, d.endtalk, d.sstid, d.estid,
    0, 99999000, 99999000, 0, d.sort + 1, 0, d.kino, d.kiname,
    0, 0, 0, d.company
FROM data.constructionnode d
WHERE d.name = '木门安装' AND d.status = 0
  AND NOT EXISTS (SELECT 1 FROM data.constructionnode k WHERE k.company = d.company AND k.name = '踢脚线安装');

-- 3. 七张业务表 schedule 引用同步挪位(阈值=本公司踢脚线插入位置,即木门sort+1;
--    2 步已插入踢脚线行,此处直接以踢脚线行 sort 为阈值)
UPDATE construction.construction c
JOIN decoration.decoration d ON c.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '踢脚线安装' AND x.company NOT IN (12,55,57)) t ON t.company = d.company
SET c.schedule = c.schedule + 1
WHERE c.schedule >= t.newsort;

UPDATE construction.constructionschedule cs
JOIN decoration.decoration d ON cs.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '踢脚线安装' AND x.company NOT IN (12,55,57)) t ON t.company = d.company
SET cs.schedule = cs.schedule + 1
WHERE cs.schedule >= t.newsort;

UPDATE construction.constructiondrawing cd
JOIN construction.construction c ON cd.cid = c.cid
JOIN decoration.decoration d ON c.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '踢脚线安装' AND x.company NOT IN (12,55,57)) t ON t.company = d.company
SET cd.schedule = cd.schedule + 1
WHERE cd.schedule >= t.newsort;

UPDATE construction.constructer cu
JOIN decoration.decoration d ON cu.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '踢脚线安装' AND x.company NOT IN (12,55,57)) t ON t.company = d.company
SET cu.schedule = cu.schedule + 1
WHERE cu.schedule >= t.newsort;

UPDATE quotation.addreduce ar
JOIN decoration.decoration d ON ar.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '踢脚线安装' AND x.company NOT IN (12,55,57)) t ON t.company = d.company
SET ar.schedule = ar.schedule + 1
WHERE ar.schedule >= t.newsort;

UPDATE inventory.accessories a
JOIN decoration.decoration d ON a.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '踢脚线安装' AND x.company NOT IN (12,55,57)) t ON t.company = d.company
SET a.schedule = a.schedule + 1
WHERE a.schedule >= t.newsort;

UPDATE salary.workersalary ws
JOIN decoration.decoration d ON ws.orderId = d.orderId
JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name = '踢脚线安装' AND x.company NOT IN (12,55,57)) t ON t.company = d.company
SET ws.schedule = ws.schedule + 1
WHERE ws.schedule >= t.newsort;

COMMIT;

-- ---------------------------------------------------------------------
-- 验证(只读)
-- ---------------------------------------------------------------------
-- 4.1 应返回 28(全部有木门安装的公司均配齐踢脚线)
-- SELECT COUNT(*) FROM data.constructionnode d
-- WHERE d.name='木门安装' AND d.status=0
--   AND EXISTS (SELECT 1 FROM data.constructionnode k WHERE k.company=d.company AND k.name='踢脚线安装');
--
-- 4.2 抽查某家排序连续性与引用一致(如公司 20)
-- SELECT cnid,name,sort FROM data.constructionnode WHERE company=20 AND status=0 ORDER BY sort;
--
-- 4.3 新插入行清单(应 25 行)
-- SELECT cnid,company,sort,precheck,postcheck FROM data.constructionnode WHERE name='踢脚线安装' AND company NOT IN (12,55,57);

-- ---------------------------------------------------------------------
-- 回滚(如需,逆序:先回挪业务表,再删节点行,再回挪 node)
-- ---------------------------------------------------------------------
-- UPDATE construction.construction c
-- JOIN decoration.decoration d ON c.orderId=d.orderId
-- JOIN (SELECT x.company, x.sort AS newsort FROM data.constructionnode x WHERE x.name='踢脚线安装') t ON t.company=d.company
-- SET c.schedule=c.schedule-1 WHERE c.schedule>=t.newsort;
-- (其余六表同式,把 +1 改 -1)
--
-- DELETE FROM data.constructionnode WHERE name='踢脚线安装' AND company NOT IN (12,55,57);
--
-- UPDATE data.constructionnode n
-- JOIN (SELECT d.company, d.sort+1 AS newsort FROM data.constructionnode d WHERE d.name='木门安装') t
--   ON n.company=t.company
-- SET n.sort=n.sort-1 WHERE n.sort>t.newsort AND n.name!='踢脚线安装'
--   AND n.company NOT IN (12,55,57);
