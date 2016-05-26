package com.fanglin.common.vo;

public class LoginInfoVO implements java.io.Serializable {

	private static final long serialVersionUID = 1748734600090273917L;

	private Long liId;
	
	private String loginFlag;
	
	private Integer code;
	
	private String message;
	
	private String authentication;
	
	private Long optime;
	
	private String userId;
	
	private Double x;
	
	private Double y;

	public Long getLiId() {
		return this.liId;
	}

	public void setLiId(Long liId) {
		this.liId = liId;
	}

	public String getLoginFlag() {
		return this.loginFlag;
	}

	public void setLoginFlag(String loginFlag) {
		this.loginFlag = loginFlag;
	}

	public Integer getCode() {
		return this.code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getAuthentication() {
		return this.authentication;
	}

	public void setAuthentication(String authentication) {
		this.authentication = authentication;
	}

	public Long getOptime() {
		return optime;
	}

	public void setOptime(Long optime) {
		this.optime = optime;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Double getX() {
		return x;
	}

	public void setX(Double x) {
		this.x = x;
	}

	public Double getY() {
		return y;
	}

	public void setY(Double y) {
		this.y = y;
	}

}