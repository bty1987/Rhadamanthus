-- =====================================================================
-- 文件: 19_signet_esign_batch_seed.sql
-- 用途: e签宝印章批量铺建——按公司从存量法大大有效章一键复制 provider=2 新行,
--       复用印张图片(path)/盖章关键字(keyword)/印章名(name=公司名, e签宝实名须逐字一致),
--       状态置1(已注册待认证); 双并行"补全签章"的自动化主步骤
-- 前置条件: data.signet 表已有 provider 列(11号SQL); 生产RDS执行
-- 执行时机: 任意时点可执行(新行status=1不会被合同选用; 认证完成后才生效)
-- 回滚方式: DELETE FROM data.signet WHERE provider = 2 AND signno IS NULL AND signid IS NULL
--           (仅删除未完成认证的铺建行, 已认证行保留; 或按 no LIKE '%-ES' 精确清理)
-- 验证语句: SELECT company, COUNT(*) FROM data.signet WHERE provider = 2 GROUP BY company;
--           SELECT * FROM data.signet WHERE no LIKE '%-ES';  -- 核对铺建清单
-- 幂等性: NOT EXISTS 守卫(company+provider=2 已存在则跳过), 可重复执行
-- 🔴后续人工环节(无法自动化): 每公司经办人在认证授权H5上完成机构实名+静默签授权
--   (法律效力要求真人操作, 链接可由脚本批量生成); orgId 回写/状态推进已有回调自动化
-- =====================================================================

INSERT INTO data.signet (no, name, keyword, path, status, signid, signno, token, authurl, type, company, provider)
SELECT
    CONCAT(s.no, '-ES'),
    s.name,
    s.keyword,
    s.path,
    1,
    NULL,
    NULL,
    NULL,
    NULL,
    s.type,
    s.company,
    2
FROM data.signet s
WHERE s.provider = 1
  AND s.status IN (3, 4)
  AND NOT EXISTS (
      SELECT 1 FROM data.signet t
      WHERE t.company = s.company
        AND t.provider = 2
        AND t.status != 5
  );

-- 验证:
-- SELECT COUNT(*) AS seeded FROM data.signet WHERE provider = 2 AND no LIKE '%-ES';
-- SELECT s.company, c.fullname, s.no, s.name, s.status
--   FROM data.signet s LEFT JOIN communion.company c ON c.cid = s.company
--  WHERE s.provider = 2 ORDER BY s.company;
