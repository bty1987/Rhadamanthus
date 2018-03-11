package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.WorkflowPlanPO;

public interface WorkflowPlanDao extends Dao<WorkflowPlanPO> {
	
	public List<WorkflowPlanPO> queryWorkflowPlanByWfid(Long wfid);
	
	public List<WorkflowPlanPO> queryWorkflowPlanByWpid(Long wpid);
	public int deleteWorkflowPlan(Long wpid);
}
