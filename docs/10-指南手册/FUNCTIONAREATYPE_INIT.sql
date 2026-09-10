-- =====================================================================
-- 功能区类型基础数据(functionAreaType 字段字典化改造)
-- 方案:functionarea/quotationfunctionarea 的 functionAreaType varchar(10) 字段
--       复用为空间类型字典值(值关联,存名称文本),零加列。
-- 关联改动:fanglin-data + fanglin-quotation 两 jar + WebContent/app 前端。
-- 发版顺序:先本 SQL(1-2 节) → 发 jar → 前端 → 菜单授权(3 节) → 回填(4 节,可选)。
-- 错误码:200116 功能区类型不存在 / 200117 功能区类型已被引用。
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. 建表 + 预置(唯一 DDL,大表 quotationfunctionarea 零变更)
-- ---------------------------------------------------------------------
CREATE TABLE quotation.functionareatype (
  fatId   INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  name    VARCHAR(10) NOT NULL COMMENT '类型名称',
  company INT NOT NULL DEFAULT 0 COMMENT '所属公司(0=全局)',
  status  TINYINT NOT NULL DEFAULT 0 COMMENT '状态(0启用 1停用)',
  PRIMARY KEY (fatId),
  UNIQUE KEY uk_name_company (name, company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='功能区类型(空间类型字典)';

INSERT INTO quotation.functionareatype (name, company, status) VALUES
('客厅', 0, 0),
('卧室', 0, 0),
('主卧', 0, 0),
('次卧', 0, 0),
('厨房', 0, 0),
('餐厅', 0, 0),
('卫生间', 0, 0),
('阳台', 0, 0),
('书房', 0, 0),
('玄关', 0, 0),
('走廊', 0, 0),
('衣帽间', 0, 0),
('其他', 0, 0);

-- ---------------------------------------------------------------------
-- 2. operation 接口登记(与 functionArea 族同组 moduleId=316,through=1 同族惯例)
-- ---------------------------------------------------------------------
INSERT INTO communion.operation (moduleId, name, operation, through, status) VALUES
(316, '分页查询功能区类型', 'pageFunctionAreaType',       1, 0),
(316, '查询功能区类型',     'queryFunctionAreaType',      1, 0),
(316, '新增功能区类型',     'addFunctionAreaType',        1, 0),
(316, '更新功能区类型',     'updateFunctionAreaType',     1, 0),
(316, '更新功能区类型状态', 'updateFunctionAreaTypeForStatus', 1, 0),
(316, '删除功能区类型',     'deleteFunctionAreaType',     1, 0);

-- ---------------------------------------------------------------------
-- 3. 菜单 + 授权(挂"数据→报价"分组,即功能区菜单 mid=61 的同级;
--    授权复制功能区菜单的既有角色,免逐角色配置)
-- ---------------------------------------------------------------------
INSERT INTO communion.module (fatherModuleId, name, alias, module, icon, url, level, system, `order`, helpKey)
VALUES (36, '功能区类型', '功能区类型', NULL, '', '/views/quotation/functionAreaType.html', 3, 1, 7, NULL);

SET @functionAreaTypeMid = LAST_INSERT_ID();

INSERT INTO communion.rolemodule (rid, mid, link, access, cuid, company)
SELECT rid, @functionAreaTypeMid, link, access, cuid, company
FROM communion.rolemodule WHERE mid = 61;

-- ---------------------------------------------------------------------
-- 4. 模板存量回填(用户已拍板执行;快照表 quotationfunctionarea 不回填)
--    规则:按 name 关键词匹配空间类型;主卧/次卧优先于卧室;当前值已是
--    空间类型的行跳过(NOT IN 幂等)。预览:3158 行中约 1948 行命中,
--    约 1210 行(管理费/生成项目/无空间词)保持原计价口径值。
-- ---------------------------------------------------------------------
UPDATE quotation.functionarea SET functionAreaType = (
  CASE
    WHEN name LIKE '%主卧%' THEN '主卧'
    WHEN name LIKE '%次卧%' THEN '次卧'
    WHEN name LIKE '%卧%'   THEN '卧室'
    WHEN name LIKE '%厨%'   THEN '厨房'
    WHEN name LIKE '%餐%'   THEN '餐厅'
    WHEN name LIKE '%卫%'   THEN '卫生间'
    WHEN name LIKE '%客厅%' THEN '客厅'
    WHEN name LIKE '%厅%'   THEN '客厅'
    WHEN name LIKE '%阳台%' THEN '阳台'
    WHEN name LIKE '%书房%' THEN '书房'
    WHEN name LIKE '%玄关%' THEN '玄关'
    WHEN name LIKE '%走廊%' OR name LIKE '%过道%' THEN '走廊'
    WHEN name LIKE '%衣帽%' THEN '衣帽间'
    ELSE functionAreaType
  END
)
WHERE functionAreaType NOT IN ('客厅','卧室','主卧','次卧','厨房','餐厅','卫生间','阳台','书房','玄关','走廊','衣帽间','其他');

-- ---------------------------------------------------------------------
-- 验证(只读核对)
-- ---------------------------------------------------------------------
-- SELECT functionAreaType, COUNT(*) FROM quotation.functionarea GROUP BY functionAreaType;
-- SELECT * FROM quotation.functionareatype;
-- SELECT operation, through FROM communion.operation WHERE operation LIKE '%FunctionAreaType%';
