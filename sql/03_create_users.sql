-- ============================================
-- 用户创建脚本
-- ============================================
-- 功能：创建只读用户，授予除敏感表外所有表的查询权限
-- 版本：v1.3
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
-- 2. 敏感表只能访问脱敏视图，不能访问原表
-- 3. communion库先撤销全部，再逐个授予非敏感表

-- ============================================
-- 步骤1：创建用户
-- ============================================

-- 注意：MySQL 5.6 不支持 CREATE USER IF NOT EXISTS
-- 如用户已存在，请先执行 DROP USER '用户名'@'%';

CREATE USER 'BI'@'%' IDENTIFIED BY 'bS86YCLQiHv3cIzoI7MThQ==';
CREATE USER 'PM'@'%' IDENTIFIED BY 'joBBT+C/mZorJIG5UE5A9A==';
CREATE USER 'CRM'@'%' IDENTIFIED BY 'hY+Kv2RjhnykoTm9/zAKsg==';
CREATE USER 'MEM'@'%' IDENTIFIED BY 'Wb3I4VFcteLJoLizC1nEvg==';
CREATE USER 'zhanglt'@'%' IDENTIFIED BY '71bEgvNTAwu5CHsTMpqpVQ==';
CREATE USER 'zhouhh'@'%' IDENTIFIED BY 'rfbGz5BrzYcuoPhxlNWb8g==';
CREATE USER 'zhous'@'%' IDENTIFIED BY 'BRfrcBWSbxQZXw4NJWHt/g==';

FLUSH PRIVILEGES;

-- 验证用户创建
SELECT user, host FROM mysql.user WHERE user IN ('BI', 'PM', 'CRM', 'MEM', 'zhanglt', 'zhouhh', 'zhous');

-- ============================================
-- 步骤2：授予权限
-- ============================================

-- 说明：communion库有80+表，需要先撤销整库权限，再逐个授予非敏感表
-- 敏感表：customer, user, customerphone, house (只能访问脱敏视图)

-- ============================================
-- 2.1 BI 用户权限
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

-- communion 库：逐个授予非敏感表（排除敏感表：customer, user, customerphone, house）
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
GRANT SELECT ON communion.customerrecord TO 'BI'@'%';
GRANT SELECT ON communion.custype TO 'BI'@'%';
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
GRANT SELECT ON communion.userinfo TO 'BI'@'%';
GRANT SELECT ON communion.usercompany TO 'BI'@'%';
GRANT SELECT ON communion.usercontract TO 'BI'@'%';
GRANT SELECT ON communion.usereducation TO 'BI'@'%';
GRANT SELECT ON communion.userexperience TO 'BI'@'%';
GRANT SELECT ON communion.userfunction TO 'BI'@'%';
GRANT SELECT ON communion.userlabel TO 'BI'@'%';
GRANT SELECT ON communion.useroperation TO 'BI'@'%';
GRANT SELECT ON communion.userpartner TO 'BI'@'%';
GRANT SELECT ON communion.userrequire TO 'BI'@'%';
GRANT SELECT ON communion.userrole TO 'BI'@'%';
GRANT SELECT ON communion.version TO 'BI'@'%';
GRANT SELECT ON communion.village TO 'BI'@'%';
GRANT SELECT ON communion.villagerule TO 'BI'@'%';
GRANT SELECT ON communion.worktype TO 'BI'@'%';

-- 脱敏视图
GRANT SELECT ON communion.customer_v TO 'BI'@'%';
GRANT SELECT ON communion.user_v TO 'BI'@'%';
GRANT SELECT ON communion.customerphone_v TO 'BI'@'%';
GRANT SELECT ON communion.house_v TO 'BI'@'%';

