-- ============================================================
-- 阶段2：客户与楼盘域常量数据迁移
-- 将 data.json 中的 relationshipType、labeltype 迁入 communion.constant
--
-- 说明：
--   - customerType（个人/公司）：生产库已有 customer.customer.customerType，无需新增
--   - vscoreRecordtype（新增/提取）：生产库已有 customer.vscoreRecord.type，无需新增
--   - houseType/orientation/roomNum/waterVapour/parlourType/heatingType/through：
--     经核查，前端实际从 building.json（api.ds.building）取这些字段，
--     data.json 中的同名段是历史遗留死数据，不迁移。
--   - relationshipType 的 key 为中文（与 data.json 保持一致）
--
-- 可重入：DELETE + INSERT
-- ============================================================

USE `communion`;

-- ============ customer.customer.relationshipType（客户关系类型） ============
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='customer' AND `type`='relationshipType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('普通客户','customer','customer','relationshipType','relationshipType','普通客户','普通客户',0),
('企业高端客户','customer','customer','relationshipType','relationshipType','企业高端客户','企业高端客户',0),
('企业关系客户','customer','customer','relationshipType','relationshipType','企业关系客户','企业关系客户',0),
('领导关系客户','customer','customer','relationshipType','relationshipType','领导关系客户','领导关系客户',0),
('员工关系','customer','customer','relationshipType','relationshipType','员工关系','员工关系',0);

-- ============ data.label.type（设计师标签类型） ============
DELETE FROM `constant` WHERE `module`='data' AND `clazz`='label' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('设计师风格','data','label','type','type','0','设计师风格',0),
('擅长面积','data','label','type','type','1','擅长面积',0),
('小区','data','label','type','type','2','小区',0);
