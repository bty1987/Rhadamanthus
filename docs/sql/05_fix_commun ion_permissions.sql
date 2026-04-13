-- ============================================
-- 修正 BI/PM/CRM/MEM 用户权限配置
-- ============================================
-- 功能：收回 communion.* 数据库级权限，改为单独表授权
-- 版本：v1.0
-- 日期：2026-04-11
-- ============================================

-- 说明：
-- - 收回 communion.* 数据库级权限（包含敏感表访问）
-- - 单独授权非敏感表（排除 customer, user, customerphone, house）
-- - 授予脱敏视图权限

-- ============================================
-- 步骤1：收回数据库级权限
-- ============================================

REVOKE SELECT ON `communion`.* FROM 'BI'@'%';
REVOKE SELECT ON `communion`.* FROM 'PM'@'%';
REVOKE SELECT ON `communion`.* FROM 'CRM'@'%';
REVOKE SELECT ON `communion`.* FROM 'MEM'@'%';

FLUSH PRIVILEGES;

-- ============================================
-- 步骤2：单独授予非敏感表权限
-- ============================================

-- 2.1 BI 用户权限
GRANT SELECT ON communion.assistance TO 'BI'@'%';
GRANT SELECT ON communion.assistanceitem TO 'BI'@'%';
GRANT SELECT ON communion.attendance TO 'BI'@'%';
GRANT SELECT ON communion.brand TO 'BI'@'%';
GRANT SELECT ON communion.branddeliver TO 'BI'@'%';
GRANT SELECT ON communion.brandinstall TO 'BI'@'%';
GRANT SELECT ON communion.brandinstorer TO 'BI'@'%';
GRANT SELECT ON communion.brandproduct TO 'BI'@'%';
GRANT SELECT ON communion.brandserver TO 'BI'@'%';
GRANT SELECT ON communion.brandsupplier TO 'BI'@'%';
GRANT SELECT ON communion.branduserright TO 'BI'@'%';
GRANT SELECT ON communion.buildingnamerule TO 'BI'@'%';
GRANT SELECT ON communion.category TO 'BI'@'%';
GRANT SELECT ON communion.chart TO 'BI'@'%';
GRANT SELECT ON communion.city TO 'BI'@'%';
GRANT SELECT ON communion.cityproper TO 'BI'@'%';
GRANT SELECT ON communion.cityproperpartner TO 'BI'@'%';
GRANT SELECT ON communion.colorpool TO 'BI'@'%';
GRANT SELECT ON communion.company TO 'BI'@'%';
GRANT SELECT ON communion.constant TO 'BI'@'%';
GRANT SELECT ON communion.constructionnode TO 'BI'@'%';
GRANT SELECT ON communion.contract TO 'BI'@'%';
GRANT SELECT ON communion.counting TO 'BI'@'%';
GRANT SELECT ON communion.custype TO 'BI'@'%';
GRANT SELECT ON communion.customerrecord TO 'BI'@'%';
GRANT SELECT ON communion.datadrawing TO 'BI'@'%';
GRANT SELECT ON communion.department TO 'BI'@'%';
GRANT SELECT ON communion.departmentpartner TO 'BI'@'%';
GRANT SELECT ON communion.departmenttype TO 'BI'@'%';
GRANT SELECT ON communion.dutment TO 'BI'@'%';
GRANT SELECT ON communion.duty TO 'BI'@'%';
GRANT SELECT ON communion.formatpool TO 'BI'@'%';
GRANT SELECT ON communion.goodspool TO 'BI'@'%';
GRANT SELECT ON communion.houselayout TO 'BI'@'%';
GRANT SELECT ON communion.keyvalue TO 'BI'@'%';
GRANT SELECT ON communion.label TO 'BI'@'%';
GRANT SELECT ON communion.macontrol TO 'BI'@'%';
GRANT SELECT ON communion.measurementunit TO 'BI'@'%';
GRANT SELECT ON communion.module TO 'BI'@'%';
GRANT SELECT ON communion.operation TO 'BI'@'%';
GRANT SELECT ON communion.organization TO 'BI'@'%';
GRANT SELECT ON communion.paymenttyped TO 'BI'@'%';
GRANT SELECT ON communion.performance TO 'BI'@'%';
GRANT SELECT ON communion.pricepool TO 'BI'@'%';
GRANT SELECT ON communion.quotationbigcategory TO 'BI'@'%';
GRANT SELECT ON communion.quotationclassification TO 'BI'@'%';
GRANT SELECT ON communion.quotationsmallcategory TO 'BI'@'%';
GRANT SELECT ON communion.quotationtype TO 'BI'@'%';
GRANT SELECT ON communion.receipttype TO 'BI'@'%';
GRANT SELECT ON communion.receipttypeitem TO 'BI'@'%';
GRANT SELECT ON communion.recruitment TO 'BI'@'%';
GRANT SELECT ON communion.recruitmenteducation TO 'BI'@'%';
GRANT SELECT ON communion.recruitmentoperation TO 'BI'@'%';
GRANT SELECT ON communion.region TO 'BI'@'%';
GRANT SELECT ON communion.role TO 'BI'@'%';
GRANT SELECT ON communion.roleaction TO 'BI'@'%';
GRANT SELECT ON communion.rolechart TO 'BI'@'%';
GRANT SELECT ON communion.rolemodule TO 'BI'@'%';
GRANT SELECT ON communion.roleoperation TO 'BI'@'%';
GRANT SELECT ON communion.roletask TO 'BI'@'%';
GRANT SELECT ON communion.servicenode TO 'BI'@'%';
GRANT SELECT ON communion.signet TO 'BI'@'%';
GRANT SELECT ON communion.supplier TO 'BI'@'%';
GRANT SELECT ON communion.suppliercontract TO 'BI'@'%';
GRANT SELECT ON communion.suppliercontractbrand TO 'BI'@'%';
GRANT SELECT ON communion.suppliercontractcategory TO 'BI'@'%';
GRANT SELECT ON communion.suppliercontractgoods TO 'BI'@'%';
GRANT SELECT ON communion.suppliercontractproduct TO 'BI'@'%';
GRANT SELECT ON communion.suppliercontractservice TO 'BI'@'%';
GRANT SELECT ON communion.supplieruserright TO 'BI'@'%';
GRANT SELECT ON communion.systemconfig TO 'BI'@'%';
GRANT SELECT ON communion.talking TO 'BI'@'%';
GRANT SELECT ON communion.task TO 'BI'@'%';
GRANT SELECT ON communion.taskparam TO 'BI'@'%';
GRANT SELECT ON communion.upgrade TO 'BI'@'%';
GRANT SELECT ON communion.usercompany TO 'BI'@'%';
GRANT SELECT ON communion.usercontract TO 'BI'@'%';
GRANT SELECT ON communion.usereducation TO 'BI'@'%';
GRANT SELECT ON communion.userexperience TO 'BI'@'%';
GRANT SELECT ON communion.userfunction TO 'BI'@'%';
GRANT SELECT ON communion.userinfo TO 'BI'@'%';
GRANT SELECT ON communion.userlabel TO 'BI'@'%';
GRANT SELECT ON communion.useroperation TO 'BI'@'%';
GRANT SELECT ON communion.userpartner TO 'BI'@'%';
GRANT SELECT ON communion.userrequire TO 'BI'@'%';
GRANT SELECT ON communion.userrole TO 'BI'@'%';
GRANT SELECT ON communion.village TO 'BI'@'%';
GRANT SELECT ON communion.villagerule TO 'BI'@'%';
GRANT SELECT ON communion.worktype TO 'BI'@'%';

