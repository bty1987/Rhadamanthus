package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "address", catalog = "store")
public class AddressPO implements Serializable {

	private static final long serialVersionUID = -2216568102426630778L;

	public static final String COLUMN_UID_STR = "uid";

	public static final Short STATUS_ABLE_SHORT = 0;

	public static final Short STATUS_DEFAULT_SHORT = 1;

	public static final Short STATUS_DISABLE_SHORT = 2;

	private long aid;

	private long uid;

	private String name;

	private String phone;

	private String province;

	private String city;

	private String proper;

	private String address;

	private short status;

	public AddressPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	@Column(name = "uid")
	public long getUid() {
		return uid;
	}

	public void setUid(long uid) {
		this.uid = uid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "province")
	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	@Column(name = "city")
	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Column(name = "proper")
	public String getProper() {
		return proper;
	}

	public void setProper(String proper) {
		this.proper = proper;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "status")
	public Short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
