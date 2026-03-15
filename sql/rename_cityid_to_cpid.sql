-- ====================================================================
-- 重命名脚本：customerUserRuleItem.cityid → cpid
-- 目的：消除命名歧义，明确表示城区ID（CityProperID）
-- 作者：AI Claude
-- 日期：2026-03-15
-- ====================================================================

-- 备份说明
-- 1. 建议先在测试环境验证
-- 2. 执行前备份数据库
-- 3. 此操作不会丢失数据，只是修改列名

-- ====================================================================
-- 步骤1：修改 customerUserRuleItem 表
-- ====================================================================

USE `customer`;

-- 修改列名：cityid → cpid
ALTER TABLE `customeruserruleitem`
CHANGE COLUMN `cityid` `cpid` INT(11) NULL DEFAULT NULL
COMMENT '城区ID，关联cityproper.cpid';

-- 验证修改
SELECT
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM
    INFORMATION_SCHEMA.COLUMNS
WHERE
    TABLE_SCHEMA = 'customer'
    AND TABLE_NAME = 'customeruserruleitem'
    AND COLUMN_NAME = 'cpid';

-- ====================================================================
-- 步骤2：修改 customerCityRule 表（保持一致性）
-- ====================================================================

USE `customer`;

-- 修改列名：cityid → cpid
ALTER TABLE `customerCityRule`
CHANGE COLUMN `cityid` `cpid` INT(11) NOT NULL
COMMENT '城区ID，关联cityproper.cpid';

-- 验证修改
SELECT
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM
    INFORMATION_SCHEMA.COLUMNS
WHERE
    TABLE_SCHEMA = 'customer'
    AND TABLE_NAME = 'customerCityRule'
    AND COLUMN_NAME = 'cpid';

-- ====================================================================
-- 回滚脚本（如需回滚，执行以下语句）
-- ====================================================================

-- USE `customer`;
-- ALTER TABLE `customeruserruleitem`
-- CHANGE COLUMN `cpid` `cityid` INT(11) NULL DEFAULT NULL
-- COMMENT '城区ID（新增cityproper）';
--
-- ALTER TABLE `customerCityRule`
-- CHANGE COLUMN `cpid` `cityid` INT(11) NOT NULL
-- COMMENT '城区ID';
