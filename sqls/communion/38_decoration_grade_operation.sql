-- ============================================================================
-- 文件: 38_decoration_grade_operation.sql
-- 库表: communion.operation / communion.roleoperation
-- 用途: 装修单等级修改专用接口 updateDecorationForGrade 权限配置(强权限, 不能所有人都改——2026-11-13):
--       ① operation 登记(through=0 强权限, moduleId=6 装修, logFlag=2 对齐 878 修改装修预付款)
--       ② roleoperation 白名单: 系统管理员(rid=86)×全公司在营公司(103行)——默认最小授权,
--          扩展=按下方模板为指定角色+公司补行(即插即生效, 免重启)
--       接口语义: 五态(初始/定金/预签/重签/签约)装修单修改 grade 等级, 变更留痕 serviceRecord;
--       前端=装修单详情页等级下拉旁"更新"按钮(显隐=operation授权+状态双控)+管理页改等级按钮已切换本接口
--       ⚠️ 旧通道 changeDecorationForAdvance(oid=878 through=1 免检)保持不动——它还承载详情页"保存基本信息"
--          (houseType/houseClass/busitype 等)与收据链, 该接口本身不含 grade 参数(grade 已迁出), 无越权面
-- 执行前置条件:
--       ① decoration jar(含 updateDecorationForGrade)部署后执行亦可(权限先行不报错, 接口未部署时调用404);
--         建议顺序=部署jar→执行本SQL
--       ② 干跑: operation 无 updateDecorationForGrade 行(首跑); rid=86 存在(系统管理员)
-- 回滚方式: DELETE operation 行 + DELETE roleoperation 行(仅限未产生 serviceRecord 依赖前, 权限行可随时回滚)
-- 幂等性: 两段 NOT EXISTS 守卫, 可重复执行
-- 扩展授权模板(为其他角色开通时执行, 替换 rid/company):
--   INSERT INTO communion.roleoperation (rid, oid, cuid, company)
--   SELECT <rid>, o.oid, 0, c.cid FROM communion.operation o, communion.company c
--   WHERE o.operation = 'updateDecorationForGrade' AND c.cid > 0
--     AND NOT EXISTS (SELECT 1 FROM communion.roleoperation ro WHERE ro.oid = o.oid AND ro.rid = <rid> AND ro.company = c.cid);
-- ============================================================================

-- ============ 一、operation 登记(影响行数=1) ============

INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 6, '修改装修单等级', 'updateDecorationForGrade', 0, 0, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM communion.operation WHERE operation = 'updateDecorationForGrade'
);

-- ============ 二、白名单: 系统管理员(rid=86)×全公司在营公司(期望103行) ============

INSERT INTO communion.roleoperation (rid, oid, cuid, company)
SELECT 86, o.oid, 0, c.cid
FROM communion.operation o, communion.company c
WHERE o.operation = 'updateDecorationForGrade' AND c.cid > 0
  AND NOT EXISTS (
    SELECT 1 FROM communion.roleoperation ro
    WHERE ro.oid = o.oid AND ro.rid = 86 AND ro.company = c.cid
  );

-- ============ 验证段 ============

-- 1. operation 行: 期望 through=0
SELECT oid, moduleId, name, operation, through, type, status, system, logFlag
FROM communion.operation WHERE operation = 'updateDecorationForGrade';

-- 2. 白名单行数: 期望=103(86×全公司); 3. 白名单外角色可调性自测: 未授权角色调用返回 -2 无操作权限
SELECT COUNT(*) AS grantRows_expect103 FROM communion.roleoperation ro
JOIN communion.operation o ON o.oid = ro.oid WHERE o.operation = 'updateDecorationForGrade';
