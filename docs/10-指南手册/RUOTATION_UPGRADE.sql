-- =============================================================================
-- 退报单(ruotation)功能启用 —— DDL / 菜单修复 / 枚举 / 页面配置
-- 日期: 2026-09-19
-- 背景: 退报单骨架(表/后端/前端)早已存在但从未投产:
--         1) 生产 quotation.ruotation / quotation.ruotationitem 均 0 行
--         2) 菜单 mid=870 指向改名前旧 URL /views/quotation/quotationRefundIndex.html
--            (2026-05-23 提交 1de21db0d 全层改名后死链)
--         3) quotation.quotationfunction / platform.quotationfunctionright 无 ruotation
--            页面配置行, 列表页 getConfig 拿不到 apiPage 打不开
--         4) communion.constant 无退报单状态枚举
--       本轮代码改造(阶段1):
--         - ruotation 加 status 状态机: 0=编辑中 1=已提交(终止审批中) 2=已生效(终止落地) 3=已作废
--         - ruotationitem 加 source(0=报价/1=扩展/2=增减) + sourceItemId(qfaiId/eiid/ariId)
--           + qfaiId(订单报价项实例) 三列, 为三源接入铺路
--         - 查重口径从"一报价一退报单"改为"一订单一有效退报单"(终止是订单级动作)
--         - 修复 RuotationItemServiceImpl 错用 quotationItemDao 保存退报项
--       执行顺序: 本脚本先于 quotation jar 发版(DDL 先行, 否则新 PO 起动报缺列)
--
-- 生产核查(2026-09-19 只读库):
--   quotation.ruotation / ruotationitem 0 行 → 无存量迁移, ALTER 加列即现状等价
--   quotation.quotationfunction MAX(qfid)=305, platform.quotationfunctionright MAX(qfrid)=8570
--   communion.constant 无 ruotation 相关行
--   菜单 mid=870 "退报单" 存在, url 为旧死链
--
-- 幂等性: ALTER 不带 IF NOT EXISTS(MySQL 5.6 不支持), 重复执行会报 Duplicate column,
--         报错即跳过即可; INSERT 均带 WHERE NOT EXISTS 防重
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. DDL: ruotation 状态机 + ruotationitem 三源回链
--    默认值 = 现状等价: status 默认 0(编辑中), source 默认 0(报价), 存量 0 行无感
-- -----------------------------------------------------------------------------

ALTER TABLE quotation.ruotation
    ADD COLUMN status tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态:0编辑中,1已提交(终止审批中),2已生效(终止落地),3已作废';

ALTER TABLE quotation.ruotationitem
    ADD COLUMN source tinyint(1) NOT NULL DEFAULT 0 COMMENT '来源:0报价,1扩展,2增减',
    ADD COLUMN sourceItemId bigint(20) DEFAULT NULL COMMENT '源单行ID:报价qfaiId/扩展eiid/增减ariId',
    ADD COLUMN qfaiId bigint(20) DEFAULT NULL COMMENT '订单报价项实例ID(quotationfunctionareaitem)';

-- -----------------------------------------------------------------------------
-- 2. 菜单修复: mid=870 改指新页面并带 depage=ruotation
--    (页面 getConfig(params.urlLoadParams.depage, 9) 依赖 URL 参数定位配置行)
-- -----------------------------------------------------------------------------

UPDATE communion.module
SET url = '/views/quotation/ruotationIndex.html?depage=ruotation'
WHERE mid = 870 AND url LIKE '%quotationRefundIndex%';

-- -----------------------------------------------------------------------------
-- 3. 状态枚举: communion.constant (前端 constant.quotation().ruotation.status 消费)
-- -----------------------------------------------------------------------------

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '编辑中(退报状态)', 'quotation', 'ruotation', 'status', 'STATUS_INIT_INT', '0', '编辑中', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='quotation' AND clazz='ruotation' AND field='STATUS_INIT_INT');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '已提交(退报状态)', 'quotation', 'ruotation', 'status', 'STATUS_SUBMIT_INT', '1', '已提交', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='quotation' AND clazz='ruotation' AND field='STATUS_SUBMIT_INT');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '已生效(退报状态)', 'quotation', 'ruotation', 'status', 'STATUS_EFFECT_INT', '2', '已生效', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='quotation' AND clazz='ruotation' AND field='STATUS_EFFECT_INT');

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '已作废(退报状态)', 'quotation', 'ruotation', 'status', 'STATUS_OBSOLETE_INT', '3', '已作废', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.constant WHERE module='quotation' AND clazz='ruotation' AND field='STATUS_OBSOLETE_INT');

-- -----------------------------------------------------------------------------
-- 4. 页面配置: quotation.quotationfunction 主表 + platform.quotationfunctionright 绑定
--    前端 getConfig 解析口径(ruotationIndex.js):
--      type=1 api 行(key=apiPage, 单值) / type=2 条件行(key=condArr, 数组)
--      type=3 列显隐行(key=propertyArr, 数组) / type=4 按钮行(key=pageBtn, 数组)
--    绑定行 name='ruotation'(depage 标识), type=9(页面 getConfig 第二参), company=1(方林主体)
--    注意: queryQuotationFunctionRight 后端只按 name 过滤不按 company, 绑定行即全局生效
-- -----------------------------------------------------------------------------

-- 4.1 api 行
INSERT INTO quotation.quotationfunction (name, `key`, value, `group`, type, subtype, status, sort, comment)
SELECT '退报单', 'apiPage', 'api.quotation.pageRuotation', 0, 1, 0, 0, 1, '退报单列表页数据接口'
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM quotation.quotationfunction WHERE `key`='apiPage' AND value='api.quotation.pageRuotation'
);

