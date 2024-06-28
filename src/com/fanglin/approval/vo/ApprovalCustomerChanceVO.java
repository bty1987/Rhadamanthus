package com.fanglin.approval.vo;

import java.io.Serializable;

import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;

public class ApprovalCustomerChanceVO implements Serializable {

	private static final long serialVersionUID = -4005739227869924526L;

	private Long accid;

	private Long aid;

	private CustomerChanceVO chance;

	private Short type;

	private short typeness;

	private DecorationBusitypeVO busitype;

	private String houseType;

	private String houseClass;

	private Short resourceType;

	public ApprovalCustomerChanceVO() {
		super();
	}

	public ApprovalCustomerChanceVO(CustomerChanceVO chance, DecorationBusitypeVO busitype) {

		super();

		this.chance = chance;
		this.busitype = busitype;
	}

	public Long getAccid() {
		return accid;
	}

	public void setAccid(Long accid) {
		this.accid = accid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public CustomerChanceVO getChance() {
		return chance;
	}

	public void setChance(CustomerChanceVO chance) {
		this.chance = chance;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public short getTypeness() {
		return typeness;
	}

	public void setTypeness(short typeness) {
		this.typeness = typeness;
	}

	public DecorationBusitypeVO getBusitype() {
		return busitype;
	}

	public void setBusitype(DecorationBusitypeVO busitype) {
		this.busitype = busitype;
	}

	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public String getHouseClass() {
		return houseClass;
	}

	public void setHouseClass(String houseClass) {
		this.houseClass = houseClass;
	}

	public Short getResourceType() {
		return resourceType;
	}

	public void setResourceType(Short resourceType) {
		this.resourceType = resourceType;
	}

}
