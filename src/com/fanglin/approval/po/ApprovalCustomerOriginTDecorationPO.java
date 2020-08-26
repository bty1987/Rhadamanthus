package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "approvalCustomerOriginTDecoration", catalog = "approval")
public class ApprovalCustomerOriginTDecorationPO implements Serializable {

	private static final long serialVersionUID = -4327950869950843118L;

	private long acodid;

	private long aid;

	private CustomerOriginPO customerOrigin;

	private short type;

	private String salesmanType;

	private String houseType;

	private String houseClass;

	private short resourceType;

	private UserPO salesman;
	
	private short typeness;

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

	@ManyToOne
	@JoinColumn(nullable = true, name = "csid", referencedColumnName = "coid")
	public CustomerOriginPO getCustomerOrigin() {
		return customerOrigin;
	}

	public void setCustomerOrigin(CustomerOriginPO customerOrigin) {
		this.customerOrigin = customerOrigin;
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

	@Column(name = "houseClass")
	public String getHouseClass() {
		return houseClass;
	}

	public void setHouseClass(String houseClass) {
		this.houseClass = houseClass;
	}

	@Column(name = "resourceType")
	public short getResourceType() {
		return resourceType;
	}

	public void setResourceType(short resourceType) {
		this.resourceType = resourceType;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "suid", referencedColumnName = "uid")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}
	
	@Column(name = "typeness")
	public short getTypeness() {
		return typeness;
	}

	public void setTypeness(short typeness) {
		this.typeness = typeness;
	}

}
