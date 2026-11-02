-- ============================================================
-- 抽奖券存量行 type 0→20 迁移 (decoration.decorationactivityitem)
-- 用途: 存量抽奖券行(引擎发放, no=LT前缀)此前写死 type=0(券), 迁移为 20(抽奖券);
--      🔴必须先于 decoration 新 jar 执行——新 jar 的补发计数 countDecorationActivityItemForLottery
--      按 type=20 过滤, 存量不迁移则已发老券不计入应得对齐 → 触发时全额重复补发
-- 前置: 执行前核对守卫规模与开发时实证一致(2026-11-02 实证 116 行):
--      SELECT COUNT(*) FROM decoration.decorationactivityitem WHERE no LIKE 'LT%' AND type=0; -- 116(或更大, 以执行日实查为准)
--      SELECT COUNT(*) FROM decoration.decorationactivityitem WHERE no LIKE 'LT%';             -- 应与上一句相同(全部 LT 行均为 type=0)
-- 回滚: UPDATE decoration.decorationactivityitem SET type=0 WHERE no LIKE 'LT%' AND type=20;
-- 验证: SELECT COUNT(*) FROM decoration.decorationactivityitem WHERE no LIKE 'LT%' AND type=20; -- 应等于迁移总数, 且 type=0 计 0
-- 幂等: WHERE type=0 守卫, 重跑零影响; 🔴部署新 jar 后建议再重跑一次本脚本,
--      兜底"SQL与jar之间窗口期老jar新发的 type=0 券行"
-- ============================================================

UPDATE decoration.decorationactivityitem
SET type = 20
WHERE no LIKE 'LT%' AND type = 0;
