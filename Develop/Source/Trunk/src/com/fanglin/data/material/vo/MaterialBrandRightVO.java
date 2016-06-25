package com.fanglin.data.material.vo;

public class MaterialBrandRightVO implements java.io.Serializable {

	private static final long serialVersionUID = -2471732452681836855L;

	private Integer mbrId;
	
	private String userId;
	
	private String brandId;

	public Integer getMbrId(){
		return this.mbrId;
	}

	public void setMbrId(Integer mbrId){
		this.mbrId = mbrId;
	}

	public String getUserId(){
		return this.userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	public String getBrandId(){
		return this.brandId;
	}

	public void setBrandId(String brandId){
		this.brandId = brandId;
	}

}