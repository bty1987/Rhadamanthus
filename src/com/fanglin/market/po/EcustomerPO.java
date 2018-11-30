package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="ecustomer", catalog = "market")
public class EcustomerPO implements Serializable{

	private static final long serialVersionUID = -1732240735648022167L;

	private long ecid;
	
	private long cityId;
	
	private String name;
	
	private String phone;
	
	private String villageName;
	
	private float area;
	
	public EcustomerPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name="ecid")
	public long getEcid() {
		return ecid;
	}

	public void setEcid(long ecid) {
		this.ecid = ecid;
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

	@Column(name="phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name="villageName")
	public String getVillageName() {
		return villageName;
	}

	public void setVillageName(String villageName) {
		this.villageName = villageName;
	}

	@Column(name="area")
	public float getArea() {
		return area;
	}

	public void setArea(float area) {
		this.area = area;
	}
	
}
