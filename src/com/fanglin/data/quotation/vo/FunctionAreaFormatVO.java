package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class FunctionAreaFormatVO implements Serializable {

	private static final long serialVersionUID = 6517283049185273460L;

	private Long ffid;

	private Long fcid;

	private String format;

	private String company;

	private String comment;

	public FunctionAreaFormatVO() {
		super();
	}

	public Long getFfid() {
		return ffid;
	}

	public void setFfid(Long ffid) {
		this.ffid = ffid;
	}

	public Long getFcid() {
		return fcid;
	}

	public void setFcid(Long fcid) {
		this.fcid = fcid;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
