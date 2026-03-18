-- ========================================
-- 报价预算员分配功能菜单配置脚本
-- 创建时间: 2026-03-18
-- 功能: 添加预算配置、预算员规则、待分配队列三个菜单
-- ========================================

-- 查看当前报价模块的菜单结构（执行前确认）
SELECT mid, fatherModuleId, name, `order`, url
FROM communion.module
WHERE fatherModuleId = 36
ORDER BY `order`;

-- 添加三个新菜单
INSERT INTO communion.module (
    fatherModuleId, name, alias, module, icon, url, level, system, `order`, helpKey
) VALUES
(36, '预算配置', '预算配置', '', 'icon-cog', '/views/quotation/quotationAssignConfig.html', 3, 1, 16, NULL),
(36, '预算员规则', '预算员规则', '', 'icon-user', '/views/quotation/quotationAssignUserRule.html', 3, 1, 17, NULL),
(36, '待分配队列', '待分配队列', '', 'icon-list-alt', '/views/quotation/quotationAssignRequest.html', 3, 1, 18, NULL);

-- 验证插入结果
SELECT mid, fatherModuleId, name, alias, icon, url, `order`
FROM communion.module
WHERE fatherModuleId = 36
  AND name IN ('预算配置', '预算员规则', '待分配队列')
ORDER BY `order`;

-- 回滚脚本（如需删除，请执行以下语句）
-- DELETE FROM communion.module WHERE name IN ('预算配置', '预算员规则', '待分配队列') AND fatherModuleId = 36;
