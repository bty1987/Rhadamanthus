package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.personel.vo.UserBaseVO;

public class CustomerSourceVO implements Serializable {

	private static final long serialVersionUID = -6768347550739318900L;

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

	private Integer freeArea;

	private Integer totalArea;

	private Integer innerArea;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Integer company;

	private Short status;

	private String comment;

	private CustomerVO customer;

	private HouseVO house;

	private UserBaseVO designer;

	private UserBaseVO salesman;

	private String orderId;

	public CustomerSourceVO() {
		super();
	}

	public CustomerSourceVO(VillageVO village, UserBaseVO creater, CustomerVO customer, HouseVO house, UserBaseVO designer, UserBaseVO salesman) {
		super();
		this.village = village;
		this.creater = creater;
		this.customer = customer;
		this.house = house;
		this.designer = designer;
		this.salesman = salesman;
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

	public Integer getFreeArea() {
		return freeArea;
	}

	public void setFreeArea(Integer freeArea) {
		this.freeArea = freeArea;
	}

	public Integer getTotalArea() {
		return totalArea;
	}

	public void setTotalArea(Integer totalArea) {
		this.totalArea = totalArea;
	}

	public Integer getInnerArea() {
		return innerArea;
	}

	public void setInnerArea(Integer innerArea) {
		this.innerArea = innerArea;
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

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
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

	public UserBaseVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserBaseVO salesman) {
		this.salesman = salesman;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}
