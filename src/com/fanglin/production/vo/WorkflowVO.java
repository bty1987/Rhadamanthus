package com.fanglin.production.vo;

import java.io.Serializable;

public class WorkflowVO implements Serializable {

	private static final long serialVersionUID = 4007904131452337689L;

	private Long wfid;

	private String name;

	private Short status;

	public WorkflowVO() {
		super();
	}

	public void setWfid(Long wfid) {
		this.wfid = wfid;
	}

	public Long getWfid() {
		return wfid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
