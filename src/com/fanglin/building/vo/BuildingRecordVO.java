package com.fanglin.building.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class BuildingRecordVO implements java.io.Serializable {

	private static final long serialVersionUID = -4632028111958414235L;
	
	private Long brid;
	
	private HouseSourceVO houseSource;
	
	private CustomerSourceVO customerSource;
	
	private String comment;
	
	private Short type;
	
	private Short pattern;
	
	private UserVO operater;
	
	private Timestamp operatTime;
	
	public BuildingRecordVO() {
		super();
	}
	
	public BuildingRecordVO(HouseSourceVO houseSource, UserVO operater) {
		super();
		this.houseSource = houseSource;
		this.operater = operater;
	}
	
	public BuildingRecordVO(HouseSourceVO houseSource, CustomerSourceVO customerSource, UserVO operater) {
		super();
		this.houseSource = houseSource;
		this.customerSource = customerSource;
		this.operater = operater;
	}

	public Long getBrid() {
		return brid;
	}

	public void setBrid(Long brid) {
		this.brid = brid;
	}

	public HouseSourceVO getHouseSource() {
		return houseSource;
	}

	public void setHouseSource(HouseSourceVO houseSource) {
		this.houseSource = houseSource;
	}

	public CustomerSourceVO getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(CustomerSourceVO customerSource) {
		this.customerSource = customerSource;
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

	public UserVO getOperater() {
		return operater;
	}

	public void setOperater(UserVO operater) {
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
