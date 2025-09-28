package com.fanglin.personel.vo;

import java.io.Serializable;

public class SupplierContractProductVO implements Serializable {

	private static final long serialVersionUID = -3873476866237850519L;

	private Long scpid;

	private Long scid;

	private String name;

	private String warranTime; // 质保期

	private String warranty;

	private String category;

	private String brand;

	public SupplierContractProductVO() {
		super();
	}

	public Long getScpid() {
		return scpid;
	}

	public void setScpid(Long scpid) {
		this.scpid = scpid;
	}

	public Long getScid() {
		return scid;
	}

	public void setScid(Long scid) {
		this.scid = scid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getWarranTime() {
		return warranTime;
	}

	public void setWarranTime(String warranTime) {
		this.warranTime = warranTime;
	}

	public String getWarranty() {
		return warranty;
	}

	public void setWarranty(String warranty) {
		this.warranty = warranty;
	}

}