-- 2.2 PM 用户权限
GRANT SELECT ON communion.assistance TO 'PM'@'%';
GRANT SELECT ON communion.assistanceitem TO 'PM'@'%';
GRANT SELECT ON communion.attendance TO 'PM'@'%';
GRANT SELECT ON communion.brand TO 'PM'@'%';
GRANT SELECT ON communion.branddeliver TO 'PM'@'%';
GRANT SELECT ON communion.brandinstall TO 'PM'@'%';
GRANT SELECT ON communion.brandinstorer TO 'PM'@'%';
GRANT SELECT ON communion.brandproduct TO 'PM'@'%';
GRANT SELECT ON communion.brandserver TO 'PM'@'%';
GRANT SELECT ON communion.brandsupplier TO 'PM'@'%';
GRANT SELECT ON communion.branduserright TO 'PM'@'%';
GRANT SELECT ON communion.buildingnamerule TO 'PM'@'%';
GRANT SELECT ON communion.category TO 'PM'@'%';
GRANT SELECT ON communion.chart TO 'PM'@'%';
GRANT SELECT ON communion.city TO 'PM'@'%';
GRANT SELECT ON communion.cityproper TO 'PM'@'%';
GRANT SELECT ON communion.cityproperpartner TO 'PM'@'%';
GRANT SELECT ON communion.colorpool TO 'PM'@'%';
GRANT SELECT ON communion.company TO 'PM'@'%';
GRANT SELECT ON communion.constant TO 'PM'@'%';
GRANT SELECT ON communion.constructionnode TO 'PM'@'%';
GRANT SELECT ON communion.contract TO 'PM'@'%';
GRANT SELECT ON communion.counting TO 'PM'@'%';
GRANT SELECT ON communion.custype TO 'PM'@'%';
GRANT SELECT ON communion.customerrecord TO 'PM'@'%';
GRANT SELECT ON communion.datadrawing TO 'PM'@'%';
GRANT SELECT ON communion.department TO 'PM'@'%';
GRANT SELECT ON communion.departmentpartner TO 'PM'@'%';
GRANT SELECT ON communion.departmenttype TO 'PM'@'%';
GRANT SELECT ON communion.dutment TO 'PM'@'%';
GRANT SELECT ON communion.duty TO 'PM'@'%';
GRANT SELECT ON communion.formatpool TO 'PM'@'%';
GRANT SELECT ON communion.goodspool TO 'PM'@'%';
GRANT SELECT ON communion.houselayout TO 'PM'@'%';
GRANT SELECT ON communion.keyvalue TO 'PM'@'%';
GRANT SELECT ON communion.label TO 'PM'@'%';
GRANT SELECT ON communion.macontrol TO 'PM'@'%';
GRANT SELECT ON communion.measurementunit TO 'PM'@'%';
GRANT SELECT ON communion.module TO 'PM'@'%';
GRANT SELECT ON communion.operation TO 'PM'@'%';
GRANT SELECT ON communion.organization TO 'PM'@'%';
GRANT SELECT ON communion.paymenttyped TO 'PM'@'%';
GRANT SELECT ON communion.performance TO 'PM'@'%';
GRANT SELECT ON communion.pricepool TO 'PM'@'%';
GRANT SELECT ON communion.quotationbigcategory TO 'PM'@'%';
GRANT SELECT ON communion.quotationclassification TO 'PM'@'%';
GRANT SELECT ON communion.quotationsmallcategory TO 'PM'@'%';
GRANT SELECT ON communion.quotationtype TO 'PM'@'%';
GRANT SELECT ON communion.receipttype TO 'PM'@'%';
GRANT SELECT ON communion.receipttypeitem TO 'PM'@'%';
GRANT SELECT ON communion.recruitment TO 'PM'@'%';
GRANT SELECT ON communion.recruitmenteducation TO 'PM'@'%';
GRANT SELECT ON communion.recruitmentoperation TO 'PM'@'%';
GRANT SELECT ON communion.region TO 'PM'@'%';
GRANT SELECT ON communion.role TO 'PM'@'%';
GRANT SELECT ON communion.roleaction TO 'PM'@'%';
GRANT SELECT ON communion.rolechart TO 'PM'@'%';
GRANT SELECT ON communion.rolemodule TO 'PM'@'%';
GRANT SELECT ON communion.roleoperation TO 'PM'@'%';
GRANT SELECT ON communion.roletask TO 'PM'@'%';
GRANT SELECT ON communion.servicenode TO 'PM'@'%';
GRANT SELECT ON communion.signet TO 'PM'@'%';
GRANT SELECT ON communion.supplier TO 'PM'@'%';
GRANT SELECT ON communion.suppliercontract TO 'PM'@'%';
GRANT SELECT ON communion.suppliercontractbrand TO 'PM'@'%';
GRANT SELECT ON communion.suppliercontractcategory TO 'PM'@'%';
GRANT SELECT ON communion.suppliercontractgoods TO 'PM'@'%';
GRANT SELECT ON communion.suppliercontractproduct TO 'PM'@'%';
GRANT SELECT ON communion.suppliercontractservice TO 'PM'@'%';
GRANT SELECT ON communion.supplieruserright TO 'PM'@'%';
GRANT SELECT ON communion.systemconfig TO 'PM'@'%';
GRANT SELECT ON communion.talking TO 'PM'@'%';
GRANT SELECT ON communion.task TO 'PM'@'%';
GRANT SELECT ON communion.taskparam TO 'PM'@'%';
GRANT SELECT ON communion.upgrade TO 'PM'@'%';
GRANT SELECT ON communion.usercompany TO 'PM'@'%';
GRANT SELECT ON communion.usercontract TO 'PM'@'%';
GRANT SELECT ON communion.usereducation TO 'PM'@'%';
GRANT SELECT ON communion.userexperience TO 'PM'@'%';
GRANT SELECT ON communion.userfunction TO 'PM'@'%';
GRANT SELECT ON communion.userinfo TO 'PM'@'%';
GRANT SELECT ON communion.userlabel TO 'PM'@'%';
GRANT SELECT ON communion.useroperation TO 'PM'@'%';
GRANT SELECT ON communion.userpartner TO 'PM'@'%';
GRANT SELECT ON communion.userrequire TO 'PM'@'%';
GRANT SELECT ON communion.userrole TO 'PM'@'%';
GRANT SELECT ON communion.village TO 'PM'@'%';
GRANT SELECT ON communion.villagerule TO 'PM'@'%';
GRANT SELECT ON communion.worktype TO 'PM'@'%';

