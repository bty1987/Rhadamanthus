package com.fanglin.personel.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class UserCheckVO implements java.io.Serializable {

	private static final long serialVersionUID = -3081228509086918182L;

	private Long ucId;
	
	private String userId;
	
	private String currentName;
	
	private Timestamp checkTime;
	
	private Double x;
	
	private Double y;
	
	private String checkDate;

	public Long getUcId() {
		return this.ucId;
	}

	public void setUcId(Long ucId) {
		this.ucId = ucId;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCheckTime() {
		return this.checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	public Double getX() {
		return this.x;
	}

	public void setX(Double x) {
		this.x = x;
	}

	public Double getY() {
		return this.y;
	}

	public void setY(Double y) {
		this.y = y;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getCurrentName() {
		return currentName;
	}

	public void setCurrentName(String currentName) {
		this.currentName = currentName;
	}

	public String getCheckDate() {
		return checkDate;
	}

	public void setCheckDate(String checkDate) {
		this.checkDate = checkDate;
	}

}