-- ========================================
-- 施工信息交接状态常量数据
-- ========================================
-- 表名: communion.constant
-- 模块: construction
-- 类: constructionInfo
-- 类型: handoverStatus
-- 说明: 0-未交接, 1-已交接, 2-不验证
-- 执行日期: 2025-12-31
-- ========================================

USE `communion`;

-- 清理已存在的数据（避免重复插入）
DELETE FROM `constant`
WHERE `module` = 'construction'
  AND `clazz` = 'constructionInfo'
  AND `type` = 'handoverStatus';

-- 插入交接状态常量数据
INSERT INTO `constant` (`name`, `module`, `clazz`, `type`, `field`, `key`, `value`, `status`) VALUES
('未交接', 'construction', 'constructionInfo', 'handoverStatus', 'handoverStatus', '0', '未交接', 0),
('已交接', 'construction', 'constructionInfo', 'handoverStatus', 'handoverStatus', '1', '已交接', 0),
('不验证', 'construction', 'constructionInfo', 'handoverStatus', 'handoverStatus', '2', '不验证', 0);

-- 验证插入的数据
SELECT c.*, CONCAT(module, '.', clazz, '.', type) as full_key
FROM `constant` c
WHERE c.`module` = 'construction'
  AND c.`clazz` = 'constructionInfo'
  AND c.`type` = 'handoverStatus'
ORDER BY c.`key` + 0;
