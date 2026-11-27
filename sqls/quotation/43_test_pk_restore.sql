-- ============================================================================
-- 43_test_pk_restore.sql
-- ============================================================================
-- 用途: test 库定额明细三表主键还原单列 —— 41 号 RANGE 分区实验遗留清理。
--   41 号验证时曾将主键改为联合 (主键列, qid)（分区键必须入主键的硬约束），
--   后 REMOVE PARTITIONING 只还原了分区结构, 联合主键遗留至今。
--   Hibernate 实体 @Id 为单列(ngiid/npiid/ntiid), 与物理联合主键错位是
--   makeNormtion "Batch update returned unexpected row count (0/1)" 的头号嫌疑。
-- 前置条件: 单列唯一性核对(段0), 有重复则禁止执行
-- 执行环境: 仅 test; 生产未跑过 41 号分区(无联合主键)不需要本文件
-- 回滚方式:
--   ALTER TABLE quotation.normooditem  DROP PRIMARY KEY, ADD PRIMARY KEY (ngiid, qid);
--   ALTER TABLE quotation.normriceitem DROP PRIMARY KEY, ADD PRIMARY KEY (npiid, qid);
--   ALTER TABLE quotation.normtimeitem DROP PRIMARY KEY, ADD PRIMARY KEY (ntiid, qid);
--   (即还原回 41 号实验态; 一般无需回滚)
-- 验证语句(见段2): 各表 PK 应为单列
-- ============================================================================

-- ---------- 段0: 单列唯一性核对(有重复则停) ----------
SELECT ngiid, COUNT(*) c FROM quotation.normooditem GROUP BY ngiid HAVING c > 1;   -- 期望空
SELECT npiid, COUNT(*) c FROM quotation.normriceitem GROUP BY npiid HAVING c > 1;  -- 期望空
SELECT ntiid, COUNT(*) c FROM quotation.normtimeitem GROUP BY ntiid HAVING c > 1;  -- 期望空

-- ---------- 段1: 主键还原单列 ----------
ALTER TABLE quotation.normooditem  DROP PRIMARY KEY, ADD PRIMARY KEY (ngiid);
ALTER TABLE quotation.normriceitem DROP PRIMARY KEY, ADD PRIMARY KEY (npiid);
ALTER TABLE quotation.normtimeitem DROP PRIMARY KEY, ADD PRIMARY KEY (ntiid);

-- 分表1(空表)同款还原, 保持结构一致
ALTER TABLE quotation.normooditem1  DROP PRIMARY KEY, ADD PRIMARY KEY (ngiid);
ALTER TABLE quotation.normriceitem1 DROP PRIMARY KEY, ADD PRIMARY KEY (npiid);

-- ---------- 段2: 验证 ----------
SHOW KEYS FROM quotation.normooditem  WHERE Key_name = 'PRIMARY';
SHOW KEYS FROM quotation.normriceitem WHERE Key_name = 'PRIMARY';
SHOW KEYS FROM quotation.normtimeitem WHERE Key_name = 'PRIMARY';
-- 期望: 各表 PRIMARY 仅单列(ngiid/npiid/ntiid)
