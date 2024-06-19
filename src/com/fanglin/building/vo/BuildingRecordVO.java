package com.fanglin.building.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BuildingRecordVO implements java.io.Serializable {

	private static final long serialVersionUID = -4632028111958414235L;

	private Long brid;

	private BuildingHouseVO buildingHouse;

	private BuildingCustomerVO buildingCustomer;

	private String comment;

	private Short type;

	private Short pattern;

	private UserBaseVO operater;

	private Timestamp operatTime;

	public BuildingRecordVO() {
		super();
	}

	public BuildingRecordVO(BuildingHouseVO buildingHouse, UserBaseVO operater) {
		super();
		this.buildingHouse = buildingHouse;
		this.operater = operater;
	}

	public BuildingRecordVO(BuildingHouseVO buildingHouse, BuildingCustomerVO buildingCustomer, UserBaseVO operater) {
		super();
		this.buildingHouse = buildingHouse;
		this.buildingCustomer = buildingCustomer;
		this.operater = operater;
	}

	public Long getBrid() {
		return brid;
	}

	public void setBrid(Long brid) {
		this.brid = brid;
	}

	public BuildingHouseVO getBuildingHouse() {
		return buildingHouse;
	}

	public void setBuildingHouse(BuildingHouseVO buildingHouse) {
		this.buildingHouse = buildingHouse;
	}

	public BuildingCustomerVO getBuildingCustomer() {
		return buildingCustomer;
	}

	public void setBuildingCustomer(BuildingCustomerVO buildingCustomer) {
		this.buildingCustomer = buildingCustomer;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPattern() {
		return pattern;
	}

	public void setPattern(Short pattern) {
		this.pattern = pattern;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperatTime() {
		return operatTime;
	}

	public void setOperatTime(Timestamp operatTime) {
		this.operatTime = operatTime;
	}

}