-- 2.3 CRM 用户权限
GRANT SELECT ON communion.assistance TO 'CRM'@'%';
GRANT SELECT ON communion.assistanceitem TO 'CRM'@'%';
GRANT SELECT ON communion.attendance TO 'CRM'@'%';
GRANT SELECT ON communion.brand TO 'CRM'@'%';
GRANT SELECT ON communion.branddeliver TO 'CRM'@'%';
GRANT SELECT ON communion.brandinstall TO 'CRM'@'%';
GRANT SELECT ON communion.brandinstorer TO 'CRM'@'%';
GRANT SELECT ON communion.brandproduct TO 'CRM'@'%';
GRANT SELECT ON communion.brandserver TO 'CRM'@'%';
GRANT SELECT ON communion.brandsupplier TO 'CRM'@'%';
GRANT SELECT ON communion.branduserright TO 'CRM'@'%';
GRANT SELECT ON communion.buildingnamerule TO 'CRM'@'%';
GRANT SELECT ON communion.category TO 'CRM'@'%';
GRANT SELECT ON communion.chart TO 'CRM'@'%';
GRANT SELECT ON communion.city TO 'CRM'@'%';
GRANT SELECT ON communion.cityproper TO 'CRM'@'%';
GRANT SELECT ON communion.cityproperpartner TO 'CRM'@'%';
GRANT SELECT ON communion.colorpool TO 'CRM'@'%';
GRANT SELECT ON communion.company TO 'CRM'@'%';
GRANT SELECT ON communion.constant TO 'CRM'@'%';
GRANT SELECT ON communion.constructionnode TO 'CRM'@'%';
GRANT SELECT ON communion.contract TO 'CRM'@'%';
GRANT SELECT ON communion.counting TO 'CRM'@'%';
GRANT SELECT ON communion.custype TO 'CRM'@'%';
GRANT SELECT ON communion.customerrecord TO 'CRM'@'%';
GRANT SELECT ON communion.datadrawing TO 'CRM'@'%';
GRANT SELECT ON communion.department TO 'CRM'@'%';
GRANT SELECT ON communion.departmentpartner TO 'CRM'@'%';
GRANT SELECT ON communion.departmenttype TO 'CRM'@'%';
GRANT SELECT ON communion.dutment TO 'CRM'@'%';
GRANT SELECT ON communion.duty TO 'CRM'@'%';
GRANT SELECT ON communion.formatpool TO 'CRM'@'%';
GRANT SELECT ON communion.goodspool TO 'CRM'@'%';
GRANT SELECT ON communion.houselayout TO 'CRM'@'%';
GRANT SELECT ON communion.keyvalue TO 'CRM'@'%';
GRANT SELECT ON communion.label TO 'CRM'@'%';
GRANT SELECT ON communion.macontrol TO 'CRM'@'%';
GRANT SELECT ON communion.measurementunit TO 'CRM'@'%';
GRANT SELECT ON communion.module TO 'CRM'@'%';
GRANT SELECT ON communion.operation TO 'CRM'@'%';
GRANT SELECT ON communion.organization TO 'CRM'@'%';
GRANT SELECT ON communion.paymenttyped TO 'CRM'@'%';
GRANT SELECT ON communion.performance TO 'CRM'@'%';
GRANT SELECT ON communion.pricepool TO 'CRM'@'%';
GRANT SELECT ON communion.quotationbigcategory TO 'CRM'@'%';
GRANT SELECT ON communion.quotationclassification TO 'CRM'@'%';
GRANT SELECT ON communion.quotationsmallcategory TO 'CRM'@'%';
GRANT SELECT ON communion.quotationtype TO 'CRM'@'%';
GRANT SELECT ON communion.receipttype TO 'CRM'@'%';
GRANT SELECT ON communion.receipttypeitem TO 'CRM'@'%';
GRANT SELECT ON communion.recruitment TO 'CRM'@'%';
GRANT SELECT ON communion.recruitmenteducation TO 'CRM'@'%';
GRANT SELECT ON communion.recruitmentoperation TO 'CRM'@'%';
GRANT SELECT ON communion.region TO 'CRM'@'%';
GRANT SELECT ON communion.role TO 'CRM'@'%';
GRANT SELECT ON communion.roleaction TO 'CRM'@'%';
GRANT SELECT ON communion.rolechart TO 'CRM'@'%';
GRANT SELECT ON communion.rolemodule TO 'CRM'@'%';
GRANT SELECT ON communion.roleoperation TO 'CRM'@'%';
GRANT SELECT ON communion.roletask TO 'CRM'@'%';
GRANT SELECT ON communion.servicenode TO 'CRM'@'%';
GRANT SELECT ON communion.signet TO 'CRM'@'%';
GRANT SELECT ON communion.supplier TO 'CRM'@'%';
GRANT SELECT ON communion.suppliercontract TO 'CRM'@'%';
GRANT SELECT ON communion.suppliercontractbrand TO 'CRM'@'%';
GRANT SELECT ON communion.suppliercontractcategory TO 'CRM'@'%';
GRANT SELECT ON communion.suppliercontractgoods TO 'CRM'@'%';
GRANT SELECT ON communion.suppliercontractproduct TO 'CRM'@'%';
GRANT SELECT ON communion.suppliercontractservice TO 'CRM'@'%';
GRANT SELECT ON communion.supplieruserright TO 'CRM'@'%';
GRANT SELECT ON communion.systemconfig TO 'CRM'@'%';
GRANT SELECT ON communion.talking TO 'CRM'@'%';
GRANT SELECT ON communion.task TO 'CRM'@'%';
GRANT SELECT ON communion.taskparam TO 'CRM'@'%';
GRANT SELECT ON communion.upgrade TO 'CRM'@'%';
GRANT SELECT ON communion.usercompany TO 'CRM'@'%';
GRANT SELECT ON communion.usercontract TO 'CRM'@'%';
GRANT SELECT ON communion.usereducation TO 'CRM'@'%';
GRANT SELECT ON communion.userexperience TO 'CRM'@'%';
GRANT SELECT ON communion.userfunction TO 'CRM'@'%';
GRANT SELECT ON communion.userinfo TO 'CRM'@'%';
GRANT SELECT ON communion.userlabel TO 'CRM'@'%';
GRANT SELECT ON communion.useroperation TO 'CRM'@'%';
GRANT SELECT ON communion.userpartner TO 'CRM'@'%';
GRANT SELECT ON communion.userrequire TO 'CRM'@'%';
GRANT SELECT ON communion.userrole TO 'CRM'@'%';
GRANT SELECT ON communion.village TO 'CRM'@'%';
GRANT SELECT ON communion.villagerule TO 'CRM'@'%';
GRANT SELECT ON communion.worktype TO 'CRM'@'%';

