package com.fanglin.report.vo;

import com.fanglin.system.vo.CityProperVO;

public class CityProperCountVO implements java.io.Serializable {

	private static final long serialVersionUID = 443716626972890096L;

	private Long cpcId;
	
	private CityProperVO cityProper;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;

	public CityProperCountVO() {
		super();
	}

	public CityProperCountVO(CityProperVO cityProper) {
		super();
		this.cityProper = cityProper;
	}

	public Long getCpcId() {
		return cpcId;
	}

	public void setCpcId(Long cpcId) {
		this.cpcId = cpcId;
	}

	public CityProperVO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper) {
		this.cityProper = cityProper;
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