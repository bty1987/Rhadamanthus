-- ============================================================================
-- 41_normitem_range_partition.sql
-- ============================================================================
-- 用途: quotation.normriceitem / normooditem / normtimeitem 三表按 qid RANGE 分区
--   (存储层切分, 应用零改动)。每 10 万 qid 一段, MAXVALUE 兜底段承接新写入, 扩段=
--   REORGANIZE 兜底段(仅重组该段, 秒~分钟级)。
-- 设计依据(2026-11-26 只读库实测):
--   qid 域三表对齐(985299/985299/976175); 主键 npiid/ngiid/ntiid 单列;
--   indexone(qid,type) 天然含分区键(分区裁剪后分区本地索引继续可用);
--   indextwo(sid,type)/indexthr(cnid,nid) 不含 qid: 不带 qid 的查询扫全分区
--   (实证访问面中仅 make 复活键点查场景, 每分区各一次 B+ 树查找, 成本可控);
--   normriceitem 2585 万/normooditem 1890 万 → 每段约 260 万/190 万行;
--   normtimeitem 1667 行(秒级, 与另两表保持结构一致)。
-- 🔴 分区硬约束: 分区键必须入主键 —— 先 DROP 单列主键, 改联合主键 (主键列, qid)。
--   Hibernate @Id 单字段映射不受影响(联合主键为物理约束, qid 落库恒非空)。
-- 🔴 执行成本: ALTER ... PARTITION BY = 全表复制重建。
--   normriceitem 2585 万行预计小时级; 建议路径 = 阿里云 DMS 无锁变更 或 pt-osc
--   (pt-osc: 建 shadow 表→shadow 上分区→触发器同步→rename swap), 或低峰直跑。
-- 执行顺序(风险递增, normtimeitem 1667 行试点先行验证全流程):
--   ① normtimeitem(秒级) → ② 验证段7 EXPLAIN 裁剪+业务回归点 → ③ normooditem → ④ normriceitem
-- 前置条件:
--   ① 生产主库版本确认(5.6/5.7 语法一致); RDS 自动快照在手(回滚底牌)
--   ② 低峰窗口; 执行期间 make/确认/拆单等写链暂停或低峰自然错峰
--   ③ 每张表执行前核对段0 的现状清单
-- 回滚方式: ALTER TABLE ... REMOVE PARTITIONING(重建回单表, 同样复制式); 联合主键
--   保留无害(单列 npiid 逻辑唯一性由应用保证), 如需还原单列主键另行低峰 ALTER。
-- 应用侧配套(分区后建议项, 非阻塞):
--   confirm/reject 原生 SQL 加 qid 条件(走裁剪, 现按主键直改=全分区扫描, 功能不坏);
--   三个 ItemService 的 dao.get(裸主键) 双键化同理(每分区一次本地 PK 查找, 可接受)。
-- 归档红利(后续可选): 老 qid 段整段归档 = 搬 archive 表后 DROP PARTITION(秒级);
--   段内混合有效行, 整段归档需业务拍板"历史报价明细是否可出主表"。
-- ============================================================================

-- ================= 段0: 现状核对(执行前逐表跑) =================
SELECT COUNT(*) AS total_rows, MAX(qid) AS max_qid FROM quotation.normtimeitem;  -- 1667 / 976175
SELECT COUNT(*) AS total_rows, MAX(qid) AS max_qid FROM quotation.normooditem;   -- 1890万 / 985299
SELECT COUNT(*) AS total_rows, MAX(qid) AS max_qid FROM quotation.normriceitem;  -- 2585万 / 985299

-- ================= 段1: normtimeitem 试点(1667 行, 秒级) =================
ALTER TABLE quotation.normtimeitem
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (ntiid, qid);
-- 🔴 test 实证(2026-11-26): PARTITION BY 不能与其它 ALTER 子句组合(1064), 必须独立一条;
--   两段式=两次重建, 生产直跑成本×2, DMS 无锁/pt-osc 路径可在 shadow 表一次完成
ALTER TABLE quotation.normtimeitem
  PARTITION BY RANGE (qid) (
    PARTITION p00 VALUES LESS THAN (100000),
    PARTITION p01 VALUES LESS THAN (200000),
    PARTITION p02 VALUES LESS THAN (300000),
    PARTITION p03 VALUES LESS THAN (400000),
    PARTITION p04 VALUES LESS THAN (500000),
    PARTITION p05 VALUES LESS THAN (600000),
    PARTITION p06 VALUES LESS THAN (700000),
    PARTITION p07 VALUES LESS THAN (800000),
    PARTITION p08 VALUES LESS THAN (900000),
    PARTITION p09 VALUES LESS THAN (1000000),
    PARTITION pmax VALUES LESS THAN MAXVALUE
  );