-- 2.4 MEM 用户权限
GRANT SELECT ON communion.assistance TO 'MEM'@'%';
GRANT SELECT ON communion.assistanceitem TO 'MEM'@'%';
GRANT SELECT ON communion.attendance TO 'MEM'@'%';
GRANT SELECT ON communion.brand TO 'MEM'@'%';
GRANT SELECT ON communion.branddeliver TO 'MEM'@'%';
GRANT SELECT ON communion.brandinstall TO 'MEM'@'%';
GRANT SELECT ON communion.brandinstorer TO 'MEM'@'%';
GRANT SELECT ON communion.brandproduct TO 'MEM'@'%';
GRANT SELECT ON communion.brandserver TO 'MEM'@'%';
GRANT SELECT ON communion.brandsupplier TO 'MEM'@'%';
GRANT SELECT ON communion.branduserright TO 'MEM'@'%';
GRANT SELECT ON communion.buildingnamerule TO 'MEM'@'%';
GRANT SELECT ON communion.category TO 'MEM'@'%';
GRANT SELECT ON communion.chart TO 'MEM'@'%';
GRANT SELECT ON communion.city TO 'MEM'@'%';
GRANT SELECT ON communion.cityproper TO 'MEM'@'%';
GRANT SELECT ON communion.cityproperpartner TO 'MEM'@'%';
GRANT SELECT ON communion.colorpool TO 'MEM'@'%';
GRANT SELECT ON communion.company TO 'MEM'@'%';
GRANT SELECT ON communion.constant TO 'MEM'@'%';
GRANT SELECT ON communion.constructionnode TO 'MEM'@'%';
GRANT SELECT ON communion.contract TO 'MEM'@'%';
GRANT SELECT ON communion.counting TO 'MEM'@'%';
GRANT SELECT ON communion.custype TO 'MEM'@'%';
GRANT SELECT ON communion.customerrecord TO 'MEM'@'%';
GRANT SELECT ON communion.datadrawing TO 'MEM'@'%';
GRANT SELECT ON communion.department TO 'MEM'@'%';
GRANT SELECT ON communion.departmentpartner TO 'MEM'@'%';
GRANT SELECT ON communion.departmenttype TO 'MEM'@'%';
GRANT SELECT ON communion.dutment TO 'MEM'@'%';
GRANT SELECT ON communion.duty TO 'MEM'@'%';
GRANT SELECT ON communion.formatpool TO 'MEM'@'%';
GRANT SELECT ON communion.goodspool TO 'MEM'@'%';
GRANT SELECT ON communion.houselayout TO 'MEM'@'%';
GRANT SELECT ON communion.keyvalue TO 'MEM'@'%';
GRANT SELECT ON communion.label TO 'MEM'@'%';
GRANT SELECT ON communion.macontrol TO 'MEM'@'%';
GRANT SELECT ON communion.measurementunit TO 'MEM'@'%';
GRANT SELECT ON communion.module TO 'MEM'@'%';
GRANT SELECT ON communion.operation TO 'MEM'@'%';
GRANT SELECT ON communion.organization TO 'MEM'@'%';
GRANT SELECT ON communion.paymenttyped TO 'MEM'@'%';
GRANT SELECT ON communion.performance TO 'MEM'@'%';
GRANT SELECT ON communion.pricepool TO 'MEM'@'%';
GRANT SELECT ON communion.quotationbigcategory TO 'MEM'@'%';
GRANT SELECT ON communion.quotationclassification TO 'MEM'@'%';
GRANT SELECT ON communion.quotationsmallcategory TO 'MEM'@'%';
GRANT SELECT ON communion.quotationtype TO 'MEM'@'%';
GRANT SELECT ON communion.receipttype TO 'MEM'@'%';
GRANT SELECT ON communion.receipttypeitem TO 'MEM'@'%';
GRANT SELECT ON communion.recruitment TO 'MEM'@'%';
GRANT SELECT ON communion.recruitmenteducation TO 'MEM'@'%';
GRANT SELECT ON communion.recruitmentoperation TO 'MEM'@'%';
GRANT SELECT ON communion.region TO 'MEM'@'%';
GRANT SELECT ON communion.role TO 'MEM'@'%';
GRANT SELECT ON communion.roleaction TO 'MEM'@'%';
GRANT SELECT ON communion.rolechart TO 'MEM'@'%';
GRANT SELECT ON communion.rolemodule TO 'MEM'@'%';
GRANT SELECT ON communion.roleoperation TO 'MEM'@'%';
GRANT SELECT ON communion.roletask TO 'MEM'@'%';
GRANT SELECT ON communion.servicenode TO 'MEM'@'%';
GRANT SELECT ON communion.signet TO 'MEM'@'%';
GRANT SELECT ON communion.supplier TO 'MEM'@'%';
GRANT SELECT ON communion.suppliercontract TO 'MEM'@'%';
GRANT SELECT ON communion.suppliercontractbrand TO 'MEM'@'%';
GRANT SELECT ON communion.suppliercontractcategory TO 'MEM'@'%';
GRANT SELECT ON communion.suppliercontractgoods TO 'MEM'@'%';
GRANT SELECT ON communion.suppliercontractproduct TO 'MEM'@'%';
GRANT SELECT ON communion.suppliercontractservice TO 'MEM'@'%';
GRANT SELECT ON communion.supplieruserright TO 'MEM'@'%';
GRANT SELECT ON communion.systemconfig TO 'MEM'@'%';
GRANT SELECT ON communion.talking TO 'MEM'@'%';
GRANT SELECT ON communion.task TO 'MEM'@'%';
GRANT SELECT ON communion.taskparam TO 'MEM'@'%';
GRANT SELECT ON communion.upgrade TO 'MEM'@'%';
GRANT SELECT ON communion.usercompany TO 'MEM'@'%';
GRANT SELECT ON communion.usercontract TO 'MEM'@'%';
GRANT SELECT ON communion.usereducation TO 'MEM'@'%';
GRANT SELECT ON communion.userexperience TO 'MEM'@'%';
GRANT SELECT ON communion.userfunction TO 'MEM'@'%';
GRANT SELECT ON communion.userinfo TO 'MEM'@'%';
GRANT SELECT ON communion.userlabel TO 'MEM'@'%';
GRANT SELECT ON communion.useroperation TO 'MEM'@'%';
GRANT SELECT ON communion.userpartner TO 'MEM'@'%';
GRANT SELECT ON communion.userrequire TO 'MEM'@'%';
GRANT SELECT ON communion.userrole TO 'MEM'@'%';
GRANT SELECT ON communion.village TO 'MEM'@'%';
GRANT SELECT ON communion.villagerule TO 'MEM'@'%';
GRANT SELECT ON communion.worktype TO 'MEM'@'%';

