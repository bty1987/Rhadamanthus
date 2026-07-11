-- ============================================================
-- 阶段2：客户与楼盘域常量数据迁移
-- 将 data.json 中的 relationshipType、labeltype 迁入 communion.constant
--
-- 说明：
--   - customerType（个人/公司）：生产库已有 customer.customer.customerType，无需新增
--   - vscoreRecordtype（新增/提取）：生产库已有 customer.vscoreRecord.type，无需新增
--   - houseType/orientation/roomNum/waterVavour/parlourType/heatingType/through：
--     经核查，前端实际从 building.json（api.ds.building）取这些字段，
--     data.json 中的同名段是历史遗留死数据，不迁移。
--   - relationshipType 的 key 为中文（与 data.json 保持一致）
--
-- field 命名规范：{类别前缀}_{含义}_{类型后缀}
--   - 数字 key 用 _INT，字符串 key 用 _STR
--   - PO 已有常量名优先沿用，PO 无常量的按规则补造
--   - field 在前端被用作常量标识符（constant.js: constant[module][clazz][field]=key），
--     便于前端以 constant.customer().customer.RELATIONSHIPTYPE_NORMAL_STR 形式做值比较
--
-- 可重入：DELETE + INSERT
-- ============================================================

USE `communion`;

-- ============ customer.customer.relationshipType（客户关系类型） ============
-- key 为中文字符串，field 后缀 _STR
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='customer' AND `type`='relationshipType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('普通客户','customer','customer','relationshipType','RELATIONSHIPTYPE_NORMAL_STR','普通客户','普通客户',0),
('企业高端客户','customer','customer','relationshipType','RELATIONSHIPTYPE_HIGH_STR','企业高端客户','企业高端客户',0),
('企业关系客户','customer','customer','relationshipType','RELATIONSHIPTYPE_COMPANY_STR','企业关系客户','企业关系客户',0),
('领导关系客户','customer','customer','relationshipType','RELATIONSHIPTYPE_LEADER_STR','领导关系客户','领导关系客户',0),
('员工关系','customer','customer','relationshipType','RELATIONSHIPTYPE_STAFF_STR','员工关系','员工关系',0);

-- ============ data.label.type（设计师标签类型） ============
-- LabelPO 无 type 取值常量，按含义补造；key 为数字，field 后缀 _INT
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='label' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('设计师风格','data','label','type','TYPE_DESIGNERSTYLE_INT','0','设计师风格',0),
('擅长面积','data','label','type','TYPE_GOODAREA_INT','1','擅长面积',0),
('小区','data','label','type','TYPE_VILLAGE_INT','2','小区',0);
