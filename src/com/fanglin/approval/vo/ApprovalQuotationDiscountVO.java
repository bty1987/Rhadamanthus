package com.fanglin.approval.vo;

public class ApprovalQuotationDiscountVO implements java.io.Serializable {

	private static final long serialVersionUID = 6220700622327921672L;

	private Integer aqdId;
	
	private Integer aid;
	
	private String orderId;
	
	private Long quotationId;
	
	private Float oldDiscount;
	
	private Float newDiscount;

	public Integer getAqdId() {
		return this.aqdId;
	}

	public void setAqdId(Integer aqdId) {
		this.aqdId = aqdId;
	}

	public Integer getAid() {
		return this.aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getQuotationId() {
		return this.quotationId;
	}

	public void setQuotationId(Long quotationId) {
		this.quotationId = quotationId;
	}

	public Float getOldDiscount() {
		return this.oldDiscount;
	}

	public void setOldDiscount(Float oldDiscount) {
		this.oldDiscount = oldDiscount;
	}

	public Float getNewDiscount() {
		return this.newDiscount;
	}

	public void setNewDiscount(Float newDiscount) {
		this.newDiscount = newDiscount;
	}

}