package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DecorationMeasureRuleVO implements Serializable {

	private static final long serialVersionUID = 1289031066363118974L;

	private Long dmid;

	private String name;

	private Short status;

	private String comment;

	public DecorationMeasureRuleVO() {
		super();
	}

	public Long getDmid() {
		return dmid;
	}

	public void setDmid(Long dmid) {
		this.dmid = dmid;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
