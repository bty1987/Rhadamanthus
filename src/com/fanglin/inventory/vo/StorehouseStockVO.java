package com.fanglin.inventory.vo;

public class StorehouseStockVO implements java.io.Serializable {

	private static final long serialVersionUID = -7595345354718957137L;

	private Long shsId;
	
	private StorehouseVO storehouse;
	
	private String month;
	
	private Float num;

	public StorehouseStockVO() {
		super();
	}

	public StorehouseStockVO(StorehouseVO storehouse) {
		super();
		this.storehouse = storehouse;
	}

	public Long getShsId() {
		return this.shsId;
	}

	public void setShsId(Long shsId) {
		this.shsId = shsId;
	}

	public StorehouseVO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehouseVO storehouse) {
		this.storehouse = storehouse;
	}

	public String getMonth() {
		return this.month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public Float getNum() {
		return this.num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

}