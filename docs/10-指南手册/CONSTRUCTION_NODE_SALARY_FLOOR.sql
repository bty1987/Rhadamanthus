-- =====================================================================
-- CONSTRUCTION_NODE_SALARY_FLOOR.sql
-- 数据工程·工程节点 增加工费保底额(salaryFloor)
-- =====================================================================
-- 需求:
--   数据工程(工程节点基础数据)增加"工费保底额"。工费管理过程
--   (创建工人工资)节点定额工费低于保底额时,按保底额管控
--   (管控公式: max(定额工费, 保底额) + 工费浮动额,超出发 280014);
--   定额工费项目单打印识别总额为保底托底时,总额显示保底值并附"(保底)"标识。
--
-- 字段: data.constructionnode.salaryFloor
--   int(8) NOT NULL DEFAULT 0,单位分(×1000,与 salaryLimit/accessoryLimit
--   同 tranargs 口径),0 = 无保底 = 现状等价(存量零影响)。
--   逐公司配置(constructionnode.company),初始由各公司在数据工程页
--   按节点维护(如机电节点)。
--
-- 🔴 执行顺序: 必须先于 fanglin-data 新 jar(PO 映射 salaryFloor 列,
--   列不存在则节点相关查询全部炸库)。SQL 先行,jar 随后,前端随包。
-- 回滚: 无需回滚列(默认0无行为);回退 jar 即回到现状。
-- 幂等: 一次性 DDL,重复执行报 Duplicate column(正常)。
-- =====================================================================

ALTER TABLE data.constructionnode ADD COLUMN salaryFloor int(8) NOT NULL DEFAULT 0 COMMENT '工费保底额(x1000,0=无保底)';

-- 验证
SHOW COLUMNS FROM data.constructionnode LIKE 'salaryFloor';
