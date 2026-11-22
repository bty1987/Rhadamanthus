-- ============================================================================
-- 文件: QUOTATIONFUNCTIONAREAITEM_NAN_FIX_1707290064.sql
-- 库表: quotation.quotationfunctionareaitem2(shard2)
-- 用途: 装修单 1707290064(qid=976192, qvid=176)综合项目分区"地砖保护"
--       (qfaiId=15917718, 模板项qiid=114121, rtem聚合目标16条引用公式{w})
--       formula='NaN' 字面量脏数据修复——num=171800 正确(不对称形态:
--       formula为String列原样收下NaN字面量, num为int列拒收保持实量),
--       按 10-18 QUOTATIONFUNCTIONAREAITEM_NAN_FORMULA_FIX.sql 同款模式回写实量。
-- 成因: 引用聚合链(cacsedeUpdateQuoteItem)在源项数量解析出NaN时把NaN直接写入
--       formula列; 该写入闸(isFinite判据)已随 d30b8d95e 推送, 部署热替换后
--       现版本不再产生新NaN——本行为存量残留(10-18全库扫描4行之外的新增,
--       涉及新增rtem引用qrid 4571/8117后聚合链的一次回写)。
-- 执行前置条件:
--   ① SELECT formula, num FROM quotation.quotationfunctionareaitem2 WHERE qfaiId = 15917718;
--      期望 formula='NaN' AND num=171800(若num已非171800以实况num为准, 语句取num/1000自适应)
-- 回滚方式:
--   UPDATE quotation.quotationfunctionareaitem2 SET formula = 'NaN' WHERE qfaiId = 15917718;
-- 幂等性: WHERE formula = 'NaN' 守卫, 重复执行 0 行受影响。
-- ============================================================================

UPDATE quotation.quotationfunctionareaitem2
SET formula = CAST(num / 1000 AS CHAR)
WHERE qfaiId = 15917718
  AND formula = 'NaN';

-- ============================================================================
-- 验证语句(执行后核对):
--   SELECT qfaiId, formula, num FROM quotation.quotationfunctionareaitem2 WHERE qfaiId = 15917718;
--   期望 formula = '171.8', num = 171800
--   SELECT COUNT(*) FROM quotation.quotationfunctionareaitem2
--    WHERE formula LIKE '%NaN%';
--   (跨shard全量复扫需逐分表执行同条件; 本次全库扫描仅此 1 行)
-- 配套: 前端双闸已推送(d30b8d95e 字符串闸+isFinite闸 / 更早输入三重闸),
--       🔴 执行器/生产 jar 热替换部署后即闭环, 不再产生新NaN。
-- ============================================================================
