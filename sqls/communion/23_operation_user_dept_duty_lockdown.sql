-- ============================================================================
-- 文件: 23_operation_user_dept_duty_lockdown.sql
-- 库表: communion.operation / communion.roleoperation(含备份表两张)
-- 用途: 收紧人员/部门/职位基础数据维护接口——删除其 operation 注册行与角色授权行:
--   人员: addUser / updateUser / updateUserForAdvance / updateUserForBaseInfo
--   部门: addDepartment / updateDepartment / updateDepartmentForStatus
--   职位: addDuty / updateDuty / updateDutyForStatus
--   (人员/部门/职位的 delete 类接口代码中不存在, 系以停用态代替删除, 无 operation 可删)
-- 背景: 生产实测上述 10 行 operation 均为 type=0 且 9 行 through=1(THROUGH_PASS 免登放行)——
--   未登录即可创建/修改人员、部门、职位(游客角色亦有授权), 属权限漏洞。删除 operation 行后
--   AccessInterceptor.checkOperation 查无注册, 接口回落缺省登录态校验(等同 through=0),
--   页面正常登录操作不受影响, 免登调用被 110005 拒绝。
-- 执行前置条件:
--   ① 确认无免登调用方依赖这些接口(外部系统人员同步走 syncSupplier/syncInstorer 独立接口,
--      不在删除清单; AUTHCODE 系走 requestAuthCode 独立接口, 不受影响);
--   ② 现状核对(期望10行):
--      SELECT oid, operation, through, type FROM communion.operation WHERE operation IN
--      ('addUser','updateUser','updateUserForAdvance','updateUserForBaseInfo',
--       'addDepartment','updateDepartment','updateDepartmentForStatus',
--       'addDuty','updateDuty','updateDutyForStatus');
-- 回滚方式(从备份表还原):
--   INSERT INTO communion.operation SELECT * FROM communion.operation_bak_20261028_lockdown;
--   INSERT INTO communion.roleoperation SELECT * FROM communion.roleoperation_bak_20261028_lockdown;
--   (备份表保留不删, 重跑本脚本前先核对备份表行数防重复叠加)
-- 幂等性: DELETE 天然幂等; 备份表 CREATE TABLE IF NOT EXISTS 防重复建表(已有备份则跳过备份,
--   🔴 若需二次执行请先核对备份表行数, 避免备份缺行)。
-- ============================================================================

-- ① 备份(幂等: 已存在则跳过)
CREATE TABLE IF NOT EXISTS communion.operation_bak_20261028_lockdown AS
SELECT * FROM communion.operation
WHERE operation IN (
  'addUser','updateUser','updateUserForAdvance','updateUserForBaseInfo',
  'addDepartment','updateDepartment','updateDepartmentForStatus',
  'addDuty','updateDuty','updateDutyForStatus'
);

CREATE TABLE IF NOT EXISTS communion.roleoperation_bak_20261028_lockdown AS
SELECT ro.* FROM communion.roleoperation ro
WHERE ro.oid IN (
  SELECT oid FROM communion.operation
  WHERE operation IN (
    'addUser','updateUser','updateUserForAdvance','updateUserForBaseInfo',
    'addDepartment','updateDepartment','updateDepartmentForStatus',
    'addDuty','updateDuty','updateDutyForStatus'
  )
);

-- ② 备份行数核对(执行删除前人工确认)
SELECT (SELECT COUNT(*) FROM communion.operation_bak_20261028_lockdown) AS op_bak_cnt,
       (SELECT COUNT(*) FROM communion.roleoperation_bak_20261028_lockdown) AS roleop_bak_cnt;
-- 期望: op_bak_cnt=10; roleop_bak_cnt>0(生产实测各角色分散授权含游客)

-- ③ 删除角色授权行(子表先删; 5.6 跨表 DELETE...IN 子查询合法)
DELETE FROM communion.roleoperation
WHERE oid IN (
  SELECT oid FROM communion.operation_bak_20261028_lockdown
);

-- ④ 删除 operation 注册行
DELETE FROM communion.operation
WHERE operation IN (
  'addUser','updateUser','updateUserForAdvance','updateUserForBaseInfo',
  'addDepartment','updateDepartment','updateDepartmentForStatus',
  'addDuty','updateDuty','updateDutyForStatus'
);

-- ⑤ 验证(期望均=0)
SELECT (SELECT COUNT(*) FROM communion.operation WHERE operation IN (
  'addUser','updateUser','updateUserForAdvance','updateUserForBaseInfo',
  'addDepartment','updateDepartment','updateDepartmentForStatus',
  'addDuty','updateDuty','updateDutyForStatus'
)) AS op_left,
(SELECT COUNT(*) FROM communion.roleoperation WHERE oid IN (
  SELECT oid FROM communion.operation_bak_20261028_lockdown
)) AS roleop_left;
