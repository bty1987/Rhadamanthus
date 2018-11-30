package com.fanglin.market.vo;

import java.io.Serializable;

public class EpersonVO implements Serializable{
	
	private static final long serialVersionUID = -9090763144000740025L;

	private Long euid;
	
	private Long cityId;
	
	private String name;
	
	private String pinyin;
	
	private String phone;
	
	private Short experience;
	
	private Short type;
	
	private String imgUrl;
	
	private String info;

	public Long getEuid() {
		return euid;
	}

	public void setEuid(Long euid) {
		this.euid = euid;
	}

	public Long getCityId() {
		return cityId;
	}

	public void setCityId(Long cityId) {
		this.cityId = cityId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Short getExperience() {
		return experience;
	}

	public void setExperience(Short experience) {
		this.experience = experience;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}
	
}
