-- =============================================================================
-- 装修功能维护(decoration/decorationFunctionManage.html) —— 菜单注册 + 角色授权
-- 日期: 2026-10-09
--
-- 用途: decoration.decorationfunction(装修单功能字典, 238行, type 0-7) 的页面化管理,
--       分页查询 + 名称/键/类型/子类型条件 + 添加/编辑/删除(引用保护)。
--       挂载点与 mid=373(功能配置, 同管 decorationfunction 的开发者工具页) 平级。
--
-- 生产核查(2026-10-09 只读库):
--   communion.module MAX(mid) = 932, 本脚本取 933(执行前请复核未被占用)
--   挂载点: mid=6 "装修"(一级), 其下二级 order 已用到 6(373 功能配置=5), 新菜单取 7
--   授权: 复制 mid=373(功能配置) 的全部 rolemodule 行(DISTINCT 去重), 322 行
--
-- 注意:
--   1. 非幂等, 重复执行前先跑核验查询确认未插入过。
--   2. cuid 必须为真实存在的 user.uid(统一 34=白添宇 FL-00479): RoleModulePO.creater 系
--      EAGER ManyToOne 关联 user.uid, cuid 无对应用户时 queryModuleForLogin 取菜单抛
--      ObjectNotFoundException, 整个菜单接口报错。
--   3. 后端 pageDecorationFunction/add/update/deleteDecorationFunction.do 走 operation
--      自动补全(through=1), 无需登记。
--   4. 页面为纯前端 + decoration 模块 jar(fanglin-decoration-8.3.030, 2026-10-09 及以后
--      构建版含本功能), 部署先发 jar 再开菜单。
-- =============================================================================

-- 1. module: 菜单(装修 → 功能维护)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (933, 6, '功能维护', '功能维护', '', 'icon-list-alt',
   '/views/decoration/decorationFunctionManage.html', 2, 1, 7, '');

-- 2. rolemodule: 复制 mid=373(功能配置) 的全部角色授权(DISTINCT 去重历史重复行)
INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.rid, 933, rm.link, rm.access, 34, NOW(), rm.company
FROM `communion`.`rolemodule` rm
WHERE rm.mid = 373;

-- =============================================================================
-- 执行前核验(mid 未被占用, 应返回 0 行)
-- =============================================================================
-- SELECT mid FROM communion.module WHERE mid = 933
--    OR url = '/views/decoration/decorationFunctionManage.html';

-- 执行后核验(应各返回 1 行 / 授权行数)
-- SELECT mid, fatherModuleId, name, url, level, `order`
-- FROM communion.module WHERE mid = 933;
--
-- SELECT COUNT(*) FROM communion.rolemodule WHERE mid = 933;