-- ============================================
-- 2.2 PM 用户权限
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
GRANT SELECT ON communion.customerrecord TO 'PM'@'%';
GRANT SELECT ON communion.custype TO 'PM'@'%';
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
GRANT SELECT ON communion.userinfo TO 'PM'@'%';
GRANT SELECT ON communion.usercompany TO 'PM'@'%';
GRANT SELECT ON communion.usercontract TO 'PM'@'%';
GRANT SELECT ON communion.usereducation TO 'PM'@'%';
GRANT SELECT ON communion.userexperience TO 'PM'@'%';
GRANT SELECT ON communion.userfunction TO 'PM'@'%';
GRANT SELECT ON communion.userlabel TO 'PM'@'%';
GRANT SELECT ON communion.useroperation TO 'PM'@'%';
GRANT SELECT ON communion.userpartner TO 'PM'@'%';
GRANT SELECT ON communion.userrequire TO 'PM'@'%';
GRANT SELECT ON communion.userrole TO 'PM'@'%';
GRANT SELECT ON communion.version TO 'PM'@'%';
GRANT SELECT ON communion.village TO 'PM'@'%';
GRANT SELECT ON communion.villagerule TO 'PM'@'%';
GRANT SELECT ON communion.worktype TO 'PM'@'%';

GRANT SELECT ON communion.customer_v TO 'PM'@'%';
GRANT SELECT ON communion.user_v TO 'PM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'PM'@'%';
GRANT SELECT ON communion.house_v TO 'PM'@'%';

-- ============================================
-- 2.3 CRM 用户权限
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
GRANT SELECT ON communion.customerrecord TO 'CRM'@'%';
GRANT SELECT ON communion.custype TO 'CRM'@'%';
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
GRANT SELECT ON communion.userinfo TO 'CRM'@'%';
GRANT SELECT ON communion.usercompany TO 'CRM'@'%';
GRANT SELECT ON communion.usercontract TO 'CRM'@'%';
GRANT SELECT ON communion.usereducation TO 'CRM'@'%';
GRANT SELECT ON communion.userexperience TO 'CRM'@'%';
GRANT SELECT ON communion.userfunction TO 'CRM'@'%';
GRANT SELECT ON communion.userlabel TO 'CRM'@'%';
GRANT SELECT ON communion.useroperation TO 'CRM'@'%';
GRANT SELECT ON communion.userpartner TO 'CRM'@'%';
GRANT SELECT ON communion.userrequire TO 'CRM'@'%';
GRANT SELECT ON communion.userrole TO 'CRM'@'%';
GRANT SELECT ON communion.version TO 'CRM'@'%';
GRANT SELECT ON communion.village TO 'CRM'@'%';
GRANT SELECT ON communion.villagerule TO 'CRM'@'%';
GRANT SELECT ON communion.worktype TO 'CRM'@'%';

GRANT SELECT ON communion.customer_v TO 'CRM'@'%';
GRANT SELECT ON communion.user_v TO 'CRM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'CRM'@'%';
GRANT SELECT ON communion.house_v TO 'CRM'@'%';

-- ============================================
-- 2.4 MEM 用户权限
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
GRANT SELECT ON communion.customerrecord TO 'MEM'@'%';
GRANT SELECT ON communion.custype TO 'MEM'@'%';
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
GRANT SELECT ON communion.userinfo TO 'MEM'@'%';
GRANT SELECT ON communion.usercompany TO 'MEM'@'%';
GRANT SELECT ON communion.usercontract TO 'MEM'@'%';
GRANT SELECT ON communion.usereducation TO 'MEM'@'%';
GRANT SELECT ON communion.userexperience TO 'MEM'@'%';
GRANT SELECT ON communion.userfunction TO 'MEM'@'%';
GRANT SELECT ON communion.userlabel TO 'MEM'@'%';
GRANT SELECT ON communion.useroperation TO 'MEM'@'%';
GRANT SELECT ON communion.userpartner TO 'MEM'@'%';
GRANT SELECT ON communion.userrequire TO 'MEM'@'%';
GRANT SELECT ON communion.userrole TO 'MEM'@'%';
GRANT SELECT ON communion.version TO 'MEM'@'%';
GRANT SELECT ON communion.village TO 'MEM'@'%';
GRANT SELECT ON communion.villagerule TO 'MEM'@'%';
GRANT SELECT ON communion.worktype TO 'MEM'@'%';

