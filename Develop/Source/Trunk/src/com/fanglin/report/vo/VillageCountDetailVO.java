package com.fanglin.report.vo;

import java.util.Date;

public class VillageCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = -5561047492197009304L;

	private Long vcdId;
	
	private Integer vid;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;
	
	private Date createDate;

	public Long getVcdId() {
		return vcdId;
	}

	public void setVcdId(Long vcdId) {
		this.vcdId = vcdId;
	}

	public Integer getVid() {
		return vid;
	}

	public void setVid(Integer vid) {
		this.vid = vid;
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