-- ============================================================
-- P4 试点:装饰合同审批(type=24)流程定义示例
-- 演示串行 + 或签 + 并签三种节点模式的配置方式
--
-- ⚠️ 部署前请替换下面占位符为真实 userId:
--    {DESIGN_DIRECTOR}    设计部主管
--    {OPERATION_MANAGER}  运营经理
--    {GENERAL_MANAGER_1}  总经理A
--    {GENERAL_MANAGER_2}  总经理B
--
-- 节点流转:
--   节点1(串行):设计部主管审批
--        ↓ 通过
--   节点2(或签):运营经理A 或 运营经理B,任一通过即可
--        ↓ 通过
--   节点3(并签):总经理A 与 总经理B 全部通过
--        ↓ 全部通过
--   流程终结 → 触发 postHandler:DecorationContractServiceImpl.approveForDecorationContract
-- ============================================================

-- 1. 流程定义
INSERT INTO `approval`.`approvalFlow`
  (`code`, `name`, `businessType`, `version`, `status`, `company`, `comment`)
VALUES
  ('DECORATION_CONTRACT', '装饰合同审批', 24, 1, 0, 0,
   'P4试点:设计部主管(串行)→运营经理(或签)→总经理(并签)');

-- 假设上面插入的 flowId = @flowId
SET @flowId = LAST_INSERT_ID();

-- 2. 节点1:设计部主管审批(串行,单审批人)
INSERT INTO `approval`.`approvalFlowNode`
  (`flowId`, `nodeSeq`, `nodeName`, `nodeType`, `approverRule`, `approverData`,
   `passRatio`, `timeoutHours`, `autoAction`, `skipCondition`,
   `preHandler`, `postHandler`, `rejectStrategy`, `status`)
VALUES
  (@flowId, 1, '设计部主管审批', 1, 0, '["{DESIGN_DIRECTOR}"]',
   NULL, 48, 0, NULL,
   NULL, NULL, 0, 0);

-- 3. 节点2:运营经理审批(或签,任一通过)
INSERT INTO `approval`.`approvalFlowNode`
  (`flowId`, `nodeSeq`, `nodeName`, `nodeType`, `approverRule`, `approverData`,
   `passRatio`, `timeoutHours`, `autoAction`, `skipCondition`,
   `preHandler`, `postHandler`, `rejectStrategy`, `status`)
VALUES
  (@flowId, 2, '运营经理审批(或签)', 3, 0, '["{OPERATION_MANAGER_1}","{OPERATION_MANAGER_2}"]',
   NULL, 48, 0, NULL,
   NULL, NULL, 0, 0);

-- 4. 节点3:总经理审批(并签,全部通过)
INSERT INTO `approval`.`approvalFlowNode`
  (`flowId`, `nodeSeq`, `nodeName`, `nodeType`, `approverRule`, `approverData`,
   `passRatio`, `timeoutHours`, `autoAction`, `skipCondition`,
   `preHandler`, `postHandler`, `rejectStrategy`, `status`)
VALUES
  (@flowId, 3, '总经理审批(并签)', 2, 0, '["{GENERAL_MANAGER_1}","{GENERAL_MANAGER_2}"]',
   NULL, 72, 0, NULL,
   NULL,
   'com.fanglin.approval.service.impl.ApprovalDecorationContractServiceImpl#approveForDecorationContract',
   0, 0);

-- ============================================================
-- 验证查询(部署后执行确认)
-- ============================================================
-- SELECT f.flowId, f.code, f.name, f.businessType, f.status,
--        n.nodeSeq, n.nodeName, n.nodeType, n.approverData, n.postHandler
-- FROM approval.approvalFlow f
-- JOIN approval.approvalFlowNode n ON n.flowId = f.flowId
-- WHERE f.code = 'DECORATION_CONTRACT'
-- ORDER BY n.nodeSeq;
