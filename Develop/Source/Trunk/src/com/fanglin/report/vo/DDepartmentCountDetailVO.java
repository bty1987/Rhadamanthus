package com.fanglin.report.vo;

import java.util.Date;

public class DDepartmentCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = 929642468468594884L;

	private Long ddcdId;
	
	private Integer ddId;
	
	private String designDepartmentName;
	
	private Integer sdId;
	
	private String salesmanDepartmentName;
	
	private Float createNum;
	
	private Float signNum;
	
	private Float contractPrice;
	
	private Date createDate;

	public Long getDdcdId() {
		return ddcdId;
	}

	public void setDdcdId(Long ddcdId) {
		this.ddcdId = ddcdId;
	}

	public Integer getDdId() {
		return ddId;
	}

	public void setDdId(Integer ddId) {
		this.ddId = ddId;
	}

	public Integer getSdId() {
		return sdId;
	}

	public void setSdId(Integer sdId) {
		this.sdId = sdId;
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

	public String getDesignDepartmentName() {
		return designDepartmentName;
	}

	public void setDesignDepartmentName(String designDepartmentName) {
		this.designDepartmentName = designDepartmentName;
	}

	public String getSalesmanDepartmentName() {
		return salesmanDepartmentName;
	}

	public void setSalesmanDepartmentName(String salesmanDepartmentName) {
		this.salesmanDepartmentName = salesmanDepartmentName;
	}

}