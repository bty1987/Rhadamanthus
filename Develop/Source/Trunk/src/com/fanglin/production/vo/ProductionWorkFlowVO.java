package com.fanglin.production.vo;

import java.io.Serializable;

public class ProductionWorkFlowVO implements Serializable{

	private static final long serialVersionUID = 7769360077315654875L;
	
	private long pwfid;
	
	private long pwpid;
	
	private WorkflowVO workflow;

	public ProductionWorkFlowVO() {
		super();
	}

	public ProductionWorkFlowVO(WorkflowVO workflow) {
		super();
		this.workflow = workflow;
	}

	public long getPwfid() {
		return pwfid;
	}

	public void setPwfid(long pwfid) {
		this.pwfid = pwfid;
	}

	public long getPwpid() {
		return pwpid;
	}

	public void setPwpid(long pwpid) {
		this.pwpid = pwpid;
	}

	public WorkflowVO getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkflowVO workflow) {
		this.workflow = workflow;
	}

}
