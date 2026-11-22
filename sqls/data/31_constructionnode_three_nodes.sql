-- ============================================================
-- 全公司施工节点补三节点: 清运 / 拆除 / 精工画线 (data.constructionnode)
-- 用途: 全部拥有锚点节点(力工/形象保护/水暖)的公司补齐三节点, 已有该节点的公司跳过:
--      ①拆除 = 形象保护之后   ②清运 = 力工之后   ③精工画线 = 水暖之前
--      新行默认值对齐存量老公司口径(pcnid=0, process=0, proset=0, kino/kiname='',
--      timeLimit=0, accessoryLimit/salaryLimit=99999000, salaryFloor=0, status=0),
--      即不带工费映射/决算标识的纯流程节点, 工费等个性化配置后续按公司在页面调
-- 现状(2026-11-02 生产实查, 68个有节点公司):
--      清运已有: 7,9,20,56,75,76 (6公司) → 预计补 61 公司
--      拆除已有: 9,91,92,93      (4公司) → 预计补 63 公司
--      精工画线已有: 91,92,93    (3公司) → 预计补 64 公司
--      合计预计新增 188 行; 执行后三节点应各覆盖 67 公司
-- 特殊公司说明:
--      company=0 方林集团: 3行且无力工/形象保护/水暖锚点, 自然跳过(不处理)
--      company=77 成都1918: 历史遗留7份字节级重复节点集(同名同sort), 脚本按公司聚合
--      锚点(MAX(sort)), 每公司只插一行、整体移位一次, 不放大重复
-- 顺序说明: 三步按 拆除→清运→精工画线 顺序执行, 每步=移位+插入, 后步读前步后的最新sort,
--      与各公司锚点相对位置无关均正确; 🔴三步与事务必须整体执行(移位无插入=排序断裂)
-- 前置: 下方"执行前核对"三个计数与头部现状一致(允许因新增公司自然变大, 逻辑不受影响)
-- 回滚: DELETE FROM data.constructionnode WHERE name IN ('清运','拆除','精工画线')
--      AND kino='' AND timeLimit=0 AND proset=0 AND cnid > <执行前最大cnid>;
--      (仅删除本次插入行; 若已按新排序跑过业务, 回滚后需将受影响公司 sort 各 -1~-3 复原)
-- 验证: 尾部三段; 幂等: NOT EXISTS 守卫, 重跑零影响
-- 建议: 生产低峰单事务执行(表小, 全量~1400行)
-- ============================================================

-- ---------- 执行前核对 ----------
SELECT name, COUNT(*) AS rows_cnt, COUNT(DISTINCT company) AS company_cnt
FROM data.constructionnode
WHERE name IN ('清运', '拆除', '精工画线') GROUP BY name;
-- 期望: 清运 6行/6公司, 拆除 4行/4公司, 精工画线 3行/3公司

SELECT MAX(cnid) AS max_cnid_before FROM data.constructionnode;
-- 记下该值, 回滚 DELETE 用

-- ========== 步骤1: 拆除 = 形象保护之后 ==========
START TRANSACTION;

-- 1a. 移位: 待补公司中 sort 大于本公司形象保护的一律 +1
UPDATE data.constructionnode n
JOIN (
    SELECT x.company, MAX(x.sort) AS sort
    FROM (SELECT company, sort FROM data.constructionnode WHERE name = '形象保护') x
    WHERE NOT EXISTS (SELECT 1 FROM data.constructionnode t WHERE t.name = '拆除' AND t.company = x.company)
    GROUP BY x.company
) a ON n.company = a.company
SET n.sort = n.sort + 1
WHERE n.sort > a.sort;

-- 1b. 插入拆除行
INSERT INTO data.constructionnode
    (pcnid, name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid,
     timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, account, status, company, salaryFloor)
SELECT 0, '拆除', 0, 0, 0, 0, '', '', NULL, NULL,
       0, 99999000, 99999000, 0, a.sort + 1, 0, '', '', 0, 0, 0, a.company, 0
FROM (
    SELECT x.company, MAX(x.sort) AS sort
    FROM (SELECT company, sort FROM data.constructionnode WHERE name = '形象保护') x
    WHERE NOT EXISTS (SELECT 1 FROM data.constructionnode t WHERE t.name = '拆除' AND t.company = x.company)
    GROUP BY x.company
) a;
-- 期望影响行数: 移位 1310 行(2026-11-02 干跑实证) + 插入 63 行 (插入数必须=63)

-- ========== 步骤2: 清运 = 力工之后 ==========
-- 2a. 移位
UPDATE data.constructionnode n
JOIN (
    SELECT x.company, MAX(x.sort) AS sort
    FROM (SELECT company, sort FROM data.constructionnode WHERE name = '力工') x
    WHERE NOT EXISTS (SELECT 1 FROM data.constructionnode t WHERE t.name = '清运' AND t.company = x.company)
    GROUP BY x.company
) a ON n.company = a.company
SET n.sort = n.sort + 1
WHERE n.sort > a.sort;

-- 2b. 插入清运行
INSERT INTO data.constructionnode
    (pcnid, name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid,
     timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, account, status, company, salaryFloor)
SELECT 0, '清运', 0, 0, 0, 0, '', '', NULL, NULL,
       0, 99999000, 99999000, 0, a.sort + 1, 0, '', '', 0, 0, 0, a.company, 0
