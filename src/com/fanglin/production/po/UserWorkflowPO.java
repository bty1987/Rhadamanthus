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
@Table(name = "userWorkflow", catalog = "production")
public class UserWorkflowPO implements Serializable {

	private static final long serialVersionUID = -412416657174336405L;

	public static final String COLUMN_UID_STR = "uid";

	private long uwid;

	private long uid;

	private WorkflowPO workflow;

	public UserWorkflowPO() {
		super();
	}

	public UserWorkflowPO(long uid, WorkflowPO workflow) {
		super();
		this.uid = uid;
		this.workflow = workflow;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "uwid")
	public long getUwid() {
		return uwid;
	}

	public void setUwid(long uwid) {
		this.uwid = uwid;
	}

	@Column(name = "uid")
	public long getUid() {
		return uid;
	}

	public void setUid(long uid) {
		this.uid = uid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wfid", referencedColumnName = "wfid")
	public WorkflowPO getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkflowPO workflow) {
		this.workflow = workflow;
	}

}
