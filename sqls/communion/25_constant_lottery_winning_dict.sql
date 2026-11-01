-- ============================================================================
-- 文件: 25_constant_lottery_winning_dict.sql
-- 库表: communion.constant(前端字典)
-- 用途: 双人海外玩翻天抽奖券——decorationactivityitem.state 新增抽奖状态 key=11:
--       生命周期 0初始 → 11抽奖(券参与抽奖, 抽奖系统回写; 奖项详情由抽奖系统说明) → 10已领(奖品发放)。
--       🔴注意语义: 11=抽奖(参与), 非"已中奖"——是否真中奖/中什么奖由抽奖系统说明(用户拍板)。
--       本行字典驱动: 装修单详情/活动区块状态列显示(state=11 显示"抽奖", 缺行则显示空白);
--       查询页(decoration4activityItem)条件下拉已用前端内嵌数组不依赖本表, 互不影响。
-- 执行前置条件:
--   ① 后端jar(decoration-8.3.030: DecorationActivityItemPO.STATUS_DRAW_INT=11)部署前后均可, 字典仅影响前端显示;
--   ② 验证现状: SELECT COUNT(*) FROM communion.constant
--      WHERE module='decoration' AND clazz='decorationActivityItem' AND type='status' AND `key`='11'; 期望=0
--   ③ 若已按旧文案("已中奖")执行过本脚本: 脚本内修正 UPDATE 会自动把 value/name 归位为"抽奖"。
-- 回滚方式:
--   DELETE FROM communion.constant WHERE module='decoration' AND clazz='decorationActivityItem'
--     AND type='status' AND field='STATUS_DRAW_INT' AND `key`='11';
--   (仅删字典会使装修单详情 state=11 显示空白, 券数据本身不受影响)
-- 幂等性: INSERT 按 module+clazz+type+key NOT EXISTS 守卫; 文案归位 UPDATE 可重复执行
-- 附带说明(用户拍板, 非瑕疵): key=10(STATUS_VERIFY_INT)的 value="已领"是**有意为之**——
--   需求方无"核销"概念, 奖品发放即"已领", 勿改为"核销"。
-- ============================================================================

-- 1. 新增抽奖状态字典 key=11 (含旧文案归位: 已中奖→抽奖)
INSERT INTO communion.constant
  (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`)
SELECT '抽奖(装修活动状态)', 'decoration', 'decorationActivityItem', 'status', 'STATUS_DRAW_INT', '11', '抽奖', 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.constant
  WHERE module = 'decoration' AND clazz = 'decorationActivityItem'
    AND type = 'status' AND `key` = '11'
);

-- 1a. 旧文案归位(若曾按"已中奖"执行过)
UPDATE communion.constant
SET `name` = '抽奖(装修活动状态)', `value` = '抽奖', `field` = 'STATUS_DRAW_INT'
WHERE module = 'decoration' AND clazz = 'decorationActivityItem'
  AND type = 'status' AND `key` = '11';

-- 2. 验证
-- SELECT cid, name, field, `key`, `value` FROM communion.constant
--  WHERE module='decoration' AND clazz='decorationActivityItem' AND type='status' AND `key` IN ('10','11');
-- 期望: key=11 name=抽奖(装修活动状态) value=抽奖; key=10 value=已领(保持, 勿改核销)
