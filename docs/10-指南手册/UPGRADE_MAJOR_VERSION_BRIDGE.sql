-- =============================================================================
-- communion.upgrade 大版本桥接行补齐脚本
-- 日期: 2026-08-25  编制: 白添宇(AI辅助)
--
-- 【背景】
--   upgrade 表的增量升级链靠 trialno(适用版本)→no(目标版本) 逐级衔接。
--   整装安装包携带的客户端版本号是三段式大版本号(x.x.xxx, 如 5.3.004),
--   version.js 的 git 历史可证实: 2.0.004/2.0.005/2.0.008/2.0.011/2.0.014/
--   3.0.001/3.0.002/3.0.004/4.3.002/5.3.004 等基线值均整段出现过。
--   但全表 912 行中只有 2 行 trialno 为三段式(ugid=2: 2.0.001, ugid=11: 2.0.004),
--   即: 除 2.0.001/2.0.004 外, 所有整装基线客户端 matchUpgrade 匹配不到任何行,
--   永远进不了升级链(nw.js 启动检查 upgrade.no==null 时直接静默跳过)。
--
-- 【方案】
--   沿用 2018 年先例(ugid=11: trialno='2.0.004' → no='2.0.004.001'):
--   为每个缺少桥接行的大版本 M 插一行:
--     trialno = 'M'(三段式大版本号)
--     no/path/filesize/content/isRestart/createtime = 复制该大版本第一条补丁行
--       (优先取非 .000 起步行; 该大版本仅有 .000 行时取 .000 行)
--     status = 1(直接上线, 引用的包本身已在线)
--   共 95 行(97 个大版本 - 已有桥接的 2.0.001/2.0.004)。
--
-- 【安全性】
--   - 不影响存量链: 新增行 trialno 值全局唯一, 现有客户端匹配结果不变;
--     maxUpgrade()=MAX(no) 不变(新行 no 均为存量 no)。
--   - 幂等: NOT EXISTS 守卫, 重复执行不会再插。
--   - 桥接行仅被"恰好停在三段式基线"的客户端命中, 其余为静默行, 无副作用。
--
-- 【执行前快照】(回滚锚点, 执行时请以实际值为准, 编制时为 946)
SELECT MAX(ugid) AS max_ugid_before FROM communion.upgrade;

-- =============================================================================
-- 1. 补桥接行(95 行, 幂等)
-- =============================================================================
INSERT INTO communion.upgrade (`no`, `trialno`, `createtime`, `content`, `path`, `filesize`, `isRestart`, `status`)
SELECT u.no,
       SUBSTRING_INDEX(u.no, '.', 3),
       u.createtime,
       u.content,
       u.path,
       u.filesize,
       u.isRestart,
       1
FROM communion.upgrade u
WHERE u.status = 1
  AND u.ugid = (
      SELECT ugid
      FROM communion.upgrade
      WHERE status = 1
        AND SUBSTRING_INDEX(no, '.', 3) = SUBSTRING_INDEX(u.no, '.', 3)
      ORDER BY (no LIKE '%.000'), no
      LIMIT 1
  )
  AND NOT EXISTS (
      SELECT 1
      FROM communion.upgrade
      WHERE trialno = SUBSTRING_INDEX(u.no, '.', 3)
        AND status = 1
  );

-- =============================================================================
-- 2. 验证
-- =============================================================================
-- 2.1 桥接行总数: 预期 97(每个大版本一条)
SELECT COUNT(*) AS bridge_cnt
FROM communion.upgrade
WHERE status = 1
  AND LENGTH(trialno) - LENGTH(REPLACE(trialno, '.', '')) = 2;

-- 2.2 仍缺桥接的大版本: 预期 0 行
SELECT SUBSTRING_INDEX(no, '.', 3) AS major
FROM communion.upgrade
WHERE status = 1
GROUP BY SUBSTRING_INDEX(no, '.', 3)
HAVING SUM(LENGTH(trialno) - LENGTH(REPLACE(trialno, '.', '')) = 2) = 0;

-- 2.3 存量链完整性复查(补数不应改变): 预期 0 行
SELECT a.no, a.trialno
FROM communion.upgrade a
WHERE a.status = 1
  AND a.no <> (SELECT MAX(b.no) FROM communion.upgrade b WHERE b.status = 1)
  AND NOT EXISTS (SELECT 1 FROM communion.upgrade c WHERE c.status = 1 AND c.trialno = a.no);

-- =============================================================================
-- 回滚(如需): 删除本次插入的三段式 trialno 桥接行
-- (946 换成步骤0实际查到的 max_ugid_before)
-- =============================================================================
-- DELETE FROM communion.upgrade
-- WHERE ugid > 946
--   AND LENGTH(trialno) - LENGTH(REPLACE(trialno, '.', '')) = 2;
