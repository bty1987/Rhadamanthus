package com.fanglin.approval.vo;

import java.io.Serializable;

import com.fanglin.customer.vo.CustomerOriginVO;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ApprovalCustomerOriginTDecorationVO implements Serializable {

	private static final long serialVersionUID = 5937990438453637182L;

	private Long acodid;

	private ApprovalVO approval;

	private CustomerOriginVO customerOrigin;

	private Short type;

	private DecorationBusitypeVO decorationBusitype;

	private String houseType;

	private String houseClass;

	private Short resourceType;

	private UserBaseVO salesman;

	private short typeness;

	public ApprovalCustomerOriginTDecorationVO() {
		super();
	}

	public ApprovalCustomerOriginTDecorationVO(CustomerOriginVO customerOrigin, DecorationBusitypeVO decorationBusitype, UserBaseVO salesman) {
		super();
		this.customerOrigin = customerOrigin;
		this.decorationBusitype = decorationBusitype;
		this.salesman = salesman;
	}

	public short getTypeness() {
		return typeness;
	}

	public void setTypeness(short typeness) {
		this.typeness = typeness;
	}

	public Long getAcodid() {
		return acodid;
	}

	public void setAcodid(Long acodid) {
		this.acodid = acodid;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public CustomerOriginVO getCustomerOrigin() {
		return customerOrigin;
	}

	public void setCustomerOrigin(CustomerOriginVO customerOrigin) {
		this.customerOrigin = customerOrigin;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public DecorationBusitypeVO getDecorationBusitype() {
		return decorationBusitype;
	}

	public void setDecorationBusitype(DecorationBusitypeVO decorationBusitype) {
		this.decorationBusitype = decorationBusitype;
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

	public UserBaseVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserBaseVO salesman) {
		this.salesman = salesman;
	}

}
