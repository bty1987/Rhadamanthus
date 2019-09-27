package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.personel.vo.UserBaseVO;

public class CustomerOriginVO implements Serializable {

	private static final long serialVersionUID = -4556862985248539773L;

	private Long csid;

	private String name;

	private String gender;

	private String phone;

	private String purpose;

	private String intention;

	private String price;

	private String grade;

	private VillageVO village;

	private String houseNumber;

	private Integer buildArea;

	private UserBaseVO creater;

	private Timestamp createTime;

	private UserBaseVO belonger;

	private DepartmentVO department;

	private DepartmentVO region;

	private Short status;

	private String comment;

	private CustomerVO customer;

	private HouseVO house;

	private UserBaseVO designer;

	private String orderId;

	public CustomerOriginVO() {
		super();
	}

	public CustomerOriginVO(VillageVO village, UserBaseVO creater, UserBaseVO belonger, DepartmentVO department, DepartmentVO region, CustomerVO customer, HouseVO house, UserBaseVO designer) {
		super();
		this.village = village;
		this.creater = creater;
		this.belonger = belonger;
		this.department = department;
		this.region = region;
		this.customer = customer;
		this.house = house;
		this.designer = designer;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
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

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	public Integer getBuildArea() {
		return buildArea;
	}

	public void setBuildArea(Integer buildArea) {
		this.buildArea = buildArea;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
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

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public UserBaseVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserBaseVO designer) {
		this.designer = designer;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}
