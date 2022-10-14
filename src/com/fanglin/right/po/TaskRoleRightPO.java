package com.fanglin.right.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.data.po.TaskPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "taskroleright", catalog = "data")
public class TaskRoleRightPO implements Serializable {

	private static final long serialVersionUID = 5556511370996501114L;

	private long trrid;

	private int rid;

	private TaskPO task;

	private UserPO creater;

	private Timestamp createTime;

	public TaskRoleRightPO() {
		super();
	}

	public TaskRoleRightPO(int rid, TaskPO task, UserPO creater) {

		super();

		this.rid = rid;
		this.task = task;
		this.creater = creater;
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
	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
