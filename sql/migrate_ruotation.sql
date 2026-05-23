-- ============================================================
-- quotationRefund → ruotation 数据库迁移脚本
-- catalog: quotation
-- 生成时间: 2026-05-23
-- ============================================================
-- 注意: 执行前请备份 quotation 库
-- 执行环境: 测试库 (rm-2ze6qgdw1vit531v3io.mysql.rds.aliyuncs.com)
-- ============================================================

-- ========== 第一步: 重命名主表 ==========
-- quotationrefund → ruotation
RENAME TABLE `quotation`.`quotationrefund` TO `quotation`.`ruotation`;

-- ========== 第二步: 重命名子表 ==========
-- quotationrefunditem → ruotationitem
RENAME TABLE `quotation`.`quotationrefunditem` TO `quotation`.`ruotationitem`;

-- ============================================================
-- 说明:
--   1. 列名 qrid, qriid 保持不变 (PO中 @Column name 未改)
--   2. 外键列 orderId, qid, qvid, cuid, qfaid, qiid 保持不变
--   3. 普通列 createTime, totalPrice, content, itemName 等保持不变
--   4. 只有表名从 quotationrefund* → ruotation*
--
-- PO 映射验证:
--   RuotationPO     → @Table(name="ruotation",     catalog="quotation")  主键 qrid
--   RuotationItemPO → @Table(name="ruotationitem",  catalog="quotation")  主键 qriid
--
-- RuotationPO 列:
--   qrid (PK), orderId (FK→decoration), qid (FK→quotation),
--   qvid (FK→quotationversion), cuid (FK→user),
--   createTime, totalPrice, content
--
-- RuotationItemPO 列:
--   qriid (PK), qrid (FK→ruotation), qfaid (FK→quotationfunctionarea),
--   qiid (FK→quotationitem), itemName, measurementUnit, workType,
--   unitPrice, addPrice, subPrice, formula, initNum, num,
--   type, subtype, content, [index]
-- ============================================================

-- ========== 验证 (执行后检查) ==========
SELECT 'ruotation' AS tbl, COUNT(*) AS cnt FROM `quotation`.`ruotation`
UNION ALL
SELECT 'ruotationitem', COUNT(*) FROM `quotation`.`ruotationitem`;

-- 确认旧表已不存在 (应该报错 "Table doesn't exist")
-- SELECT * FROM quotation.quotationrefund LIMIT 1;
-- SELECT * FROM quotation.quotationrefunditem LIMIT 1;
