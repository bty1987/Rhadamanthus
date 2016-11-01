package com.fanglin.report.vo;

import java.util.Date;

public class CityCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = 668512292231398078L;

	private Long ccdId;
	
	private Integer cid;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;
	
	private Date createDate;

	public Long getCcdId() {
		return this.ccdId;
	}

	public void setCcdId(Long ccdId) {
		this.ccdId = ccdId;
	}

	public Integer getCid() {
		return this.cid;
	}

	public void setCid(Integer cid) {
		this.cid = cid;
	}

	public Integer getNewOrderNum() {
		return this.newOrderNum;
	}

	public void setNewOrderNum(Integer newOrderNum) {
		this.newOrderNum = newOrderNum;
	}

	public Integer getSignOrderNum() {
		return this.signOrderNum;
	}

	public void setSignOrderNum(Integer signOrderNum) {
		this.signOrderNum = signOrderNum;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

}