-- ============================================================
-- building.json 常量数据化迁移
-- 将 WebContent/ds/building.json 中前端在用的枚举段迁入 communion.constant（module='building'）
--
-- 说明：
--   - 生产库 module='building' 此前无任何数据，本脚本为全量新建。
--   - building.json 共 35 个字段，其中 buildingNode / familyType 无前端引用（死数据），不迁移。
--   - cardType 原为纯字符串数组 ["身份证","军官证","护照"]，前端错误地用 split/bindData
--     当 key/value 处理（现有bug），本次顺带修正为标准 key/value 结构。
--   - buildrule / buildruleOne / buildruleTwo / buildruleThr 是楼座号拼接规则符号（#/-/座/门/空），
--     无对应 PO 字段，属纯前端枚举；key 存在空字符串和重复值，按原 JSON 原样迁入。
--   - unitPrice / totalPrice / area 是区间筛选，key 为范围字符串（如 "0-6000"）。
--   - waterVapour 在 JSON 中正确拼写为 "waterVapour"（注意非 waterVavour）。
--   - allowLoan / beingLoan 在 JSON 中各重复定义两次（后者覆盖），值相同，按一组建。
--   - history / grade / houseType 的 PO 字段类型为 String，但 building.json 中 key 为数字，
--     constant 表 key 列为 varchar，按原 JSON 的数字字符串 key 存储。
--
-- field 命名规范：{类别前缀}_{含义}_{类型后缀}
--   - 数字 key 用 _INT，字符串 key 用 _STR
--   - building 模块 PO 几乎无业务取值常量，field 均按规则补造
--   - field 在前端被用作常量标识符（constant.js: constant[module][clazz][field]=key），
--     便于前端以 constant.building().house.HOUSETYPE_0_INT 形式做值比较
--
-- 可重入：DELETE + INSERT
-- ============================================================

USE `communion`;

-- ============ building.house.houseType（房屋类型） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='house' AND `type`='houseType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('住宅','building','house','houseType','HOUSETYPE_0_INT','0','住宅',0),
('半越住宅','building','house','houseType','HOUSETYPE_1_INT','1','半越住宅',0),
('全越住宅','building','house','houseType','HOUSETYPE_2_INT','2','全越住宅',0),
('门市房','building','house','houseType','HOUSETYPE_3_INT','3','门市房',0),
('窗改门','building','house','houseType','HOUSETYPE_4_INT','4','窗改门',0),
('商住综合','building','house','houseType','HOUSETYPE_5_INT','5','商住综合',0),
('酒店公寓','building','house','houseType','HOUSETYPE_6_INT','6','酒店公寓',0),
('写字间','building','house','houseType','HOUSETYPE_7_INT','7','写字间',0),
('别墅厂房','building','house','houseType','HOUSETYPE_8_INT','8','别墅厂房',0),
('仓库','building','house','houseType','HOUSETYPE_9_INT','9','仓库',0),
('车库','building','house','houseType','HOUSETYPE_10_INT','10','车库',0),
('其它','building','house','houseType','HOUSETYPE_11_INT','11','其它',0);

-- ============ building.house.orientation（朝向） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='house' AND `type`='orientation';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('南北','building','house','orientation','ORIENTATION_0_INT','0','南北',0),
('东西','building','house','orientation','ORIENTATION_1_INT','1','东西',0),
('双阳','building','house','orientation','ORIENTATION_2_INT','2','双阳',0),
('双东','building','house','orientation','ORIENTATION_3_INT','3','双东',0),
('双西','building','house','orientation','ORIENTATION_4_INT','4','双西',0),
('双北','building','house','orientation','ORIENTATION_5_INT','5','双北',0),
('东南','building','house','orientation','ORIENTATION_6_INT','6','东南',0),
('东北','building','house','orientation','ORIENTATION_7_INT','7','东北',0),
('西南','building','house','orientation','ORIENTATION_8_INT','8','西南',0),
('西北','building','house','orientation','ORIENTATION_9_INT','9','西北',0),
('东南北','building','house','orientation','ORIENTATION_10_INT','10','东南北',0),
('西南北','building','house','orientation','ORIENTATION_11_INT','11','西南北',0),
('其它','building','house','orientation','ORIENTATION_12_INT','12','其它',0);

