-- ============================================================================
-- 10_constant_dedup_and_constraints.sql
-- communion.constant 表去重 + 唯一约束 + 索引优化 + 审计列
-- ============================================================================
-- 背景：
--   详见 docs/14-分析调研/constant-system/00-AUDIT.md 第七章。
--   constant 表业务键为 (module, clazz, type, key) 四元组，但历史上仅有主键 cid，
--   无唯一约束。生产库（截至 2026-07-27）实测存在 44 组重复四元组，原因有三类：
--     A. 完全重复：INSERT 脚本多次执行，两条记录所有业务字段完全相同（最常见）
--     B. 语义重叠：同 key 不同 field，是历史遗留的等价别名（如 STATUS_PROSIGN_APPROVE_INT
--        与 STATUS_PROSIGNAPPROVAL_INT 都映射 key=22 "审批中"）
--     C. 语义冲突：同 key 不同 value（如 ctype key=0 既是"低价"又是"底价"），需业务裁决
--
-- 生产真实结构核对（2026-07-27 information_schema）：
--   现有 9 列：cid/name/module/clazz/type/field/key/value/status（无 updateTime！）
--   现有索引：PRIMARY(cid)、indexone(module,clazz,type)
--   dbs/communion.sql 里的 DDL 含 updateTime 列，但生产库实际未建——以生产为准。
--
-- ⚠️ 执行顺序与注意事项：
--   1. 本脚本分四段，必须按 ①查重 → ②清理 → ③加列/约束/索引 → ④验证 顺序执行。
--   2. 第 ② 段只自动化处理"类A 完全重复"（保留 status=0 启用、cid 最小的那条）。
--      类B/类C 涉及业务语义，必须人工裁决后用单独 UPDATE/DELETE 处理，本脚本不擅自删。
--   3. 执行前请备份：CREATE TABLE communion.constant_bak_20260727 AS SELECT * FROM communion.constant;
--   4. 本脚本在只读 RDS 上无法执行（ERROR 1290），必须在可写的主库执行。
--   5. 加唯一约束前，务必重新跑一遍第 ① 段确认无重复，否则 ALTER 会失败。
--
-- 产出文档：docs/14-分析调研/constant-system/batches/P1-b-dedup-and-constraints.md
-- ============================================================================


-- ============================================================================
-- ① 查重（只读，可反复执行）
-- ============================================================================

-- 1.1 备份（执行前必做）
-- CREATE TABLE communion.constant_bak_20260727 AS SELECT * FROM communion.constant;

-- 1.2 四元组重复统计
SELECT module, clazz, type, `key`, COUNT(*) AS dup_cnt
FROM communion.constant
GROUP BY module, clazz, type, `key`
HAVING COUNT(*) > 1
ORDER BY dup_cnt DESC, module, clazz, type, `key`;

-- 1.3 重复明细（人工裁决类B/类C 用）
SELECT cid, name, module, clazz, type, field, `key`, value, status
FROM communion.constant
WHERE (module, clazz, type, `key`) IN (
    SELECT module, clazz, type, `key`
    FROM (
        SELECT module, clazz, type, `key`
        FROM communion.constant
        GROUP BY module, clazz, type, `key`
        HAVING COUNT(*) > 1
    ) t
)
ORDER BY module, clazz, type, `key`, cid;


-- ============================================================================
-- ② 清理（只处理类A：完全重复；保留优先级 status=0 > status=1，再 cid 最小）
-- ============================================================================
-- "完全重复"判定：除 cid 外，name/module/clazz/type/field/key/value/status 全相同。
-- 保留规则：同组内 status=0(启用) 优先于 status=1(禁用)；status 相同则保留 cid 最小。
-- 用 CONCAT(LPAD(status,2,'0'), LPAD(cid,10,'0')) 拼成排序键，MIN 取最优行的 cid。

-- 2.1 找出每组完全重复中"应保留的 cid"
DROP TEMPORARY TABLE IF EXISTS tmp_classA_keep;
CREATE TEMPORARY TABLE tmp_classA_keep AS
SELECT t.cid AS keep_cid
FROM communion.constant t
INNER JOIN (
    SELECT name, module, clazz, type, field, `key`, value,
           MIN(CONCAT(LPAD(status, 2, '0'), LPAD(cid, 10, '0'))) AS keep_rank
    FROM communion.constant
    GROUP BY name, module, clazz, type, field, `key`, value
    HAVING COUNT(*) > 1
) g
  ON  IFNULL(t.name, '')   = IFNULL(g.name, '')
 AND IFNULL(t.module, '')  = IFNULL(g.module, '')
 AND IFNULL(t.clazz, '')   = IFNULL(g.clazz, '')
 AND IFNULL(t.type, '')    = IFNULL(g.type, '')
 AND IFNULL(t.field, '')   = IFNULL(g.field, '')
 AND IFNULL(t.`key`, '')   = IFNULL(g.`key`, '')
 AND IFNULL(t.value, '')   = IFNULL(g.value, '')
 AND CONCAT(LPAD(t.status, 2, '0'), LPAD(t.cid, 10, '0')) = g.keep_rank;

