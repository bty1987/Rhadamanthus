-- ============================================
-- 用户创建脚本
-- ============================================
-- 功能：创建只读用户，授予除敏感表外所有表的查询权限
-- 版本：v1.1
-- 日期：2026-04-11
-- ============================================

-- 用户清单：
-- BI     - 商业智能/报表
-- PM     - 项目管理
-- CRM    - 客户关系管理
-- MEM    - 会员管理
-- zhanglt - 个人用户
-- zhouhh  - 个人用户
-- zhous   - 个人用户

-- 权限说明：
-- 1. 所有用户只读权限 (SELECT)
-- 2. 敏感表只能访问脱敏视图
-- 3. 所有用户都可以访问视图

-- ============================================
-- 步骤1：创建用户
-- ============================================

-- ⚠️ 请执行前替换以下密码为实际密码

CREATE USER IF NOT EXISTS 'BI'@'%' IDENTIFIED BY 'bS86YCLQiHv3cIzoI7MThQ==';
CREATE USER IF NOT EXISTS 'PM'@'%' IDENTIFIED BY 'joBBT+C/mZorJIG5UE5A9A==';
CREATE USER IF NOT EXISTS 'CRM'@'%' IDENTIFIED BY 'hY+Kv2RjhnykoTm9/zAKsg==';
CREATE USER IF NOT EXISTS 'MEM'@'%' IDENTIFIED BY 'Wb3I4VFcteLJoLizC1nEvg==';
CREATE USER IF NOT EXISTS 'zhanglt'@'%' IDENTIFIED BY '71bEgvNTAwu5CHsTMpqpVQ==';
CREATE USER IF NOT EXISTS 'zhouhh'@'%' IDENTIFIED BY 'rfbGz5BrzYcuoPhxlNWb8g==';
CREATE USER IF NOT EXISTS 'zhous'@'%' IDENTIFIED BY 'BRfrcBWSbxQZXw4NJWHt/g==';

FLUSH PRIVILEGES;

-- 验证用户创建
SELECT user, host FROM mysql.user WHERE user IN ('BI', 'PM', 'CRM', 'MEM', 'zhanglt', 'zhouhh', 'zhous');

-- ============================================
-- 步骤2：授予权限模板（所有用户通用）
-- ============================================

-- communion 库非敏感表列表（80个表）
SET @communion_tables = '
    assistance, assistanceitem, attendance, brand, branddeliver, brandinstall,
    brandinstorer, brandproduct, brandserver, brandsupplier, branduserright,
    buildingnamerule, category, chart, city, cityproper, cityproperpartner,
    colorpool, company, constant, constructionnode, contract, counting,
    customerrecord, custype, datadrawing, department, departmentpartner,
    departmenttype, dutment, duty, formatpool, goodspool, houselayout,
    keyvalue, label, macontrol, measurementunit, module, operation, organization,
    paymenttyped, performance, pricepool, quotationbigcategory,
    quotationclassification, quotationsmallcategory, quotationtype, receipttype,
    receipttypeitem, recruitment, recruitmenteducation, recruitmentoperation,
    region, role, roleaction, rolechart, rolemodule, roleoperation, roletask,
    servicenode, signet, supplier, suppliercontract, suppliercontractbrand,
    suppliercontractcategory, suppliercontractgoods, suppliercontractproduct,
    suppliercontractservice, supplieruserright, systemconfig, talking, task,
    taskparam, upgrade, userinfo, usercompany, usercontract, usereducation,
    userexperience, userfunction, userlabel, useroperation, userpartner,
    userrequire, userrole, version, village, villagerule, worktype
';

-- ============================================
-- 2.1 BI 用户权限（全库只读）
-- ============================================

-- 业务库权限
GRANT SELECT ON decoration.* TO 'BI'@'%';
GRANT SELECT ON quotation.* TO 'BI'@'%';
GRANT SELECT ON construction.* TO 'BI'@'%';
GRANT SELECT ON balance.* TO 'BI'@'%';
GRANT SELECT ON sales.* TO 'BI'@'%';
GRANT SELECT ON material.* TO 'BI'@'%';
GRANT SELECT ON building.* TO 'BI'@'%';
GRANT SELECT ON payment.* TO 'BI'@'%';
GRANT SELECT ON production.* TO 'BI'@'%';
GRANT SELECT ON personel.* TO 'BI'@'%';
GRANT SELECT ON salary.* TO 'BI'@'%';
GRANT SELECT ON information.* TO 'BI'@'%';
GRANT SELECT ON inventory.* TO 'BI'@'%';
GRANT SELECT ON factory.* TO 'BI'@'%';
GRANT SELECT ON market.* TO 'BI'@'%';
GRANT SELECT ON store.* TO 'BI'@'%';
GRANT SELECT ON report.* TO 'BI'@'%';
GRANT SELECT ON quotetion.* TO 'BI'@'%';
GRANT SELECT ON approval.* TO 'BI'@'%';
GRANT SELECT ON platform.* TO 'BI'@'%';
GRANT SELECT ON data.* TO 'BI'@'%';

