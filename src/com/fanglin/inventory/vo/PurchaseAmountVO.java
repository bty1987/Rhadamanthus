package com.fanglin.inventory.vo;

public class PurchaseAmountVO implements java.io.Serializable {

	private static final long serialVersionUID = -4972158168590827580L;

	private Long paId;
	
	private String month;
	
	private Float money;

	public Long getPaId() {
		return this.paId;
	}

	public void setPaId(Long paId) {
		this.paId = paId;
	}

	public String getMonth() {
		return this.month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public Float getMoney() {
		return this.money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

}