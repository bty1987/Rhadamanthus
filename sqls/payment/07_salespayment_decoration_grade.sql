-- =====================================================================
-- 07: salesPayment(销售收款, type=8) 页面增加「装修等级」列
-- =====================================================================
-- 用途:
--   1. payment.paymentfunction 登记「装修等级」列定义(value=decorationGrade,
--      渲染取 v.sales.decoration.grade, 后端 pageSalesPayment 已批量回填)
--   2. platform.paymentfunctionright 将该列配至 type=8(salesPayment 页面组)
--      全部五个场景(collect/common/confirm/history/pos), sort=32 紧跟销售单等级(31)
--   3. decorationPayment 页面(type=2)装修等级列已存在(pfid=57 五场景已配+数据链
--      DecorationPaymentPO.ptv→ptvcascade 已通), 本批次不涉及
-- 执行前置条件:
--   - 后端 jar(decoration+payment)已部署(前端列渲染依赖接口回填 grade, 未部署时列显示空)
--   - 前端 paymentUtils.js(propertyMap.decorationGrade 映射)已随批部署
--   - 幂等: 重复执行无新增(NOT EXISTS 守卫)
-- 回滚方式:
--   DELETE FROM platform.paymentfunctionright WHERE type = 8 AND pfid =
--     (SELECT pfid FROM payment.paymentfunction WHERE value = 'decorationGrade' AND `group` = 8);
--   DELETE FROM payment.paymentfunction WHERE value = 'decorationGrade' AND name = '装修等级' AND `group` = 8;
-- 验证语句:
--   SELECT r.name, f.value, f.sort FROM platform.paymentfunctionright r
--   JOIN payment.paymentfunction f ON f.pfid = r.pfid
--   WHERE r.type = 8 AND f.value = 'decorationGrade';   -- 预期 5 行, sort=32
-- =====================================================================

-- 1. 登记列定义(幂等)
INSERT INTO payment.paymentfunction (name, `key`, value, `group`, type, subtype, status, sort)
SELECT '装修等级', 'propertyArr', 'decorationGrade', 8, 3, 1, 0, 32
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM payment.paymentfunction WHERE `key` = 'propertyArr' AND value = 'decorationGrade' AND `group` = 8);

-- 2. 配置到 salesPayment 五场景(幂等)
INSERT INTO platform.paymentfunctionright (name, pfid, type)
SELECT t.name, f.pfid, 8
FROM (SELECT 'collect' name UNION SELECT 'common' UNION SELECT 'confirm' UNION SELECT 'history' UNION SELECT 'pos') t
JOIN payment.paymentfunction f ON f.value = 'decorationGrade' AND f.`group` = 8
WHERE NOT EXISTS (SELECT 1 FROM platform.paymentfunctionright r WHERE r.name = t.name AND r.type = 8 AND r.pfid = f.pfid);

-- 3. 「销售单等级」更名「销售等级」(pfid=79, 与前端 propertyMap.salesGrade.name 同步)
UPDATE payment.paymentfunction SET name = '销售等级' WHERE pfid = 79 AND name = '销售单等级';

-- 4. 验证
SELECT r.name, f.value, f.sort FROM platform.paymentfunctionright r
JOIN payment.paymentfunction f ON f.pfid = r.pfid
WHERE r.type = 8 AND f.value = 'decorationGrade' ORDER BY r.name;

SELECT pfid, name, value, sort FROM payment.paymentfunction WHERE pfid = 79;   -- 预期 name=销售等级
