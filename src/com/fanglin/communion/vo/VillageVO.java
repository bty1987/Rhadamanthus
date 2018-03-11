package com.fanglin.communion.vo;

import java.io.Serializable;

import com.fanglin.system.vo.CityProperVO;

public class VillageVO implements Serializable {

	private static final long serialVersionUID = 6573242903839888845L;
	
	private Long vid;

	private String no;

	private String name;

	private CityProperVO cityProper;

	private String developer;

	private String salesPhone;

	private String deliveryTime;
	
	private String rule;

	private String content;
	
	private Double x;
	
	private Double y;
	
	private Short status;
	
	public VillageVO() {
		super();
	}

	public VillageVO(CityProperVO cityProper) {
		super();
		this.cityProper = cityProper;
	}

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public CityProperVO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper) {
		this.cityProper = cityProper;
	}

	public String getDeveloper() {
		return developer;
	}

	public void setDeveloper(String developer) {
		this.developer = developer;
	}

	public String getSalesPhone() {
		return salesPhone;
	}

	public void setSalesPhone(String salesPhone) {
		this.salesPhone = salesPhone;
	}

	public String getDeliveryTime() {
		return deliveryTime;
	}

	public void setDeliveryTime(String deliveryTime) {
		this.deliveryTime = deliveryTime;
	}

	public String getRule() {
		return rule;
	}

	public void setRule(String rule) {
		this.rule = rule;
	}
	
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	
}
