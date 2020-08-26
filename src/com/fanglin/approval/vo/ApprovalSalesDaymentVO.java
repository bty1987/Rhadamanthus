package com.fanglin.approval.vo;

import java.io.Serializable;

public class ApprovalSalesDaymentVO implements Serializable{

	private static final long serialVersionUID = -510097867448690813L;

	private Long sadid;
	
	private Long aid;
	
	private Long sid;

	public Long getSadid() {
		return sadid;
	}
  
	public void setSadid(Long sadid) {
		this.sadid = sadid;
	}
	
	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

}
