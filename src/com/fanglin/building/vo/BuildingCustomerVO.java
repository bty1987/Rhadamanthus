package com.fanglin.building.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.personel.vo.UserBaseVO;

public class BuildingCustomerVO implements Serializable {

	private static final long serialVersionUID = -4319485351492418005L;

	private Long csid;

	private String no;

	private CustomerVO customer;

	private String customerName;

	private Short type;

	private String purpose;

	private String intention;

	private String price;

	private String area;

	private String familyType;

	private Short orientation;

	private String conditions;

	private String grade;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short status;

	private String comment;

	public BuildingCustomerVO() {
		super();
	}

	public BuildingCustomerVO(CustomerVO customer, UserBaseVO creater) {
		super();
		this.customer = customer;
		this.creater = creater;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public String getIntention() {
		return intention;
	}

	public void setIntention(String intention) {
		this.intention = intention;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getFamilyType() {
		return familyType;
	}

	public void setFamilyType(String familyType) {
		this.familyType = familyType;
	}

	public Short getOrientation() {
		return orientation;
	}

	public void setOrientation(Short orientation) {
		this.orientation = orientation;
	}

	public String getConditions() {
		return conditions;
	}

	public void setConditions(String conditions) {
		this.conditions = conditions;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
