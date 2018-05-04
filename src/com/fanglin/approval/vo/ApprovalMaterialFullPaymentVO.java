package com.fanglin.approval.vo;

public class ApprovalMaterialFullPaymentVO implements java.io.Serializable {

	private static final long serialVersionUID = 5886031564100480704L;

	private Integer amfpId;
	
	private Long aid;
	
	private Long mid;
	
	private Float referMoney;

	public Integer getAmfpId() {
		return amfpId;
	}

	public void setAmfpId(Integer amfpId) {
		this.amfpId = amfpId;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getMid() {
		return mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
	}

	public Float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Float referMoney) {
		this.referMoney = referMoney;
	}


}