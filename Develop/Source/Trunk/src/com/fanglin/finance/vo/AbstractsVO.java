package com.fanglin.finance.vo;


public class AbstractsVO implements java.io.Serializable {

	private static final long serialVersionUID = -7358730712172481022L;

	private Integer aid;
	
	private Integer ownerId;
	
	private String abstracts;

	public Integer getAid() {
		return aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public Integer getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Integer ownerId) {
		this.ownerId = ownerId;
	}

	public String getAbstracts() {
		return abstracts;
	}

	public void setAbstracts(String abstracts) {
		this.abstracts = abstracts;
	}

}