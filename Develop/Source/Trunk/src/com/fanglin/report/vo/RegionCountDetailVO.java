package com.fanglin.report.vo;

import java.util.Date;

public class RegionCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = -8694444386026523252L;

	private Long rcdId;
	
	private Integer rid;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;
	
	private Date createDate;

	public Long getRcdId() {
		return rcdId;
	}

	public void setRcdId(Long rcdId) {
		this.rcdId = rcdId;
	}

	public Integer getRid() {
		return rid;
	}

	public void setRid(Integer rid) {
		this.rid = rid;
	}

	public Integer getNewOrderNum() {
		return newOrderNum;
	}

	public void setNewOrderNum(Integer newOrderNum) {
		this.newOrderNum = newOrderNum;
	}

	public Integer getSignOrderNum() {
		return signOrderNum;
	}

	public void setSignOrderNum(Integer signOrderNum) {
		this.signOrderNum = signOrderNum;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

}