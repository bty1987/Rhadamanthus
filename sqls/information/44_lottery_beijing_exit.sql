-- ============================================================================
-- 文件: 44_lottery_beijing_exit.sql
-- 库表: information.activity / decoration.decorationactivityitem / decoration.decorationactivityrecord
-- 用途: 双人海外玩翻天——北京地区三个公司退出活动(用户拍板 2026-11-04), 并清理北京已发券:
--       ① activity 停用: aid 3613(91 北京方林装饰)/3614(92 北京方林整装)/3615(93 北京方林大宅)
--          status 0→1, 引擎 queryActivityForLottery 只认 status=0, 停用即退出, 可逆
--          (当年 41 号按公司名 LIKE '%方林%' 播种, 北京三家被误带入)
--       ② 券删除: 实测北京仅 aid=3613 下 6 张券(daiId 521883/521884/521904/521911/521912/521913),
--          全部 type=20 抽奖券、state=0 初始未抽奖、未核销未领、无轨迹行(2026-11-04 只读库核实)
-- 执行前置条件:
--   ① 段0自检期望值全部通过(6张券仍 state=0; 轨迹0行; 活动3条 status=0)
--   ② 先跑段1备份并确认返回6行, 再跑段2事务段
-- 回滚方式(备份表在, 可整体还原):
--   UPDATE information.activity SET status=0 WHERE aid IN (3613,3614,3615) AND status=1;
--   INSERT INTO decoration.decorationactivityitem SELECT * FROM decoration.bak_dai_beijing_exit_20261104;
--   (若段2事务未 COMMIT 直接 ROLLBACK 即可, 无需回滚段)
-- 幂等性: UPDATE/DELETE 均带状态守卫, 重复执行影响0行; 备份表 CREATE...SELECT 首跑建表
-- ============================================================================

-- 段0: 自检(只读, 逐条核对期望值)
-- 0.1 北京三活动在窗且有效, 期望3行
SELECT aid, company, name, status FROM information.activity
WHERE aid IN (3613,3614,3615) AND name='双人海外玩翻天' AND status=0;

-- 0.2 北京已发券, 期望6行且全部 state=0/type=20(若有 state=11 已抽奖行出现, 停止执行并反馈)
SELECT daiId, `no`, orderId, type, state, createTime FROM decoration.decorationactivityitem
WHERE aid IN (3613,3614,3615) ORDER BY daiId;

-- 0.3 轨迹行, 期望0行(>0 也一并删除, 属正常)
SELECT darId, daid, type, comment FROM decoration.decorationactivityrecord
WHERE daid IN (521883,521884,521904,521911,521912,521913);

-- 段1: 备份(期望返回6行, 必须先于段2执行)
CREATE TABLE decoration.bak_dai_beijing_exit_20261104 AS
SELECT * FROM decoration.decorationactivityitem
WHERE aid IN (3613,3614,3615);

-- 段2: 停用活动 + 删券(单事务, 任一步行数不符 ROLLBACK)
START TRANSACTION;

-- 2.1 停用北京三活动, 期望影响3行
UPDATE information.activity SET status = 1
WHERE aid IN (3613,3614,3615) AND name='双人海外玩翻天' AND status=0;

-- 2.2 删北京6张券, 期望影响6行(值级守卫: daiId+aid+type=20+state=0 四重)
DELETE FROM decoration.decorationactivityitem
WHERE daiId IN (521883,521884,521904,521911,521912,521913)
  AND aid IN (3613,3614,3615)
  AND type = 20
  AND state = 0;

-- 2.3 券轨迹防御性清理, 期望影响0行(首跑实测无轨迹; 若段0.3查出>0行则此处同步清掉)
DELETE FROM decoration.decorationactivityrecord
WHERE daid IN (521883,521884,521904,521911,521912,521913);

COMMIT;

-- 段3: 验证
-- 3.1 期望北京三活动 status=1
SELECT aid, company, name, status FROM information.activity WHERE aid IN (3613,3614,3615);
-- 3.2 期望0行
SELECT COUNT(*) FROM decoration.decorationactivityitem WHERE aid IN (3613,3614,3615);
-- 3.3 备份表期望6行
SELECT COUNT(*) FROM decoration.bak_dai_beijing_exit_20261104;
