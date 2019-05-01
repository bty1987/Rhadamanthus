package com.fanglin.inventory.vo;

public class ManifestTemplateVO implements java.io.Serializable {

	private static final long serialVersionUID = 2007729210713616447L;

	private Long mtid;
	
	private String name;
	
	private String comment;
	
	private Short status;

	public Long getMtid() {
		return this.mtid;
	}

	public void setMtid(Long mtid) {
		this.mtid = mtid;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}