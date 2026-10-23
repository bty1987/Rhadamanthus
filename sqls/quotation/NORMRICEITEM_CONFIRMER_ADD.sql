-- ============================================================================
-- 文件: NORMRICEITEM_CONFIRMER_ADD.sql
-- 库表: quotation.normriceitem(定额项, 约2300万行大表)
-- 用途: 增加 确认人(confirmer) 与 确认时间(confirmTime) 两列, 支撑 confirmNormriceItem
--       确认动作留痕(状态转 STATUS_CONFIRMED=2 时写入)。
-- 命名与类型: 镜像同库 selectionitem 的 confirmTime(timestamp)惯例;
--       confirmer 存 userId 字符串(FL-xxxxx, varchar(15))——2400万行大表不加
--       UserPO ManyToOne 关联(读取链全为原生SQL, 关联join代价高), 报表需要
--       名称时 join communion.user 取 userName。
-- 执行窗口: 🔴 2300万行, ADD COLUMN 在 MySQL 5.6 为 INPLACE 重建表(允许并发DML,
--       不锁业务读写), 但耗时分钟级且期间产生大量磁盘IO——务必低峰期执行,
--       执行前确认磁盘剩余空间 ≥ 表体积(normriceitem ibd 大小)。
-- 回滚方式: ALTER TABLE quotation.normriceitem DROP COLUMN confirmer, DROP COLUMN confirmTime;
--       (回滚同样重建表, 同样低峰; 落码的 confirmNormriceItem SQL 引用两列,
--        回滚DDL前须先回滚 jar/SQL 引用)
-- 幂等性: 不可重复执行(重复 ADD 同名列报 1060); 执行前先核对:
--   SELECT COLUMN_NAME FROM information_schema.COLUMNS
--    WHERE TABLE_SCHEMA='quotation' AND TABLE_NAME='normriceitem'
--      AND COLUMN_NAME IN ('confirmer','confirmTime');   期望空
-- ============================================================================

ALTER TABLE quotation.normriceitem
  ADD COLUMN confirmer VARCHAR(15) NULL COMMENT '确认人userId',
  ADD COLUMN confirmTime TIMESTAMP NULL COMMENT '确认时间',
  ALGORITHM=INPLACE, LOCK=NONE;

-- ============================================================================
-- 验证语句(执行后核对):
--   ① DESCRIBE quotation.normriceitem;                              两列在位
--   ② SELECT COUNT(*) FROM quotation.normriceitem
--      WHERE status = 2 AND confirmer IS NULL;                      期望 = 存量已确认数
--      (历史已确认行两列为 NULL 属预期——留痕自新版本确认动作起)
-- 配套代码(同批发布): NormriceItemPO/VO 加字段 + confirmNormriceItem 写入
--   (Action→Service→DAO, DAO 原生SQL set confirmer/confirmTime=now());
--   🔴 发布序 = 先本DDL后 quotation jar(旧代码不引用新列, DDL 先上无害;
--   jar 先上而列缺失会 SQL 报错 Unknown column)。
-- ============================================================================