-- communion 库非敏感表
GRANT SELECT ON
    assistance, assistanceitem, attendance, brand, branddeliver, brandinstall,
    brandinstorer, brandproduct, brandserver, brandsupplier, branduserright,
    buildingnamerule, category, chart, city, cityproper, cityproperpartner,
    colorpool, company, constant, constructionnode, contract, counting,
    customerrecord, custype, datadrawing, department, departmentpartner,
    departmenttype, dutment, duty, formatpool, goodspool, houselayout,
    keyvalue, label, macontrol, measurementunit, module, operation, organization,
    paymenttyped, performance, pricepool, quotationbigcategory,
    quotationclassification, quotationsmallcategory, quotationtype, receipttype,
    receipttypeitem, recruitment, recruitmenteducation, recruitmentoperation,
    region, role, roleaction, rolechart, rolemodule, roleoperation, roletask,
    servicenode, signet, supplier, suppliercontract, suppliercontractbrand,
    suppliercontractcategory, suppliercontractgoods, suppliercontractproduct,
    suppliercontractservice, supplieruserright, systemconfig, talking, task,
    taskparam, upgrade, userinfo, usercompany, usercontract, usereducation,
    userexperience, userfunction, userlabel, useroperation, userpartner,
    userrequire, userrole, version, village, villagerule, worktype
TO 'BI'@'%';

-- 敏感表视图
GRANT SELECT ON communion.customer_v TO 'BI'@'%';
GRANT SELECT ON communion.user_v TO 'BI'@'%';
GRANT SELECT ON communion.customerphone_v TO 'BI'@'%';
GRANT SELECT ON communion.house_v TO 'BI'@'%';

-- ============================================
-- 2.2 PM 用户权限（全库只读）
-- ============================================

GRANT SELECT ON decoration.* TO 'PM'@'%';
GRANT SELECT ON quotation.* TO 'PM'@'%';
GRANT SELECT ON construction.* TO 'PM'@'%';
GRANT SELECT ON balance.* TO 'PM'@'%';
GRANT SELECT ON sales.* TO 'PM'@'%';
GRANT SELECT ON material.* TO 'PM'@'%';
GRANT SELECT ON building.* TO 'PM'@'%';
GRANT SELECT ON payment.* TO 'PM'@'%';
GRANT SELECT ON production.* TO 'PM'@'%';
GRANT SELECT ON personel.* TO 'PM'@'%';
GRANT SELECT ON salary.* TO 'PM'@'%';
GRANT SELECT ON information.* TO 'PM'@'%';
GRANT SELECT ON inventory.* TO 'PM'@'%';
GRANT SELECT ON factory.* TO 'PM'@'%';
GRANT SELECT ON market.* TO 'PM'@'%';
GRANT SELECT ON store.* TO 'PM'@'%';
GRANT SELECT ON report.* TO 'PM'@'%';
GRANT SELECT ON quotetion.* TO 'PM'@'%';
GRANT SELECT ON approval.* TO 'PM'@'%';
GRANT SELECT ON platform.* TO 'PM'@'%';
GRANT SELECT ON data.* TO 'PM'@'%';

GRANT SELECT ON
    assistance, assistanceitem, attendance, brand, branddeliver, brandinstall,
    brandinstorer, brandproduct, brandserver, brandsupplier, branduserright,
    buildingnamerule, category, chart, city, cityproper, cityproperpartner,
    colorpool, company, constant, constructionnode, contract, counting,
    customerrecord, custype, datadrawing, department, departmentpartner,
    departmenttype, dutment, duty, formatpool, goodspool, houselayout,
    keyvalue, label, macontrol, measurementunit, module, operation, organization,
    paymenttyped, performance, pricepool, quotationbigcategory,
    quotationclassification, quotationsmallcategory, quotationtype, receipttype,
    receipttypeitem, recruitment, recruitmenteducation, recruitmentoperation,
    region, role, roleaction, rolechart, rolemodule, roleoperation, roletask,
    servicenode, signet, supplier, suppliercontract, suppliercontractbrand,
    suppliercontractcategory, suppliercontractgoods, suppliercontractproduct,
    suppliercontractservice, supplieruserright, systemconfig, talking, task,
    taskparam, upgrade, userinfo, usercompany, usercontract, usereducation,
    userexperience, userfunction, userlabel, useroperation, userpartner,
    userrequire, userrole, version, village, villagerule, worktype
