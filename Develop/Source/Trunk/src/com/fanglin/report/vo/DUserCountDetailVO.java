package com.fanglin.report.vo;

import java.util.Date;

public class DUserCountDetailVO implements java.io.Serializable {
	
	private static final long serialVersionUID = 5346238041428533130L;

	private Long ducdId;
	
	private Integer duId;
	
	private String designerName;
	
	private Integer suId;
	
	private String salesmanName;
	
	private Float createNum;
	
	private Float signNum;
	
	private Float contractPrice;
	
	private Date createDate;

	public Long getDucdId() {
		return ducdId;
	}

	public void setDucdId(Long ducdId) {
		this.ducdId = ducdId;
	}

	public Integer getDuId() {
		return duId;
	}

	public void setDuId(Integer duId) {
		this.duId = duId;
	}

	public Integer getSuId() {
		return suId;
	}

	public void setSuId(Integer suId) {
		this.suId = suId;
	}

	public Float getCreateNum() {
		return createNum;
	}

	public void setCreateNum(Float createNum) {
		this.createNum = createNum;
	}

	public Float getSignNum() {
		return signNum;
	}

	public void setSignNum(Float signNum) {
		this.signNum = signNum;
	}

	public Float getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Float contractPrice) {
		this.contractPrice = contractPrice;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getDesignerName() {
		return designerName;
	}

	public void setDesignerName(String designerName) {
		this.designerName = designerName;
	}

	public String getSalesmanName() {
		return salesmanName;
	}

	public void setSalesmanName(String salesmanName) {
		this.salesmanName = salesmanName;
	}

}