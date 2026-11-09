-- ============================================================
-- 03_salesfunction_operate_btn.sql 销售单"记录"按钮功能配置 (sales.salesfunction + platform.salesfunctionright)
-- 用途: 销售单列表新增"记录"按钮(buttonMap键=operate, 打开sales4operate操作记录弹窗,
--      数据源=sales.salesoperate高权限操作留痕), 显隐走salesfunction配置驱动
--      (与厂结/配送等按钮同机制: pageBtn键按subtype=1追加进pageBtn数组)
--      铺开范围=现存全部(页面变体name × 公司company)组合——与各变体既有授权面完全对齐,
--      已在用变体的所有公司均可看到"记录"按钮
-- 前置: 配套前端sales4operate.html/js + api.sales.js(querySalesOperateBySid) + sales.js按钮定义
-- 回滚: DELETE FROM platform.salesfunctionright WHERE sfid = (SELECT sfid FROM sales.salesfunction WHERE `key`='pageBtn' AND value='operate');
--      DELETE FROM sales.salesfunction WHERE `key`='pageBtn' AND value='operate';
-- 验证: SELECT COUNT(*) FROM platform.salesfunctionright r JOIN sales.salesfunction f ON f.sfid = r.sfid
--      WHERE f.value='operate'; -- 应≈现存(变体,公司)组合数
-- 幂等: NOT EXISTS 防重, 可重复执行
-- ============================================================

-- ---------- 1. 按钮字典行 ----------
INSERT INTO sales.salesfunction (name, `key`, value, `group`, type, subtype, sort, comment)
SELECT '记录', 'pageBtn', 'operate', 65, 4, 1, 20, '高权限操作记录查看(sales4operate)'
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM sales.salesfunction WHERE `key` = 'pageBtn' AND value = 'operate'
);

-- ---------- 2. 权限铺开: 现存全部(变体, 公司)组合 ----------
INSERT INTO platform.salesfunctionright (name, sfid, company)
SELECT r.name, f.sfid, r.company
FROM (SELECT DISTINCT name, company FROM platform.salesfunctionright) r
CROSS JOIN sales.salesfunction f
WHERE f.`key` = 'pageBtn' AND f.value = 'operate'
  AND NOT EXISTS (
      SELECT 1 FROM platform.salesfunctionright x
      WHERE x.name = r.name AND x.company = r.company AND x.sfid = f.sfid
  );
-- 期望行数 ≈ 现存变体×公司组合数(执行后 SELECT COUNT(*) 核对)

-- ---------- 3. 验证 ----------
SELECT r.name, r.company, f.value FROM platform.salesfunctionright r
JOIN sales.salesfunction f ON f.sfid = r.sfid
WHERE f.value = 'operate' ORDER BY r.name, r.company LIMIT 10;
