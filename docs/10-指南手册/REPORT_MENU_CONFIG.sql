-- ============================================================
-- Report 经营分析报表 - 菜单与角色权限配置 SQL
-- 生成日期: 2026-08-09
-- 说明: 为已完成的 6 个经营分析报表页面配置菜单(module) + 授权角色(rid=86)
--
-- 使用方式:
--   1. 先执行"一、菜单注册"插入新菜单(每个页面一条二级菜单)
--   2. 再执行"二、角色授权"为 rid=86 授权新菜单
--   3. 本脚本可重复执行(二、三部分用 NOT EXISTS 防重复)
--
//   注意: mid 用变量 @newMid_xx 接收,保证授权时引用正确的菜单ID
// ============================================================

-- ============================================================
-- 一、菜单注册：在"报表"(mid=9) 下新增"经营分析"分组 + 6 个报表页
// ============================================================

-- 1) 新增分组父菜单"经营分析"(level=2, fatherModuleId=9, order=40)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`)
VALUES (9, '经营分析', 'reportAnalytics', 'report', 'icon-bar-chart', '', 2, 1, 40);
SET @mid_analytics = LAST_INSERT_ID();

-- 2) 装修销售转化(decorationFunnelReport)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`)
VALUES (@mid_analytics, '装修销售转化', 'decorationFunnelReport', 'report', '', '/views/report/decorationFunnelReport.html', 3, 1, 1);
SET @mid_funnel = LAST_INSERT_ID();

-- 3) 财务收款(paymentReport)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`)
VALUES (@mid_analytics, '财务收款分析', 'paymentReport', 'report', '', '/views/report/paymentReport.html', 3, 1, 2);
SET @mid_payment = LAST_INSERT_ID();

-- 4) 装修履约(fulfillmentReport)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`)
VALUES (@mid_analytics, '装修履约分析', 'fulfillmentReport', 'report', '', '/views/report/fulfillmentReport.html', 3, 1, 3);
SET @mid_fulfillment = LAST_INSERT_ID();

-- 5) 主材经营(materialSalesReport)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`)
VALUES (@mid_analytics, '主材经营分析', 'materialSalesReport', 'report', '', '/views/report/materialSalesReport.html', 3, 1, 4);
SET @mid_material = LAST_INSERT_ID();

-- 6) 客户获客(customerReport)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`)
VALUES (@mid_analytics, '客户获客分析', 'customerReport', 'report', '', '/views/report/customerReport.html', 3, 1, 5);
SET @mid_customer = LAST_INSERT_ID();

-- 7) 仓储物流(inventoryReport)
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`)
VALUES (@mid_analytics, '仓储物流分析', 'inventoryReport', 'report', '', '/views/report/inventoryReport.html', 3, 1, 6);
SET @mid_inventory = LAST_INSERT_ID();


-- ============================================================
-- 二、角色授权：为 rid=86 授权新菜单(含父菜单"经营分析")
//    用 NOT EXISTS 防重复插入(rid=86 数据量大,可能有多次执行)
// ============================================================

-- 授权"经营分析"分组父菜单
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT 86, @mid_analytics, 1, 0, 0, NOW(), 0
WHERE NOT EXISTS (SELECT 1 FROM communion.rolemodule WHERE rid = 86 AND mid = @mid_analytics AND company = 0);

-- 授权 6 个报表页
INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT 86, @mid_funnel, 1, 0, 0, NOW(), 0
WHERE NOT EXISTS (SELECT 1 FROM communion.rolemodule WHERE rid = 86 AND mid = @mid_funnel AND company = 0);

INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT 86, @mid_payment, 1, 0, 0, NOW(), 0
WHERE NOT EXISTS (SELECT 1 FROM communion.rolemodule WHERE rid = 86 AND mid = @mid_payment AND company = 0);

INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT 86, @mid_fulfillment, 1, 0, 0, NOW(), 0
WHERE NOT EXISTS (SELECT 1 FROM communion.rolemodule WHERE rid = 86 AND mid = @mid_fulfillment AND company = 0);

INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT 86, @mid_material, 1, 0, 0, NOW(), 0
WHERE NOT EXISTS (SELECT 1 FROM communion.rolemodule WHERE rid = 86 AND mid = @mid_material AND company = 0);

INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT 86, @mid_customer, 1, 0, 0, NOW(), 0
WHERE NOT EXISTS (SELECT 1 FROM communion.rolemodule WHERE rid = 86 AND mid = @mid_customer AND company = 0);

INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, createTime, company)
SELECT 86, @mid_inventory, 1, 0, 0, NOW(), 0
WHERE NOT EXISTS (SELECT 1 FROM communion.rolemodule WHERE rid = 86 AND mid = @mid_inventory AND company = 0);


-- ============================================================
-- 三、验证查询(执行后确认数据正确)
// ============================================================

-- 确认新菜单已注册
SELECT mid, fatherModuleId, name, url, `order`
FROM communion.module
WHERE fatherModuleId = @mid_analytics OR mid = @mid_analytics
ORDER BY `order`;

-- 确认 rid=86 已授权
SELECT rm.rmid, rm.mid, m.name, rm.company
FROM communion.rolemodule rm
LEFT JOIN communion.module m ON rm.mid = m.mid
WHERE rm.rid = 86 AND (rm.mid = @mid_analytics OR rm.mid IN (@mid_funnel, @mid_payment, @mid_fulfillment, @mid_material, @mid_customer, @mid_inventory))
ORDER BY m.`order`;


-- ============================================================
-- 回滚脚本(如需删除)
// ============================================================
-- DELETE FROM communion.rolemodule WHERE rid = 86 AND mid IN (@mid_analytics, @mid_funnel, @mid_payment, @mid_fulfillment, @mid_material, @mid_customer, @mid_inventory);
-- DELETE FROM communion.module WHERE mid IN (@mid_analytics, @mid_funnel, @mid_payment, @mid_fulfillment, @mid_material, @mid_customer, @mid_inventory);