GRANT SELECT ON communion.customer_v TO 'MEM'@'%';
GRANT SELECT ON communion.user_v TO 'MEM'@'%';
GRANT SELECT ON communion.customerphone_v TO 'MEM'@'%';
GRANT SELECT ON communion.house_v TO 'MEM'@'%';

-- ============================================
-- 2.5 zhanglt 用户权限
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

GRANT SELECT ON communion.assistance TO 'zhanglt'@'%';
GRANT SELECT ON communion.assistanceitem TO 'zhanglt'@'%';
GRANT SELECT ON communion.attendance TO 'zhanglt'@'%';
GRANT SELECT ON communion.brand TO 'zhanglt'@'%';
GRANT SELECT ON communion.branddeliver TO 'zhanglt'@'%';
GRANT SELECT ON communion.brandinstall TO 'zhanglt'@'%';
GRANT SELECT ON communion.brandinstorer TO 'zhanglt'@'%';
GRANT SELECT ON communion.brandproduct TO 'zhanglt'@'%';
GRANT SELECT ON communion.brandserver TO 'zhanglt'@'%';
GRANT SELECT ON communion.brandsupplier TO 'zhanglt'@'%';
GRANT SELECT ON communion.branduserright TO 'zhanglt'@'%';
GRANT SELECT ON communion.buildingnamerule TO 'zhanglt'@'%';
GRANT SELECT ON communion.category TO 'zhanglt'@'%';
GRANT SELECT ON communion.chart TO 'zhanglt'@'%';
GRANT SELECT ON communion.city TO 'zhanglt'@'%';
GRANT SELECT ON communion.cityproper TO 'zhanglt'@'%';
GRANT SELECT ON communion.cityproperpartner TO 'zhanglt'@'%';
GRANT SELECT ON communion.colorpool TO 'zhanglt'@'%';
GRANT SELECT ON communion.company TO 'zhanglt'@'%';
GRANT SELECT ON communion.constant TO 'zhanglt'@'%';
GRANT SELECT ON communion.constructionnode TO 'zhanglt'@'%';
GRANT SELECT ON communion.contract TO 'zhanglt'@'%';
GRANT SELECT ON communion.counting TO 'zhanglt'@'%';
GRANT SELECT ON communion.customerrecord TO 'zhanglt'@'%';
GRANT SELECT ON communion.custype TO 'zhanglt'@'%';
GRANT SELECT ON communion.datadrawing TO 'zhanglt'@'%';
GRANT SELECT ON communion.department TO 'zhanglt'@'%';
GRANT SELECT ON communion.departmentpartner TO 'zhanglt'@'%';
GRANT SELECT ON communion.departmenttype TO 'zhanglt'@'%';
GRANT SELECT ON communion.dutment TO 'zhanglt'@'%';
GRANT SELECT ON communion.duty TO 'zhanglt'@'%';
GRANT SELECT ON communion.formatpool TO 'zhanglt'@'%';
GRANT SELECT ON communion.goodspool TO 'zhanglt'@'%';
GRANT SELECT ON communion.houselayout TO 'zhanglt'@'%';
GRANT SELECT ON communion.keyvalue TO 'zhanglt'@'%';
GRANT SELECT ON communion.label TO 'zhanglt'@'%';
GRANT SELECT ON communion.macontrol TO 'zhanglt'@'%';
GRANT SELECT ON communion.measurementunit TO 'zhanglt'@'%';
GRANT SELECT ON communion.module TO 'zhanglt'@'%';
GRANT SELECT ON communion.operation TO 'zhanglt'@'%';
GRANT SELECT ON communion.organization TO 'zhanglt'@'%';
GRANT SELECT ON communion.paymenttyped TO 'zhanglt'@'%';
GRANT SELECT ON communion.performance TO 'zhanglt'@'%';
GRANT SELECT ON communion.pricepool TO 'zhanglt'@'%';
GRANT SELECT ON communion.quotationbigcategory TO 'zhanglt'@'%';
GRANT SELECT ON communion.quotationclassification TO 'zhanglt'@'%';
GRANT SELECT ON communion.quotationsmallcategory TO 'zhanglt'@'%';
GRANT SELECT ON communion.quotationtype TO 'zhanglt'@'%';
GRANT SELECT ON communion.receipttype TO 'zhanglt'@'%';
GRANT SELECT ON communion.receipttypeitem TO 'zhanglt'@'%';
GRANT SELECT ON communion.recruitment TO 'zhanglt'@'%';
GRANT SELECT ON communion.recruitmenteducation TO 'zhanglt'@'%';
GRANT SELECT ON communion.recruitmentoperation TO 'zhanglt'@'%';
GRANT SELECT ON communion.region TO 'zhanglt'@'%';
GRANT SELECT ON communion.role TO 'zhanglt'@'%';
GRANT SELECT ON communion.roleaction TO 'zhanglt'@'%';
GRANT SELECT ON communion.rolechart TO 'zhanglt'@'%';
GRANT SELECT ON communion.rolemodule TO 'zhanglt'@'%';
GRANT SELECT ON communion.roleoperation TO 'zhanglt'@'%';
GRANT SELECT ON communion.roletask TO 'zhanglt'@'%';
GRANT SELECT ON communion.servicenode TO 'zhanglt'@'%';
GRANT SELECT ON communion.signet TO 'zhanglt'@'%';
GRANT SELECT ON communion.supplier TO 'zhanglt'@'%';
GRANT SELECT ON communion.suppliercontract TO 'zhanglt'@'%';
GRANT SELECT ON communion.suppliercontractbrand TO 'zhanglt'@'%';
GRANT SELECT ON communion.suppliercontractcategory TO 'zhanglt'@'%';
GRANT SELECT ON communion.suppliercontractgoods TO 'zhanglt'@'%';
GRANT SELECT ON communion.suppliercontractproduct TO 'zhanglt'@'%';
GRANT SELECT ON communion.suppliercontractservice TO 'zhanglt'@'%';
GRANT SELECT ON communion.supplieruserright TO 'zhanglt'@'%';
GRANT SELECT ON communion.systemconfig TO 'zhanglt'@'%';
GRANT SELECT ON communion.talking TO 'zhanglt'@'%';
GRANT SELECT ON communion.task TO 'zhanglt'@'%';
GRANT SELECT ON communion.taskparam TO 'zhanglt'@'%';
GRANT SELECT ON communion.upgrade TO 'zhanglt'@'%';
GRANT SELECT ON communion.userinfo TO 'zhanglt'@'%';
GRANT SELECT ON communion.usercompany TO 'zhanglt'@'%';
GRANT SELECT ON communion.usercontract TO 'zhanglt'@'%';
GRANT SELECT ON communion.usereducation TO 'zhanglt'@'%';
GRANT SELECT ON communion.userexperience TO 'zhanglt'@'%';
GRANT SELECT ON communion.userfunction TO 'zhanglt'@'%';
GRANT SELECT ON communion.userlabel TO 'zhanglt'@'%';
GRANT SELECT ON communion.useroperation TO 'zhanglt'@'%';
GRANT SELECT ON communion.userpartner TO 'zhanglt'@'%';
GRANT SELECT ON communion.userrequire TO 'zhanglt'@'%';
GRANT SELECT ON communion.userrole TO 'zhanglt'@'%';
GRANT SELECT ON communion.version TO 'zhanglt'@'%';
GRANT SELECT ON communion.village TO 'zhanglt'@'%';
GRANT SELECT ON communion.villagerule TO 'zhanglt'@'%';
GRANT SELECT ON communion.worktype TO 'zhanglt'@'%';

