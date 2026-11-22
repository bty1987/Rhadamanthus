-- =====================================================================
-- 56号SQL: department表增加是否计入业绩标识(isPrefor)
-- =====================================================================
-- 用途:
--   communion.department 新增 isPrefor 列(业绩标识), 参考
--   decoration.decorationactivityitem.isPrefor 同款口径:
--     tinyint(1) NOT NULL DEFAULT 0, 0=计入业绩, 1=不计入业绩
--   配套改动(同批代码, 部署依赖本DDL先行):
--     ① communion 部门维护页(views/personnel/department.html/js)列表列+新增/编辑开关
--     ② seiya syncDepartment 接口新增 is_prefor 参数(未传=新增默认计/更新保持原值)
--     ③ DepartmentPO/VO/ServiceImpl 支持
--
-- 执行前置条件:
--   1) 目标库 communion.department 现无 isPrefor 列(下方预检应返回空)
--   2) 🔴必须先执行本DDL再部署新增 communion jar, 否则 Hibernate 映射列
--     与表结构不一致, 部门查询/新增/编辑会直接报 Unknown column
--
-- 回滚方式:
--   ALTER TABLE communion.department DROP COLUMN isPrefor;
--   (仅当确认要下线该功能时执行; 回滚后必须同步回退 jar, 否则同样报表错)
--
-- 验证语句:
--   SHOW COLUMNS FROM communion.department LIKE 'isPrefor';
--   SELECT isPrefor, COUNT(*) FROM communion.department GROUP BY isPrefor;
--   (存量部门全部落默认值 0=计入业绩, 与改造前"全部计入"的事实行为一致)
-- =====================================================================

-- ---------- 预检: 期望返回空(列不存在才执行ALTER) ----------
SHOW COLUMNS FROM communion.department LIKE 'isPrefor';

-- ---------- DDL: MySQL 5.x 不支持 ADD COLUMN IF NOT EXISTS, 重复执行会报
-- ---------- Duplicate column name, 报错即说明已执行过, 跳过即可 ----------
ALTER TABLE communion.department
	ADD COLUMN isPrefor tinyint(1) NOT NULL DEFAULT 0 COMMENT '业绩标识(是否计入业绩) 0:计 1:不计';

-- ---------- 终验: 期望返回 isPrefor 列定义 + 存量分布(应只有0一行) ----------
SHOW COLUMNS FROM communion.department LIKE 'isPrefor';
SELECT isPrefor, COUNT(*) FROM communion.department GROUP BY isPrefor;