-- ============ building.house.roomNum（室数） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='house' AND `type`='roomNum';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('一室','building','house','roomNum','ROOMNUM_1_INT','1','一室',0),
('两室','building','house','roomNum','ROOMNUM_2_INT','2','两室',0),
('三室','building','house','roomNum','ROOMNUM_3_INT','3','三室',0),
('四室','building','house','roomNum','ROOMNUM_4_INT','4','四室',0),
('五室','building','house','roomNum','ROOMNUM_5_INT','5','五室',0),
('五室以上','building','house','roomNum','ROOMNUM_6_INT','6','五室以上',0);

-- ============ building.house.waterVapour（水气） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='house' AND `type`='waterVapour';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('无','building','house','waterVapour','WATERVAPOUR_NEG1_INT','-1','无',0),
('两水一气','building','house','waterVapour','WATERVAPOUR_0_INT','0','两水一气',0),
('两水两气','building','house','waterVapour','WATERVAPOUR_1_INT','1','两水两气',0),
('三水两气','building','house','waterVapour','WATERVAPOUR_2_INT','2','三水两气',0);

-- ============ building.house.parlourType（厅型） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='house' AND `type`='parlourType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('无','building','house','parlourType','PARLOURTYPE_NEG1_INT','-1','无',0),
('明厅','building','house','parlourType','PARLOURTYPE_0_INT','0','明厅',0),
('暗厅','building','house','parlourType','PARLOURTYPE_1_INT','1','暗厅',0);

-- ============ building.house.heatingType（供暖） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='house' AND `type`='heatingType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('无','building','house','heatingType','HEATINGTYPE_NEG1_INT','-1','无',0),
('热网','building','house','heatingType','HEATINGTYPE_0_INT','0','热网',0),
('锅炉房','building','house','heatingType','HEATINGTYPE_1_INT','1','锅炉房',0),
('燃气','building','house','heatingType','HEATINGTYPE_2_INT','2','燃气',0);

-- ============ building.house.through（通透） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='house' AND `type`='through';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('否','building','house','through','THROUGH_0_INT','0','否',0),
('是','building','house','through','THROUGH_1_INT','1','是',0);

-- ============ building.buildingHouse.type（房源类型 hsType：出售/出租） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('出售','building','buildingHouse','type','TYPE_SELL_INT','0','出售',0),
('出租','building','buildingHouse','type','TYPE_RENT_INT','1','出租',0);

-- ============ building.buildingHouse.decorateDegree（装修程度） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='decorateDegree';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('清水房','building','buildingHouse','decorateDegree','DECORATEDEGREE_0_INT','0','清水房',0),
('老式装修','building','buildingHouse','decorateDegree','DECORATEDEGREE_1_INT','1','老式装修',0),
('简单装修','building','buildingHouse','decorateDegree','DECORATEDEGREE_2_INT','2','简单装修',0),
('中等装修','building','buildingHouse','decorateDegree','DECORATEDEGREE_3_INT','3','中等装修',0),
('高级装修','building','buildingHouse','decorateDegree','DECORATEDEGREE_4_INT','4','高级装修',0),
('豪华装修','building','buildingHouse','decorateDegree','DECORATEDEGREE_5_INT','5','豪华装修',0),
('其它','building','buildingHouse','decorateDegree','DECORATEDEGREE_6_INT','6','其它',0);

-- ============ building.buildingHouse.discussType（议价） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='discussType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('少议','building','buildingHouse','discussType','DISCUSSTYPE_0_INT','0','少议',0),
('可议','building','buildingHouse','discussType','DISCUSSTYPE_1_INT','1','可议',0),
('不可议','building','buildingHouse','discussType','DISCUSSTYPE_2_INT','2','不可议',0);

