-- =====================================================================
-- 61_belong_tran_operation.sql
-- 用途: 离职归属移交4端点登记 communion.operation, through=0 强权限(移交=批量高危写,
--       未授权角色点击将被拦截器拒; 授权走 roleoperation(rid,oid,company) 常规页面配权)
--       登记即生效, 未登记时=放行(OperationServiceImpl:274), 故本脚本必须在 jar 部署前执行
-- 执行前置: communion 库; 无表结构依赖
-- 回滚方式: DELETE FROM communion.operation WHERE operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger','submitApprovalForBelongTran','queryApprovalBelongTranByAId');
-- 验证语句: SELECT operation, name, through FROM communion.operation WHERE operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger','submitApprovalForBelongTran','queryApprovalBelongTranByAId'); -- 期望4行 through=0
-- 幂等: NOT EXISTS 守卫
-- =====================================================================

INSERT INTO communion.operation (operation, name, through, type, status, system) SELECT 'queryDecorationBelongForTran', '离职移交-候选人员查询', 0, 0, 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'queryDecorationBelongForTran');

INSERT INTO communion.operation (operation, name, through, type, status, system) SELECT 'pageDecorationForTranByBelonger', '离职移交-名下装修单查询', 0, 0, 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'pageDecorationForTranByBelonger');

INSERT INTO communion.operation (operation, name, through, type, status, system) SELECT 'submitApprovalForBelongTran', '离职移交-提交审批', 0, 0, 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'submitApprovalForBelongTran');

INSERT INTO communion.operation (operation, name, through, type, status, system) SELECT 'queryApprovalBelongTranByAId', '离职移交-审批明细查询', 0, 0, 0, 1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'queryApprovalBelongTranByAId');
