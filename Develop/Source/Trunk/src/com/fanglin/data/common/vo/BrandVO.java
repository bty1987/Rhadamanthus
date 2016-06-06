package com.fanglin.data.common.vo;

public class BrandVO implements java.io.Serializable {

	private static final long serialVersionUID = -7415918438727720875L;

	private Long bid;
	
	private String brandId;
	
	private String brandName;
	
	private String brandNamePinyin;
	
	private Long cid;
	
	private String categoryId;
	
	private String categoryName;
	
	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getBrandId() {
		return brandId;
	}

	public void setBrandId(String brandId) {
		this.brandId = brandId;
	}

	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	public String getBrandNamePinyin() {
		return brandNamePinyin;
	}

	public void setBrandNamePinyin(String brandNamePinyin) {
		this.brandNamePinyin = brandNamePinyin;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

}