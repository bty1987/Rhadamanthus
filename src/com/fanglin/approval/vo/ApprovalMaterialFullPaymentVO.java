package com.fanglin.approval.vo;

public class ApprovalMaterialFullPaymentVO implements java.io.Serializable {

	private static final long serialVersionUID = 5886031564100480704L;

	private Integer amfpId;
	
	private Integer aid;
	
	private Long msoId;
	
	private Float referMoney;

	public Integer getAmfpId() {
		return amfpId;
	}

	public void setAmfpId(Integer amfpId) {
		this.amfpId = amfpId;
	}

	public Integer getAid() {
		return aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public Long getMsoId() {
		return msoId;
	}

	public void setMsoId(Long msoId) {
		this.msoId = msoId;
	}

	public Float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Float referMoney) {
		this.referMoney = referMoney;
	}


}