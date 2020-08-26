package com.fanglin.right.po;

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

import com.fanglin.data.po.TaskPO;

@Entity
@Table(name = "taskroleright", catalog = "data")
public class TaskRoleRightPO implements Serializable {

	private static final long serialVersionUID = 5556511370996501114L;

	private long trrid;

	private long rid;

	private TaskPO task;

	public TaskRoleRightPO() {
		super();
	}

	public TaskRoleRightPO(long rid, TaskPO task) {
		super();
		this.rid = rid;
		this.task = task;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "trrid")
	public long getTrrid() {
		return trrid;
	}

	public void setTrrid(long trrid) {
		this.trrid = trrid;
	}

	@Column(name = "rid")
	public long getRid() {
		return rid;
	}

	public void setRid(long rid) {
		this.rid = rid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tid", referencedColumnName = "tid")
	public TaskPO getTask() {
		return task;
	}

	public void setTask(TaskPO task) {
		this.task = task;
	}

}
