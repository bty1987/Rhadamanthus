-- =============================================================================
-- 品类规格(communion.categoryformat)建表 + operation 登记
--
-- 背景：品类维度的规格字典,作为两个场景的规格取值范围约束：
--   1. 商品-整装创建过程：所选品类已维护规格时,商品规格必须取自品类规格集合
--      (GoodsServiceImpl.checkFormatInCategoryScope,不在范围报 200124)
--   2. 功能区品类规格(quotation.functionareaformat)：规格取值范围同样约束于品类规格
--      (FunctionAreaCategoryServiceImpl.checkFormatInCategoryScope,不在范围报 200124)
--   品类未维护规格时不约束(兼容自由录入,存量行为不变)。
--
-- 品类规格维护入口：品类管理页(data/category)品类行"规格"按钮弹窗维护。
--
-- ⚠️ 部署顺序：本脚本先于含品类规格代码的 jar 执行(纯新增表,先建无害)。
-- =============================================================================

-- 1. 建表(唯一 DDL,幂等)
CREATE TABLE IF NOT EXISTS communion.categoryformat (
  cfid    INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  cid     INT NOT NULL COMMENT '品类ID(communion.category.cid)',
  format  VARCHAR(64) NOT NULL COMMENT '规格',
  comment VARCHAR(128) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (cfid),
  UNIQUE KEY uk_cid_format (cid, format)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='品类规格';

-- 2. operation 登记(moduleId 继承 queryCategory 所在模块,through=1;NOT EXISTS 防重)
INSERT INTO communion.operation (moduleId, name, operation, through, status)
SELECT moduleId, '查询品类规格', 'queryCategoryFormatByCid', 1, 0 FROM communion.operation WHERE operation = 'queryCategory' LIMIT 1;
INSERT INTO communion.operation (moduleId, name, operation, through, status)
SELECT moduleId, '新增品类规格', 'addCategoryFormat', 1, 0 FROM communion.operation WHERE operation = 'queryCategory' LIMIT 1;
INSERT INTO communion.operation (moduleId, name, operation, through, status)
SELECT moduleId, '更新品类规格', 'updateCategoryFormat', 1, 0 FROM communion.operation WHERE operation = 'queryCategory' LIMIT 1;
INSERT INTO communion.operation (moduleId, name, operation, through, status)
SELECT moduleId, '删除品类规格', 'deleteCategoryFormat', 1, 0 FROM communion.operation WHERE operation = 'queryCategory' LIMIT 1;

-- =============================================================================
-- 验证：
--   SHOW COLUMNS FROM communion.categoryformat;
--   SELECT operation FROM communion.operation WHERE operation LIKE '%CategoryFormat%';  -- 预期4行
-- =============================================================================
