-- =====================================================================
-- 功能区-品类关联 + 品类规格(functionareacategory / functionareaformat)
-- 功能区(quotation.functionarea)关联品类(communion.category,品类由
-- category 全局字典维护),每个功能区-品类关联下可维护多条规格行
-- (规格/公式/备注,公式为自由文本,供计价公式使用)。
-- 规格取值范围约束于品类规格(communion.categoryformat,见
-- sqls/communion/13_categoryformat.sql):品类已维护规格时,功能区规格
-- 必须取自品类规格集合(200124);品类未维护规格时自由录入。
-- 关联改动:fanglin-data jar + WebContent/app 前端(功能区页"品类"弹窗)。
-- 错误码:200118 品类不存在 / 200119 功能区品类已存在 /
--         200120 功能区品类不存在 / 200121 功能区规格不存在 /
--         200124 规格不在品类规格范围。
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. 建表(全新环境 DDL;⚠️ 2026-09-17 起 functionareaformat 第二列由
--    company(公司) 更名为 formula(公式),旧列数据语义随更名废弃)
-- ---------------------------------------------------------------------
CREATE TABLE quotation.functionareacategory (
  fcid INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  faid INT NOT NULL COMMENT '功能区ID(quotation.functionarea.faid)',
  cid  INT NOT NULL COMMENT '品类ID(communion.category.cid)',
  PRIMARY KEY (fcid),
  UNIQUE KEY uk_faid_cid (faid, cid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='功能区-品类关联';

CREATE TABLE quotation.functionareaformat (
  ffid  INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  facid INT NOT NULL COMMENT '功能区品类关联ID(functionareacategory.fcid)',
  format   VARCHAR(64) NOT NULL COMMENT '规格',
  formula  VARCHAR(256) DEFAULT NULL COMMENT '公式',
  comment  VARCHAR(128) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (ffid),
  KEY idx_facid (facid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='功能区品类规格';

-- ---------------------------------------------------------------------
-- 1.1 已按旧版(company 列)建过表的环境执行本段迁移(列更名,数据保留)
-- ---------------------------------------------------------------------
-- ALTER TABLE quotation.functionareaformat CHANGE COLUMN company formula VARCHAR(256) DEFAULT NULL COMMENT '公式';

-- ---------------------------------------------------------------------
-- 2. operation 接口登记(functionArea 族同组 moduleId=316,through=1)
-- ---------------------------------------------------------------------
INSERT INTO communion.operation (moduleId, name, operation, through, status) VALUES
(316, '查询功能区品类',   'queryFunctionAreaCategoryByFaid', 1, 0),
(316, '新增功能区品类',   'addFunctionAreaCategory',         1, 0),
(316, '删除功能区品类',   'deleteFunctionAreaCategory',      1, 0),
(316, '新增功能区规格',   'addFunctionAreaFormat',           1, 0),
(316, '更新功能区规格',   'updateFunctionAreaFormat',        1, 0),
(316, '删除功能区规格',   'deleteFunctionAreaFormat',        1, 0);

-- ---------------------------------------------------------------------
-- 验证(只读核对)
-- ---------------------------------------------------------------------
-- SHOW COLUMNS FROM quotation.functionareacategory;
-- SHOW COLUMNS FROM quotation.functionareaformat;  -- 应含 formula 无 company
-- SELECT operation, through FROM communion.operation WHERE operation LIKE '%FunctionAreaCategory%' OR operation LIKE '%FunctionAreaFormat%';
