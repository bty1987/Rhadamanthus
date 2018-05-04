package com.fanglin.right.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="customersourceright",catalog="platform")
public class CustomerSourceRightPO implements Serializable {

	private static final long serialVersionUID = 847875108829700521L;
	
	public static final String COLUMN_UID_STR="uid";
	
	public static final String COLUMN_COMPANY_STR="company";
	
	public static final int DEPARTMENT_ALL_ENABLE_INT = -1;
	
	private long csdrid;
	
	private Integer uid;
	
	private Integer did;
	
	private Integer company;
	
	public CustomerSourceRightPO(int uid, Integer did, int company){
		super();
		this.uid=uid;
		this.did=did;
		this.company=company;
	}
	
	public CustomerSourceRightPO(){
		super();
	}
	
	@Id
	@GeneratedValue
	@Column(name="csdrid")
	public long getCsdrid() {
		return csdrid;
	}
	public void setCsdrid(long csdrid) {
		this.csdrid = csdrid;
	}
	
	@Column(name="uid")
	public Integer getUid() {
		return uid;
	}
	
	public void setUid(Integer uid) {
		this.uid = uid;
	}
	
	@Column(name="did")
	public Integer getDid() {
		return did;
	}
	public void setDid(Integer did) {
		this.did = did;
	}
	
	@Column(name="company")
	public Integer getCompany() {
		return company;
	}
	public void setCompany(Integer company) {
		this.company = company;
	}
	
	
}
