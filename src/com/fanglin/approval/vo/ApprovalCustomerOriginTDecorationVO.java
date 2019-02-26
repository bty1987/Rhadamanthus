package com.fanglin.approval.vo;

import java.io.Serializable;

public class ApprovalCustomerOriginTDecorationVO implements Serializable {

	private static final long serialVersionUID = 5937990438453637182L;

	private Long acodid;

	private Long aid;

	private Long csid;

	private Short type;

	private String salesmanType;

	private String houseType;

	private Short resourceType;

	public Long getAcodid() {
		return acodid;
	}

	public void setAcodid(Long acodid) {
		this.acodid = acodid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getSalesmanType() {
		return salesmanType;
	}

	public void setSalesmanType(String salesmanType) {
		this.salesmanType = salesmanType;
	}

	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public Short getResourceType() {
		return resourceType;
	}

	public void setResourceType(Short resourceType) {
		this.resourceType = resourceType;
	}

}
