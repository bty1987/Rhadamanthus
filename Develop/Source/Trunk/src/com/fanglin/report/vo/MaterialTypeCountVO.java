package com.fanglin.report.vo;

public class MaterialTypeCountVO implements java.io.Serializable {

	private static final long serialVersionUID = -1333201432486306386L;

	private Integer mtcId;
	
	private String materialType;
	
	private String createTime;
	
	private Float total;

	public Integer getMtcId() {
		return mtcId;
	}

	public void setMtcId(Integer mtcId) {
		this.mtcId = mtcId;
	}

	public String getMaterialType() {
		return materialType;
	}

	public void setMaterialType(String materialType) {
		this.materialType = materialType;
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