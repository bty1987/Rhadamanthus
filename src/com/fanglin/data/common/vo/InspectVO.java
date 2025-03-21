package com.fanglin.data.common.vo;

import java.io.Serializable;

public class InspectVO implements Serializable {

	private static final long serialVersionUID = 7518904206829850789L;

	private Long iid;

	private String name;

	private Short atttype;

	private Short type;

	private Short status;

	private String content;

	private Integer company;

	public InspectVO() {
		super();
	}

	public InspectVO(Long iid) {
		super();
		this.iid = iid;
	}

	public Long getIid() {
		return iid;
	}

	public void setIid(Long iid) {
		this.iid = iid;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
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

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
