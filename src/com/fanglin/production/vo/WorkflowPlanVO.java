package com.fanglin.production.vo;

import java.io.Serializable;

public class WorkflowPlanVO implements Serializable {

	private static final long serialVersionUID = 78906200111284042L;

	private Long wfpid;

	private WorkflowVO workflow;

	private WorkplanVO workplan;

	public WorkflowPlanVO() {
		super();
	}

	public WorkflowPlanVO(WorkflowVO workflow, WorkplanVO workplan, WorkshopVO workshopVO) {
		super();
		this.workflow = workflow;
		this.workplan = workplan;
		this.workplan.setWorkshop(workshopVO);
	}

	public WorkflowPlanVO(WorkflowVO workflow, WorkplanVO workplan) {
		super();
		this.workflow = workflow;
		this.workplan = workplan;
	}

	public Long getWfpid() {
		return wfpid;
	}

	public void setWfpid(Long wfpid) {
		this.wfpid = wfpid;
	}

	public WorkflowVO getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkflowVO workflow) {
		this.workflow = workflow;
	}

	public WorkplanVO getWorkplan() {
		return workplan;
	}

	public void setWorkplan(WorkplanVO workplan) {
		this.workplan = workplan;
	}

}
