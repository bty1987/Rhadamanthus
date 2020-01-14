package com.fanglin.production.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "productionworkflow", catalog = "production")
public class ProductionWorkFlowPO implements Serializable {

	private static final long serialVersionUID = 1030940835934617143L;

	public static final String COLUMN_PWPID_STR = "pwpid";

	public static final String COLUMN_WORKFLOW_STR = "workflow.wfid";
	
	public static final Short STATUS_INIT_INT = 0;
	
	public static final Short STATUS_OPERATED_INT = 1;//执行
	
	private Long pwfid;

	private Long pwpid;// productionworkplan 计划工序组

	private WorkflowPO workflow; // 工序
	
	private UserPO operater;//操作人
	
	private Timestamp operateTime;

	private Short status;

	public ProductionWorkFlowPO() {
		super();
	}

	public ProductionWorkFlowPO(WorkflowPO workflow) {
		super();
		this.workflow = workflow;
	}

	@Id
	@GeneratedValue
	@Column(name = "pwfid")
	public Long getPwfid() {
		return pwfid;
	}

	public void setPwfid(Long pwfid) {
		this.pwfid = pwfid;
	}

	@Column(name = "pwpid")
	public Long getPwpid() {
		return pwpid;
	}

	public void setPwpid(Long pwpid) {
		this.pwpid = pwpid;
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
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "status")
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
