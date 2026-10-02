-- =============================================================================
-- 主材计划(MaterialPlan)功能发版SQL  2026-09-19
-- 设计文档: docs/10-指南手册/MATERIAL_PLAN_DESIGN.md
--
-- 内容:
--   1. DDL: data.materialplannode(公司级规则) + construction.materialplan(订单级实例)  [幂等]
--   2. constant 枚举: module=construction / clazz=materialPlan 五组                      [幂等]
--   3. constructionfunction 种子: materialPlan 页 + constructionInfo 行按钮 matplan       [幂等]
--   4. constructionfunctionright 授权: 复制 constructionInfo 公司集                        [幂等]
--   5. 菜单: 规则维护页挂 443 数据字典目录(工程节点 mid=189 同级)                          [非幂等]
--   6. constructionSchedule 页联动: 主材计划汇总列×2 + 行按钮 matplan + 授权              [幂等]
--
-- 生产核查(2026-09-19 只读库):
--   communion.module MAX(mid)=929 → 本脚本取 930(执行前复核未被占用)
--   443 目录 order 已用 1~5(放线小组/工程节点/工程成本/工程计划/工程周期) → 取 6
--   platform.constructionfunctionright 无 company=0 回退, 必须按公司逐家插右行(见 §4)
--
-- 🔴 执行顺序: 本SQL必须先于 fanglin-data-8.3.029 + fanglin-construction-8.3.029 双jar发版
-- =============================================================================

