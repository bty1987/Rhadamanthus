package com.fanglin.data.common.vo;

public class BrandUserRightVO implements java.io.Serializable {

	private static final long serialVersionUID = -7452577383481408006L;

	private Integer burId;
	
	private String userId;
	
	private BrandVO brand;

	public BrandUserRightVO() {
		super();
	}

	public BrandUserRightVO(BrandVO brand) {
		super();
		this.brand = brand;
	}

	public Integer getBurId() {
		return burId;
	}

	public void setBurId(Integer burId) {
		this.burId = burId;
	}
	
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}
	
}