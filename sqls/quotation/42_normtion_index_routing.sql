-- ============================================================================
-- 42_normtion_index_routing.sql
-- ============================================================================
-- 用途: normtion.index 路由中枢落地三件套 —— 定额明细分表(normriceitem/normooditem)
--   按 normtion.index 路由(镜像 qfai 的 qfa.index→quotationfunctionareaitem{index} 机制):
--   ① normtion 加列 `index`(路由键, 存量默认 0=原表, 零迁移)
--   ② systemConfig 新增 normtionIndex=0(当前批次号, 运维切表: 先建表后改值)
--   ③ 建分表 normriceitem1 / normooditem1(结构+索引同款, 自增错开防视觉混淆)
-- 配套代码: quotation jar(PO1 实体+DAO 路由化+make/新增链写 index+双键化) + seiya jar
--   (三方补数写入路由化) —— 41 号(RANGE 分区)方案已被本方案取代作废。
-- 路由语义: normtion.index=0 → 原表; =1 → *item1; 切表动作=建 normxxxitem2 + normtionIndex 改 2。
--   normtion 创建三处(makeNormtion 首建/addNormtion/seiya 兜底建)自动读 normtionIndex 写入;
--   normitem 新增入口(addNormriceItem/addNormoodItem/addNormtimeItem)均 ensure normtion
--   (有明细必有单据头), 路由值由 qid→normtion.index 解析。
-- 执行前置条件:
--   ① quotation/seiya 新 jar 已发版(老代码不写 index 也不炸: 默认 0=原表, 行为与现状一致)
--   ② 段0 核对 normtion 行数(加列默认 0 即存量全落原表)
-- 幂等性: 加列需先判存在(MySQL 5.6 无 IF NOT EXISTS); systemConfig NOT EXISTS 守卫;
--   建表 DROP IF EXISTS+CREATE(⚠️ 重跑会清空分表数据 —— 仅首次执行, 分表有数据后禁重跑段3)
-- 回滚方式:
--   ALTER TABLE quotation.normtion DROP COLUMN `index`;
--   DELETE FROM communion.systemconfig WHERE `key` = 'normtionIndex' AND company = 0;
--   DROP TABLE IF EXISTS quotation.normriceitem1, quotation.normooditem1;
-- 验证语句(见段4)
-- ============================================================================

-- ---------- 段0: 现状核对 ----------
SELECT COUNT(*) AS normtion_rows FROM quotation.normtion;              -- 17.7万(生产)
SELECT COUNT(*) AS sc_rows FROM communion.systemconfig WHERE `key` = 'normtionIndex';  -- 应 0

-- ---------- 段1: normtion 加路由列 ----------
ALTER TABLE quotation.normtion ADD COLUMN `index` tinyint NOT NULL DEFAULT 0;
-- 验证: SHOW COLUMNS FROM quotation.normtion LIKE '%index%';

-- ---------- 段2: systemConfig 当前批次(初始 0=原表; 切表时改值) ----------
INSERT INTO communion.systemconfig (`group`, `key`, `value`, createTime, `comment`, company)
SELECT 'quotation', 'normtionIndex', '0', NOW(), '定额明细分表路由批次(normtion.index): 0=原表, N=normxxxitem{N}', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.systemconfig WHERE `key` = 'normtionIndex' AND company = 0);

-- ---------- 段3: 建分表(结构+索引同款; 自增错开 1 亿防主键视觉混淆) ----------
CREATE TABLE quotation.normriceitem1 LIKE quotation.normriceitem;
ALTER TABLE quotation.normriceitem1 AUTO_INCREMENT = 100000000;

CREATE TABLE quotation.normooditem1 LIKE quotation.normooditem;
ALTER TABLE quotation.normooditem1 AUTO_INCREMENT = 100000000;

-- ---------- 段4: 验证 ----------
-- ① normtion 列与默认值
SHOW COLUMNS FROM quotation.normtion LIKE '%index%';
-- ② 配置行
SELECT `group`, `key`, `value`, company FROM communion.systemconfig WHERE `key` = 'normtionIndex';  -- 应 1 行 value=0
-- ③ 分表结构(索引应与主表一致: indexone(qid,type)/indextwo(sid,type)/indexthr)
SHOW INDEX FROM quotation.normriceitem1;
SHOW INDEX FROM quotation.normooditem1;
-- ④ 写读冒烟(可选): 模拟 index=1 路由的行落分表
-- INSERT INTO quotation.normriceitem1 (qid, sid, type, normtype, atttype, status) VALUES (999999001, 999999001, 3, 1, 0, 0);
-- SELECT npiid, qid, type FROM quotation.normriceitem1 WHERE qid = 999999001;
-- DELETE FROM quotation.normriceitem1 WHERE qid = 999999001;
