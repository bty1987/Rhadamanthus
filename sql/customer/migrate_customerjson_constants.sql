-- ============================================================
-- customer.json 常量数据化迁移
-- 将 WebContent/ds/customer.json 中前端在用的、生产库尚不存在的枚举段
-- 迁入 communion.constant 表（module='customer'）
--
-- 说明：
--   - 生产库 module='customer' 已有大量历史数据（aepair/survey/droup 等），
--     本脚本仅补建 customer.json 中"前端引用且 DB 缺失"的 8 个枚举段。
--   - 已存在的字段（aepair.status/survey.status/droup.status/droup.type/droup.dType）
--     前端改为 constant 访问器即可，无需补数据。
--   - plumberType/electricianType/tilerType/carpenterType/painterType 5 个工种问题类型，
--     在 PO 里共享 FeedbackGuaranteePO.workType（String, CSV），DB 无独立枚举，此处按 5 个
--     独立 type 建组（与 customer.json 结构一致），前端按工种分组渲染。
--   - painterType 在 customer.json 中 key=4 重复（壁纸更换/油工收尾），JSON 解析后者覆盖，
--     此处保留与 JSON 一致的两条 key=4（前端 keys 映射后者"油工收尾"生效）。
--
-- field 命名规范：{类别前缀}_{含义}_{类型后缀}
--   - 数字 key 用 _INT，字符串 key 用 _STR
--   - PO 已有常量名优先沿用（如 CustomerCompanyRulePO.TYPE_AREA_INT）
--   - field 在前端被用作常量标识符（constant.js: constant[module][clazz][field]=key），
--     便于前端以 constant.customer().customerCompanyRule.TYPE_AREA_INT 形式做值比较
--
-- 可重入：DELETE + INSERT
-- ============================================================

USE `communion`;

-- ============ customer.customerCompanyRule.type（客户公司规则类型） ============
-- 沿用 CustomerCompanyRulePO 常量名 TYPE_AREA_INT/TYPE_DEPT_INT；PO 缺 key=1(特殊)，补造 TYPE_SPECIAL_INT
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='customerCompanyRule' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('面积','customer','customerCompanyRule','type','TYPE_AREA_INT','0','面积',0),
('特殊','customer','customerCompanyRule','type','TYPE_SPECIAL_INT','1','特殊',0),
('部门','customer','customerCompanyRule','type','TYPE_DEPT_INT','2','部门',0);

-- ============ customer.feedbackComplaint.deptType（投诉部门类型） ============
-- FeedbackComplaintPO 无常量，按含义补造；deptType 为字符串字段（CSV），各选项 key 为数字
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='feedbackComplaint' AND `type`='deptType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('设计','customer','feedbackComplaint','deptType','DEPTTYPE_DESIGN_INT','0','设计',0),
('主材','customer','feedbackComplaint','deptType','DEPTTYPE_MATERIAL_INT','1','主材',0),
('尺源','customer','feedbackComplaint','deptType','DEPTTYPE_DESIGNORIGIN_INT','2','尺源',0),
('工程','customer','feedbackComplaint','deptType','DEPTTYPE_CONSTRUCTION_INT','3','工程',0),
('职能','customer','feedbackComplaint','deptType','DEPTTYPE_FUNCTION_INT','4','职能',0),
('未知','customer','feedbackComplaint','deptType','DEPTTYPE_UNKNOWN_INT','5','未知',0);

-- ============ customer.feedbackGuarantee.deptType（报修部门工种类型） ============
-- FeedbackGuaranteePO 无常量，按含义补造
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='feedbackGuarantee' AND `type`='deptType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('监理','customer','feedbackGuarantee','deptType','DEPTTYPE_SUPERVISION_INT','0','监理',0),
('售后','customer','feedbackGuarantee','deptType','DEPTTYPE_AFTERSALE_INT','1','售后',0),
('质检','customer','feedbackGuarantee','deptType','DEPTTYPE_QC_INT','2','质检',0),
('值班','customer','feedbackGuarantee','deptType','DEPTTYPE_DUTY_INT','3','值班',0);

-- ============ customer.feedbackGuarantee.plumberType（水工问题类型） ============
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='feedbackGuarantee' AND `type`='plumberType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('卫生间漏水','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_0_INT','0','卫生间漏水',0),
('下水堵塞/返水','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_1_INT','1','下水堵塞/返水',0),
('卫生间反味','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_2_INT','2','卫生间反味',0),
('厨房反味','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_3_INT','3','厨房反味',0),
('主管道漏水','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_4_INT','4','主管道漏水',0),
('厨房漏水','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_5_INT','5','厨房漏水',0),
('下水漏水','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_6_INT','6','下水漏水',0),
('上水管漏水','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_7_INT','7','上水管漏水',0),
('软连接漏水','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_8_INT','8','软连接漏水',0),
('角阀漏水','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_9_INT','9','角阀漏水',0),
('打胶处理','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_10_INT','10','打胶处理',0),
('水流小/水压问题','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_11_INT','11','水流小/水压问题',0),
('更换水件（角阀/软连接/水龙头等）','customer','feedbackGuarantee','plumberType','PLUMBERTYPE_12_INT','12','更换水件（角阀/软连接/水龙头等）',0);

