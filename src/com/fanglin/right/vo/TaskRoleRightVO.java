package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.TaskVO;

public class TaskRoleRightVO implements Serializable {

	private static final long serialVersionUID = -4702665252171333753L;

	private Long trrid;

	private Long rid;

	private TaskVO task;

	public TaskRoleRightVO() {
		super();
	}

	public TaskRoleRightVO(TaskVO task) {
		super();
		this.task = task;
	}

	public Long getTrrid() {
		return trrid;
	}

	public void setTrrid(Long trrid) {
		this.trrid = trrid;
	}

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public TaskVO getTask() {
		return task;
	}

	public void setTask(TaskVO task) {
		this.task = task;
	}

}
