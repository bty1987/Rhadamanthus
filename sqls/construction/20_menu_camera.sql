-- =============================================================================
-- 施工摄像头页面(constructionCamera.html) —— 菜单注册 + 角色授权
-- 日期: 2026-09-02
--
-- 生产核查(2026-09-02 只读库):
--   communion.module MAX(mid) = 924, 本脚本取 925(执行前请复核未被占用)
--   挂载点: mid=237 "工程"(一级菜单), 其下二级 order 已用到 7(923 功能配置), 新菜单取 8
--   rid=86 = "系统管理员"(level=5, company=0, 系统开发部专用),
--   其 company=1 现有授权行惯例: link=1(不进快捷导航), access=0(入口正常显示)
--
-- 注意:
--   1. access=1 仅对三级菜单隐藏入口(index.js:922), 二级菜单不受影响;
--      取 0 与 rid=86 绝大多数可见行一致。
--   2. cuid=0 表示 SQL 直接落库无操作人, 如需留痕可替换为实际操作人 uid。
--   3. 非幂等, 重复执行前先跑核验查询确认未插入过。
-- =============================================================================

-- 1. module: 菜单(工程 → 施工摄像头)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (925, 237, '施工摄像头', '施工摄像头', '', 'icon-camera',
   '/views/construction/constructionCamera.html', 2, 1, 8, '');

-- 2. rolemodule: rid=86(系统管理员) @ company=1
INSERT INTO `communion`.`rolemodule`
  (`rmid`, `rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
VALUES
  (NULL, 86, 925, 1, 0, 34, NOW(), 1);

-- =============================================================================
-- 执行前核验(mid 未被占用, 应返回 0 行)
-- =============================================================================
-- SELECT mid FROM communion.module WHERE mid = 925
--    OR url = '/views/construction/constructionCamera.html';

-- 执行后核验(应各返回 1 行)
-- SELECT mid, fatherModuleId, name, url, level, `order`
-- FROM communion.module WHERE mid = 925;
--
-- SELECT rmid, rid, mid, link, access, company
-- FROM communion.rolemodule WHERE rid = 86 AND mid = 925 AND company = 1;
