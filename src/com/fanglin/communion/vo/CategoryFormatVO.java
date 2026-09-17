package com.fanglin.communion.vo;

import java.io.Serializable;

public class CategoryFormatVO implements Serializable {

	private static final long serialVersionUID = 1289430185672504433L;

	private Long cfid;

	private Long cid;

	private String format;

	private String comment;

	public CategoryFormatVO() {
		super();
	}

	public Long getCfid() {
		return cfid;
	}

	public void setCfid(Long cfid) {
		this.cfid = cfid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
