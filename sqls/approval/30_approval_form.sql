-- ============================================================
-- 审批表单层 - 全新 EAV 纵向结构(不复用 process/processItem)
-- MySQL 5.6 友好:全部标量列,无 JSON/TEXT,可索引可查询
--
-- 设计:
--   approvalForm       表单元信息,通过 flowId 桥接 approvalFlow
--   approvalFormField  字段定义(每字段一行),controlType 引用控件字典
--   approvalFormData   运行时填写数据,每值一行,(aid, fieldId) 联合索引
--
-- 控件类型字典(controlType 枚举值,不入库,维护在 ApprovalFormFieldPO 常量):
--   1=文本 2=文本域 3=数字 4=下拉 5=日期 6=用户选择 7=部门选择 8=附件
-- ============================================================

-- ------------------------------------------------------------
-- 1. approvalForm  表单定义(元信息)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `approval`.`approvalForm` (
  `formId`     bigint(20)   NOT NULL AUTO_INCREMENT COMMENT '表单ID',
  `code`       varchar(64)  NOT NULL                COMMENT '表单编码(业务唯一键)',
  `name`       varchar(100) NOT NULL                COMMENT '表单名称',
  `flowId`     bigint(20)   DEFAULT NULL            COMMENT '关联流程定义 approvalFlow.flowId',
  `status`     smallint(6)  NOT NULL DEFAULT 0      COMMENT '状态:0=启用 1=禁用',
  `company`    int(11)      NOT NULL DEFAULT 0      COMMENT '公司ID,0=全公司通用',
  `comment`    varchar(255) DEFAULT NULL            COMMENT '表单说明',
  `createTime` timestamp    NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`formId`),
  UNIQUE KEY `uk_code_company` (`code`, `company`),
  KEY `idx_flowId` (`flowId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批表单定义';

-- ------------------------------------------------------------
-- 2. approvalFormField  表单字段定义(EAV 纵向,每字段一行)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `approval`.`approvalFormField` (
  `fieldId`      bigint(20)   NOT NULL AUTO_INCREMENT COMMENT '字段ID',
  `formId`       bigint(20)   NOT NULL                COMMENT '所属表单ID',
  `fieldKey`     varchar(50)  NOT NULL                COMMENT '字段键(英文标识,如 discountRate)',
  `fieldLabel`   varchar(100) NOT NULL                COMMENT '字段标签(中文显示,如 降点比例)',
  `controlType`  smallint(6)  NOT NULL DEFAULT 1      COMMENT '控件类型:1文本 2文本域 3数字 4下拉 5日期 6用户选择 7部门选择 8附件',
  `required`     smallint(6)  NOT NULL DEFAULT 0      COMMENT '是否必填:0否 1是',
  `defaultValue` varchar(255) DEFAULT NULL            COMMENT '默认值',
  `dataSource`   varchar(500) DEFAULT NULL            COMMENT '下拉数据源(逗号分隔值 或 beanClass#method 动态获取)',
  `validateRule` varchar(100) DEFAULT NULL            COMMENT '验证规则(逗号分隔:require,integer,float,phone 等)',
  `sortOrder`    int(11)      NOT NULL DEFAULT 0      COMMENT '排序(从小到大)',
  `status`       smallint(6)  NOT NULL DEFAULT 0      COMMENT '状态:0=启用 1=禁用',
  PRIMARY KEY (`fieldId`),
  KEY `idx_formId_status_sort` (`formId`, `status`, `sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批表单字段定义';

-- ------------------------------------------------------------
-- 3. approvalFormData  表单填写数据(运行时)
--    每次提交/审批产生的填写值,每值一行
--    (aid, fieldId) 联合索引支持按字段精确查询
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `approval`.`approvalFormData` (
  `dataId`     bigint(20)   NOT NULL AUTO_INCREMENT COMMENT '数据ID',
  `aid`        bigint(20)   NOT NULL                COMMENT '关联审批主表 approval.aid',
  `fieldId`    bigint(20)   NOT NULL                COMMENT '字段定义ID',
  `fieldValue` varchar(2000) DEFAULT NULL           COMMENT '填写的值(标量)',
  `taskId`     bigint(20)   DEFAULT NULL            COMMENT '关联任务(可选,区分提交时填/审批时填)',
  PRIMARY KEY (`dataId`),
  KEY `idx_aid_fieldId` (`aid`, `fieldId`),
  KEY `idx_fieldId` (`fieldId`),
  KEY `idx_taskId` (`taskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='审批表单填写数据';
