package com.fanglin.data.common.vo;

public class PaymentScaleVO {
	
	private Long psid;
	
	private String cid;
	
	private String name;
	
	private String comment;
	
	public PaymentScaleVO() {
		super();
	}

	public Long getPsid() {
		return psid;
	}

	public void setPsid(Long psid) {
		this.psid = psid;
	}

	public String getCid() {
		return cid;
	}

	public void setCid(String cid) {
		this.cid = cid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
