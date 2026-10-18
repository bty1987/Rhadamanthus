-- =====================================================================
-- quotationfunctionareaitem 公式'NaN'坏数据修复(4行, 全库仅此4行)
-- =====================================================================
-- 背景: 2610110261(北京)报价页综合项目分区不显示, 控制台 Uncaught Error:formula
--       ——根因=分区实例项 formula 字段存了字面 'NaN'(数量编辑链路曾把NaN当
--       公式文本落库), 渲染时 evalFormula('NaN')→NaN→抛错中断 createdomain,
--       综合项目分区(含其后内容)不渲染; 折前总价为后端存量合计故仍包含。
-- 全库扫描: 714万分区实例项中 formula='NaN' 共4行(另有2行空公式行为正常):
--   分表2 qfaiId= 8024122 分区15158551 沙子、水泥搬运费(有电梯或无电梯3楼及以下)
--   分表2 qfaiId=13945253 分区15700830 地砖保护
--   分表2 qfaiId=15394226 分区15829066 沙子、水泥搬运费(有电梯或无电梯3楼及以下)
--   分表2 qfaiId=15423214 分区15831561 地砖保护   ← 2610110261 本单
-- 修复: formula='NaN' 的行, 公式回写为实量(num/1000, num本身是对的),
--   subPrice/金额零变化, 渲染恢复且数值不变。
-- ⚠️ 幂等(WHERE formula='NaN'); 前端建议同步部署 quotationPart.js 的
--    try/catch 防崩补丁(单项公式坏不再中断整个报价页渲染)。
-- =====================================================================

UPDATE quotation.quotationfunctionareaitem0 SET formula = CAST(num / 1000 AS CHAR)
WHERE formula = 'NaN';

UPDATE quotation.quotationfunctionareaitem1 SET formula = CAST(num / 1000 AS CHAR)
WHERE formula = 'NaN';

UPDATE quotation.quotationfunctionareaitem2 SET formula = CAST(num / 1000 AS CHAR)
WHERE formula = 'NaN';

UPDATE quotation.quotationfunctionareaitem3 SET formula = CAST(num / 1000 AS CHAR)
WHERE formula = 'NaN';

UPDATE quotation.quotationfunctionareaitem4 SET formula = CAST(num / 1000 AS CHAR)
WHERE formula = 'NaN';

-- 核验: 全分表应为 0 行
-- SELECT COUNT(*) FROM quotation.quotationfunctionareaitem0 WHERE formula='NaN'
--  UNION ALL SELECT COUNT(*) FROM quotation.quotationfunctionareaitem1 WHERE formula='NaN'
--  UNION ALL SELECT COUNT(*) FROM quotation.quotationfunctionareaitem2 WHERE formula='NaN'
--  UNION ALL SELECT COUNT(*) FROM quotation.quotationfunctionareaitem3 WHERE formula='NaN'
--  UNION ALL SELECT COUNT(*) FROM quotation.quotationfunctionareaitem4 WHERE formula='NaN';
