package com.fanglin.report.vo;

import com.fanglin.system.vo.CityVO;

public class CityCountVO implements java.io.Serializable {

	private static final long serialVersionUID = 5816561838292673612L;

	private Long ccId;
	
	private CityVO city;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;

	public CityCountVO() {
		super();
	}

	public CityCountVO(CityVO city) {
		super();
		this.city = city;
	}

	public Long getCcId() {
		return ccId;
	}

	public void setCcId(Long ccId) {
		this.ccId = ccId;
	}

	public CityVO getCity() {
		return city;
	}

	public void setCity(CityVO city) {
		this.city = city;
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

}