GRANT SELECT ON communion.customer_v TO 'zhanglt'@'%';
GRANT SELECT ON communion.user_v TO 'zhanglt'@'%';
GRANT SELECT ON communion.customerphone_v TO 'zhanglt'@'%';
GRANT SELECT ON communion.house_v TO 'zhanglt'@'%';

-- ============================================
-- 2.6 zhouhh 用户权限
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

GRANT SELECT ON communion.assistance TO 'zhouhh'@'%';
GRANT SELECT ON communion.assistanceitem TO 'zhouhh'@'%';
GRANT SELECT ON communion.attendance TO 'zhouhh'@'%';
GRANT SELECT ON communion.brand TO 'zhouhh'@'%';
GRANT SELECT ON communion.branddeliver TO 'zhouhh'@'%';
GRANT SELECT ON communion.brandinstall TO 'zhouhh'@'%';
GRANT SELECT ON communion.brandinstorer TO 'zhouhh'@'%';
GRANT SELECT ON communion.brandproduct TO 'zhouhh'@'%';
GRANT SELECT ON communion.brandserver TO 'zhouhh'@'%';
GRANT SELECT ON communion.brandsupplier TO 'zhouhh'@'%';
GRANT SELECT ON communion.branduserright TO 'zhouhh'@'%';
GRANT SELECT ON communion.buildingnamerule TO 'zhouhh'@'%';
GRANT SELECT ON communion.category TO 'zhouhh'@'%';
GRANT SELECT ON communion.chart TO 'zhouhh'@'%';
GRANT SELECT ON communion.city TO 'zhouhh'@'%';
GRANT SELECT ON communion.cityproper TO 'zhouhh'@'%';
GRANT SELECT ON communion.cityproperpartner TO 'zhouhh'@'%';
GRANT SELECT ON communion.colorpool TO 'zhouhh'@'%';
GRANT SELECT ON communion.company TO 'zhouhh'@'%';
GRANT SELECT ON communion.constant TO 'zhouhh'@'%';
GRANT SELECT ON communion.constructionnode TO 'zhouhh'@'%';
GRANT SELECT ON communion.contract TO 'zhouhh'@'%';
GRANT SELECT ON communion.counting TO 'zhouhh'@'%';
GRANT SELECT ON communion.customerrecord TO 'zhouhh'@'%';
GRANT SELECT ON communion.custype TO 'zhouhh'@'%';
GRANT SELECT ON communion.datadrawing TO 'zhouhh'@'%';
GRANT SELECT ON communion.department TO 'zhouhh'@'%';
GRANT SELECT ON communion.departmentpartner TO 'zhouhh'@'%';
GRANT SELECT ON communion.departmenttype TO 'zhouhh'@'%';
GRANT SELECT ON communion.dutment TO 'zhouhh'@'%';
GRANT SELECT ON communion.duty TO 'zhouhh'@'%';
GRANT SELECT ON communion.formatpool TO 'zhouhh'@'%';
GRANT SELECT ON communion.goodspool TO 'zhouhh'@'%';
GRANT SELECT ON communion.houselayout TO 'zhouhh'@'%';
GRANT SELECT ON communion.keyvalue TO 'zhouhh'@'%';
GRANT SELECT ON communion.label TO 'zhouhh'@'%';
GRANT SELECT ON communion.macontrol TO 'zhouhh'@'%';
GRANT SELECT ON communion.measurementunit TO 'zhouhh'@'%';
GRANT SELECT ON communion.module TO 'zhouhh'@'%';
GRANT SELECT ON communion.operation TO 'zhouhh'@'%';
GRANT SELECT ON communion.organization TO 'zhouhh'@'%';
GRANT SELECT ON communion.paymenttyped TO 'zhouhh'@'%';
GRANT SELECT ON communion.performance TO 'zhouhh'@'%';
GRANT SELECT ON communion.pricepool TO 'zhouhh'@'%';
GRANT SELECT ON communion.quotationbigcategory TO 'zhouhh'@'%';
GRANT SELECT ON communion.quotationclassification TO 'zhouhh'@'%';
GRANT SELECT ON communion.quotationsmallcategory TO 'zhouhh'@'%';
GRANT SELECT ON communion.quotationtype TO 'zhouhh'@'%';
GRANT SELECT ON communion.receipttype TO 'zhouhh'@'%';
GRANT SELECT ON communion.receipttypeitem TO 'zhouhh'@'%';
GRANT SELECT ON communion.recruitment TO 'zhouhh'@'%';
GRANT SELECT ON communion.recruitmenteducation TO 'zhouhh'@'%';
GRANT SELECT ON communion.recruitmentoperation TO 'zhouhh'@'%';
GRANT SELECT ON communion.region TO 'zhouhh'@'%';
GRANT SELECT ON communion.role TO 'zhouhh'@'%';
GRANT SELECT ON communion.roleaction TO 'zhouhh'@'%';
GRANT SELECT ON communion.rolechart TO 'zhouhh'@'%';
GRANT SELECT ON communion.rolemodule TO 'zhouhh'@'%';
GRANT SELECT ON communion.roleoperation TO 'zhouhh'@'%';
GRANT SELECT ON communion.roletask TO 'zhouhh'@'%';
GRANT SELECT ON communion.servicenode TO 'zhouhh'@'%';
GRANT SELECT ON communion.signet TO 'zhouhh'@'%';
GRANT SELECT ON communion.supplier TO 'zhouhh'@'%';
GRANT SELECT ON communion.suppliercontract TO 'zhouhh'@'%';
GRANT SELECT ON communion.suppliercontractbrand TO 'zhouhh'@'%';
GRANT SELECT ON communion.suppliercontractcategory TO 'zhouhh'@'%';
GRANT SELECT ON communion.suppliercontractgoods TO 'zhouhh'@'%';
GRANT SELECT ON communion.suppliercontractproduct TO 'zhouhh'@'%';
GRANT SELECT ON communion.suppliercontractservice TO 'zhouhh'@'%';
GRANT SELECT ON communion.supplieruserright TO 'zhouhh'@'%';
GRANT SELECT ON communion.systemconfig TO 'zhouhh'@'%';
GRANT SELECT ON communion.talking TO 'zhouhh'@'%';
GRANT SELECT ON communion.task TO 'zhouhh'@'%';
GRANT SELECT ON communion.taskparam TO 'zhouhh'@'%';
GRANT SELECT ON communion.upgrade TO 'zhouhh'@'%';
GRANT SELECT ON communion.userinfo TO 'zhouhh'@'%';
GRANT SELECT ON communion.usercompany TO 'zhouhh'@'%';
GRANT SELECT ON communion.usercontract TO 'zhouhh'@'%';
GRANT SELECT ON communion.usereducation TO 'zhouhh'@'%';
GRANT SELECT ON communion.userexperience TO 'zhouhh'@'%';
GRANT SELECT ON communion.userfunction TO 'zhouhh'@'%';
GRANT SELECT ON communion.userlabel TO 'zhouhh'@'%';
GRANT SELECT ON communion.useroperation TO 'zhouhh'@'%';
GRANT SELECT ON communion.userpartner TO 'zhouhh'@'%';
GRANT SELECT ON communion.userrequire TO 'zhouhh'@'%';
GRANT SELECT ON communion.userrole TO 'zhouhh'@'%';
GRANT SELECT ON communion.version TO 'zhouhh'@'%';
GRANT SELECT ON communion.village TO 'zhouhh'@'%';
GRANT SELECT ON communion.villagerule TO 'zhouhh'@'%';
GRANT SELECT ON communion.worktype TO 'zhouhh'@'%';

