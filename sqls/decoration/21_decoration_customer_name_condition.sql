-- =====================================================================
-- 装修单-客户页面增加"客户姓名"查询条件(模糊, 生产执行)
-- 日期: 2026-10-18
--
-- 背景:
--   装修单-客户页面(depage=customerPhone)原仅有"客户电话"条件(dfid=131)。
--   应需求增加"客户姓名"模糊查询(输入"赵"即筛出所有赵姓客户装修单)。
--
--   前端条件规则(WebContent/js/condition/decoration.js: customerName,
--   submitConfig name=decoration.customer.name op=cn) 与
--   后端白名单分支(DecorationDaoImpl.queryFilterExcute: decoration.customer.name)
--   均为代码层新增, 随 decoration jar 发布; 本SQL补配置:
--   主表 condArr 定义行 + 页面变体绑定行。
--
-- 启用范围:
--   仅复制"客户电话"(dfid=131, name=customerPhone)的绑定 = 只挂"装修单-客户"
--   页面变体(当前77行, 各公司), 不扩散到其他装修单页面变体。
--
-- 幂等: 主表按 key+value 防重, 绑定按 name+company+dfid 防重, 可重复执行。
--
-- 发版配合:
--   前端规则随 WebContent 发布, 后端白名单随 decoration jar 发布;
--   本SQL可先执行(规则未上线时条件渲染静默跳过, 不报错), 前后端就绪即生效。
-- =====================================================================

-- ---------- 1. 主表补条件定义行(排客户电话 dfid=131 sort=38 之后) ----------

INSERT INTO decoration.decorationfunction (name, `key`, value, type, subtype, sort)
SELECT '客户姓名', 'condArr', 'decoration-customerName', 2, 1, 39 FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationfunction
    WHERE `key` = 'condArr' AND value = 'decoration-customerName'
);

-- ---------- 2. 绑定行: 复制客户电话(dfid=131)的全部绑定(仅装修单-客户变体) ----------

INSERT INTO platform.decorationfunctionright (name, dfid, company)
SELECT r.name, f.dfid, r.company
FROM platform.decorationfunctionright r
JOIN decoration.decorationfunction f
    ON f.`key` = 'condArr' AND f.value = 'decoration-customerName'
WHERE r.dfid = 131
  AND NOT EXISTS (
      SELECT 1 FROM platform.decorationfunctionright x
      WHERE x.name = r.name AND x.company = r.company AND x.dfid = f.dfid
  );

-- ---------- 3. 执行后核验 ----------
-- 应返回: 新条件1行定义; 绑定行数=客户电话(131)的绑定数(当前77)
SELECT f.dfid, f.name, f.`key`, f.value, f.sort,
       (SELECT COUNT(*) FROM platform.decorationfunctionright r WHERE r.dfid = f.dfid) AS bindings
FROM decoration.decorationfunction f
WHERE f.`key` = 'condArr' AND f.value = 'decoration-customerName';

-- 对照: 客户电话绑定数应与新条件绑定数一致
SELECT dfid, name, (SELECT COUNT(*) FROM platform.decorationfunctionright r WHERE r.dfid = decorationfunction.dfid) AS bindings
FROM decoration.decorationfunction WHERE dfid IN (131);
