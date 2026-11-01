-- ============================================================================
-- 27_department_createtime_nullable_trigger.sql
-- ============================================================================
-- 用途: 止血桥接——syncDepartment 旧构建(A20260324ServiceImpl.java:308 版本)新增部门
--       不设 createTime, 而 department.createTime 为 date NOT NULL 无默认值,
--       INSERT 显式 NULL 被拒(MySQLIntegrityConstraintViolationException:
--       Column 'createTime' cannot be null), fl-sync 上海建司同步受阻(500004)。
--       本脚本放列 NULL + BEFORE INSERT 触发器兜底, 使旧构建立即可用;
--       根因修复(seiya 3bea1a385 setCreateTime)部署生效后, 触发器 IFNULL 自动空转。
--
-- 为什么不是 "NOT NULL + DEFAULT CURRENT_TIME":
--   ① MySQL 5.6 的 DATE 列不支持 CURRENT_DATE/CURRENT_TIMESTAMP 默认值(仅 TIMESTAMP/DATETIME),
--      强行 MODIFY 报 ERROR 1067 Invalid default value;
--   ② 即便有默认值也救不了旧代码——Hibernate 显式带列 INSERT 传 NULL,
--      NOT NULL 列遇显式 NULL 仍报 1048, 默认值只在列被省略时生效。
--
-- 执行前置条件:
--   ① 确认表现状(期望 createTime date NOT NULL 无默认):
--      SHOW COLUMNS FROM communion.department LIKE 'createTime';
--   ② 确认无同名触发器: SHOW TRIGGERS FROM communion LIKE 'department';
--   ③ 表仅 ~4500 行, ALTER 秒级; 触发器不影响现有数据, 无需回填。
--
-- 幂等性: ①重复执行 MODIFY 无副作用; ②CREATE TRIGGER 不幂等, 重复执行前先 DROP:
--      DROP TRIGGER IF EXISTS trg_department_createtime;
--
-- 回滚方式:
--   DROP TRIGGER IF EXISTS trg_department_createtime;
--   UPDATE communion.department SET createTime = CURDATE() WHERE createTime IS NULL;  -- 若存在NULL行
--   ALTER TABLE communion.department MODIFY `createTime` date NOT NULL;
--
-- 验证语句(执行后核对):
--   ① SHOW COLUMNS FROM communion.department LIKE 'createTime';   -- Null=YES
--   ② SHOW TRIGGERS FROM communion WHERE `Trigger`='trg_department_createtime';  -- 1行
--   ③ 重放 syncDepartment.do(org_code=101, 上海人力行政部) 应返回 errorCode=0 + data=did,
--      且 SELECT did,no,name,createTime FROM communion.department
--      WHERE company=101 AND name='上海人力行政部';  -- createTime=当天日期(触发器填入)
--
-- 后续(根因修复部署生效后, 可选):
--   ① 观察新部门行 createTime 均有值(代码直填);
--   ② 择期清理: DROP TRIGGER trg_department_createtime;
--      UPDATE ... WHERE createTime IS NULL; ALTER ... MODIFY `createTime` date NOT NULL;
-- ============================================================================

-- ① 放开 NOT NULL(date 类型不变, ~4500 行秒级)
ALTER TABLE communion.department MODIFY `createTime` date NULL;

-- ② 兜底触发器: NULL 自动填当天日期(旧构建传 NULL / 新构建有值则原样)
DROP TRIGGER IF EXISTS trg_department_createtime;
CREATE TRIGGER trg_department_createtime BEFORE INSERT ON communion.department
FOR EACH ROW SET NEW.createTime = IFNULL(NEW.createTime, CURDATE());
