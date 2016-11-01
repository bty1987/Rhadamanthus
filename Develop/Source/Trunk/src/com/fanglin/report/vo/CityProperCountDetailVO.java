package com.fanglin.report.vo;

import java.util.Date;

public class CityProperCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = -2940275377190785119L;

	private Long cpcdId;
	
	private Integer cpId;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;
	
	private Date createDate;

	public Long getCpcdId() {
		return cpcdId;
	}

	public void setCpcdId(Long cpcdId) {
		this.cpcdId = cpcdId;
	}

	public Integer getCpId() {
		return cpId;
	}

	public void setCpId(Integer cpId) {
		this.cpId = cpId;
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