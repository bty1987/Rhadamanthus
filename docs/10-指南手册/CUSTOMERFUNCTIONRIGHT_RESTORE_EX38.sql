-- ============================================================================
-- CUSTOMERFUNCTIONRIGHT_RESTORE_EX38.sql
-- customerfunctionright 误删还原(排除 cfid=38)——两步版 v2(2026-10-02)
--
-- 背景: customerOriginfunction 38~43(feedback 页 6 按钮)+47(revisit 页条件)被误删,
--   连带 right 绑定 679 行已按"删孤儿"清理; 拍板=仅 cfid=38 保持删除, 其余还原。
--
-- 重建依据(已核实): 同族表 customer.customerfunction 同 cfid 行存有原文——
--   39=record记录 / 40=receive接收 / 41=done完成 / 42=complaint投诉 / 43=guarantee维修
--   (均为 pageBtn, 与 feedback.js 行按钮键名逐一对应, btnVisible 白名单即来自本配置);
--   47=condArr/customer-service-orderId(装修单号, revisit.js 默认条件集含此键)。
--   name 列取源行 comment 中文标签; cfid 显式回填(right 绑定按此号引用);
--   sort 沿用源行(38-43=1-6、47=1, 与现存 pageBtn 排序有重叠, 仅影响配置页显示顺序, 非功能)。
--
-- 执行顺序: 步骤1 → 步骤2 → 核验。全程幂等, 可重复执行。
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 步骤1: 恢复 customer.customerOriginfunction 功能行 6 行(39,40,41,42,43,47; 38 按拍板不恢复)
-- ----------------------------------------------------------------------------
INSERT INTO customer.customerOriginfunction (cfid, name, `key`, value, type, subtype, status, sort, comment)
SELECT cfid, comment, `key`, value, type, subtype, 0, sort, comment
  FROM customer.customerfunction
 WHERE cfid IN (39,40,41,42,43,47);

-- ----------------------------------------------------------------------------
-- 步骤2: 恢复 right 绑定网格(公司 0~96, 排除 38; 幂等)
-- ----------------------------------------------------------------------------
INSERT INTO platform.customerfunctionright (name, cfid, company)
SELECT p.name, p.cfid, c.cid
  FROM (
        SELECT 'feedback' AS name, 39 AS cfid UNION ALL SELECT 'feedback', 40 UNION ALL SELECT 'feedback', 41
        UNION ALL SELECT 'feedback', 42 UNION ALL SELECT 'feedback', 43
        UNION ALL SELECT 'revisit', 47
       ) p
  JOIN communion.company c ON c.cid BETWEEN 0 AND 96
 WHERE NOT EXISTS (SELECT 1 FROM platform.customerfunctionright r
                    WHERE r.name = p.name AND r.cfid = p.cfid AND r.company = c.cid);

-- ----------------------------------------------------------------------------
-- 核验
-- ----------------------------------------------------------------------------
-- 1) 功能行在位: 应 6 行(39-43,47), 38 应无
-- SELECT cfid, name, `key`, value, type, subtype, sort FROM customer.customerOriginfunction WHERE cfid IN (38,39,40,41,42,43,47);
--
-- 2) right 网格: feedback=2716(28×97) / revisit=1067(11×97) / vustomer=1261
-- SELECT name, COUNT(*) FROM platform.customerfunctionright GROUP BY name;
--
-- 3) 悬空引用: 应 = 0
-- SELECT cfr.cfid, COUNT(*) FROM platform.customerfunctionright cfr
--   LEFT JOIN customer.customeroriginfunction cf ON cf.cfid = cfr.cfid
--  WHERE cf.cfid IS NULL GROUP BY cfr.cfid;
-- ============================================================================


-- ============================================================================
-- 【终态 2026-10-02】用户执行两步还原后确认: 按钮恢复但显示列仍缺失——
--   根因=feedback/revisit 绑定的 16-28 为客源共享池列项, value 与 feedback.js/
--   revisit.js 字段键不对齐, 列白名单本就只命中 装修单号/状态 两三列(旧疾, 非误删造成)。
--   页面机制支持零配置全默认(列/按钮/条件三重 fallback), 且原网格 97 公司完全一致
--   无按公司差异化 → 终态处置=清空 feedback/revisit 全部绑定, 两页走全默认
--   (14 列全显含图片 + 6 按钮全显含 drawing + 回访页默认条件), vustomer 不动。
--   已执行并经用户页面验证恢复。
--
-- 终态处置 SQL(留档):
-- CREATE TABLE IF NOT EXISTS platform.customerfunctionright_bak2_20261002 AS
--   SELECT * FROM platform.customerfunctionright WHERE name IN ('feedback','revisit');
-- DELETE FROM platform.customerfunctionright WHERE name IN ('feedback','revisit');
-- 现状: customerfunctionright 仅剩 vustomer 1261 行(绑定 customerOriginfunction 2-14);
--   customerOriginfunction 含还原的 39-43/47 六行; customerfunction 表全程未动。
--   未来如需按公司裁剪 feedback/revisit 列/按钮, 走"客户-功能"配置页重建白名单。
-- ============================================================================