TO 'PM'@'%';

GRANT SELECT ON communion.customer_v TO 'PM'@'%';
GRANT SELECT ON communion.user_v TO 'PM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'PM'@'%';
GRANT SELECT ON communion.house_v TO 'PM'@'%';

-- ============================================
-- 2.3 CRM 用户权限（全库只读）
-- ============================================

GRANT SELECT ON decoration.* TO 'CRM'@'%';
GRANT SELECT ON quotation.* TO 'CRM'@'%';
GRANT SELECT ON construction.* TO 'CRM'@'%';
GRANT SELECT ON balance.* TO 'CRM'@'%';
GRANT SELECT ON sales.* TO 'CRM'@'%';
GRANT SELECT ON material.* TO 'CRM'@'%';
GRANT SELECT ON building.* TO 'CRM'@'%';
GRANT SELECT ON payment.* TO 'CRM'@'%';
GRANT SELECT ON production.* TO 'CRM'@'%';
GRANT SELECT ON personel.* TO 'CRM'@'%';
GRANT SELECT ON salary.* TO 'CRM'@'%';
GRANT SELECT ON information.* TO 'CRM'@'%';
GRANT SELECT ON inventory.* TO 'CRM'@'%';
GRANT SELECT ON factory.* TO 'CRM'@'%';
GRANT SELECT ON market.* TO 'CRM'@'%';
GRANT SELECT ON store.* TO 'CRM'@'%';
GRANT SELECT ON report.* TO 'CRM'@'%';
GRANT SELECT ON quotetion.* TO 'CRM'@'%';
GRANT SELECT ON approval.* TO 'CRM'@'%';
GRANT SELECT ON platform.* TO 'CRM'@'%';
GRANT SELECT ON data.* TO 'CRM'@'%';

GRANT SELECT ON
    assistance, assistanceitem, attendance, brand, branddeliver, brandinstall,
    brandinstorer, brandproduct, brandserver, brandsupplier, branduserright,
    buildingnamerule, category, chart, city, cityproper, cityproperpartner,
    colorpool, company, constant, constructionnode, contract, counting,
    customerrecord, custype, datadrawing, department, departmentpartner,
    departmenttype, dutment, duty, formatpool, goodspool, houselayout,
    keyvalue, label, macontrol, measurementunit, module, operation, organization,
    paymenttyped, performance, pricepool, quotationbigcategory,
    quotationclassification, quotationsmallcategory, quotationtype, receipttype,
    receipttypeitem, recruitment, recruitmenteducation, recruitmentoperation,
    region, role, roleaction, rolechart, rolemodule, roleoperation, roletask,
    servicenode, signet, supplier, suppliercontract, suppliercontractbrand,
    suppliercontractcategory, suppliercontractgoods, suppliercontractproduct,
    suppliercontractservice, supplieruserright, systemconfig, talking, task,
    taskparam, upgrade, userinfo, usercompany, usercontract, usereducation,
    userexperience, userfunction, userlabel, useroperation, userpartner,
    userrequire, userrole, version, village, villagerule, worktype
TO 'CRM'@'%';

GRANT SELECT ON communion.customer_v TO 'CRM'@'%';
GRANT SELECT ON communion.user_v TO 'CRM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'CRM'@'%';
GRANT SELECT ON communion.house_v TO 'CRM'@'%';

-- ============================================
-- 2.4 MEM 用户权限（全库只读）
-- ============================================