-- 1. DDL -----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `data`.`materialplannode` (
  `mpnid`        BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type`         TINYINT      NOT NULL DEFAULT 0 COMMENT '维度: 0品类 1品牌',
  `cid`          BIGINT       NOT NULL DEFAULT 0 COMMENT '品类id(communion.category.cid), type=0时有效',
  `bid`          BIGINT       NOT NULL DEFAULT 0 COMMENT '品牌id(communion.brand.bid), type=1时有效',
  `categoryName` VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '品类名快照',
  `brandName`    VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '品牌名快照',
  `cnid`         BIGINT       NOT NULL COMMENT '锚点施工节点(data.constructionnode.cnid)',
  `nodeName`     VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '节点名快照',
  `action`       TINYINT      NOT NULL DEFAULT 0 COMMENT '动作: 0下单 1配送 2到货',
  `anchor`       TINYINT      NOT NULL DEFAULT 0 COMMENT '锚点: 0计划开工 1计划完工 2实际开工 3实际完工',
  `offsetDay`    INT          NOT NULL DEFAULT 0 COMMENT '偏移天数: 负=锚点前N天 0=当日 正=锚点后N天',
  `status`       TINYINT      NOT NULL DEFAULT 0 COMMENT '0启用 1停用',
  `comment`      VARCHAR(128) NOT NULL DEFAULT '' COMMENT '说明',
  `creater`      BIGINT       NOT NULL DEFAULT 0 COMMENT '创建人uid',
  `company`      INT          NOT NULL DEFAULT 0 COMMENT '公司cid',
  `createTime`   DATETIME     NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`mpnid`),
  KEY `idx_company_status` (`company`, `status`),
  KEY `idx_cnid` (`cnid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='主材计划规则表(公司级字典)';

CREATE TABLE IF NOT EXISTS `construction`.`materialplan` (
  `mpid`        BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cid`         BIGINT       NOT NULL DEFAULT 0 COMMENT '工程id(construction.construction.cid, 生成时取自schedule行)',
  `orderId`     VARCHAR(16)  NOT NULL COMMENT '装修单号',
  `ruleId`      BIGINT       NOT NULL DEFAULT 0 COMMENT '来源规则mpnid, 手工添加行=0',
  `type`        TINYINT      NOT NULL DEFAULT 0 COMMENT '维度快照: 0品类 1品牌',
  `categoryId`  BIGINT       NOT NULL DEFAULT 0 COMMENT '品类id快照',
  `categoryName` VARCHAR(64) NOT NULL DEFAULT '' COMMENT '品类名快照(品牌行=品牌所属品类)',
  `brandId`     BIGINT       NOT NULL DEFAULT 0 COMMENT '品牌id快照(品类行=0)',
  `brandName`   VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '品牌名快照(品类行=空)',
  `cnid`        BIGINT       NOT NULL COMMENT '锚点施工节点id',
  `nodeName`    VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '节点名快照(优先取该单schedule.name)',
  `action`      TINYINT      NOT NULL DEFAULT 0 COMMENT '动作快照: 0下单 1配送 2到货',
  `anchor`      TINYINT      NOT NULL DEFAULT 0 COMMENT '锚点快照: 0计划开工 1计划完工 2实际开工 3实际完工',
  `offsetDay`   INT          NOT NULL DEFAULT 0 COMMENT '偏移天数快照',
  `manualTime`  DATETIME     DEFAULT NULL COMMENT '手工指定的计划时点(NULL=按锚点+偏移推算)',
  `status`      TINYINT      NOT NULL DEFAULT 0 COMMENT '0未完成 1已完成(手工) 2已取消',
  `actualTime`  DATETIME     DEFAULT NULL COMMENT '手工完成时间',
  `operater`    BIGINT       NOT NULL DEFAULT 0 COMMENT '操作人uid(完成/取消)',
  `comment`     VARCHAR(128) NOT NULL DEFAULT '' COMMENT '说明',
  `company`     INT          NOT NULL DEFAULT 0 COMMENT '公司快照(生成时取decoration.company)',
  `createTime`  DATETIME     NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`mpid`),
  KEY `idx_orderId` (`orderId`),
  KEY `idx_company_status` (`company`, `status`),
  KEY `idx_cnid` (`cnid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='主材计划表(订单级实例)';

-- 2. constant 枚举(前端 constant.construction().materialPlan.xxx 自动生效) ---------------------

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '品类(维度)','construction','materialPlan','type','TYPE_CATEGORY_SHORT','0','品类',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='type' AND c.`key`='0');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '品牌(维度)','construction','materialPlan','type','TYPE_BRAND_SHORT','1','品牌',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='type' AND c.`key`='1');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '下单(动作)','construction','materialPlan','action','ACTION_ORDER_INT','0','下单',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='action' AND c.`key`='0');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '配送(动作)','construction','materialPlan','action','ACTION_DELIVERY_INT','1','配送',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='action' AND c.`key`='1');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '到货(动作)','construction','materialPlan','action','ACTION_ARRIVAL_INT','2','到货',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='action' AND c.`key`='2');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '计划开工(锚点)','construction','materialPlan','anchor','ANCHOR_PRE_START_INT','0','计划开工',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='anchor' AND c.`key`='0');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '计划完工(锚点)','construction','materialPlan','anchor','ANCHOR_PRE_END_INT','1','计划完工',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='anchor' AND c.`key`='1');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '实际开工(锚点)','construction','materialPlan','anchor','ANCHOR_START_INT','2','实际开工',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='anchor' AND c.`key`='2');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '实际完工(锚点)','construction','materialPlan','anchor','ANCHOR_END_INT','3','实际完工',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='anchor' AND c.`key`='3');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '未完成(主材计划)','construction','materialPlan','status','STATUS_INIT_INT','0','未完成',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='status' AND c.`key`='0');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '已完成(主材计划)','construction','materialPlan','status','STATUS_CONFIRM_INT','1','已完成',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='status' AND c.`key`='1');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '已取消(主材计划)','construction','materialPlan','status','STATUS_CANCEL_INT','2','已取消',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='status' AND c.`key`='2');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '未履约(系统)','construction','materialPlan','autoStatus','AUTO_NONE_INT','0','未履约',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='autoStatus' AND c.`key`='0');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '已下单(系统)','construction','materialPlan','autoStatus','AUTO_ORDERED_INT','1','已下单',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='autoStatus' AND c.`key`='1');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '已配送(系统)','construction','materialPlan','autoStatus','AUTO_DELIVERED_INT','2','已配送',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='autoStatus' AND c.`key`='2');

