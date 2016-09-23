package com.fanglin.approval.vo;

public class ApprovalMaterialRefundVO implements java.io.Serializable {

	private static final long serialVersionUID = 963161255371916154L;

	private Integer amrId;
	
	private Integer aid;
	
	private Long msoId;
	
	private Float refund;
	
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

	public Long getMsoId() {
		return this.msoId;
	}

	public void setMsoId(Long msoId) {
		this.msoId = msoId;
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

}