GRANT SELECT ON decoration.* TO 'MEM'@'%';
GRANT SELECT ON quotation.* TO 'MEM'@'%';
GRANT SELECT ON construction.* TO 'MEM'@'%';
GRANT SELECT ON balance.* TO 'MEM'@'%';
GRANT SELECT ON sales.* TO 'MEM'@'%';
GRANT SELECT ON material.* TO 'MEM'@'%';
GRANT SELECT ON building.* TO 'MEM'@'%';
GRANT SELECT ON payment.* TO 'MEM'@'%';
GRANT SELECT ON production.* TO 'MEM'@'%';
GRANT SELECT ON personel.* TO 'MEM'@'%';
GRANT SELECT ON salary.* TO 'MEM'@'%';
GRANT SELECT ON information.* TO 'MEM'@'%';
GRANT SELECT ON inventory.* TO 'MEM'@'%';
GRANT SELECT ON factory.* TO 'MEM'@'%';
GRANT SELECT ON market.* TO 'MEM'@'%';
GRANT SELECT ON store.* TO 'MEM'@'%';
GRANT SELECT ON report.* TO 'MEM'@'%';
GRANT SELECT ON quotetion.* TO 'MEM'@'%';
GRANT SELECT ON approval.* TO 'MEM'@'%';
GRANT SELECT ON platform.* TO 'MEM'@'%';
GRANT SELECT ON data.* TO 'MEM'@'%';

GRANT SELECT ON
    assistance, assistanceitem, attendance, brand, branddeliver, brandinstall,
    brandinstorer, brandproduct, brandserver, brandsupplier, branduserright,
    buildingnamerule, category, chart, city, cityproper, cityproperpartner,
    colorpool, company, constant, constructionnode, contract, counting,
    customerrecord, custype, datadrawing, department, departmentpartner,
    departmenttype, dutment, duty, formatpool, goodspool, houselayout,
    keyvalue, label, macontrol, measurementunit, module, operation, organization,
    paymenttyped, performance, pricepool, quotationbigcategory,
    quotationclassification, quotationsmallcategory, quotationtype, receipttype,
    receipttypeitem, recruitment, recruitmenteducation, recruitmentoperation,
    region, role, roleaction, rolechart, rolemodule, roleoperation, roletask,
    servicenode, signet, supplier, suppliercontract, suppliercontractbrand,
    suppliercontractcategory, suppliercontractgoods, suppliercontractproduct,
    suppliercontractservice, supplieruserright, systemconfig, talking, task,
    taskparam, upgrade, userinfo, usercompany, usercontract, usereducation,
    userexperience, userfunction, userlabel, useroperation, userpartner,
    userrequire, userrole, version, village, villagerule, worktype
TO 'MEM'@'%';

GRANT SELECT ON communion.customer_v TO 'MEM'@'%';
GRANT SELECT ON communion.user_v TO 'MEM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'MEM'@'%';
GRANT SELECT ON communion.house_v TO 'MEM'@'%';

-- ============================================
-- 2.5 zhanglt 用户权限（全库只读）
-- ============================================

GRANT SELECT ON decoration.* TO 'zhanglt'@'%';
GRANT SELECT ON quotation.* TO 'zhanglt'@'%';
GRANT SELECT ON construction.* TO 'zhanglt'@'%';
GRANT SELECT ON balance.* TO 'zhanglt'@'%';
GRANT SELECT ON sales.* TO 'zhanglt'@'%';
GRANT SELECT ON material.* TO 'zhanglt'@'%';
GRANT SELECT ON building.* TO 'zhanglt'@'%';
GRANT SELECT ON payment.* TO 'zhanglt'@'%';
GRANT SELECT ON production.* TO 'zhanglt'@'%';
GRANT SELECT ON personel.* TO 'zhanglt'@'%';
GRANT SELECT ON salary.* TO 'zhanglt'@'%';
GRANT SELECT ON information.* TO 'zhanglt'@'%';
GRANT SELECT ON inventory.* TO 'zhanglt'@'%';
GRANT SELECT ON factory.* TO 'zhanglt'@'%';
GRANT SELECT ON market.* TO 'zhanglt'@'%';
GRANT SELECT ON store.* TO 'zhanglt'@'%';
GRANT SELECT ON report.* TO 'zhanglt'@'%';
GRANT SELECT ON quotetion.* TO 'zhanglt'@'%';
GRANT SELECT ON approval.* TO 'zhanglt'@'%';
GRANT SELECT ON platform.* TO 'zhanglt'@'%';
GRANT SELECT ON data.* TO 'zhanglt'@'%';

