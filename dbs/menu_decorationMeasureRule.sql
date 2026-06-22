-- ============================================================================
-- 装修区域分支规则（decorationMeasureRule）菜单注册脚本
-- ============================================================================
-- 用途：在 communion.module 表注册"装修区域分支规则"菜单项
-- 执行前提：data 模块的父级菜单已存在（name='数据' 或类似）
-- 注意：请先在数据库中确认 data 父模块的 name/alias，必要时调整下方子查询条件
-- 执行方式：由 DBA 在 communion 库中执行
-- ============================================================================

-- 1. 注册菜单项（挂在 data 数据维护父模块下）
--    fatherModuleId 通过子查询获取 data 父模块的 mid（请按实际数据调整 WHERE 条件）
INSERT INTO `module` (`fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`)
SELECT m.mid, '装修区域分支规则', 'decorationMeasureRule', 'decorationMeasureRule', 'icon-th-list', '/views/data/decorationMeasureRule.html', 3, 0, 99
FROM `module` m
WHERE m.name = '数据' OR m.alias = 'data'
LIMIT 1;

-- 若上述 WHERE 条件无法匹配到 data 父模块，可手动指定 fatherModuleId：
-- INSERT INTO `module` (`fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`)
-- VALUES (<data父模块mid>, '装修区域分支规则', 'decorationMeasureRule', 'decorationMeasureRule', 'icon-th-list', '/views/data/decorationMeasureRule.html', 3, 0, 99);

-- 2. （可选）注册按钮级权限到 operation 表
--    moduleId 通过子查询关联到上面新增的菜单
INSERT INTO `operation` (`moduleId`, `name`, `operation`, `through`, `type`, `system`, `status`)
SELECT mid, '装修区域分支规则', 'decorationMeasureRule', 0, 0, 1, 0
FROM `module` WHERE alias = 'decorationMeasureRule';

-- ============================================================================
-- 说明：
-- 1. level=3 表示三级菜单（叶子节点，对应具体页面）
-- 2. system=0 表示业务模块（非系统内置）
-- 3. 注册后需在"角色管理"中给对应角色分配该菜单权限，用户才能看到
-- 4. 也可通过系统后台的"模块管理"界面图形化添加，无需手动执行 SQL
-- ============================================================================
