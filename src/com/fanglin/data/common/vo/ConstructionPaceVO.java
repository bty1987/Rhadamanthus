package com.fanglin.data.common.vo;

import java.io.Serializable;

public class ConstructionPaceVO implements Serializable {

	private static final long serialVersionUID = 7650786358582409834L;

	private Long cpid;

	private String name;

	private Short status; // 0: 启用, 1: 禁用

	private String content;

	public ConstructionPaceVO() {
		super();
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