GRANT SELECT ON
    assistance, assistanceitem, attendance, brand, branddeliver, brandinstall,
    brandinstorer, brandproduct, brandserver, brandsupplier, branduserright,
    buildingnamerule, category, chart, city, cityproper, cityproperpartner,
    colorpool, company, constant, constructionnode, contract, counting,
    customerrecord, custype, datadrawing, department, departmentpartner,
    departmenttype, dutment, duty, formatpool, goodspool, houselayout,
    keyvalue, label, macontrol, measurementunit, module, operation, organization,
    paymenttyped, performance, pricepool, quotationbigcategory,
    quotationclassification, quotationsmallcategory, quotationtype, receipttype,
    receipttypeitem, recruitment, recruitmenteducation, recruitmentoperation,
    region, role, roleaction, rolechart, rolemodule, roleoperation, roletask,
    servicenode, signet, supplier, suppliercontract, suppliercontractbrand,
    suppliercontractcategory, suppliercontractgoods, suppliercontractproduct,
    suppliercontractservice, supplieruserright, systemconfig, talking, task,
    taskparam, upgrade, userinfo, usercompany, usercontract, usereducation,
    userexperience, userfunction, userlabel, useroperation, userpartner,
    userrequire, userrole, version, village, villagerule, worktype
TO 'zhanglt'@'%';

GRANT SELECT ON communion.customer_v TO 'zhanglt'@'%';
GRANT SELECT ON communion.user_v TO 'zhanglt'@'%';
GRANT SELECT ON communion.customerphone_v TO 'zhanglt'@'%';
GRANT SELECT ON communion.house_v TO 'zhanglt'@'%';

-- ============================================
-- 2.6 zhouhh 用户权限（全库只读）
-- ============================================

GRANT SELECT ON decoration.* TO 'zhouhh'@'%';
GRANT SELECT ON quotation.* TO 'zhouhh'@'%';
GRANT SELECT ON construction.* TO 'zhouhh'@'%';
GRANT SELECT ON balance.* TO 'zhouhh'@'%';
GRANT SELECT ON sales.* TO 'zhouhh'@'%';
GRANT SELECT ON material.* TO 'zhouhh'@'%';
GRANT SELECT ON building.* TO 'zhouhh'@'%';
GRANT SELECT ON payment.* TO 'zhouhh'@'%';
GRANT SELECT ON production.* TO 'zhouhh'@'%';
GRANT SELECT ON personel.* TO 'zhouhh'@'%';
GRANT SELECT ON salary.* TO 'zhouhh'@'%';
GRANT SELECT ON information.* TO 'zhouhh'@'%';
GRANT SELECT ON inventory.* TO 'zhouhh'@'%';
GRANT SELECT ON factory.* TO 'zhouhh'@'%';
GRANT SELECT ON market.* TO 'zhouhh'@'%';
GRANT SELECT ON store.* TO 'zhouhh'@'%';
GRANT SELECT ON report.* TO 'zhouhh'@'%';
GRANT SELECT ON quotetion.* TO 'zhouhh'@'%';
GRANT SELECT ON approval.* TO 'zhouhh'@'%';
GRANT SELECT ON platform.* TO 'zhouhh'@'%';
GRANT SELECT ON data.* TO 'zhouhh'@'%';

GRANT SELECT ON
    assistance, assistanceitem, attendance, brand, branddeliver, brandinstall,
    brandinstorer, brandproduct, brandserver, brandsupplier, branduserright,
    buildingnamerule, category, chart, city, cityproper, cityproperpartner,
    colorpool, company, constant, constructionnode, contract, counting,
    customerrecord, custype, datadrawing, department, departmentpartner,
    departmenttype, dutment, duty, formatpool, goodspool, houselayout,
    keyvalue, label, macontrol, measurementunit, module, operation, organization,
    paymenttyped, performance, pricepool, quotationbigcategory,
    quotationclassification, quotationsmallcategory, quotationtype, receipttype,
    receipttypeitem, recruitment, recruitmenteducation, recruitmentoperation,
    region, role, roleaction, rolechart, rolemodule, roleoperation, roletask,
    servicenode, signet, supplier, suppliercontract, suppliercontractbrand,
    suppliercontractcategory, suppliercontractgoods, suppliercontractproduct,
    suppliercontractservice, supplieruserright, systemconfig, talking, task,
    taskparam, upgrade, userinfo, usercompany, usercontract, usereducation,
    userexperience, userfunction, userlabel, useroperation, userpartner,
    userrequire, userrole, version, village, villagerule, worktype
TO 'zhouhh'@'%';

