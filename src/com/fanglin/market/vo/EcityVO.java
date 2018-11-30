package com.fanglin.market.vo;

import java.io.Serializable;

public class EcityVO implements Serializable{
	
	private static final long serialVersionUID = 8887725467980821037L;

	private Long ecid;
	
	private String city;
	
	private String pinyin;
	
	private Double x;
	
	private Double y;

	public EcityVO() {
		super();
	}

	public Long getEcid() {
		return ecid;
	}

	public void setEcid(Long ecid) {
		this.ecid = ecid;
	}

	public String getCity() {
		return city;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public Double getX() {
		return x;
	}

	public void setX(Double x) {
		this.x = x;
	}

	public Double getY() {
		return y;
	}

	public void setY(Double y) {
		this.y = y;
	}
	
}
