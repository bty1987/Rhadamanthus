package com.fanglin.building.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.personel.vo.UserVO;

public class HouseSourceVO implements Serializable{

	private static final long serialVersionUID = -4319485351492418005L;
	
	private Long hsid;
	
	private String no;
	
	private Short type;
	
	private Short sourceType;
	
	private HouseVO house;
	
	private CustomerVO customer;
	
	private String deedNum;
	
	private Float deedValue;
	
	private Float unitPrice;
	
	private Float totalPrice;
	
	private Timestamp decorateTime;
	
	private Short decorateDegree;
	
	private Short discussType;
	
	private Short rentType;
	
	private String indoores;
	
	private String history;
	
	private Float propertyFee;
	
	private Short elevator;
	
	private Short onlyHousing;
	
	private Timestamp documentsDate;
	
	private Short allowLoan;
	
	private Short beingLoan;
	
	private String checkingTime;
	
	private UserVO create;
	
	private Timestamp createTime;
	
	private UserVO followUser;
	
	private String housingGrade;
	
	private Short status;
	
	private String path;
	
	private String comment;
	
	public HouseSourceVO() {
		super();
	}
	
	public HouseSourceVO(HouseVO house, CustomerVO customer, UserVO create, UserVO followUser) {
		super();
		this.house = house;
		this.customer = customer;
		this.create = create;
		this.followUser = followUser;
	}
	
	public Long getHsid() {
		return hsid;
	}

	public void setHsid(Long hsid) {
		this.hsid = hsid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getSourceType() {
		return sourceType;
	}

	public void setSourceType(Short sourceType) {
		this.sourceType = sourceType;
	}

	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public String getDeedNum() {
		return deedNum;
	}

	public void setDeedNum(String deedNum) {
		this.deedNum = deedNum;
	}

	public Float getDeedValue() {
		return deedValue;
	}

	public void setDeedValue(Float deedValue) {
		this.deedValue = deedValue;
	}

	public Float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Float unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Float totalPrice) {
		this.totalPrice = totalPrice;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDecorateTime() {
		return decorateTime;
	}

	public void setDecorateTime(Timestamp decorateTime) {
		this.decorateTime = decorateTime;
	}

	public Short getDecorateDegree() {
		return decorateDegree;
	}

	public void setDecorateDegree(Short decorateDegree) {
		this.decorateDegree = decorateDegree;
	}

	public Short getDiscussType() {
		return discussType;
	}

	public void setDiscussType(Short discussType) {
		this.discussType = discussType;
	}

	public Short getRentType() {
		return rentType;
	}

	public void setRentType(Short rentType) {
		this.rentType = rentType;
	}

	public String getIndoores() {
		return indoores;
	}

	public void setIndoores(String indoores) {
		this.indoores = indoores;
	}

	public String getHistory() {
		return history;
	}

	public void setHistory(String history) {
		this.history = history;
	}

	public Float getPropertyFee() {
		return propertyFee;
	}

	public void setPropertyFee(Float propertyFee) {
		this.propertyFee = propertyFee;
	}

	public Short getElevator() {
		return elevator;
	}

	public void setElevator(Short elevator) {
		this.elevator = elevator;
	}

	public Short getOnlyHousing() {
		return onlyHousing;
	}

	public void setOnlyHousing(Short onlyHousing) {
		this.onlyHousing = onlyHousing;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDocumentsDate() {
		return documentsDate;
	}

	public void setDocumentsDate(Timestamp documentsDate) {
		this.documentsDate = documentsDate;
	}

	public Short getAllowLoan() {
		return allowLoan;
	}

	public void setAllowLoan(Short allowLoan) {
		this.allowLoan = allowLoan;
	}

	public Short getBeingLoan() {
		return beingLoan;
	}

	public void setBeingLoan(Short beingLoan) {
		this.beingLoan = beingLoan;
	}

	public String getCheckingTime() {
		return checkingTime;
	}

	public void setCheckingTime(String checkingTime) {
		this.checkingTime = checkingTime;
	}

	public UserVO getCreate() {
		return create;
	}

	public void setCreate(UserVO create) {
		this.create = create;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserVO getFollowUser() {
		return followUser;
	}

	public void setFollowUser(UserVO followUser) {
		this.followUser = followUser;
	}

	public String getHousingGrade() {
		return housingGrade;
	}

	public void setHousingGrade(String housingGrade) {
		this.housingGrade = housingGrade;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