-- ================= 段2: normooditem(1890 万, 低峰长事务/DMS 无锁) =================
ALTER TABLE quotation.normooditem
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (ngiid, qid);
ALTER TABLE quotation.normooditem
  PARTITION BY RANGE (qid) (
    PARTITION p00 VALUES LESS THAN (100000),
    PARTITION p01 VALUES LESS THAN (200000),
    PARTITION p02 VALUES LESS THAN (300000),
    PARTITION p03 VALUES LESS THAN (400000),
    PARTITION p04 VALUES LESS THAN (500000),
    PARTITION p05 VALUES LESS THAN (600000),
    PARTITION p06 VALUES LESS THAN (700000),
    PARTITION p07 VALUES LESS THAN (800000),
    PARTITION p08 VALUES LESS THAN (900000),
    PARTITION p09 VALUES LESS THAN (1000000),
    PARTITION pmax VALUES LESS THAN MAXVALUE
  );

-- ================= 段3: normriceitem(2585 万, 同上) =================
ALTER TABLE quotation.normriceitem
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (npiid, qid);
ALTER TABLE quotation.normriceitem
  PARTITION BY RANGE (qid) (
    PARTITION p00 VALUES LESS THAN (100000),
    PARTITION p01 VALUES LESS THAN (200000),
    PARTITION p02 VALUES LESS THAN (300000),
    PARTITION p03 VALUES LESS THAN (400000),
    PARTITION p04 VALUES LESS THAN (500000),
    PARTITION p05 VALUES LESS THAN (600000),
    PARTITION p06 VALUES LESS THAN (700000),
    PARTITION p07 VALUES LESS THAN (800000),
    PARTITION p08 VALUES LESS THAN (900000),
    PARTITION p09 VALUES LESS THAN (1000000),
    PARTITION pmax VALUES LESS THAN MAXVALUE
  );

-- ================= 段4: 分区落位核对 =================
SELECT table_name, partition_name, partition_description, table_rows
FROM information_schema.partitions
WHERE table_schema = 'quotation'
  AND table_name IN ('normriceitem', 'normooditem', 'normtimeitem')
ORDER BY table_name, partition_description;

-- ================= 段5: 扩段模板(未来 qid 越过 110 万时执行, 仅重组 pmax) =================
-- ALTER TABLE quotation.normriceitem REORGANIZE PARTITION pmax INTO (
--   PARTITION p10 VALUES LESS THAN (1100000),
--   PARTITION pmax VALUES LESS THAN MAXVALUE
-- );
-- normooditem / normtimeitem 同款; 基准边界按实际 max(qid) 推进。

-- ================= 段6: 归档模板(业务拍板"整段可出主表"后启用) =================
-- ALTER TABLE quotation.normriceitem DROP PARTITION p00;  -- 段先搬 archive 表留底

-- ================= 段7: 验证 =================
-- ① 裁剪验证: partitions 列应只命中单个分区(qid=961004 落 p09):
EXPLAIN PARTITIONS SELECT COUNT(*) FROM quotation.normriceitem WHERE qid = 961004;
EXPLAIN PARTITIONS SELECT COUNT(*) FROM quotation.normooditem WHERE qid = 961004;
-- ② 行数守恒: 分区后 COUNT(*) 与段0 记录一致
SELECT COUNT(*) FROM quotation.normriceitem;
SELECT COUNT(*) FROM quotation.normooditem;
SELECT COUNT(*) FROM quotation.normtimeitem;
-- ③ 业务回归点: make 全量重算 / normriceItem 确认页 / 拆单页数量修改 / 工费计算(amountNormriceItemForSalary)