INSERT INTO `communion`.`constant` (`name`,`module`,`clazz`,`type`,`field`,`key`,`value`,`status`)
SELECT '已到货(系统)','construction','materialPlan','autoStatus','AUTO_ARRIVED_INT','3','已到货',0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `communion`.`constant` c WHERE c.module='construction' AND c.clazz='materialPlan' AND c.`type`='autoStatus' AND c.`key`='3');

-- 3. constructionfunction 种子 ------------------------------------------------------------------
-- 注意: materialPlan 页组 sort=22 按 2026-09-19 种子文件 MAX(type=0)=21 顺延, 执行前复核

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','materialPlan','materialPlan',0,0,'主材计划',22 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`type`=0);

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','apiPage','api.construction.queryMaterialPlanByOrderId',1,0,'主材计划查询接口',1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='apiPage');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','nodeName',3,1,'施工节点',1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='nodeName');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','type',3,1,'维度',2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='type');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','categoryName',3,1,'品类',3 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='categoryName');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','brandName',3,1,'品牌',4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='brandName');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','action',3,1,'动作',5 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='action');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','anchor',3,1,'锚点',6 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='anchor');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','offsetDay',3,1,'偏移天数',7 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='offsetDay');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','planTime',3,1,'计划时点',8 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='planTime');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','manualTime',3,1,'指定时点',9 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='manualTime');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','autoStatus',3,1,'系统履约',10 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='autoStatus');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','autoTime',3,1,'履约时间',11 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='autoTime');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','salesCount',3,1,'销售单数',12 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='salesCount');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','status',3,1,'状态',13 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='status');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','actualTime',3,1,'完成时间',14 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='actualTime');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','propertyArr','comment',3,1,'说明',15 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='propertyArr' AND f.`value`='comment');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','pageBtn','edit',4,1,'编辑',1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='pageBtn' AND f.`value`='edit');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','pageBtn','confirm',4,1,'完成',2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='pageBtn' AND f.`value`='confirm');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','pageBtn','cancel',4,1,'取消',3 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='pageBtn' AND f.`value`='cancel');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'materialPlan','pageBtn','del',4,1,'删除',4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='materialPlan' AND f.`key`='pageBtn' AND f.`value`='del');

-- constructionInfo 页行按钮追加(工程信息列表弹窗入口)
INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'constructionInfo','pageBtn','matplan',4,1,'主材计划',11 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='constructionInfo' AND f.`key`='pageBtn' AND f.`value`='matplan');

-- 4. constructionfunctionright 授权(无 company=0 回退, 按公司逐家绑定) --------------------------
-- materialPlan 页: 复制 constructionInfo 已绑定的公司集(含 company=0 默认行)
INSERT INTO `platform`.`constructionfunctionright` (`name`,`cfid`,`company`)
SELECT f.name, f.cfid, r.company
FROM `construction`.`constructionfunction` f
JOIN (SELECT DISTINCT company FROM `platform`.`constructionfunctionright` WHERE name = 'constructionInfo'
      UNION SELECT 0) r
WHERE f.name = 'materialPlan' AND f.`type` != 0
AND NOT EXISTS (SELECT 1 FROM `platform`.`constructionfunctionright` x WHERE x.name = f.name AND x.cfid = f.cfid AND x.company = r.company);

-- constructionInfo 新增的 matplan 行按钮: 补到已绑定 constructionInfo 的公司
INSERT INTO `platform`.`constructionfunctionright` (`name`,`cfid`,`company`)
SELECT f.name, f.cfid, r.company
FROM `construction`.`constructionfunction` f
JOIN (SELECT DISTINCT company FROM `platform`.`constructionfunctionright` WHERE name = 'constructionInfo') r
WHERE f.name = 'constructionInfo' AND f.`key` = 'pageBtn' AND f.`value` = 'matplan'
AND NOT EXISTS (SELECT 1 FROM `platform`.`constructionfunctionright` x WHERE x.name = f.name AND x.cfid = f.cfid AND x.company = r.company);

