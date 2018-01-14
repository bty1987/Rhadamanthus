package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="workflowplan",catalog= "production")
public class WorkflowPlanPO implements Serializable{
	
	private static final long serialVersionUID = -6551143213986337841L;
	
	public  static final String  WORKFLOW_WFID = "workflow.wfid";
	
	public  static final String  WORKFLOWPLAN_WPID = "workplan.wpid";
	
	public  static final String  WORKFLOWPLAN_WFPID = "wfpid";
	
	private long wfpid ;
	
	private WorkflowPO  workflow;
	
	private WorkplanPO  workplan;
	
	public WorkflowPlanPO (){
		super();
	}
	
	public WorkflowPlanPO (WorkflowPO  workflow ,WorkplanPO  workplan){
		super();
		this.workflow = workflow ;
		this.workplan = workplan ;
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="wfpid")
	public long getWfpid() {
		return wfpid;
	}

	public void setWfpid(long wfpid) {
		this.wfpid = wfpid;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wfid", referencedColumnName = "wfid")
	public WorkflowPO getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkflowPO workflow) {
		this.workflow = workflow;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wpid", referencedColumnName = "wpid")
	public WorkplanPO getWorkplan() {
		return workplan;
	}

	public void setWorkplan(WorkplanPO workplan) {
		this.workplan = workplan;
	}
	
}
