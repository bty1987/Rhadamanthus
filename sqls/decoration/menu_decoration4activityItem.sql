-- =============================================================================
-- 活动物品查询(decoration/decoration4activityItem.html) —— 菜单注册 + 角色授权
-- 日期: 2026-11-01
--
-- 用途: 活动物品查询页(覆盖全部活动类型 decorationactivityitem 行: 券/物品/优惠额度系),
--       条件筛选 订单号/编号(no, 抽奖券=LT前缀)/活动名称/奖励名称/物品类型/券状态(含11已中奖)/线上线下,
--       供全国门店员工查询中奖客户信息(需求: 工作人员需要一个入口可以查询到中奖客户信息)
--
-- 生产核查(2026-11-01 只读库):
--   communion.module MAX(mid) = 939, 本脚本取 940(执行前请复核未被占用)
--   挂载点: mid=39 "装修单"(二级菜单), 其下三级 order 已用到 25(931 装修单-我的), 新菜单取 26
--   授权源: 复制 mid=336(装修单-活动) 的全部 rolemodule 行(link/access/company 逐角色照搬, DISTINCT 去重)
--
-- 注意:
--   1. 非幂等, 重复执行前先跑核验查询确认未插入过(mid=940 是否已存在)。
--   2. cuid 必须为真实存在的 user.uid(统一 34=白添宇 FL-00479): RoleModulePO.creater 系
--      EAGER ManyToOne 关联 user.uid, cuid 无对应用户时 queryModuleForLogin 取菜单抛
--      ObjectNotFoundException, 整个菜单接口报错。
--   3. 页面调用的 pageDecorationActivityItem.do 走 operation 自动补全(through=1), 无需登记。
--
-- 回滚: DELETE FROM communion.rolemodule WHERE mid=940; DELETE FROM communion.module WHERE mid=940;
-- 验证: SELECT mid,name,url FROM communion.module WHERE mid=940;
--       SELECT COUNT(*) FROM communion.rolemodule WHERE mid=940; (应与 mid=336 行数一致)
-- =============================================================================

-- 1. module: 菜单(装修单 → 活动物品查询)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (940, 39, '装修单-活动物品查询', '活动物品查询', '', 'icon-tag',
   '/views/decoration/decoration4activityItem.html', 3, 1, 26, '');

-- 2. rolemodule: 复制 mid=336(装修单-活动) 的全部角色授权(DISTINCT 去重历史重复行)
INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.`rid`, 940, rm.`link`, rm.`access`, 34, NOW(), rm.`company`
FROM `communion`.`rolemodule` rm
WHERE rm.`mid` = 336
  AND NOT EXISTS (SELECT 1 FROM `communion`.`rolemodule` t WHERE t.`mid` = 940 AND t.`rid` = rm.`rid` AND t.`company` = rm.`company`);
