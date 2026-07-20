-- =====================================================================
-- actionLog 归档月表建表模板（DBA 参考）
--
-- Phase 4 归档机制要求：每月 1 号凌晨 2 点，定时任务 ActionLogArchiveJob
-- 会把 90 天前的 actionLog 数据按月归档到 log.actionlog_yyyymm 表。
--
-- 本脚本不是自动执行的，而是给 DBA 的建表模板。两种使用方式：
--
-- 方式 A（推荐，每月提前建好下个月的归档表）：
--   在每月归档任务执行前，DBA 跑一次：
--     CREATE TABLE log.actionlog_202605 LIKE log.actionlog;
--   归档任务检测到表存在才会搬运数据。
--
-- 方式 B（一次性建好未来 12 个月的归档表）：
--   执行下方循环存储过程，一次建好。
--
-- 注意：
--   - 归档表名格式必须为 actionlog_yyyymm（全小写），与代码里的拼接一致
--   - LIKE 会复制表结构和索引，但不复制外键（归档表不需要外键约束）
--   - 如果某个月的归档表未建，归档任务会跳过该月并在日志里告警，不删热表数据
--   - 归档表与热表 schema 一致（log），DDL 见 dbs/actionlog_extend.sql
-- =====================================================================

-- 单月建表示例（替换 yyyymm 为实际月份，如 202605）：
-- CREATE TABLE log.`actionlog_202605` LIKE log.`actionlog`;

-- =====================================================================
-- 一次性建好未来 12 个月的归档表（存储过程）
-- =====================================================================
USE `log`;

DELIMITER $$

DROP PROCEDURE IF EXISTS `create_actionlog_archive_tables`$$
CREATE PROCEDURE `create_actionlog_archive_tables`(
    IN start_ym VARCHAR(6),  -- 起始月份，如 '202605'
    IN months_cnt INT        -- 建多少个月的表，如 12
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE ym VARCHAR(6);
    DECLARE tbl_name VARCHAR(64);

    SET i = 0;
    WHILE i < months_cnt DO
        -- 用 DATE_ADD 计算月份
        SET ym = DATE_FORMAT(DATE_ADD(STR_TO_DATE(CONCAT(start_ym, '01'), '%Y%m%d'), INTERVAL i MONTH), '%Y%m');
        SET tbl_name = CONCAT('actionlog_', ym);

        -- 防重复创建
        SET @ddl = CONCAT('CREATE TABLE IF NOT EXISTS `log`.`', tbl_name, '` LIKE `log`.`actionlog`');
        PREPARE stmt FROM @ddl;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

        SELECT CONCAT('created: log.', tbl_name) AS msg;

        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- 示例：建 2026-05 ~ 2027-04 共 12 个月的归档表
-- CALL create_actionlog_archive_tables('202605', 12);

-- 用完可删除存储过程（可选）
-- DROP PROCEDURE IF EXISTS `create_actionlog_archive_tables`;