-- 5. 菜单(规则维护页, 非幂等) -------------------------------------------------------------------

-- 执行前核验(应返回 0 行)
-- SELECT mid FROM communion.module WHERE mid = 930 OR url = '/views/data/materialplannode.html';

INSERT INTO `communion`.`module` (`mid`,`fatherModuleId`,`name`,`alias`,`module`,`icon`,`url`,`level`,`system`,`order`,`helpKey`)
VALUES (930, 443, '主材计划', '主材计划', '', 'icon-wrench', '/views/data/materialplannode.html', 3, 1, 6, '');

-- 授权: 复制 mid=189(工程节点, 同目录同域)的全部角色授权
INSERT INTO `communion`.`rolemodule` (`rid`,`mid`,`link`,`access`,`cuid`,`createTime`,`company`)
SELECT DISTINCT rm.rid, 930, rm.link, rm.access, 34, NOW(), rm.company
FROM `communion`.`rolemodule` rm
WHERE rm.mid = 189;

-- 6. constructionSchedule 页联动(2026-09-19 追加): 节点级主材计划汇总 ------------------------
-- 进度列表每行=一单一个节点, 汇总列按 orderId+cnid 统计该节点主材计划:
--   materialPlanSchedule = 完成/总数(完成=手工确认或履约达动作档位), materialPlanOverdue = 逾期数
-- 行按钮 matplan 弹该单完整主材计划页
-- 🔴 production constructionSchedule 页 propertyArr/pageBtn 均为白名单, 不插以下行则列/按钮不显示

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'constructionSchedule','propertyArr','materialPlanSchedule',3,1,'主材计划(完/总)',17 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='constructionSchedule' AND f.`key`='propertyArr' AND f.`value`='materialPlanSchedule');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'constructionSchedule','propertyArr','materialPlanOverdue',3,1,'主材逾期',18 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='constructionSchedule' AND f.`key`='propertyArr' AND f.`value`='materialPlanOverdue');

INSERT INTO `construction`.`constructionfunction` (`name`,`key`,`value`,`type`,`subtype`,`comment`,`sort`)
SELECT 'constructionSchedule','pageBtn','matplan',4,1,'主材计划',6 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `construction`.`constructionfunction` f WHERE f.name='constructionSchedule' AND f.`key`='pageBtn' AND f.`value`='matplan');

-- constructionSchedule 新增 3 个配置项的右行: 复制其已绑定公司
INSERT INTO `platform`.`constructionfunctionright` (`name`,`cfid`,`company`)
SELECT f.name, f.cfid, r.company
FROM `construction`.`constructionfunction` f
JOIN (SELECT DISTINCT company FROM `platform`.`constructionfunctionright` WHERE name = 'constructionSchedule') r
WHERE f.name = 'constructionSchedule'
AND ((f.`key` = 'propertyArr' AND f.`value` IN ('materialPlanSchedule', 'materialPlanOverdue')) OR (f.`key` = 'pageBtn' AND f.`value` = 'matplan'))
AND NOT EXISTS (SELECT 1 FROM `platform`.`constructionfunctionright` x WHERE x.name = f.name AND x.cfid = f.cfid AND x.company = r.company);

-- =============================================================================
-- 执行后核验
--   SELECT COUNT(*) FROM communion.constant WHERE module='construction' AND clazz='materialPlan';      -- 应 16
--   SELECT COUNT(*) FROM construction.constructionfunction WHERE name='materialPlan';                    -- 应 21
--   SELECT COUNT(*) FROM platform.constructionfunctionright WHERE name='materialPlan';                   -- = constructionInfo 公司数+1(含0)
--   SELECT COUNT(*) FROM construction.constructionfunction WHERE name='constructionSchedule'
--     AND ((`key`='propertyArr' AND `value` IN ('materialPlanSchedule','materialPlanOverdue'))
--       OR (`key`='pageBtn' AND `value`='matplan'));                                                     -- 应 3
--   SELECT COUNT(*) FROM communion.rolemodule WHERE mid = 930;                                          -- = mid189 授权行数
-- =============================================================================
