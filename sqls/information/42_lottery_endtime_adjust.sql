-- ============================================================================
-- 文件: 42_lottery_endtime_adjust.sql
-- 库表: information.activity
-- 用途: 双人海外玩翻天——互动截止时间调整(用户拍板 2026-11-01):
--       endTime 2026-12-31 23:59:59 → 2026-12-31 18:00:00
--       (互动截止 18:00, 22:00 抽奖由抽奖系统执行, 不依赖 endTime)
-- 前置: 41 号初始化已执行(生产 69 家 type=20 活动已建)
-- 回滚: UPDATE information.activity SET endTime='2026-12-31 23:59:59' WHERE type=20 AND name='双人海外玩翻天';
-- 幂等: WHERE endTime='2026-12-31 23:59:59' 守卫, 重复执行 affected=0
-- 验证: SELECT COUNT(*) FROM information.activity WHERE type=20 AND endTime='2026-12-31 18:00:00'; 期望=69
-- ============================================================================

UPDATE information.activity
SET endTime = '2026-12-31 18:00:00'
WHERE type = 20
  AND name = '双人海外玩翻天'
  AND endTime = '2026-12-31 23:59:59';

-- 验证
-- SELECT COUNT(*) AS adjusted FROM information.activity WHERE type=20 AND endTime='2026-12-31 18:00:00';
