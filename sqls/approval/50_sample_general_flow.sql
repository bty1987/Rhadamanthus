-- ============================================================
-- 通用审批示例:请假审批(businessType=100)
-- 演示"无业务单据、直接发起"的审批场景
--
-- ⚠️ 部署前替换占位符为真实 userId:
--    {LEADER}      直属上级
--    {DEPT_MGR}    部门经理
--    {GM_1}        总经理A
--    {GM_2}        总经理B
--
-- 节点流转:
--   节点1(串行):直属上级审批
--        ↓ 通过
--   节点2(串行):部门经理审批
--        ↓ 通过
--   节点3(或签):总经理A 或 总经理B,任一通过即可
--        ↓ 通过
--   流程终结(无后置业务,仅更新状态)
--
-- 前端发起入口:任务待办页 → "发起审批" → 选择"请假审批" → 填写表单 → 提交
-- ============================================================

-- 1. 流程定义(businessType=100 标识通用审批)
INSERT INTO `approval`.`approvalFlow`
  (`code`, `name`, `businessType`, `version`, `status`, `company`, `comment`)
VALUES
  ('GENERAL_LEAVE', '请假审批', 100, 1, 0, 0,
   '通用审批示例:直属上级(串行)→部门经理(串行)→总经理(或签)');

SET @flowId = LAST_INSERT_ID();

-- 2. 节点1:直属上级审批(串行)
INSERT INTO `approval`.`approvalFlowNode`
  (`flowId`, `nodeSeq`, `nodeName`, `nodeType`, `approverRule`, `approverData`,
   `passRatio`, `timeoutHours`, `autoAction`, `skipCondition`,
   `preHandler`, `postHandler`, `rejectStrategy`, `status`)
VALUES
  (@flowId, 1, '直属上级审批', 1, 0, '["{LEADER}"]',
   NULL, 48, 0, NULL, NULL, NULL, 0, 0);

-- 3. 节点2:部门经理审批(串行)
INSERT INTO `approval`.`approvalFlowNode`
  (`flowId`, `nodeSeq`, `nodeName`, `nodeType`, `approverRule`, `approverData`,
   `passRatio`, `timeoutHours`, `autoAction`, `skipCondition`,
   `preHandler`, `postHandler`, `rejectStrategy`, `status`)
VALUES
  (@flowId, 2, '部门经理审批', 1, 0, '["{DEPT_MGR}"]',
   NULL, 48, 0, NULL, NULL, NULL, 0, 0);

-- 4. 节点3:总经理审批(或签)
INSERT INTO `approval`.`approvalFlowNode`
  (`flowId`, `nodeSeq`, `nodeName`, `nodeType`, `approverRule`, `approverData`,
   `passRatio`, `timeoutHours`, `autoAction`, `skipCondition`,
   `preHandler`, `postHandler`, `rejectStrategy`, `status`)
VALUES
  (@flowId, 3, '总经理审批(或签)', 3, 0, '["{GM_1}","{GM_2}"]',
   NULL, 72, 0, NULL, NULL, NULL, 0, 0);

-- 5. 表单定义(关联流程)
INSERT INTO `approval`.`approvalForm`
  (`code`, `name`, `flowId`, `status`, `company`, `comment`)
VALUES
  ('GENERAL_LEAVE_FORM', '请假表单', @flowId, 0, 0, '请假天数/事由/附件');

SET @formId = LAST_INSERT_ID();

-- 6. 表单字段
INSERT INTO `approval`.`approvalFormField`
  (`formId`, `fieldKey`, `fieldLabel`, `controlType`, `required`, `defaultValue`, `dataSource`, `validateRule`, `sortOrder`, `status`)
VALUES
  (@formId, 'leaveDays', '请假天数', 3, 1, NULL, NULL, 'require,integer', 0, 0),
  (@formId, 'leaveType', '请假类型', 4, 1, NULL, '事假,病假,年假,调休', 'require', 1, 0),
  (@formId, 'startDate', '开始日期', 5, 1, NULL, NULL, 'require', 2, 0),
  (@formId, 'endDate', '结束日期', 5, 1, NULL, NULL, 'require', 3, 0),
  (@formId, 'reason', '请假事由', 2, 1, NULL, NULL, 'require', 4, 0),
  (@formId, 'attachment', '附件', 8, 0, NULL, NULL, NULL, 5, 0);

-- ============================================================
-- 验证查询
-- ============================================================
-- SELECT f.flowId, f.code, f.name, f.businessType,
--        n.nodeSeq, n.nodeName, n.nodeType, n.approverData,
--        ff.fieldKey, ff.fieldLabel, ff.controlType, ff.required
-- FROM approval.approvalFlow f
-- JOIN approval.approvalFlowNode n ON n.flowId = f.flowId
-- LEFT JOIN approval.approvalForm fm ON fm.flowId = f.flowId
-- LEFT JOIN approval.approvalFormField ff ON ff.formId = fm.formId
-- WHERE f.code = 'GENERAL_LEAVE'
-- ORDER BY n.nodeSeq, ff.sortOrder;
