package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.TaskVO;

public class TaskUserRightVO implements Serializable {

	private static final long serialVersionUID = -5647348223813794049L;
	
	private Long tuid;
	
	private Integer uid;
	
	private TaskVO task;
	
	private Integer company;

	public Long getTuid() {
		return tuid;
	}

	public void setTuid(Long tuid) {
		this.tuid = tuid;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public TaskVO getTask() {
		return task;
	}

	public void setTask(TaskVO task) {
		this.task = task;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	} 
	
}