-- ============ building.buildingHouse.elevator（电梯） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='elevator';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('有','building','buildingHouse','elevator','ELEVATOR_0_INT','0','有',0),
('无','building','buildingHouse','elevator','ELEVATOR_1_INT','1','无',0);

-- ============ building.buildingHouse.onlyHousing（唯一住房） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='onlyHousing';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('是','building','buildingHouse','onlyHousing','ONLYHOUSING_0_INT','0','是',0),
('否','building','buildingHouse','onlyHousing','ONLYHOUSING_1_INT','1','否',0);

-- ============ building.buildingHouse.allowLoan（允许贷款） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='allowLoan';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('允许','building','buildingHouse','allowLoan','ALLOWLOAN_0_INT','0','允许',0),
('不允许','building','buildingHouse','allowLoan','ALLOWLOAN_1_INT','1','不允许',0);

-- ============ building.buildingHouse.beingLoan（在贷） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='beingLoan';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('无','building','buildingHouse','beingLoan','BEINGLOAN_0_INT','0','无',0),
('有','building','buildingHouse','beingLoan','BEINGLOAN_1_INT','1','有',0);

-- ============ building.buildingHouse.sourceType（来源） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='sourceType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('店内','building','buildingHouse','sourceType','SOURCETYPE_0_INT','0','店内',0),
('电话','building','buildingHouse','sourceType','SOURCETYPE_1_INT','1','电话',0),
('网络','building','buildingHouse','sourceType','SOURCETYPE_2_INT','2','网络',0),
('转介绍','building','buildingHouse','sourceType','SOURCETYPE_3_INT','3','转介绍',0),
('展业','building','buildingHouse','sourceType','SOURCETYPE_4_INT','4','展业',0);

-- ============ building.buildingHouse.rentType（租赁类型） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='rentType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('无','building','buildingHouse','rentType','RENTTYPE_0_INT','0','无',0),
('月付','building','buildingHouse','rentType','RENTTYPE_1_INT','1','月付',0),
('季付','building','buildingHouse','rentType','RENTTYPE_3_INT','3','季付',0),
('半年付','building','buildingHouse','rentType','RENTTYPE_6_INT','6','半年付',0),
('年付','building','buildingHouse','rentType','RENTTYPE_12_INT','12','年付',0);

-- ============ building.buildingHouse.history（历史） ============
-- PO 中 history 为 String 类型，JSON 中 key 为数字字符串
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='history';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('正常','building','buildingHouse','history','HISTORY_0_INT','0','正常',0),
('特殊','building','buildingHouse','history','HISTORY_1_INT','1','特殊',0);

-- ============ building.buildingCustomer.type（客户类型 csType：买房/租房/投资） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingCustomer' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('买房','building','buildingCustomer','type','TYPE_BUY_INT','0','买房',0),
('租房','building','buildingCustomer','type','TYPE_RENT_INT','1','租房',0),
('投资','building','buildingCustomer','type','TYPE_INVEST_INT','2','投资',0);

-- ============ building.buildingCustomer.grade（等级） ============
-- PO 中 grade 为 String 类型，key 为字母
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingCustomer' AND `type`='grade';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('A','building','buildingCustomer','grade','GRADE_A_STR','A','A',0),
('B','building','buildingCustomer','grade','GRADE_B_STR','B','B',0),
('C','building','buildingCustomer','grade','GRADE_C_STR','C','C',0),
('D','building','buildingCustomer','grade','GRADE_D_STR','D','D',0);

-- ============ building.building.payType（付款类型） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='building' AND `type`='payType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('一手房买卖','building','building','payType','PAYTYPE_0_INT','0','一手房买卖',0),
('全款','building','building','payType','PAYTYPE_1_INT','1','全款',0),
('商业贷款','building','building','payType','PAYTYPE_2_INT','2','商业贷款',0),
('公积金','building','building','payType','PAYTYPE_3_INT','3','公积金',0),
('部队公积金','building','building','payType','PAYTYPE_4_INT','4','部队公积金',0),
('租赁月付','building','building','payType','PAYTYPE_5_INT','5','租赁月付',0);

