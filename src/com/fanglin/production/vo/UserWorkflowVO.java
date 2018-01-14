package com.fanglin.production.vo;

import java.io.Serializable;

import com.fanglin.production.vo.WorkflowVO;

public class UserWorkflowVO implements Serializable{

	private static final long serialVersionUID = -5416324484664173951L;
	
	private Long uwid;
	
	private Long uid;
	
	private WorkflowVO workflow;
	
	public UserWorkflowVO() {
		super();
		
	}
	public UserWorkflowVO(WorkflowVO workflow) {
		super();
		this.workflow = workflow ;
		
	}

	public Long getUwid() {
		return uwid;
	}

	public void setUwid(Long uwid) {
		this.uwid = uwid;
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public WorkflowVO getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkflowVO workflow) {
		this.workflow = workflow;
	}
	
	
}