FROM (
    SELECT x.company, MAX(x.sort) AS sort
    FROM (SELECT company, sort FROM data.constructionnode WHERE name = '力工') x
    WHERE NOT EXISTS (SELECT 1 FROM data.constructionnode t WHERE t.name = '清运' AND t.company = x.company)
    GROUP BY x.company
) a;
-- 期望影响行数: 移位以实际为准 + 插入 61 行 (插入数必须=61)

-- ========== 步骤3: 精工画线 = 水暖之前 ==========
-- 3a. 移位(含水暖本行, 故 >= )
UPDATE data.constructionnode n
JOIN (
    SELECT x.company, MAX(x.sort) AS sort
    FROM (SELECT company, sort FROM data.constructionnode WHERE name = '水暖') x
    WHERE NOT EXISTS (SELECT 1 FROM data.constructionnode t WHERE t.name = '精工画线' AND t.company = x.company)
    GROUP BY x.company
) a ON n.company = a.company
SET n.sort = n.sort + 1
WHERE n.sort >= a.sort;

-- 3b. 插入精工画线行(占原水暖sort位, 水暖顺延)
INSERT INTO data.constructionnode
    (pcnid, name, precheck, postcheck, stacheck, fincheck, startalk, endtalk, sstid, estid,
     timeLimit, accessoryLimit, salaryLimit, process, sort, proset, kino, kiname, mark, account, status, company, salaryFloor)
SELECT 0, '精工画线', 0, 0, 0, 0, '', '', NULL, NULL,
       0, 99999000, 99999000, 0, a.sort, 0, '', '', 0, 0, 0, a.company, 0
FROM (
    SELECT x.company, MAX(x.sort) AS sort
    FROM (SELECT company, sort FROM data.constructionnode WHERE name = '水暖') x
    WHERE NOT EXISTS (SELECT 1 FROM data.constructionnode t WHERE t.name = '精工画线' AND t.company = x.company)
    GROUP BY x.company
) a;
-- 期望影响行数: 移位以实际为准 + 插入 64 行 (插入数必须=64)

COMMIT;

-- ---------- 执行后验证 ----------
-- ① 三节点覆盖数: 应各 67 公司(清运 67行? 注意company77单行, 公司数=行数一致)
SELECT name, COUNT(*) AS rows_cnt, COUNT(DISTINCT company) AS company_cnt
FROM data.constructionnode
WHERE name IN ('清运', '拆除', '精工画线') GROUP BY name;
-- 期望: 清运 67行/67公司, 拆除 67行/67公司, 精工画线 67行/67公司

-- ② 相邻性抽验(公司1 应为: 形象保护3 → 拆除4 → ... → 力工8 → 清运9 → 水钻10 → 精工画线11 → 水暖12 → ...)
SELECT name, sort FROM data.constructionnode WHERE company = 1 AND status = 0 ORDER BY sort;
-- 期望: 形象保护3, 拆除4, 砌墙5, 铲大白6, 放线7, 力工8, 清运9, 水钻10, 精工画线11, 水暖12, 电工13 ...

-- ③ 相邻关系校验(仅校验本次新补的公司; 存量已有该节点的公司位置系历史任意值, 按节点排除:
--    清运排除 7,9,20,56,75,76; 拆除排除 9,91,92,93; 精工画线排除 91,92,93), 期望 0 行
SELECT company, '拆除' AS node, sort - (SELECT sort FROM data.constructionnode x WHERE x.company = t.company AND x.name = '形象保护' LIMIT 1) AS gap
FROM data.constructionnode t
WHERE t.name = '拆除' AND t.company NOT IN (9, 91, 92, 93)
  AND sort - (SELECT sort FROM data.constructionnode x WHERE x.company = t.company AND x.name = '形象保护' LIMIT 1) <> 1
UNION ALL
SELECT company, '清运', sort - (SELECT sort FROM data.constructionnode x WHERE x.company = t.company AND x.name = '力工' LIMIT 1)
FROM data.constructionnode t
WHERE t.name = '清运' AND t.company NOT IN (7, 9, 20, 56, 75, 76)
  AND sort - (SELECT sort FROM data.constructionnode x WHERE x.company = t.company AND x.name = '力工' LIMIT 1) <> 1
UNION ALL
SELECT company, '精工画线', (SELECT sort FROM data.constructionnode x WHERE x.company = t.company AND x.name = '水暖' LIMIT 1) - sort
FROM data.constructionnode t
WHERE t.name = '精工画线' AND t.company NOT IN (91, 92, 93)
  AND (SELECT sort FROM data.constructionnode x WHERE x.company = t.company AND x.name = '水暖' LIMIT 1) - sort <> 1;
-- 期望: 0 行 (company77 的7份重复集同sort, 每节点只出一行且gap=1, 不影响)

-- ④ company77 单独复核(7份重复集, 新节点各1行)
SELECT name, sort, COUNT(*) AS cnt FROM data.constructionnode WHERE company = 77
   AND name IN ('清运','拆除','精工画线','形象保护','力工','水暖') GROUP BY name, sort;
-- 期望: 形象保护3, 拆除4, 力工8, 清运9, 精工画线11, 水暖12; 三新节点各1行, 原六类节点各7行
