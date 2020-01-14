package com.fanglin.right.po;

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
@Table(name = "taskuserright", catalog = "platform")
public class TaskUserRightPO {

	private long tuid;
	
	private int uid;
	
	private TaskPO task;
	
	private int company;
	
	public TaskUserRightPO() {
		super();
	}

	public TaskUserRightPO(int uid, TaskPO task, int company) {
		super();
		this.uid = uid;
		this.task = task;
		this.company = company;
	}

	@Id
	@GeneratedValue
	@Column(name="tuid")
	public long getTuid() {
		return tuid;
	}

	public void setTuid(long tuid) {
		this.tuid = tuid;
	}

	@Column(name="uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="tid", referencedColumnName="tid")
	public TaskPO getTask() {
		return task;
	}

	public void setTask(TaskPO task) {
		this.task = task;
	}

	@Column(name="company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
}
