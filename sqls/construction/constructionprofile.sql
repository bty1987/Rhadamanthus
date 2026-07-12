-- =============================================
-- 工程单画像/标签表 (ConstructionProfile)
-- 基于 ConstructionProfilePO / ConstructionProfileItemPO / ConstructionProfileOptionPO
-- catalog: construction
-- type(主表用途): 1=需求 2=材料 3=交接 4=标签
-- type(item 题型): 0=文本 1=输入框(备注) 2=单选 3=多选 4=日期
-- =============================================

-- 主表：工程单画像/标签实例
CREATE TABLE IF NOT EXISTS construction.constructionprofile (
    cpid       BIGINT NOT NULL AUTO_INCREMENT,
    tid        BIGINT,          -- 引用 data.surveytemplate.stid
    cid        BIGINT,          -- 工程单主键 construction.cid
    orderId    VARCHAR(255),    -- 冗余,按装修单聚合用
    name       VARCHAR(255),
    cuid       BIGINT,          -- 创建人 user.uid
    createTime DATETIME,
    type       SMALLINT,        -- 用途: 1需求/2材料/3交接/4标签
    status     SMALLINT,        -- 0初始/1已发/2完成
    company    INT,
    PRIMARY KEY (cpid),
    KEY idx_cid_type (cid, type),
    KEY idx_orderId_type (orderId, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 子表：题目项
CREATE TABLE IF NOT EXISTS construction.constructionprofileitem (
    cpiid     BIGINT NOT NULL AUTO_INCREMENT,
    cpid      BIGINT,
    name      VARCHAR(255),
    type      SMALLINT,          -- 题型: 0文本/1填空/2单选/3多选/4日期
    `require` SMALLINT,
    content   TEXT,
    PRIMARY KEY (cpiid),
    KEY idx_cpid (cpid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 子表：选项
CREATE TABLE IF NOT EXISTS construction.constructionprofileoption (
    cpoid   BIGINT NOT NULL AUTO_INCREMENT,
    cpiid   BIGINT,
    cpid    BIGINT,
    title   VARCHAR(255),
    checked SMALLINT DEFAULT 1,
    PRIMARY KEY (cpoid),
    KEY idx_cpid (cpid),
    KEY idx_cpiid (cpiid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
