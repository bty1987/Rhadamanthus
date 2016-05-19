package com.fanglin.report.vo;

public class MaterialBrandCountVO implements java.io.Serializable {

	private static final long serialVersionUID = -2004458348597433934L;

	private Integer mbcId;
	
	private String materialBrand;
	
	private String createTime;
	
	private Float total;

	public Integer getMbcId() {
		return mbcId;
	}

	public void setMbcId(Integer mbcId) {
		this.mbcId = mbcId;
	}

	public String getMaterialBrand() {
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand) {
		this.materialBrand = materialBrand;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

}