GRANT SELECT ON communion.customer_v TO 'zhouhh'@'%';
GRANT SELECT ON communion.user_v TO 'zhouhh'@'%';
GRANT SELECT ON communion.customerphone_v TO 'zhouhh'@'%';
GRANT SELECT ON communion.house_v TO 'zhouhh'@'%';

-- ============================================
-- 2.7 zhous 用户权限
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

GRANT SELECT ON communion.assistance TO 'zhous'@'%';
GRANT SELECT ON communion.assistanceitem TO 'zhous'@'%';
GRANT SELECT ON communion.attendance TO 'zhous'@'%';
GRANT SELECT ON communion.brand TO 'zhous'@'%';
GRANT SELECT ON communion.branddeliver TO 'zhous'@'%';
GRANT SELECT ON communion.brandinstall TO 'zhous'@'%';
GRANT SELECT ON communion.brandinstorer TO 'zhous'@'%';
GRANT SELECT ON communion.brandproduct TO 'zhous'@'%';
GRANT SELECT ON communion.brandserver TO 'zhous'@'%';
GRANT SELECT ON communion.brandsupplier TO 'zhous'@'%';
GRANT SELECT ON communion.branduserright TO 'zhous'@'%';
GRANT SELECT ON communion.buildingnamerule TO 'zhous'@'%';
GRANT SELECT ON communion.category TO 'zhous'@'%';
GRANT SELECT ON communion.chart TO 'zhous'@'%';
GRANT SELECT ON communion.city TO 'zhous'@'%';
GRANT SELECT ON communion.cityproper TO 'zhous'@'%';
GRANT SELECT ON communion.cityproperpartner TO 'zhous'@'%';
GRANT SELECT ON communion.colorpool TO 'zhous'@'%';
GRANT SELECT ON communion.company TO 'zhous'@'%';
GRANT SELECT ON communion.constant TO 'zhous'@'%';
GRANT SELECT ON communion.constructionnode TO 'zhous'@'%';
GRANT SELECT ON communion.contract TO 'zhous'@'%';
GRANT SELECT ON communion.counting TO 'zhous'@'%';
GRANT SELECT ON communion.customerrecord TO 'zhous'@'%';
GRANT SELECT ON communion.custype TO 'zhous'@'%';
GRANT SELECT ON communion.datadrawing TO 'zhous'@'%';
GRANT SELECT ON communion.department TO 'zhous'@'%';
GRANT SELECT ON communion.departmentpartner TO 'zhous'@'%';
GRANT SELECT ON communion.departmenttype TO 'zhous'@'%';
GRANT SELECT ON communion.dutment TO 'zhous'@'%';
GRANT SELECT ON communion.duty TO 'zhous'@'%';
GRANT SELECT ON communion.formatpool TO 'zhous'@'%';
GRANT SELECT ON communion.goodspool TO 'zhous'@'%';
GRANT SELECT ON communion.houselayout TO 'zhous'@'%';
GRANT SELECT ON communion.keyvalue TO 'zhous'@'%';
GRANT SELECT ON communion.label TO 'zhous'@'%';
GRANT SELECT ON communion.macontrol TO 'zhous'@'%';
GRANT SELECT ON communion.measurementunit TO 'zhous'@'%';
GRANT SELECT ON communion.module TO 'zhous'@'%';
GRANT SELECT ON communion.operation TO 'zhous'@'%';
GRANT SELECT ON communion.organization TO 'zhous'@'%';
GRANT SELECT ON communion.paymenttyped TO 'zhous'@'%';
GRANT SELECT ON communion.performance TO 'zhous'@'%';
GRANT SELECT ON communion.pricepool TO 'zhous'@'%';
GRANT SELECT ON communion.quotationbigcategory TO 'zhous'@'%';
GRANT SELECT ON communion.quotationclassification TO 'zhous'@'%';
GRANT SELECT ON communion.quotationsmallcategory TO 'zhous'@'%';
GRANT SELECT ON communion.quotationtype TO 'zhous'@'%';
GRANT SELECT ON communion.receipttype TO 'zhous'@'%';
GRANT SELECT ON communion.receipttypeitem TO 'zhous'@'%';
GRANT SELECT ON communion.recruitment TO 'zhous'@'%';
GRANT SELECT ON communion.recruitmenteducation TO 'zhous'@'%';
GRANT SELECT ON communion.recruitmentoperation TO 'zhous'@'%';
GRANT SELECT ON communion.region TO 'zhous'@'%';
GRANT SELECT ON communion.role TO 'zhous'@'%';
GRANT SELECT ON communion.roleaction TO 'zhous'@'%';
GRANT SELECT ON communion.rolechart TO 'zhous'@'%';
GRANT SELECT ON communion.rolemodule TO 'zhous'@'%';
GRANT SELECT ON communion.roleoperation TO 'zhous'@'%';
GRANT SELECT ON communion.roletask TO 'zhous'@'%';
GRANT SELECT ON communion.servicenode TO 'zhous'@'%';
GRANT SELECT ON communion.signet TO 'zhous'@'%';
GRANT SELECT ON communion.supplier TO 'zhous'@'%';
GRANT SELECT ON communion.suppliercontract TO 'zhous'@'%';
GRANT SELECT ON communion.suppliercontractbrand TO 'zhous'@'%';
GRANT SELECT ON communion.suppliercontractcategory TO 'zhous'@'%';
GRANT SELECT ON communion.suppliercontractgoods TO 'zhous'@'%';
GRANT SELECT ON communion.suppliercontractproduct TO 'zhous'@'%';
GRANT SELECT ON communion.suppliercontractservice TO 'zhous'@'%';
GRANT SELECT ON communion.supplieruserright TO 'zhous'@'%';
GRANT SELECT ON communion.systemconfig TO 'zhous'@'%';
GRANT SELECT ON communion.talking TO 'zhous'@'%';
GRANT SELECT ON communion.task TO 'zhous'@'%';
GRANT SELECT ON communion.taskparam TO 'zhous'@'%';
GRANT SELECT ON communion.upgrade TO 'zhous'@'%';
GRANT SELECT ON communion.userinfo TO 'zhous'@'%';
GRANT SELECT ON communion.usercompany TO 'zhous'@'%';
GRANT SELECT ON communion.usercontract TO 'zhous'@'%';
GRANT SELECT ON communion.usereducation TO 'zhous'@'%';
GRANT SELECT ON communion.userexperience TO 'zhous'@'%';
GRANT SELECT ON communion.userfunction TO 'zhous'@'%';
GRANT SELECT ON communion.userlabel TO 'zhous'@'%';
GRANT SELECT ON communion.useroperation TO 'zhous'@'%';
GRANT SELECT ON communion.userpartner TO 'zhous'@'%';
GRANT SELECT ON communion.userrequire TO 'zhous'@'%';
GRANT SELECT ON communion.userrole TO 'zhous'@'%';
GRANT SELECT ON communion.version TO 'zhous'@'%';
GRANT SELECT ON communion.village TO 'zhous'@'%';
GRANT SELECT ON communion.villagerule TO 'zhous'@'%';
GRANT SELECT ON communion.worktype TO 'zhous'@'%';

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
DROP USER 'BI'@'%';
DROP USER 'PM'@'%';
DROP USER 'CRM'@'%';
DROP USER 'MEM'@'%';
DROP USER 'zhanglt'@'%';
DROP USER 'zhouhh'@'%';
DROP USER 'zhous'@'%';
FLUSH PRIVILEGES;
*/
