-- =============================================
-- 调研模板表 (QuotationProfile)
-- 基于 QuotationProfilePO / QuotationProfileItemPO / QuotationProfileOptionPO
-- catalog: quotation
-- =============================================

-- 主表：调研模板
CREATE TABLE IF NOT EXISTS quotation.quotationprofile (
    qpid       BIGINT NOT NULL AUTO_INCREMENT,
    tid        BIGINT,
    qid        BIGINT,
    orderId    VARCHAR(255),
    name       VARCHAR(255),
    cuid       BIGINT,
    createTime DATETIME,
    type       SMALLINT,
    status     SMALLINT,
    company    INT,
    PRIMARY KEY (qpid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 子表：模板项（问题）
-- type: 0=文本 1=输入框 2=单选 3=多选 4=日期
CREATE TABLE IF NOT EXISTS quotation.quotationprofileitem (
    qpiid   BIGINT NOT NULL AUTO_INCREMENT,
    qpid    BIGINT,
    name    VARCHAR(255),
    type    SMALLINT,
    `require` SMALLINT,
    content TEXT,
    PRIMARY KEY (qpiid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 子表：选项（挂在模板项下）
CREATE TABLE IF NOT EXISTS quotation.quotationprofileoption (
    qpoid   BIGINT NOT NULL AUTO_INCREMENT,
    qpiid   BIGINT,
    qpid    BIGINT,
    title   VARCHAR(255),
    checked SMALLINT DEFAULT 1,
    PRIMARY KEY (qpoid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
