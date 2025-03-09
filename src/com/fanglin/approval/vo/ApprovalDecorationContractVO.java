package com.fanglin.approval.vo;

public class ApprovalDecorationContractVO implements java.io.Serializable {

	private static final long serialVersionUID = -4200325135099700855L;

	private Long adcid;

	private Long aid;

	private String orderId;

	private Long cid;

	public Long getAdcid() {
		return adcid;
	}

	public void setAdcid(Long adcid) {
		this.adcid = adcid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

}