-- ============ customer.feedbackGuarantee.electricianType（电工问题类型） ============
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='feedbackGuarantee' AND `type`='electricianType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('空开跳闸','customer','feedbackGuarantee','electricianType','ELECTRICIANTYPE_0_INT','0','空开跳闸',0),
('灯具不亮/频率闪','customer','feedbackGuarantee','electricianType','ELECTRICIANTYPE_1_INT','1','灯具不亮/频率闪',0),
('插座/开关不能正常使用','customer','feedbackGuarantee','electricianType','ELECTRICIANTYPE_2_INT','2','插座/开关不能正常使用',0),
('更换灯具','customer','feedbackGuarantee','electricianType','ELECTRICIANTYPE_3_INT','3','更换灯具',0),
('更换开关','customer','feedbackGuarantee','electricianType','ELECTRICIANTYPE_4_INT','4','更换开关',0),
('更换空开','customer','feedbackGuarantee','electricianType','ELECTRICIANTYPE_5_INT','5','更换空开',0),
('网线不通','customer','feedbackGuarantee','electricianType','ELECTRICIANTYPE_6_INT','6','网线不通',0),
('网线升级','customer','feedbackGuarantee','electricianType','ELECTRICIANTYPE_7_INT','7','网线升级',0);

-- ============ customer.feedbackGuarantee.tilerType（瓦工问题类型） ============
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='feedbackGuarantee' AND `type`='tilerType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('瓷砖空鼓','customer','feedbackGuarantee','tilerType','TILERTYPE_0_INT','0','瓷砖空鼓',0),
('瓷砖开裂','customer','feedbackGuarantee','tilerType','TILERTYPE_1_INT','1','瓷砖开裂',0),
('瓷砖脱落','customer','feedbackGuarantee','tilerType','TILERTYPE_2_INT','2','瓷砖脱落',0),
('瓷砖崩瓷','customer','feedbackGuarantee','tilerType','TILERTYPE_3_INT','3','瓷砖崩瓷',0),
('勾缝剂脱落','customer','feedbackGuarantee','tilerType','TILERTYPE_4_INT','4','勾缝剂脱落',0);

-- ============ customer.feedbackGuarantee.carpenterType（木工问题类型） ============
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='feedbackGuarantee' AND `type`='carpenterType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('吊棚石膏板开裂','customer','feedbackGuarantee','carpenterType','CARPENTERTYPE_0_INT','0','吊棚石膏板开裂',0),
('窗帘杆/滑道脱落','customer','feedbackGuarantee','carpenterType','CARPENTERTYPE_1_INT','1','窗帘杆/滑道脱落',0),
('窗帘盒脱落','customer','feedbackGuarantee','carpenterType','CARPENTERTYPE_2_INT','2','窗帘盒脱落',0),
('造型棚下沉','customer','feedbackGuarantee','carpenterType','CARPENTERTYPE_3_INT','3','造型棚下沉',0),
('木作造成脱落','customer','feedbackGuarantee','carpenterType','CARPENTERTYPE_4_INT','4','木作造成脱落',0);

-- ============ customer.feedbackGuarantee.painterType（油工问题类型） ============
-- 注意：customer.json 中 key=4 重复（壁纸更换/油工收尾），JSON 解析后者覆盖，
-- 此处保留与 JSON 一致的两条 key=4（前端 keys 映射后者"油工收尾"生效）
DELETE FROM `constant` WHERE `module`='customer' AND `clazz`='feedbackGuarantee' AND `type`='painterType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('墙面/棚面大白起皮开裂','customer','feedbackGuarantee','painterType','PAINTERTYPE_0_INT','0','墙面/棚面大白起皮开裂',0),
('第三方漏水大白修复','customer','feedbackGuarantee','painterType','PAINTERTYPE_1_INT','1','第三方漏水大白修复',0),
('人为剐蹭污损维修','customer','feedbackGuarantee','painterType','PAINTERTYPE_2_INT','2','人为剐蹭污损维修',0),
('大白返潮/长霉','customer','feedbackGuarantee','painterType','PAINTERTYPE_3_INT','3','大白返潮/长霉',0),
('壁纸更换，基层维修','customer','feedbackGuarantee','painterType','PAINTERTYPE_4_INT','4','壁纸更换，基层维修',0),
('油工收尾','customer','feedbackGuarantee','painterType','PAINTERTYPE_4_INT','4','油工收尾',0);
