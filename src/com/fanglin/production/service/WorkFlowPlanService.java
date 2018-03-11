package com.fanglin.production.service;

import java.util.List;

import com.fanglin.production.vo.WorkflowPlanVO;

public interface WorkFlowPlanService {
	
	public List<WorkflowPlanVO> queryWorkflowPlanByWfid(WorkflowPlanVO  workflowPlanVO);

	public List<WorkflowPlanVO> queryWorkflowPlanByWpid(WorkflowPlanVO  workflowPlanVO);

	public int updateWorkflowPlan(WorkflowPlanVO workflowPlanVO,List<Long> wfids) throws Exception;
}
