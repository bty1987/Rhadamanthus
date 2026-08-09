-- ============================================================
-- Report Analytics 汇总表 DDL
-- 配合 REPORT_PLATFORM_BLUEPRINT.md 阶段一·增量1
-- 创建日期: 2026-08-09
-- 说明: 在 report 库新建 metric_decoration_daily 汇总表。
--       由 MetricRefreshJob 每日凌晨 1:30 全量重算(INSERT...ON DUPLICATE KEY UPDATE)。
--       首次部署时手工执行本脚本。
-- ============================================================

USE `report`;

CREATE TABLE IF NOT EXISTS `metric_decoration_daily` (
    `mdid`               BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_date`          DATE         NOT NULL                COMMENT '统计日期',
    `company`            INT          NOT NULL                COMMENT '公司ID(communion.company.cid)',

    -- 订单状态计数(按 createTime 归日,反映获客与流转)
    `measure_count`      BIGINT       NOT NULL DEFAULT 0      COMMENT '量尺数(全部订单创建量)',
    `deposit_count`      BIGINT       NOT NULL DEFAULT 0      COMMENT '定金(status>=1)',
    `presign_count`      BIGINT       NOT NULL DEFAULT 0      COMMENT '预签(status>=2)',
    `sign_count`         BIGINT       NOT NULL DEFAULT 0      COMMENT '签约(status>=3)',
    `resign_count`       BIGINT       NOT NULL DEFAULT 0      COMMENT '重签(status=4)',
    `final_count`        BIGINT       NOT NULL DEFAULT 0      COMMENT '决算(status>=7)',
    `complete_count`     BIGINT       NOT NULL DEFAULT 0      COMMENT '完工(status>=8)',
    `waste_count`        BIGINT       NOT NULL DEFAULT 0      COMMENT '废单(status=5)',
    `termination_count`  BIGINT       NOT NULL DEFAULT 0      COMMENT '终止(status=6)',

    -- 签约额(按 contractTime 归日,单位分)
    `sign_amount`        BIGINT       NOT NULL DEFAULT 0      COMMENT '签约总额(orderTotalPrice之和,分)',

    -- 装修类型分布(按 createTime 归日)
    `midpack_count`      BIGINT       NOT NULL DEFAULT 0      COMMENT '半包(type=0)',
    `inclusive_count`    BIGINT       NOT NULL DEFAULT 0      COMMENT '整装(type=1)',
    `holonomy_count`     BIGINT       NOT NULL DEFAULT 0      COMMENT '大包(type=2)',

    PRIMARY KEY (`mdid`),
    UNIQUE KEY `uk_date_company` (`stat_date`, `company`),
    KEY `idx_company` (`company`),
    KEY `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='装修销售转化日级汇总(analytics子域)';

-- ============================================================
-- 验证: 部署后可执行以下语句确认数据已生成
-- SELECT COUNT(*) FROM report.metric_decoration_daily;
-- SELECT stat_date, company, measure_count, sign_count, sign_amount
--   FROM report.metric_decoration_daily ORDER BY stat_date DESC LIMIT 10;
-- ============================================================
