-- =============================================
-- Profile 用途(type)常量数据
-- 写入 communion.constant 表
-- type 字段统一语义: 1=需求 2=材料 3=交接 4=标签
-- 适用于 quotationprofile / constructionprofile / drawlineProfile
-- =============================================

-- 报价单画像/标签 (module: quotation, clazz: quotationProfile)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('需求(用途)', 'quotation', 'quotationProfile', 'type', 'TYPE_DEMAND_INT',    '1', '需求', 0),
('材料(用途)', 'quotation', 'quotationProfile', 'type', 'TYPE_MATERIAL_INT',  '2', '材料', 0),
('交接(用途)', 'quotation', 'quotationProfile', 'type', 'TYPE_HANDOVER_INT',  '3', '交接', 0),
('标签(用途)', 'quotation', 'quotationProfile', 'type', 'TYPE_TAG_INT',       '4', '标签', 0);

-- 工程单画像/标签 (module: construction, clazz: constructionProfile)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('需求(用途)', 'construction', 'constructionProfile', 'type', 'TYPE_DEMAND_INT',    '1', '需求', 0),
('材料(用途)', 'construction', 'constructionProfile', 'type', 'TYPE_MATERIAL_INT',  '2', '材料', 0),
('交接(用途)', 'construction', 'constructionProfile', 'type', 'TYPE_HANDOVER_INT',  '3', '交接', 0),
('标签(用途)', 'construction', 'constructionProfile', 'type', 'TYPE_TAG_INT',       '4', '标签', 0);

-- 放线单画像/标签 (module: construction, clazz: drawlineProfile)
INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status) VALUES
('需求(用途)', 'construction', 'drawlineProfile', 'type', 'TYPE_DEMAND_INT',    '1', '需求', 0),
('材料(用途)', 'construction', 'drawlineProfile', 'type', 'TYPE_MATERIAL_INT',  '2', '材料', 0),
('交接(用途)', 'construction', 'drawlineProfile', 'type', 'TYPE_HANDOVER_INT',  '3', '交接', 0),
('标签(用途)', 'construction', 'drawlineProfile', 'type', 'TYPE_TAG_INT',       '4', '标签', 0);
