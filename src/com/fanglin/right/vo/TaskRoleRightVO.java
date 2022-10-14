package com.fanglin.right.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.TaskVO;
import com.fanglin.personel.vo.UserBaseVO;

public class TaskRoleRightVO implements Serializable {

	private static final long serialVersionUID = -4702665252171333753L;

	private Long trrid;

	private Integer rid;

	private TaskVO task;

	private UserBaseVO creater;

	private Timestamp createTime;

	public TaskRoleRightVO() {
		super();
	}

	public TaskRoleRightVO(TaskVO task, UserBaseVO creater) {
		super();
		this.task = task;
		this.creater = creater;
	}

	public Long getTrrid() {
		return trrid;
	}

	public void setTrrid(Long trrid) {
		this.trrid = trrid;
	}

	public Integer getRid() {
		return rid;
	}

	public void setRid(Integer rid) {
		this.rid = rid;
	}

	public TaskVO getTask() {
		return task;
	}

	public void setTask(TaskVO task) {
		this.task = task;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
