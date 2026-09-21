-- =============================================================================
-- 我参与的装修单(decoration/decoration4user.html) —— 菜单注册 + 角色授权
-- 日期: 2026-09-21
--
-- 生产核查(2026-09-21 只读库):
--   communion.module MAX(mid) = 930, 本脚本取 931(执行前请复核未被占用)
--   挂载点: mid=39 "装修单"(二级菜单, 挂 6 下), 其下三级 order 已用到 24(902 会员), 新菜单取 25
--   授权: 复制 mid=70(装修单-通用) 的全部 rolemodule 行,
--   link/access/company 逐角色照搬
--
-- 注意:
--   1. 非幂等, 重复执行前先跑核验查询确认未插入过。
--   2. cuid=0 表示 SQL 直接落库无操作人, 如需留痕可替换为实际操作人 uid。
--   3. 页面调用的 pageDecorationForUser.do 走 operation 自动补全(through=1), 无需登记。
--   4. 🔴 依赖 docs/10-指南手册/DECORATION_USER_ROLE_DICT_INDEX.sql 的 idx_user 索引先建
--      (页面主查询 exists 子查询按 decorationUser.user 过滤)。
-- =============================================================================

-- 1. module: 菜单(装修单 → 我参与的装修单)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (931, 39, '我参与的装修单', '我参与的装修单', '', 'icon-user',
   '/views/decoration/decoration4user.html', 3, 1, 25, '');

-- 2. rolemodule: 复制 mid=70(装修单-通用) 的全部角色授权(DISTINCT 去重历史重复行)
INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.rid, 931, rm.link, rm.access, 0, NOW(), rm.company
FROM `communion`.`rolemodule` rm
WHERE rm.mid = 70;

-- =============================================================================
-- 执行前核验(mid 未被占用, 应返回 0 行)
-- =============================================================================
-- SELECT mid FROM communion.module WHERE mid = 931
--    OR url = '/views/decoration/decoration4user.html';

-- 执行后核验(应各返回 1 行 / 授权行数)
-- SELECT mid, fatherModuleId, name, url, level, `order`
-- FROM communion.module WHERE mid = 931;
--
-- SELECT COUNT(*) FROM communion.rolemodule WHERE mid = 931;
