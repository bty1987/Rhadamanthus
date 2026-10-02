-- =============================================================================
-- 已接客源-客服(customerChance.html?depage=service) —— 菜单注册 + 角色授权
-- 日期: 2026-09-18
--
-- 页面说明:
--   低权限客服视图, JS service 分支裁剪: 仅保留"不校验/记录"行按钮,
--   客户姓名列禁止点击客户详情, 查询条件去掉电话; 电话/身份证/地址后端置空+电话列
--   show 仅 user/designer 可见, service 天然不显示。
--
-- 生产核查(2026-09-18 只读库):
--   communion.module MAX(mid) = 928, 本脚本取 929(执行前请复核未被占用)
--   挂载点: mid=818 "已接客源"(二级目录, 父=240), 其下三级 order 已用到 6(848 已接客源-管理),
--   新菜单取 7; 行字段照 mid=848(已接客源-管理)同款
--
-- 注意:
--   1. rolemodule 第2段为幂等 INSERT...SELECT, 可重复执行;
--   2. cuid=0 表示 SQL 直接落库无操作人, 如需留痕可替换为实际操作人 uid;
--   3. module 第1段非幂等, 重复执行前先跑核验查询确认未插入过。
-- =============================================================================

-- 1. module: 菜单(已接客源 → 已接客源-客服)
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (929, 818, '已接客源-客服', '机会-客服', '', 'icon-user',
   '/views/customer/customerChance.html?depage=service', 3, 1, 7, '');

-- 2. rolemodule: rid=86(系统管理员) 按其现有授权公司集合授权(生产实查 97 家 company=0~96)
--    动态复制: 授权范围自动跟随 rid=86 当前拥有权限的公司, 后续新增公司重跑本段即可补齐; 幂等
INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT 86, 929, 1, 0, 34, NOW(), t.company
FROM (SELECT DISTINCT company FROM `communion`.`rolemodule` WHERE rid = 86) t
WHERE NOT EXISTS (
    SELECT 1 FROM `communion`.`rolemodule` x
    WHERE x.rid = 86 AND x.mid = 929 AND x.company = t.company
);

-- =============================================================================
-- 执行前核验(mid 未被占用, 应返回 0 行)
-- =============================================================================
-- SELECT mid FROM communion.module WHERE mid = 929
--    OR url = '/views/customer/customerChance.html?depage=service';

-- 执行后核验
-- SELECT mid, fatherModuleId, name, url, level, `order`
-- FROM communion.module WHERE mid = 929;
--
-- SELECT m.mid, m.name, GROUP_CONCAT(r.rid) AS rids
-- FROM communion.module m LEFT JOIN communion.rolemodule r ON r.mid = m.mid
-- WHERE m.mid = 929 GROUP BY m.mid, m.name;
--
-- 授权行数应等于 rid=86 现有公司数(当前 97):
-- SELECT COUNT(*) FROM communion.rolemodule WHERE rid = 86 AND mid = 929;
