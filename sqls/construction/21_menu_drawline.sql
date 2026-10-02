-- =============================================================================
-- 放线记录分页浏览页(construction/drawline.html) —— 菜单注册 + 角色授权
-- 日期: 2026-09-14
--
-- 生产核查(2026-09-14 只读库):
--   communion.module MAX(mid) = 927, 本脚本取 928(执行前请复核未被占用)
--   挂载点: mid=40 "放线部署"(二级菜单, 挂 237"工程"下), 其下三级 order 已用到 3
--   (374 放线计划=0 / 75 放线申请=1 / 76 放线计划=2 / 77 人员部署=3), 新菜单取 4
--   授权: 复制 mid=75(放线申请) 的全部 rolemodule 行(约200+行, 含各公司角色),
--   link/access/company 逐角色照搬(187 运维管理员 access=1 隐藏入口语义保留)
--
-- 注意:
--   1. 非幂等, 重复执行前先跑核验查询确认未插入过。
--   2. cuid=0 表示 SQL 直接落库无操作人, 如需留痕可替换为实际操作人 uid。
--   3. 页面调用的 pageDrawLine.do 等接口走 operation 自动补全(through=1), 无需登记。
-- =============================================================================

-- 1. module: 菜单(放线部署 → 放线记录)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (928, 40, '放线记录', '放线记录', '', 'icon-wrench',
   '/views/construction/drawline.html', 3, 1, 4, '');

-- 2. rolemodule: 复制 mid=75(放线申请) 的全部角色授权(DISTINCT 去重历史重复行)
INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.rid, 928, rm.link, rm.access, 34, NOW(), rm.company
FROM `communion`.`rolemodule` rm
WHERE rm.mid = 75;

-- =============================================================================
-- 执行前核验(mid 未被占用, 应返回 0 行)
-- =============================================================================
-- SELECT mid FROM communion.module WHERE mid = 928
--    OR url = '/views/construction/drawline.html';

-- 执行后核验(应各返回 1 行 / 授权行数)
-- SELECT mid, fatherModuleId, name, url, level, `order`
-- FROM communion.module WHERE mid = 928;
--
-- SELECT COUNT(*) FROM communion.rolemodule WHERE mid = 928;
