package com.fanglin.right.vo;

import java.util.List;

import com.fanglin.communion.vo.BrandVO;

public class BrandUserRightVO implements java.io.Serializable {

	private static final long serialVersionUID = -7452577383481408006L;

	private Integer burId;
	
	private Integer uid;
	
	private String brandId;
	
	private List<BrandVO> brands;

	public Integer getBurId() {
		return burId;
	}

	public void setBurId(Integer burId) {
		this.burId = burId;
	}
	
	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public String getBrandId() {
		return brandId;
	}

	public void setBrandId(String brandId) {
		this.brandId = brandId;
	}

	public List<BrandVO> getBrands() {
		return brands;
	}

	public void setBrands(List<BrandVO> brands) {
		this.brands = brands;
	}
	
}