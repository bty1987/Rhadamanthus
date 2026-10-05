-- constructionSchedule 页 开放工费按钮 配置（待生产）
-- 背景：开放工费功能自 allocation4detail 迁移至 constructionSchedule 页(前端同期改动);
--       constructionSchedule 页 pageBtn 走白名单机制(constructionPageUtils.getConfig, name=constructionSchedule
--       全局生效不分公司), 现有 5 键不含 salary → 新按钮必须补配置行才可见。
-- 幂等：可重复执行(NOT EXISTS 防重)。
-- 参照现有行: type=4(页面按钮)/subtype=1(数组型)/sort=6(接在 additem=5 之后); right 行 company=0 全局。

INSERT INTO construction.constructionfunction (name, `key`, value, type, subtype, comment, sort)
SELECT 'constructionSchedule', 'pageBtn', 'salary', 4, 1, '开放工费', 6
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM construction.constructionfunction
    WHERE name = 'constructionSchedule' AND `key` = 'pageBtn' AND value = 'salary'
);

INSERT INTO platform.constructionfunctionright (name, cfid, company)
SELECT 'constructionSchedule', f.cfid, 0
FROM construction.constructionfunction f
WHERE f.name = 'constructionSchedule' AND f.`key` = 'pageBtn' AND f.value = 'salary'
  AND NOT EXISTS (
      SELECT 1 FROM platform.constructionfunctionright r
      WHERE r.cfid = f.cfid AND r.company = 0
  );
