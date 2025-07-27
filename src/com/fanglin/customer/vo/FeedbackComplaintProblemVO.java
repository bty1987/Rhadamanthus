package com.fanglin.customer.vo;

import java.io.Serializable;

public class FeedbackComplaintProblemVO implements Serializable {

	private static final long serialVersionUID = -2008387550886181982L;

	private Long fcpid;

	private String name;

	private Long parentId;

	private Short level;

	public FeedbackComplaintProblemVO() {
		super();
	}

	public Long getFcpid() {
		return fcpid;
	}

	public void setFcpid(Long fcpid) {
		this.fcpid = fcpid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public Short getLevel() {
		return level;
	}

	public void setLevel(Short level) {
		this.level = level;
	}
}
