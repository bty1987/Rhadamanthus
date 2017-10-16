package com.fanglin.production.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "workshop", catalog = "production")
public class WorkshopPO implements Serializable{

	private static final long serialVersionUID = 2653901827862236789L;

	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final short STATUS_ENABLE_SHORT = 0;
	
	private long wsid;
	
	private String name;
	
	private short status;
	
	private int company;

	@Id
	@GeneratedValue
	@Column(name = "wsid")
	public long getWsid() {
		return wsid;
	}

	public void setWsid(long wsid) {
		this.wsid = wsid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
