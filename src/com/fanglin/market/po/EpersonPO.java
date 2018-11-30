package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="eperson", catalog = "market")
public class EpersonPO implements Serializable{
	
	private static final long serialVersionUID = -4719642976229317974L;
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_PINYIN_STR = "pinyin";
	
	public static final String COLUMN_EUID_STR = "euid";
	
	private long euid;
	
	private long cityId;
	
	private String name;
	
	private String pinyin;
	
	private String phone;
	
	private short experience;
	
	private short type;
	
	private String imgUrl;
	
	private String info;

	@Id
	@GeneratedValue
	@Column(name="euid")
	public long getEuid() {
		return euid;
	}

	public void setEuid(long euid) {
		this.euid = euid;
	}

	@Column(name="cityId")
	public long getCityId() {
		return cityId;
	}

	public void setCityId(long cityId) {
		this.cityId = cityId;
	}

	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name="pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name="phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name="experience")
	public short getExperience() {
		return experience;
	}

	public void setExperience(short experience) {
		this.experience = experience;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="imgUrl")
	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

	@Column(name="info")
	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}
	
}
