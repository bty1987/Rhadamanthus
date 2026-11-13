-- 用途说明: 离职移交重构(配置挂每条装修单→缓存→按人分组串行发起审批)后, 旧移交专用查询端点已删除
--          (queryDecorationBelongForTran/pageDecorationForTranByBelonger, 代码见 91ea13721 引入、本次重构移除),
--          61号SQL为其登记的 operation 授权行成为死行; 本脚本可选清理, 不执行不影响任何功能
--          (operation 行按请求名匹配, 端点已删则无请求命中, 纯残留)。
--          保留端点 submitApprovalForBelongTran / queryApprovalBelongTranByAId 的授权行勿动。
-- 执行前置条件: decoration jar 已部署本次重构版(两端点已下线); 仅 communion 库
-- 回滚方式: 重跑 sqls/approval/61_belong_tran_operation.sql (NOT EXISTS 幂等, 会补回这两行)
-- 验证语句: SELECT operation, name, through FROM communion.operation WHERE operation IN ('queryDecorationBelongForTran','pageDecorationForTranByBelonger'); -- 期望0行

DELETE FROM communion.roleoperation WHERE operation IN ('queryDecorationBelongForTran', 'pageDecorationForTranByBelonger');

DELETE FROM communion.operation WHERE operation IN ('queryDecorationBelongForTran', 'pageDecorationForTranByBelonger');
