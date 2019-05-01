package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.personel.vo.UserBaseVO;

public class CustomerOriginVO implements Serializable {

	private static final long serialVersionUID = -4556862985248539773L;

	private Long csid;
	
	private Long cid;

	private String name;

	private String phone;
	
	private String gender;

	private String purpose;

	private String intention;

	private String price;

	private String grade;

	private UserBaseVO creater;

	private Timestamp createTime;

	private UserBaseVO belonger;

	private DepartmentVO department;

	private DepartmentVO region;
	
	private UserBaseVO designer;
	
	private VillageVO village;
	
	private String houseNumber;
	
	private Float buildArea;
	
	private Long hid;
	
	private Short status;

	private String comment;
	
	private String orderId;
	
	public CustomerOriginVO() {
		super();
	}
	
	public CustomerOriginVO(UserBaseVO creater, UserBaseVO belonger, DepartmentVO department, DepartmentVO region, UserBaseVO designer, VillageVO village) {
		super();
		this.creater = creater;
		this.belonger = belonger;
		this.department = department;
		this.region = region;
		this.designer = designer;
		this.village = village;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}
	
	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
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

	public UserBaseVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserBaseVO designer) {
		this.designer = designer;
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

	public Float getBuildArea() {
		return buildArea;
	}

	public void setBuildArea(Float buildArea) {
		this.buildArea = buildArea;
	}

	public Long getHid() {
		return hid;
	}

	public void setHid(Long hid) {
		this.hid = hid;
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

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	
}
