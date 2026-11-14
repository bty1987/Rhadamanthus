-- =============================================================================
-- 销售「功能维护」菜单注册 + 角色授权
-- 日期: 2026-11-14
--
-- 用途: salesFunctionManage 销售功能字典维护页(照 933 装修功能维护模式, 与
--       quotation/construction/customer 934-937 批次同款), 挂销售模块
--       「功能配置」(547, order=8)之后 order=9:
--         生产 941  功能维护  挂 销售(204)  order=9   ← 授权复制 547 (304行)
--
-- 生产核查(2026-11-14 只读库):
--   communion.module MAX(mid) = 940, 本脚本取 941(执行前请复核未被占用)
--   源菜单 547 = /views/sales/salesFunction.html, rolemodule 304 行
--
-- 测试库已另行执行(本脚本不覆盖): mid=946 挂 213, order=9, 授权←600(5行)
--   —— 测试库与生产库模块ID错位, 已按 url+name 解析源菜单, 勿照搬本文件ID
--
-- 注意:
--   1. 非幂等(menu段), 重复执行前先跑核验查询确认未插入过。
--   2. cuid 必须为真实存在的 user.uid(统一 34=白添宇 FL-00479): RoleModulePO.creater 系
--      EAGER ManyToOne 关联 user.uid, cuid 无对应用户时 queryModuleForLogin 取菜单抛
--      ObjectNotFoundException, 整个菜单接口报错。
--   3. 新端点 page/add/update/deleteSalesFunction.do 走 operation 自动补全(through=1), 无需登记。
--   4. 部署序: sales jar(含四端点) 先上, 再执行本 SQL 开菜单。
-- =============================================================================

-- 1. module: 菜单
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (941, 204, '功能维护', '功能维护', '', 'icon-list-alt', '/views/sales/salesFunctionManage.html', 2, 1, 9, '');

-- 2. rolemodule: 复制本模块「功能配置」(547)的全部角色授权(NOT EXISTS 幂等), cuid=34
INSERT INTO `communion`.`rolemodule` (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT s.rid, 941, s.link, s.access, 34, NOW(), s.company
FROM `communion`.`rolemodule` s
WHERE s.mid = 547
  AND NOT EXISTS (
    SELECT 1 FROM `communion`.`rolemodule` t
    WHERE t.mid = 941 AND t.rid = s.rid AND t.company = s.company
  );

-- =============================================================================
-- 执行前核验(mid 未被占用, 应返回 0 行)
-- =============================================================================
-- SELECT mid FROM communion.module WHERE mid = 941
--    OR url = '/views/sales/salesFunctionManage.html';

-- 执行后核验(应返回 1 行菜单 + 授权约 304 行)
-- SELECT mid, fatherModuleId, name, url, `order` FROM communion.module WHERE mid = 941;
-- SELECT mid, COUNT(*) cnt, COUNT(DISTINCT rid) rids FROM communion.rolemodule WHERE mid = 941 GROUP BY mid;
