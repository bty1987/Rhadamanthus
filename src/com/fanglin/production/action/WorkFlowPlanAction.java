package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.production.service.WorkFlowPlanService;
import com.fanglin.production.vo.WorkflowPlanVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkFlowPlanAction extends BaseListAction {

	private static final long serialVersionUID = 4985552040824794455L;

	private WorkflowPlanVO workflowPlan;

	private List<WorkflowPlanVO> workflowPlans;

	@Autowired
	private WorkFlowPlanService workFlowPlanService;

	private List<Long> wfids;

	@Action(value = "queryWorkflowPlanByWfid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkflowPlanByWfid() {

		workflowPlans = workFlowPlanService.queryWorkflowPlanByWfid(workflowPlan);

		return SUCCESS;
	}

	@Action(value = "queryWorkflowPlanByWpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkflowPlanByWpid() throws Exception {

		workflowPlans = workFlowPlanService.queryWorkflowPlanByWpid(workflowPlan);

		return SUCCESS;
	}

	@Action(value = "updateWorkflowPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkflowPlan() throws Exception {

		workFlowPlanService.updateWorkflowPlan(workflowPlan, wfids);

		return SUCCESS;
	}

	public WorkflowPlanVO getWorkflowPlan() {
		return workflowPlan;
	}

	public void setWorkflowPlan(WorkflowPlanVO workflowPlan) {
		this.workflowPlan = workflowPlan;
	}

	public List<WorkflowPlanVO> getWorkflowPlans() {
		return workflowPlans;
	}

	public void setWorkflowPlans(List<WorkflowPlanVO> workflowPlans) {
		this.workflowPlans = workflowPlans;
	}

	public List<Long> getWfids() {
		return wfids;
	}

	public void setWfids(List<Long> wfids) {
		this.wfids = wfids;
	}
}