-- ============================================
-- 步骤3：授予脱敏视图权限
-- ============================================

GRANT SELECT ON communion.customer_v TO 'BI'@'%';
GRANT SELECT ON communion.user_v TO 'BI'@'%';
GRANT SELECT ON communion.customerphone_v TO 'BI'@'%';
GRANT SELECT ON communion.house_v TO 'BI'@'%';

GRANT SELECT ON communion.customer_v TO 'PM'@'%';
GRANT SELECT ON communion.user_v TO 'PM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'PM'@'%';
GRANT SELECT ON communion.house_v TO 'PM'@'%';

GRANT SELECT ON communion.customer_v TO 'CRM'@'%';
GRANT SELECT ON communion.user_v TO 'CRM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'CRM'@'%';
GRANT SELECT ON communion.house_v TO 'CRM'@'%';

GRANT SELECT ON communion.customer_v TO 'MEM'@'%';
GRANT SELECT ON communion.user_v TO 'MEM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'MEM'@'%';
GRANT SELECT ON communion.house_v TO 'MEM'@'%';

FLUSH PRIVILEGES;

-- ============================================
-- 步骤4：验证配置
-- ============================================

-- 验证 BI 用户权限（应该不再有 communion.*）
SHOW GRANTS FOR 'BI'@'%';

-- 测试敏感表访问（应该报错）
-- USE communion;
-- SELECT COUNT(*) FROM customer;  -- 应该报错：Access denied
-- SELECT COUNT(*) FROM customer_v;  -- 应该成功：返回脱敏数据

-- ============================================
-- 回滚脚本（如需恢复原状）
-- ============================================

/*
-- 恢复数据库级权限
GRANT SELECT ON `communion`.* TO 'BI'@'%';
GRANT SELECT ON `communion`.* TO 'PM'@'%';
GRANT SELECT ON `communion`.* TO 'CRM'@'%';
GRANT SELECT ON `communion`.* TO 'MEM'@'%';

FLUSH PRIVILEGES;
*/
