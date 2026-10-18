-- =====================================================================
-- quotationitem 引用状态冗余字段真值重建(isrtem/rtemFlag 修复)
-- =====================================================================
-- 背景: isrtem/rtemFlag 为 quotationrtem 的派生冗余, 历史上 delete 不重建
--       rtemFlag、复制流程不迁移引用行, 造成漂移。生产审计(2026-10-17):
--       isrtem 孤儿 184 / rtemFlag 幽灵 183 / 漏标 0。
-- 修复: 以 quotationrtem 真值行全量重算派生字段(按 sqiid 聚合:
--       行数>0 → isrtem=1, rtemFlag=目标qiid CSV带尾逗号, 与写入路径格式一致),
--       对有信号(isrtem=1 或 rtemFlag 非空)或存在真值行的项重算。
-- ⚠️ 修复后须随代码版 O1(delete 对称重建)生效, 否则删引用会再次漂移。
-- ⚠️ 幂等(重算型UPDATE, 值不变时仍会触发行写但结果一致); 建议低峰执行。
-- =====================================================================

UPDATE quotation.quotationitem qi
LEFT JOIN (
    SELECT sqiid, COUNT(*) AS c, GROUP_CONCAT(CONCAT(tqiid, ',') ORDER BY tqiid SEPARATOR '') AS flag
    FROM quotation.quotationrtem GROUP BY sqiid
) r ON r.sqiid = qi.qiid
SET qi.isrtem = IF(COALESCE(r.c, 0) > 0, 1, 0),
    qi.rtemFlag = COALESCE(r.flag, '')
WHERE qi.isrtem = 1
   OR (qi.rtemFlag IS NOT NULL AND qi.rtemFlag <> '')
   OR qi.qiid IN (SELECT sqiid FROM quotation.quotationrtem);

-- 核验: 三项异常计数应为 0/0/0, 有引用项总数应与修复前一致(3108±)
-- SELECT SUM(CASE WHEN qi.isrtem = 1 AND COALESCE(r.c,0) = 0 THEN 1 ELSE 0 END) AS isrtem孤儿,
--        SUM(CASE WHEN qi.isrtem = 0 AND COALESCE(r.c,0) > 0 THEN 1 ELSE 0 END) AS isrtem漏标,
--        SUM(CASE WHEN qi.rtemFlag IS NOT NULL AND qi.rtemFlag <> '' AND COALESCE(r.c,0) = 0 THEN 1 ELSE 0 END) AS rtemFlag幽灵
-- FROM quotation.quotationitem qi
-- LEFT JOIN (SELECT sqiid, COUNT(*) AS c FROM quotation.quotationrtem GROUP BY sqiid) r ON r.sqiid = qi.qiid
-- WHERE qi.isrtem = 1 OR (qi.rtemFlag IS NOT NULL AND qi.rtemFlag <> '') OR COALESCE(r.c,0) > 0;
