package com.fanglin.approval.vo;

public class ApprovalMaterialRefundVO implements java.io.Serializable {

	private static final long serialVersionUID = 963161255371916154L;

	private Integer amrId;
	
	private Integer aid;
	
	private Long mid;
	
	private Float refund;
	
	private Float referMoney;
	
	private Short type;

	public Integer getAmrId() {
		return amrId;
	}

	public void setAmrId(Integer amrId) {
		this.amrId = amrId;
	}

	public Integer getAid() {
		return this.aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public Long getMid() {
		return mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
	}

	public Float getRefund() {
		return this.refund;
	}

	public void setRefund(Float refund) {
		this.refund = refund;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Float referMoney) {
		this.referMoney = referMoney;
	}

}