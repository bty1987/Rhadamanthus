package com.fanglin.approval.vo;

public class ApprovalQuotationDiscountVO implements java.io.Serializable {

	private static final long serialVersionUID = 6220700622327921672L;

	private Long aqdid;

	private Long aid;

	private String orderId;

	private Long qid;

	private Integer oldDiscount;

	private Integer newDiscount;

	private Integer basePrice;

	public Long getAqdid() {
		return this.aqdid;
	}

	public void setAqdid(Long aqdid) {
		this.aqdid = aqdid;
	}

	public Long getAid() {
		return this.aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Integer getOldDiscount() {
		return this.oldDiscount;
	}

	public void setOldDiscount(Integer oldDiscount) {
		this.oldDiscount = oldDiscount;
	}

	public Integer getNewDiscount() {
		return this.newDiscount;
	}

	public void setNewDiscount(Integer newDiscount) {
		this.newDiscount = newDiscount;
	}

	public Integer getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(Integer basePrice) {
		this.basePrice = basePrice;
	}

}