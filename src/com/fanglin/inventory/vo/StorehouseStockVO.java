package com.fanglin.inventory.vo;

public class StorehouseStockVO implements java.io.Serializable {

	private static final long serialVersionUID = -7595345354718957137L;

	private Long shsid;
	
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

	public Long getShsid() {
		return this.shsid;
	}

	public void setShsid(Long shsid) {
		this.shsid = shsid;
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