GRANT SELECT ON communion.customer_v TO 'zhouhh'@'%';
GRANT SELECT ON communion.user_v TO 'zhouhh'@'%';
GRANT SELECT ON communion.customerphone_v TO 'zhouhh'@'%';
GRANT SELECT ON communion.house_v TO 'zhouhh'@'%';

-- ============================================
-- 2.7 zhous 用户权限（全库只读）
-- ============================================

GRANT SELECT ON decoration.* TO 'zhous'@'%';
GRANT SELECT ON quotation.* TO 'zhous'@'%';
GRANT SELECT ON construction.* TO 'zhous'@'%';
GRANT SELECT ON balance.* TO 'zhous'@'%';
GRANT SELECT ON sales.* TO 'zhous'@'%';
GRANT SELECT ON material.* TO 'zhous'@'%';
GRANT SELECT ON building.* TO 'zhous'@'%';
GRANT SELECT ON payment.* TO 'zhous'@'%';
GRANT SELECT ON production.* TO 'zhous'@'%';
GRANT SELECT ON personel.* TO 'zhous'@'%';
GRANT SELECT ON salary.* TO 'zhous'@'%';
GRANT SELECT ON information.* TO 'zhous'@'%';
GRANT SELECT ON inventory.* TO 'zhous'@'%';
GRANT SELECT ON factory.* TO 'zhous'@'%';
GRANT SELECT ON market.* TO 'zhous'@'%';
GRANT SELECT ON store.* TO 'zhous'@'%';
GRANT SELECT ON report.* TO 'zhous'@'%';
GRANT SELECT ON quotetion.* TO 'zhous'@'%';
GRANT SELECT ON approval.* TO 'zhous'@'%';
GRANT SELECT ON platform.* TO 'zhous'@'%';
GRANT SELECT ON data.* TO 'zhous'@'%';

GRANT SELECT ON
    assistance, assistanceitem, attendance, brand, branddeliver, brandinstall,
    brandinstorer, brandproduct, brandserver, brandsupplier, branduserright,
    buildingnamerule, category, chart, city, cityproper, cityproperpartner,
    colorpool, company, constant, constructionnode, contract, counting,
    customerrecord, custype, datadrawing, department, departmentpartner,
    departmenttype, dutment, duty, formatpool, goodspool, houselayout,
    keyvalue, label, macontrol, measurementunit, module, operation, organization,
    paymenttyped, performance, pricepool, quotationbigcategory,
    quotationclassification, quotationsmallcategory, quotationtype, receipttype,
    receipttypeitem, recruitment, recruitmenteducation, recruitmentoperation,
    region, role, roleaction, rolechart, rolemodule, roleoperation, roletask,
    servicenode, signet, supplier, suppliercontract, suppliercontractbrand,
    suppliercontractcategory, suppliercontractgoods, suppliercontractproduct,
    suppliercontractservice, supplieruserright, systemconfig, talking, task,
    taskparam, upgrade, userinfo, usercompany, usercontract, usereducation,
    userexperience, userfunction, userlabel, useroperation, userpartner,
    userrequire, userrole, version, village, villagerule, worktype
TO 'zhous'@'%';

GRANT SELECT ON communion.customer_v TO 'zhous'@'%';
GRANT SELECT ON communion.user_v TO 'zhous'@'%';
GRANT SELECT ON communion.customerphone_v TO 'zhous'@'%';
GRANT SELECT ON communion.house_v TO 'zhous'@'%';

FLUSH PRIVILEGES;

-- ============================================
-- 步骤3：验证权限
-- ============================================

-- 查看用户权限
SHOW GRANTS FOR 'BI'@'%';
SHOW GRANTS FOR 'PM'@'%';
SHOW GRANTS FOR 'CRM'@'%';
SHOW GRANTS FOR 'MEM'@'%';
SHOW GRANTS FOR 'zhanglt'@'%';
SHOW GRANTS FOR 'zhouhh'@'%';
SHOW GRANTS FOR 'zhous'@'%';

-- ============================================
-- 回滚脚本
-- ============================================

/*
DROP USER IF EXISTS 'BI'@'%';
DROP USER IF EXISTS 'PM'@'%';
DROP USER IF EXISTS 'CRM'@'%';
DROP USER IF EXISTS 'MEM'@'%';
DROP USER IF EXISTS 'zhanglt'@'%';
DROP USER IF EXISTS 'zhouhh'@'%';
DROP USER IF EXISTS 'zhous'@'%';
FLUSH PRIVILEGES;
*/
