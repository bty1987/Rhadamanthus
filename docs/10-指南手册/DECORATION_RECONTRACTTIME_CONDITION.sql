-- =====================================================================
-- 装修单页面启用"重签时间"查询条件(生产执行)
-- 日期: 2026-09-18
--
-- 背景:
--   前端条件组件(WebContent/js/condition/decoration.js:515 recontractTime)
--   与后端过滤(DecorationDaoImpl:491 decoration.recontractTime.range timeranges)
--   均为已上线存量能力,仅缺配置——主表没有 condArr 定义行,各公司无绑定。
--   本SQL补齐配置,执行后页面刷新即可见(无需发版)。
--
-- 启用范围(默认口径):
--   复制"预签时间"条件(dfid=46)的全部绑定 = 19 个页面变体 x 各公司 共1468行
--   (activity/belong/common/construction/designer/designerdept/designermanager/
--    directer/finance/material/member/plan/quoter/salesmandept/salesmanmanager/
--    stage/streamlinedBusiness/streamlinedDesign/synthesize)
--   如只需部分公司/页面: 在第2段 WHERE r.dfid = 46 后追加
--   AND r.name IN ('common') / AND r.company IN (1, 3) 自行收窄
--
-- 幂等: 主表按 key+value 防重, 绑定按 name+company+dfid 防重, 可重复执行
-- =====================================================================

-- ---------- 1. 主表补条件定义行(照预签时间 dfid=46 模板, sort=25 排其后) ----------

INSERT INTO decoration.decorationfunction (name, `key`, value, type, subtype, sort)
SELECT '重签时间', 'condArr', 'decoration-recontractTime', 2, 1, 25 FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationfunction
    WHERE `key` = 'condArr' AND value = 'decoration-recontractTime'
);

-- ---------- 2. 绑定行: 复制预签时间(dfid=46)的全部绑定到新条件 ----------

INSERT INTO platform.decorationfunctionright (name, dfid, company)
SELECT r.name, f.dfid, r.company
FROM platform.decorationfunctionright r
JOIN decoration.decorationfunction f
    ON f.`key` = 'condArr' AND f.value = 'decoration-recontractTime'
WHERE r.dfid = 46
  AND NOT EXISTS (
      SELECT 1 FROM platform.decorationfunctionright x
      WHERE x.name = r.name AND x.company = r.company AND x.dfid = f.dfid
  );

-- ---------- 3. 执行后核验 ----------
-- 应返回: 新条件1行定义; 绑定行数=1468(与预签时间46一致)
SELECT f.dfid, f.name, f.`key`, f.value, f.sort,
       (SELECT COUNT(*) FROM platform.decorationfunctionright r WHERE r.dfid = f.dfid) AS bindings
FROM decoration.decorationfunction f
WHERE f.`key` = 'condArr' AND f.value = 'decoration-recontractTime';

SELECT COUNT(*) AS precontractBindings FROM platform.decorationfunctionright WHERE dfid = 46;
