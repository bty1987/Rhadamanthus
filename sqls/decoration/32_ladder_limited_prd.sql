-- ============================================================
-- 限量奖品+收款券配比 生产SQL汇总(阶梯抽奖合并模型终态)
-- 文件: sqls/decoration/32_ladder_limited_prd.sql
-- 用途: ①收款券配比明细表建表(decoration库, 收款用券硬依赖)
--      ②券类型字典 type=30 阶梯抽奖券(communion, 券行类型显示/前端字典)
--      ③奖品类型字典 type=30 限量奖品 + 活动物品类型 type=30 限量券(communion)
--      ④券族类型命名规范统一: 0普通券/10限额券/20抽奖券/30限量券(两clazz, 更名+补行)
-- 前置: 无新增依赖; 🔴整体先于 decoration/payment/information/approval 前端 jar 与前端文件部署执行
--      (decorationscaledetail 为 DecorationScaleDetailPO 硬映射, 缺表应用启动即异常)
-- 回滚: 一、DROP TABLE decoration.decorationscaledetail(仅限未产生收款数据前)
--      二/三、按验证语句反查 DELETE 对应 constant 行(仅限未产生业务数据前)
-- 幂等: 建表 IF NOT EXISTS / 字典 NOT EXISTS 守卫, 均可重复执行
-- 验证: 文件尾验证段
-- 边界: 48号(activityrule.grade)/40号(activityrule建表)不属本包——合并模型已不使用activityrule;
--      玩翻天抽奖(40号等)随抽奖批次另行执行
-- ============================================================

-- ============ 一、收款券配比明细表(decoration库) ============

CREATE TABLE IF NOT EXISTS decoration.decorationscaledetail (
  dsdId BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  spid BIGINT NULL COMMENT '销售收款单 payment.salespayment.spid(单笔必填,批量可空——批量=同一装修单多笔收款行,配比按orderId汇总)',
  orderId VARCHAR(15) NOT NULL COMMENT '装修单号(冗余,跨收款单汇总;长度对齐decoration.orderId)',
  sourceType TINYINT NOT NULL COMMENT '来源类型 1=阶梯券(枚举可扩:场外款等)',
  sourceId BIGINT NULL COMMENT '来源行id(通用:券=daiId)',
  daiId BIGINT NULL COMMENT '券行 decorationactivityitem.daiId(券来源;UNIQUE 一券一用并发兜底)',
  asid BIGINT NULL COMMENT '券奖品(冗余,展示/对账)',
  money BIGINT NOT NULL COMMENT '计入金额(厘)=券面值',
  isScale TINYINT NOT NULL COMMENT '是否计入配比 0计入 1不计入(对齐OalesPO命名)',
  status TINYINT NOT NULL DEFAULT 0 COMMENT '明细状态 0有效(预留作废标记,一期不启用)',
  creater INT NULL COMMENT '操作人uid',
  createTime DATETIME NULL,
  comment VARCHAR(200) NULL,
  PRIMARY KEY (dsdId),
  UNIQUE KEY uk_daiId (daiId),
  KEY idx_spid (spid),
  KEY idx_orderId (orderId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='销售收款配比明细';

-- ============ 二、券类型字典 type=30 阶梯抽奖券(communion.constant, 对齐30号) ============

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'type', 'TYPE_LADDER_LOTTERY_INT', '30', '限量券', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'type' AND field = 'TYPE_LADDER_LOTTERY_INT'
);

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'typeCommon', 'TYPE_LADDER_LOTTERY_INT', '30', '限量券', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'decoration' AND clazz = 'decorationActivityItem' AND type = 'typeCommon' AND field = 'TYPE_LADDER_LOTTERY_INT'
);

-- ============ 三、奖品类型/活动物品类型字典 type=30 限量奖品(communion.constant, 对齐31号) ============

-- 奖品库"类型"下拉数据源(建奖品用, 数量num按毫: 1张=1000)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '奖品类型', 'information', 'awardStock', 'type', 'TYPE_LADDER_LOTTERY_INT', '30', '限量奖品', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='awardStock' AND type='type' AND field='TYPE_LADDER_LOTTERY_INT'
);

-- 活动物品配置页渲染分支数据源
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'information', 'activityItem', 'type', 'TYPE_LADDER_LOTTERY_INT', '30', '限量券', 0
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant WHERE module='information' AND clazz='activityItem' AND type='type' AND field='TYPE_LADDER_LOTTERY_INT'
);

-- ============ 四、券族类型命名规范统一(0普通券/10限额券/20抽奖券/30限量券) ============

-- 更名(有则改; 首次部署生产时若无可更新行, 靠下方守卫INSERT补)
UPDATE communion.constant SET value='普通券' WHERE clazz='activityItem' AND `key`='0' AND type='type';
UPDATE communion.constant SET value='限额券' WHERE clazz='activityItem' AND `key`='10' AND type='type';
UPDATE communion.constant SET value='抽奖券' WHERE clazz='activityItem' AND `key`='20' AND type='type';
UPDATE communion.constant SET value='限量券' WHERE clazz='activityItem' AND `key`='30' AND type='type';
UPDATE communion.constant SET value='普通券' WHERE clazz='decorationActivityItem' AND `key`='0' AND type IN ('type','typeCommon');
UPDATE communion.constant SET value='限额券' WHERE clazz='decorationActivityItem' AND `key`='10' AND type IN ('type','typeCommon');
UPDATE communion.constant SET value='抽奖券' WHERE clazz='decorationActivityItem' AND `key`='20' AND type IN ('type','typeCommon');
UPDATE communion.constant SET value='限量券' WHERE clazz='decorationActivityItem' AND `key`='30' AND type IN ('type','typeCommon');

-- 补行(无则插)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'information', 'activityItem', 'type', 'TYPE_LOTTERY_INT', '20', '抽奖券', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE clazz='activityItem' AND `key`='20' AND type='type');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'type', 'TYPE_COUPON_INT', '0', '普通券', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE clazz='decorationActivityItem' AND `key`='0' AND type='type');
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '活动物品类型', 'decoration', 'decorationActivityItem', 'type', 'TYPE_LOTTERY_ACTIVITY_ITEM', '20', '抽奖券', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE clazz='decorationActivityItem' AND `key`='20' AND type='type');

-- ============ 验证段 ============

-- 1. 建表
SHOW CREATE TABLE decoration.decorationscaledetail;

-- 2. 字典(限量券4行: decorationActivityItem type/typeCommon + activityItem + awardStock=限量奖品;
--    规范统一后 activityItem/decorationActivityItem 0/10/20/30 = 普通券/限额券/抽奖券/限量券)
SELECT clazz, type, field, `key`, value FROM communion.constant
WHERE field = 'TYPE_LADDER_LOTTERY_INT' OR (clazz IN ('activityItem','decorationActivityItem') AND `key` IN ('0','10','20','30'));

-- 3. 明细表空表
SELECT COUNT(*) FROM decoration.decorationscaledetail;
