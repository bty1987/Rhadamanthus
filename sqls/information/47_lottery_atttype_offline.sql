-- =====================================================================
-- 47号SQL: 抽奖券行 atttype 1→0 (线上→线下) 兜底对齐
-- =====================================================================
-- 用途:
--   将 decoration.decorationactivityitem 中 type=20(抽奖券) 行的
--   atttype 由 1(线上) 统一置 0(线下)。
--   背景: atttype=1 是"线上物品签约自动核销链"的圈行键——
--   payment.makeDecorationPayment 签约时 banch 按 atttype=1 AND state=0
--   强制核销并覆写 content="签约自动核销"。抽奖券 2026-11 切换为
--   type=20 后沿用 atttype=1 出生, 每单多张, 签约时整单券会被误核销,
--   抽奖引擎/补发/回收(仅认 state=0 初始态)随之失效。
--   修复三层: ①引擎发券改 atttype=0 出生(decoration jar, 本批)
--            ②存量行 atttype 1→0(本脚本)
--            ③140103"活动物品数量超限"校验两处删除(payment/customer jar, 本批,
--              error.md 同步摘除该码)
--   ⚠️现状说明: 2026-11-05 下午生产存量 260 行已被直接 UPDATE 翻转
--   (259 行 atttype=1 → 0, 事后实查全表 type=20 零 atttype=1 残留),
--   当时未建备份表。本脚本定位: 生产补漏兜底(防漂移/防引擎窗口期新券)
--   + dev/test 环境对齐 + 变更留痕。重跑幂等, 已翻时全段空转。
--   ⚠️部署序: 本脚本可与 decoration jar 任意先后; jar(引擎写0)部署后,
--   本脚本负责收掉"jar 部署前旧引擎发行的最后一批 atttype=1 券"。
-- 执行前置条件:
--   1. 段0 自检返回的 pending 行数 = 备份段与 UPDATE 段的实际圈定数
--   2. type=20 全表仅抽奖引擎写入(全库审计无其他写入方), 守卫仅按 type 圈定是安全的
-- 回滚方式:
--   精确回滚(推荐): UPDATE decoration.decorationactivityitem dai
--     JOIN decoration.bak_dai_lottery_atttype_20261105 b ON b.daiId = dai.daiId
--     SET dai.atttype = b.atttype;
--   ⚠️注意: bak 表快照于执行时点, 快照后旧引擎(写atttype=1)发行的新券
--   不在 bak 内; 若 jar 未换期间回滚, 需对快照后新发行券单独处理。
-- 验证语句:
--   段3执行后 type=20 行 atttype 应全为 0; 备份表行数 = 段0 pending 数
-- 幂等性: UPDATE 幂等, 重跑备份 0 行 / 更新 0 行
-- =====================================================================

-- ---------- 段0: 前置自检 (pending = 尚未翻转的抽奖券行) ----------
SELECT atttype, state, COUNT(*) AS cnt
FROM decoration.decorationactivityitem
WHERE type = 20
GROUP BY atttype, state;

SELECT COUNT(*) AS pending_should_match_backup
FROM decoration.decorationactivityitem
WHERE type = 20 AND atttype = 1;

-- ---------- 段1: 备份表先行 (回报行数与段0 pending 一致后再跑段2) ----------
CREATE TABLE IF NOT EXISTS decoration.bak_dai_lottery_atttype_20261105 AS
SELECT daiId, orderId, type, state, atttype, content, createTime
FROM decoration.decorationactivityitem
WHERE type = 20 AND atttype = 1;

SELECT COUNT(*) AS backup_rows FROM decoration.bak_dai_lottery_atttype_20261105;

-- ---------- 段2: 翻转事务 (守卫=type=20+atttype=1 双键) ----------
START TRANSACTION;

UPDATE decoration.decorationactivityitem
SET atttype = 0
WHERE type = 20 AND atttype = 1;

-- 下方 SELECT 应等于段0 pending 数; 不等即 ROLLBACK 人工核对
SELECT ROW_COUNT() AS updated_should_match_pending;

COMMIT;
-- 若上一行 updated != 段0 pending, 改执行: ROLLBACK;

-- ---------- 段3: 验证 (atttype 列应只剩 0) ----------
SELECT atttype, state, COUNT(*) AS cnt
FROM decoration.decorationactivityitem
WHERE type = 20
GROUP BY atttype, state;

SELECT COUNT(*) AS rollback_source_rows FROM decoration.bak_dai_lottery_atttype_20261105;
