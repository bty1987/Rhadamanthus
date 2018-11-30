package com.fanglin.market.vo;

import java.io.Serializable;

public class EcustomerVO implements Serializable {
	
	private static final long serialVersionUID = -7223750187339405940L;

	private Long ecid;
	
	private Long cityId;
	
	private String name;
	
	private String phone;
	
	private String villageName;
	
	private Float area;

	public EcustomerVO() {
		super();
	}

	public Long getEcid() {
		return ecid;
	}

	public void setEcid(Long ecid) {
		this.ecid = ecid;
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

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getVillageName() {
		return villageName;
	}

	public void setVillageName(String villageName) {
		this.villageName = villageName;
	}

	public Float getArea() {
		return area;
	}

	public void setArea(Float area) {
		this.area = area;
	}

}
