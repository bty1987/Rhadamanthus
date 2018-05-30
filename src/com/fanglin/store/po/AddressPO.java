package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "address", catalog = "store")
public class AddressPO implements Serializable {

	private static final long serialVersionUID = -2216568102426630778L;

	public static final String COLUMN_UID_STR = "muser.uid";

	public static final Short STATUS_ABLE_SHORT = 0;

	public static final Short STATUS_DEFAULT_SHORT = 1;
	
	public static final Short STATUS_DISABLE_SHORT = 2;

	private long aid;

	private MuserPO muser;
	
	private String name;
	
	private String phone;

	private String address;

	private short status;

	public AddressPO() {
		super();
	}

	public AddressPO(MuserPO Muser) {
		super();
		this.muser = Muser;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public MuserPO getMuser() {
		return muser;
	}

	public void setMuser(MuserPO muser) {
		this.muser = muser;
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

	public void setStatus(Short status) {
		this.status = status;
	}

}