-- ============ building.building.balanceStatus（结算状态） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='building' AND `type`='balanceStatus';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('认购','building','building','balanceStatus','BALANCESTATUS_0_INT','0','认购',0),
('成交','building','building','balanceStatus','BALANCESTATUS_1_INT','1','成交',0);

-- ============ building.building.status（房源状态：待审核/签约/失效/通过/驳回） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='building' AND `type`='status';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('待审核','building','building','status','STATUS_INIT_INT','0','待审核',0),
('签约','building','building','status','STATUS_SIGN_INT','1','签约',0),
('失效','building','building','status','STATUS_DISABLE_INT','2','失效',0),
('通过','building','building','status','STATUS_PASS_INT','3','通过',0),
('驳回','building','building','status','STATUS_REJECT_INT','4','驳回',0);

-- ============ building.buildingRecord.type（记录类型 recordType：跟进/带看/自看） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingRecord' AND `type`='type';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('跟进','building','buildingRecord','type','TYPE_FOLLOW_INT','0','跟进',0),
('带看','building','buildingRecord','type','TYPE_SHOWING_INT','1','带看',0),
('自看','building','buildingRecord','type','TYPE_SELF_INT','2','自看',0);

-- ============ building.buildingRecord.pattern（联系模式） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingRecord' AND `type`='pattern';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('店内洽谈','building','buildingRecord','pattern','PATTERN_0_INT','0','店内洽谈',0),
('网上联系','building','buildingRecord','pattern','PATTERN_1_INT','1','网上联系',0),
('电话联系','building','buildingRecord','pattern','PATTERN_2_INT','2','电话联系',0),
('信息联系','building','buildingRecord','pattern','PATTERN_3_INT','3','信息联系',0),
('其它','building','buildingRecord','pattern','PATTERN_4_INT','4','其它',0);

-- ============ building.buildingHouse.unitPrice（单价区间） ============
-- key 为范围字符串
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='unitPrice';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('6000以下','building','buildingHouse','unitPrice','UNITPRICE_0_STR','0-6000','6000以下',0),
('6000-7000元','building','buildingHouse','unitPrice','UNITPRICE_6000_STR','6000-7000','6000-7000元',0),
('7000-8000元','building','buildingHouse','unitPrice','UNITPRICE_7000_STR','7000-8000','7000-8000元',0),
('8000-9000元','building','buildingHouse','unitPrice','UNITPRICE_8000_STR','8000-9000','8000-9000元',0),
('9000-10000元','building','buildingHouse','unitPrice','UNITPRICE_9000_STR','9000-10000','9000-10000元',0),
('10000以上','building','buildingHouse','unitPrice','UNITPRICE_10000_STR','10000-99999','10000以上',0);

-- ============ building.buildingHouse.totalPrice（总价区间） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingHouse' AND `type`='totalPrice';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('50万以下','building','buildingHouse','totalPrice','TOTALPRICE_0_STR','0-500000','50万以下',0),
('50万-70万','building','buildingHouse','totalPrice','TOTALPRICE_500000_STR','500000-700000','50万-70万',0),
('70万-90万','building','buildingHouse','totalPrice','TOTALPRICE_700000_STR','700000-900000','70万-90万',0),
('90万-120万','building','buildingHouse','totalPrice','TOTALPRICE_900000_STR','900000-1200000','90万-120万',0),
('120万-140万','building','buildingHouse','totalPrice','TOTALPRICE_1200000_STR','1200000-1400000','120万-140万',0),
('140万以上','building','buildingHouse','totalPrice','TOTALPRICE_1400000_STR','1400000-99999999.99','140万以上',0);

