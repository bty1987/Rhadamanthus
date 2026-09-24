-- =====================================================================
-- QUOTATIONITEM_IMPORTANT_FLAG.sql
-- 报价项重要标记: quotation.quotationitem 增加 isImportant 列
--
-- 功能背景:
--   数据报价项(quotation.quotationitem)增加"重要标记", 由数据报价项维护页
--   (views/quotation/quotationItem.html)开关维护;
--   报价编辑页(quotationPart.js)删除报价项(单删/批删)时按标记弹确认提示,
--   无标记不提示; 标记随报价项查询结果(QuotationFunctionAreaItemVO.isImportant)
--   下发到页面随行携带, 删除时不再回查模板。
--
-- 执行时机: 先于 fanglin-data / fanglin-quotation 新版 jar 部署执行
-- 幂等性: 不可重复执行(重复执行报 Duplicate column, 无副作用)
-- 影响面: quotation.quotationitem 全量行默认 0(无标记), 与现状等价
-- =====================================================================

ALTER TABLE quotation.quotationitem ADD COLUMN isImportant tinyint NOT NULL DEFAULT 0 COMMENT '重要标记 0:否 1:是';

-- 核对(应返回 isImportant tinyint NOT NULL 默认 0):
-- SHOW COLUMNS FROM quotation.quotationitem LIKE 'isImportant';
