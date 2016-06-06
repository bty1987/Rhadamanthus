package com.fanglin.data.common.vo;

public class CategoryVO implements java.io.Serializable {

	private static final long serialVersionUID = 3848977556963217583L;

	private Long cid;
	
	private String categoryId;
	
	private String categoryName;

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