-- ============ building.buildingCustomer.area（面积区间） ============
-- area 在 condition/building.js 和 condition/data.js 两处引用，归属 buildingCustomer（意向面积）
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='buildingCustomer' AND `type`='area';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('50㎡以下','building','buildingCustomer','area','AREA_0_STR','0-50','50㎡以下',0),
('50-70㎡','building','buildingCustomer','area','AREA_50_STR','50-70','50-70㎡',0),
('70-90㎡','building','buildingCustomer','area','AREA_70_STR','70-90','70-90㎡',0),
('90-120㎡','building','buildingCustomer','area','AREA_90_STR','90-120','90-120㎡',0),
('120-150㎡','building','buildingCustomer','area','AREA_120_STR','120-150','120-150㎡',0),
('150-200㎡','building','buildingCustomer','area','AREA_150_STR','150-200','150-200㎡',0),
('200-300㎡','building','buildingCustomer','area','AREA_200_STR','200-300','200-300㎡',0),
('300㎡以上','building','buildingCustomer','area','AREA_300_STR','300-9999','300㎡以上',0);

-- ============ building.building.buildrule（楼座规则符号） ============
-- 无对应 PO 字段，纯前端枚举；key 含空字符串
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='building' AND `type`='buildrule';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('选择','building','building','buildrule','BUILDRULE_CHOICE_STR','','选择',0),
('#','building','building','buildrule','BUILDRULE_HASH_STR','#','#',0),
('','building','building','buildrule','BUILDRULE_EMPTY1_STR','','',0),
('-','building','building','buildrule','BUILDRULE_DASH_STR','-','-',0),
('座','building','building','buildrule','BUILDRULE_ZUO_STR','座','座',0),
('门','building','building','buildrule','BUILDRULE_MEN_STR','门','门',0);

-- ============ building.building.buildruleOne（楼座规则变体一） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='building' AND `type`='buildruleOne';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('#','building','building','buildruleOne','BUILDRULEONE_HASH_STR','#','#',0),
('','building','building','buildruleOne','BUILDRULEONE_EMPTY1_STR','','',0),
('-','building','building','buildruleOne','BUILDRULEONE_DASH_STR','-','-',0),
('座','building','building','buildruleOne','BUILDRULEONE_ZUO_STR','座','座',0),
('门','building','building','buildruleOne','BUILDRULEONE_MEN_STR','门','门',0);

-- ============ building.building.buildruleTwo（楼座规则变体二） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='building' AND `type`='buildruleTwo';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('-','building','building','buildruleTwo','BUILDRULETWO_DASH_STR','-','-',0),
('#','building','building','buildruleTwo','BUILDRULETWO_HASH_STR','#','#',0),
('','building','building','buildruleTwo','BUILDRULETWO_EMPTY1_STR','','',0),
('座','building','building','buildruleTwo','BUILDRULETWO_ZUO_STR','座','座',0),
('门','building','building','buildruleTwo','BUILDRULETWO_MEN_STR','门','门',0);

-- ============ building.building.buildruleThr（楼座规则变体三） ============
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='building' AND `type`='buildruleThr';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('','building','building','buildruleThr','BUILDRULETHR_EMPTY1_STR','','',0),
('-','building','building','buildruleThr','BUILDRULETHR_DASH_STR','-','-',0),
('#','building','building','buildruleThr','BUILDRULETHR_HASH_STR','#','#',0),
('座','building','building','buildruleThr','BUILDRULETHR_ZUO_STR','座','座',0),
('门','building','building','buildruleThr','BUILDRULETHR_MEN_STR','门','门',0);

-- ============ building.building.cardType（证件类型） ============
-- 原 JSON 为纯字符串数组，前端错误用 key/value 处理；本次修正为标准 key/value
DELETE FROM `constant` WHERE `module`='building' AND `clazz`='building' AND `type`='cardType';
INSERT INTO `constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`) VALUES
('身份证','building','building','cardType','CARDTYPE_0_INT','0','身份证',0),
('军官证','building','building','cardType','CARDTYPE_1_INT','1','军官证',0),
('护照','building','building','cardType','CARDTYPE_2_INT','2','护照',0);
