package com.fanglin.production.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class ProductionWorkFlowVO implements Serializable {

	private static final long serialVersionUID = 7769360077315654875L;

	private long pwfid;

	private long pwpid;
	
	private UserBaseVO operator;

	private WorkflowVO workflow;

	private short status;
	
	public ProductionWorkFlowVO() {
		super();
	}

	public ProductionWorkFlowVO(WorkflowVO workflow) {
		super();
		this.workflow = workflow;
	}

	public ProductionWorkFlowVO(UserBaseVO operator, WorkflowVO workflow) {
		super();
		this.operator = operator;
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

	public UserBaseVO getOperator() {
		return operator;
	}

	public void setOperator(UserBaseVO operator) {
		this.operator = operator;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