-- 2.2 删除"完全重复组中、非保留行"的记录
DELETE c
FROM communion.constant c
INNER JOIN (
    SELECT name, module, clazz, type, field, `key`, value
    FROM communion.constant
    GROUP BY name, module, clazz, type, field, `key`, value
    HAVING COUNT(*) > 1
) dup
  ON  IFNULL(c.name, '')   = IFNULL(dup.name, '')
 AND IFNULL(c.module, '')  = IFNULL(dup.module, '')
 AND IFNULL(c.clazz, '')   = IFNULL(dup.clazz, '')
 AND IFNULL(c.type, '')    = IFNULL(dup.type, '')
 AND IFNULL(c.field, '')   = IFNULL(dup.field, '')
 AND IFNULL(c.`key`, '')   = IFNULL(dup.`key`, '')
 AND IFNULL(c.value, '')   = IFNULL(dup.value, '')
WHERE c.cid NOT IN (SELECT keep_cid FROM (SELECT keep_cid FROM tmp_classA_keep) z);

-- 2.3 清理临时表
DROP TEMPORARY TABLE IF EXISTS tmp_classA_keep;

-- 2.4 类B/类C 清理：⚠️ 人工裁决，不在此自动化
--     已知需人工处理清单（截至 2026-07-27 生产快照）：
--       - decoration.decoration.status key=22/23：STATUS_PROSIGN_APPROVE_INT vs STATUS_PROSIGNAPPROVAL_INT
--         （审批中别名），建议保留 field 与代码引用一致的那条，禁用另一条（status=1）或物理删除。
--       - personel.supplierContractBrand.ctype key=0：低价 vs 底价语义冲突，需业务确认。
--       - data.contract.type 含 URL 路径的重复（带/不带 company 参数），需确认前台取值逻辑。
--     处理方式示例（确认后手动执行）：
--       UPDATE communion.constant SET status = 1 WHERE cid = <要废弃的cid>;
--     或：
--       DELETE FROM communion.constant WHERE cid = <要删除的cid>;

-- 2.5 清理后再次查重确认（必须为 0 行才能加唯一约束）
SELECT module, clazz, type, `key`, COUNT(*) AS dup_cnt
FROM communion.constant
GROUP BY module, clazz, type, `key`
HAVING COUNT(*) > 1;


-- ============================================================================
-- ③ 加审计列 + 唯一约束 + 索引优化（确认 ② 后无重复再执行）
-- ============================================================================

-- 3.1 新增 updateTime 审计列（生产库当前无此列，用 ADD）
--     ON UPDATE CURRENT_TIMESTAMP 由 MySQL 自动维护，无需应用层赋值。
ALTER TABLE communion.constant
ADD COLUMN `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间';

-- 3.2 业务唯一约束：防止未来再插入重复四元组
--     （key 是保留字，需反引号）
ALTER TABLE communion.constant
ADD UNIQUE KEY uk_module_clazz_type_key (`module`, `clazz`, `type`, `key`);

-- 3.3 替换既有 indexone 为含 status 的覆盖索引
--     既有 indexone(module,clazz,type) 与新唯一约束前缀重叠，且 queryConstant 常带 status=0 过滤，
--     故 drop 旧的、建含 status 的新索引，避免冗余。
ALTER TABLE communion.constant
DROP INDEX `indexone`,
ADD INDEX `idx_module_clazz_type_status` (`module`, `clazz`, `type`, `status`);

-- 3.4 列注释与长度修正
--     name 列注释"姓名"为历史误植，实为"常量集中文名"；拓宽到 64 容纳长名。
ALTER TABLE communion.constant
MODIFY COLUMN `name` varchar(64) NOT NULL COMMENT '常量集中文名';

ALTER TABLE communion.constant
MODIFY COLUMN `module` varchar(64) NULL COMMENT '模块(decoration/quotation/...)';

ALTER TABLE communion.constant
MODIFY COLUMN `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=启用 1=禁用';


-- ============================================================================
-- ④ 验证
-- ============================================================================
SHOW INDEX FROM communion.constant;
SELECT column_name, column_type, is_nullable, column_default, extra, column_comment
FROM information_schema.columns
WHERE table_schema = 'communion' AND table_name = 'constant'
ORDER BY ordinal_position;
