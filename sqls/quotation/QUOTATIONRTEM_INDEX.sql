-- =====================================================================
-- quotation.quotationrtem 增加业务索引(sqiid/tqiid)
-- =====================================================================
-- 背景: 表仅有主键索引, 而 DAO 全部业务查询按 sqiid(引用源)过滤,
--       反向查询(谁引用了我, 删除保护用)按 tqiid——无索引即全表扫。
--       现量 6432 行尚可, 增长后逐项拉取会劣化。
-- ⚠️ ADD INDEX 不幂等(重复执行报 Duplicate key name), 执行前先查:
--   SHOW INDEX FROM quotation.quotationrtem WHERE Key_name IN ('idx_sqiid','idx_tqiid');
-- ⚠️ 需先于/随 fanglin-data jar(引用去重/环检测按 sqiid 高频查询)生效。
-- =====================================================================

ALTER TABLE quotation.quotationrtem
  ADD INDEX idx_sqiid (sqiid),
  ADD INDEX idx_tqiid (tqiid);

-- 核验: 两条索引在位
-- SHOW INDEX FROM quotation.quotationrtem WHERE Key_name IN ('idx_sqiid','idx_tqiid');
