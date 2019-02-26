package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalCustomerOriginTDecoration", catalog = "approval")
public class ApprovalCustomerOriginTDecorationPO implements Serializable {

	private static final long serialVersionUID = -4327950869950843118L;

	private long acodid;

	private long aid;

	private long csid;

	private short type;

	private String salesmanType;

	private String houseType;

	private short resourceType;
	
	private String code;
	
	private String forms;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acodid")
	public long getAcodid() {
		return acodid;
	}

	public void setAcodid(long acodid) {
		this.acodid = acodid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "salesmanType")
	public String getSalesmanType() {
		return salesmanType;
	}

	public void setSalesmanType(String salesmanType) {
		this.salesmanType = salesmanType;
	}

	@Column(name = "houseType")
	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	@Column(name = "resourceType")
	public short getResourceType() {
		return resourceType;
	}

	public void setResourceType(short resourceType) {
		this.resourceType = resourceType;
	}

	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "forms")
	public String getForms() {
		return forms;
	}

	public void setForms(String forms) {
		this.forms = forms;
	}

}
