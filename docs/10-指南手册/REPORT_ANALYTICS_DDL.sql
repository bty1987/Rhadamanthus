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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='装修销售转化日级汇总(指标体系)';

-- ============================================================
-- D7 财务资金: metric_payment_daily 收款日级汇总
-- 数据源: payment.receipt (统一收据流水)
-- 维度: stat_date × company × type(收/退) × paymentType(预付/装修/主材/其他)
-- ============================================================

CREATE TABLE IF NOT EXISTS `metric_payment_daily` (
    `pmid`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_date`     DATE         NOT NULL                COMMENT '统计日期',
    `company`       INT          NOT NULL                COMMENT '公司ID',
    `type`          TINYINT      NOT NULL                COMMENT '0收款 1退款',
    `payment_type`  TINYINT      NOT NULL                COMMENT '0预付款 1装修款 2主材款 3其他',
    `count`         BIGINT       NOT NULL DEFAULT 0      COMMENT '笔数',
    `amount`        BIGINT       NOT NULL DEFAULT 0      COMMENT '金额(分)',

    PRIMARY KEY (`pmid`),
    UNIQUE KEY `uk_date_company_type_ptype` (`stat_date`, `company`, `type`, `payment_type`),
    KEY `idx_company` (`company`),
    KEY `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='财务收款日级汇总(指标体系)';

-- ============================================================
-- D3 装修履约-施工: metric_construction_monthly 施工月级汇总
-- 数据源: construction.construction + construction.constructioninfo + decoration.decoration(取company)
-- 维度: stat_month × company（按开工月/完工月统计）
-- ============================================================

CREATE TABLE IF NOT EXISTS `metric_construction_monthly` (
    `cmid`               BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_month`         CHAR(7)      NOT NULL                COMMENT '统计月份 yyyy-MM',
    `company`            INT          NOT NULL                COMMENT '公司ID',
    `start_count`        BIGINT       NOT NULL DEFAULT 0      COMMENT '开工量(startTime归月)',
    `finish_count`       BIGINT       NOT NULL DEFAULT 0      COMMENT '完工量(process=1且finishTime归月)',
    `ongoing_count`      BIGINT       NOT NULL DEFAULT 0      COMMENT '在建数(开工且未完工)',
    `avg_actual_period`  BIGINT       NOT NULL DEFAULT 0      COMMENT '平均实际工期(天)',
    `avg_plan_period`    BIGINT       NOT NULL DEFAULT 0      COMMENT '平均计划工期(天)',
    `overdue_count`      BIGINT       NOT NULL DEFAULT 0      COMMENT '超期数(实际>计划)',

    PRIMARY KEY (`cmid`),
    UNIQUE KEY `uk_month_company` (`stat_month`, `company`),
    KEY `idx_company` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='施工履约月级汇总(指标体系)';

-- ============================================================
-- D3 装修履约-报价: metric_quotation_monthly 报价偏差月级汇总
-- 数据源: quotation.quotation(默认报价) + decoration.decoration(签约单)
-- 维度: stat_month × company（按签约月）
-- ============================================================

CREATE TABLE IF NOT EXISTS `metric_quotation_monthly` (
    `qmid`                BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_month`          CHAR(7)      NOT NULL                COMMENT '统计月份 yyyy-MM(签约月)',
    `company`             INT          NOT NULL                COMMENT '公司ID',
    `quotation_count`     BIGINT       NOT NULL DEFAULT 0      COMMENT '报价单量',
    `avg_quotation_amount` BIGINT      NOT NULL DEFAULT 0      COMMENT '平均报价额(分)',
    `avg_sign_amount`     BIGINT       NOT NULL DEFAULT 0      COMMENT '平均签约额(分)',
    `avg_diff_amount`     BIGINT       NOT NULL DEFAULT 0      COMMENT '平均偏差额(签约-报价,分)',

    PRIMARY KEY (`qmid`),
    UNIQUE KEY `uk_month_company` (`stat_month`, `company`),
    KEY `idx_company` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='报价偏差月级汇总(指标体系)';

-- ============================================================
-- D4 主材经营: metric_sales_monthly 销售月级汇总
-- 数据源: sales.sales (排除作废 status!=4)
-- 维度: stat_month × company × category（品类：橱柜/全屋定制/电器/瓷砖...）
-- ============================================================

CREATE TABLE IF NOT EXISTS `metric_sales_monthly` (
    `smid`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_month`    CHAR(7)      NOT NULL                COMMENT '统计月份 yyyy-MM',
    `company`       INT          NOT NULL                COMMENT '公司ID',
    `category`      VARCHAR(32)  NOT NULL                COMMENT '品类(空品类归未分类)',
    `sales_count`   BIGINT       NOT NULL DEFAULT 0      COMMENT '销售单量',
    `total_amount`  BIGINT       NOT NULL DEFAULT 0      COMMENT '销售总额(分)',

    PRIMARY KEY (`smid`),
    UNIQUE KEY `uk_month_company_category` (`stat_month`, `company`, `category`),
    KEY `idx_company` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主材销售月级汇总(指标体系)';

-- ============================================================
-- D1 营销获客: metric_customer_monthly 客源获客月级汇总
-- 数据源: customer.customersource
-- 维度: stat_month × company × source（来源渠道）
-- ============================================================

CREATE TABLE IF NOT EXISTS `metric_customer_monthly` (
    `cmid`           BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_month`     CHAR(7)      NOT NULL                COMMENT '统计月份 yyyy-MM',
    `company`        INT          NOT NULL                COMMENT '公司ID',
    `source`         VARCHAR(64)  NOT NULL                COMMENT '来源渠道(空归未分类)',
    `total_count`    BIGINT       NOT NULL DEFAULT 0      COMMENT '报备量(全部)',
    `confirm_count`  BIGINT       NOT NULL DEFAULT 0      COMMENT '确认量(status>=3)',
    `convert_count`  BIGINT       NOT NULL DEFAULT 0      COMMENT '转单量(status=5)',
    `invalid_count`  BIGINT       NOT NULL DEFAULT 0      COMMENT '失效量(status=1)',

    PRIMARY KEY (`cmid`),
    UNIQUE KEY `uk_month_company_source` (`stat_month`, `company`, `source`),
    KEY `idx_company` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='客源获客月级汇总(指标体系)';

-- ============================================================
-- D6 仓储物流: metric_inventory_monthly 出入库月级汇总
-- 数据源: inventory.manifest (已确认 status=1)
-- 维度: stat_month × company × type × direction（0入库/1出库/2双向）
-- ============================================================

CREATE TABLE IF NOT EXISTS `metric_inventory_monthly` (
    `imid`           BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_month`     CHAR(7)      NOT NULL                COMMENT '统计月份 yyyy-MM',
    `company`        INT          NOT NULL                COMMENT '公司ID',
    `type`           TINYINT      NOT NULL                COMMENT '出入库类型(1进货/2进退/3出货/7辅料...)',
    `direction`      TINYINT      NOT NULL                COMMENT '方向: 0入库 1出库 2双向(调拨/套合)',
    `manifest_count` BIGINT       NOT NULL DEFAULT 0      COMMENT '单据量',

    PRIMARY KEY (`imid`),
    UNIQUE KEY `uk_month_company_type_direction` (`stat_month`, `company`, `type`, `direction`),
    KEY `idx_company` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='出入库月级汇总(指标体系)';

-- ============================================================
-- 验证: 部署后可执行以下语句确认数据已生成
-- SELECT COUNT(*) FROM report.metric_decoration_daily;
-- SELECT stat_date, company, measure_count, sign_count, sign_amount
--   FROM report.metric_decoration_daily ORDER BY stat_date DESC LIMIT 10;
-- SELECT stat_date, company, type, payment_type, count, amount
--   FROM report.metric_payment_daily ORDER BY stat_date DESC LIMIT 10;
-- SELECT stat_month, company, start_count, finish_count, avg_actual_period, overdue_count
--   FROM report.metric_construction_monthly ORDER BY stat_month DESC LIMIT 10;
-- SELECT stat_month, company, quotation_count, avg_quotation_amount, avg_sign_amount, avg_diff_amount
--   FROM report.metric_quotation_monthly ORDER BY stat_month DESC LIMIT 10;
-- ============================================================



-- ============================================================
-- D9 运营管理: metric_approval_monthly 审批月级汇总
-- 数据源: approval.approval (209万条)
-- 维度: stat_month × company × type（审批类型）
-- ============================================================

CREATE TABLE IF NOT EXISTS `metric_approval_monthly` (
    `amid`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_month`        CHAR(7)      NOT NULL                COMMENT '统计月份 yyyy-MM',
    `company`           INT          NOT NULL                COMMENT '公司ID',
    `type`              TINYINT      NOT NULL                COMMENT '审批类型(20客源/10销售退款/8装修活动...)',
    `total_count`       BIGINT       NOT NULL DEFAULT 0      COMMENT '审批总量',
    `reject_count`      BIGINT       NOT NULL DEFAULT 0      COMMENT '拒绝量(status=2)',
    `avg_duration_hours` BIGINT      NOT NULL DEFAULT 0      COMMENT '平均审批耗时(小时)',

    PRIMARY KEY (`amid`),
    UNIQUE KEY `uk_month_company_type` (`stat_month`, `company`, `type`),
    KEY `idx_company` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批运营月级汇总(指标体系)';

-- ============================================================
-- D8 人力薪酬: metric_salary_monthly 工人工费月级汇总
-- 数据源: salary.workersalary (仅status=1通过)
-- 维度: stat_month × company × twotype（工种：1工费/2增项/3油工奖励...）
-- ============================================================

CREATE TABLE IF NOT EXISTS `metric_salary_monthly` (
    `smid`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `stat_month`    CHAR(7)      NOT NULL                COMMENT '统计月份 yyyy-MM',
    `company`       INT          NOT NULL                COMMENT '公司ID',
    `twotype`       TINYINT      NOT NULL                COMMENT '工种(1工费/2增项/3油工奖励/4维修款...)',
    `salary_count`  BIGINT       NOT NULL DEFAULT 0      COMMENT '工费单量',
    `total_salary`  BIGINT       NOT NULL DEFAULT 0      COMMENT '实发总额(分)',

    PRIMARY KEY (`smid`),
    UNIQUE KEY `uk_month_company_twotype` (`stat_month`, `company`, `twotype`),
    KEY `idx_company` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工人工费月级汇总(指标体系)';
