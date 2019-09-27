package com.fanglin.approval.vo;

public class ApprovalDecorationHolonomyVO implements java.io.Serializable {

	private static final long serialVersionUID = 1863121293113776602L;

	private Long adhid;

	private Long aid;

	private String orderId;

	private Long materialPrice;

	public Long getAdhid() {
		return adhid;
	}

	public void setAdhid(Long adhid) {
		this.adhid = adhid;
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

	public Long getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(Long materialPrice) {
		this.materialPrice = materialPrice;
	}
}
