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

import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.data.po.DecorationBusitypePO;

@Entity
@Table(name = "approvalCustomerChance", catalog = "approval")
public class ApprovalCustomerChancePO implements Serializable {

	private static final long serialVersionUID = 9017255456576919937L;

	private long accid;

	private long aid;

	private CustomerChancePO chance;

	private short type;

	private short typeness;

	private DecorationBusitypePO busitype;

	private String houseType;

	private String houseClass;

	private short resourceType;

	public ApprovalCustomerChancePO() {
		super();
	}

	public ApprovalCustomerChancePO(CustomerChancePO chance, DecorationBusitypePO busitype) {

		super();

		this.chance = chance;
		this.busitype = busitype;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acodid")
	public long getAccid() {
		return accid;
	}

	public void setAccid(long accid) {
		this.accid = accid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "ccid", referencedColumnName = "ccid")
	public CustomerChancePO getChance() {
		return chance;
	}

	public void setChance(CustomerChancePO chance) {
		this.chance = chance;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "typeness")
	public short getTypeness() {
		return typeness;
	}

	public void setTypeness(short typeness) {
		this.typeness = typeness;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "dbid", referencedColumnName = "dbid")
	public DecorationBusitypePO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypePO busitype) {
		this.busitype = busitype;
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

}
