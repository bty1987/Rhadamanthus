package com.fanglin.approval.vo;

public class ApprovalMaterialRefundVO implements java.io.Serializable {

	private static final long serialVersionUID = 963161255371916154L;

	private Integer amrId;

	private Long aid;

	private Long mid;

	private Long refund;

	private Long referMoney;

	private Short type;

	public Integer getAmrId() {
		return amrId;
	}

	public void setAmrId(Integer amrId) {
		this.amrId = amrId;
	}

	public Long getAid() {
		return this.aid;
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

	public Long getRefund() {
		return this.refund;
	}

	public void setRefund(Long refund) {
		this.refund = refund;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
	}

}