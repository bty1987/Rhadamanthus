-- ========================================
-- 装修列表创建入口按钮功能配置
-- 功能: 增加 decorationfunction 功能项, 由装修功能权限控制“创建/多单/国补”按钮显示
-- ========================================

INSERT INTO decoration.decorationfunction (`name`, `key`, `value`, `type`, `subtype`, `sort`, `comment`)
SELECT '创建', 'pageBtn', 'create', 4, 1, 91, '装修单创建按钮'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'create' AND `type` = 4
);

INSERT INTO decoration.decorationfunction (`name`, `key`, `value`, `type`, `subtype`, `sort`, `comment`)
SELECT '多单', 'pageBtn', 'createAdvance', 4, 1, 92, '装修多单创建按钮'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'createAdvance' AND `type` = 4
);

INSERT INTO decoration.decorationfunction (`name`, `key`, `value`, `type`, `subtype`, `sort`, `comment`)
SELECT '国补', 'pageBtn', 'createCountry', 4, 1, 93, '装修国补创建按钮'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM decoration.decorationfunction WHERE `key` = 'pageBtn' AND `value` = 'createCountry' AND `type` = 4
);

-- 执行后可在“装修功能”配置页中, 为对应 decoration 页面和公司勾选以上三个功能项。
