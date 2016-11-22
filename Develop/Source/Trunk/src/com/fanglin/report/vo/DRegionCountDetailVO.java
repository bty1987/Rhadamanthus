package com.fanglin.report.vo;

import java.util.Date;

public class DRegionCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = 5239091659798741588L;

	private Long drcdId;
	
	private Integer ddId;
	
	private String designRegionName;
	
	private Integer sdId;
	
	private String salemanRegionName;
	
	private Float createNum;
	
	private Float signNum;
	
	private Float contractPrice;
	
	private Date createDate;

	public Long getDrcdId() {
		return drcdId;
	}

	public void setDrcdId(Long drcdId) {
		this.drcdId = drcdId;
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

	public String getDesignRegionName() {
		return designRegionName;
	}

	public void setDesignRegionName(String designRegionName) {
		this.designRegionName = designRegionName;
	}

	public String getSalemanRegionName() {
		return salemanRegionName;
	}

	public void setSalemanRegionName(String salemanRegionName) {
		this.salemanRegionName = salemanRegionName;
	}

}