INSERT INTO platform.quotationfunctionright (name, qfid, type, company)
SELECT 'ruotation', qfid, 9, 1
FROM quotation.quotationfunction
WHERE `key`='apiPage' AND value='api.quotation.pageRuotation'
  AND NOT EXISTS (
    SELECT 1 FROM platform.quotationfunctionright WHERE name='ruotation' AND qfid=quotation.quotationfunction.qfid
);

-- 4.2 条件行(装修单号, 条件组件 ruotation-decoration-orderId 已存在于 condition/quotation.js:350)
INSERT INTO quotation.quotationfunction (name, `key`, value, `group`, type, subtype, status, sort, comment)
SELECT '装修单号(退报)', 'condArr', 'ruotation-decoration-orderId', 0, 2, 1, 0, 1, '退报单列表查询条件'
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM quotation.quotationfunction WHERE `key`='condArr' AND value='ruotation-decoration-orderId'
);

INSERT INTO platform.quotationfunctionright (name, qfid, type, company)
SELECT 'ruotation', qfid, 9, 1
FROM quotation.quotationfunction
WHERE `key`='condArr' AND value='ruotation-decoration-orderId'
  AND NOT EXISTS (
    SELECT 1 FROM platform.quotationfunctionright WHERE name='ruotation' AND qfid=quotation.quotationfunction.qfid
);

-- 4.3 按钮行(查看/删除)
INSERT INTO quotation.quotationfunction (name, `key`, value, `group`, type, subtype, status, sort, comment)
SELECT '查看(退报)', 'pageBtn', 'view', 0, 4, 1, 0, 1, '退报单行按钮'
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM quotation.quotationfunction WHERE `key`='pageBtn' AND value='view' AND name='查看(退报)'
);

INSERT INTO quotation.quotationfunction (name, `key`, value, `group`, type, subtype, status, sort, comment)
SELECT '删除(退报)', 'pageBtn', 'delete', 0, 4, 1, 0, 2, '退报单行按钮'
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM quotation.quotationfunction WHERE `key`='pageBtn' AND value='delete' AND name='删除(退报)'
);

INSERT INTO platform.quotationfunctionright (name, qfid, type, company)
SELECT 'ruotation', qfid, 9, 1
FROM quotation.quotationfunction
WHERE `key`='pageBtn' AND name IN ('查看(退报)', '删除(退报)')
  AND NOT EXISTS (
    SELECT 1 FROM platform.quotationfunctionright WHERE name='ruotation' AND qfid=quotation.quotationfunction.qfid
);

-- 4.4 列显隐行(propertyArr, ruotationIndex.js cardprops 全集)
INSERT INTO quotation.quotationfunction (name, `key`, value, `group`, type, subtype, status, sort, comment)
SELECT * FROM (
    SELECT '装修单号(退报列)' AS n, 'propertyArr' AS k, 'decorationOrderId' AS v, 0 AS g, 3 AS t, 1 AS st, 0 AS s, 1 AS so, '退报单列显隐' AS c UNION ALL
    SELECT '楼盘(退报列)', 'propertyArr', 'decorationHouseVillageName', 0, 3, 1, 0, 2, '退报单列显隐' UNION ALL
    SELECT '楼号(退报列)', 'propertyArr', 'decorationHouseHouseNumber', 0, 3, 1, 0, 3, '退报单列显隐' UNION ALL
    SELECT '客户名(退报列)', 'propertyArr', 'decorationCustomerName', 0, 3, 1, 0, 4, '退报单列显隐' UNION ALL
    SELECT '设计师(退报列)', 'propertyArr', 'decorationDesignerCurrentName', 0, 3, 1, 0, 5, '退报单列显隐' UNION ALL
    SELECT '业务员(退报列)', 'propertyArr', 'decorationSalesmanCurrentName', 0, 3, 1, 0, 6, '退报单列显隐' UNION ALL
    SELECT '面积(退报列)', 'propertyArr', 'decorationHouseBuildArea', 0, 3, 1, 0, 7, '退报单列显隐' UNION ALL
    SELECT '订单状态(退报列)', 'propertyArr', 'decorationStatus', 0, 3, 1, 0, 8, '退报单列显隐' UNION ALL
    SELECT '报价单名称(退报列)', 'propertyArr', 'quotationName', 0, 3, 1, 0, 9, '退报单列显隐' UNION ALL
    SELECT '报价版本(退报列)', 'propertyArr', 'version', 0, 3, 1, 0, 10, '退报单列显隐' UNION ALL
    SELECT '创建人(退报列)', 'propertyArr', 'creater', 0, 3, 1, 0, 11, '退报单列显隐' UNION ALL
    SELECT '创建时间(退报列)', 'propertyArr', 'createTime', 0, 3, 1, 0, 12, '退报单列显隐' UNION ALL
    SELECT '总额(退报列)', 'propertyArr', 'totalPrice', 0, 3, 1, 0, 13, '退报单列显隐' UNION ALL
    SELECT '退报状态(退报列)', 'propertyArr', 'ruotationStatus', 0, 3, 1, 0, 14, '退报单列显隐' UNION ALL
    SELECT '说明(退报列)', 'propertyArr', 'content', 0, 3, 1, 0, 15, '退报单列显隐'
) tmp
WHERE NOT EXISTS (
    SELECT 1 FROM quotation.quotationfunction WHERE `key`='propertyArr' AND value=tmp.v AND name=tmp.n
);

INSERT INTO platform.quotationfunctionright (name, qfid, type, company)
SELECT 'ruotation', qfid, 9, 1
FROM quotation.quotationfunction
WHERE `key`='propertyArr' AND name LIKE '%(退报列)'
  AND NOT EXISTS (
    SELECT 1 FROM platform.quotationfunctionright WHERE name='ruotation' AND qfid=quotation.quotationfunction.qfid
);
