package com.fanglin.communion.vo;

import java.io.Serializable;

public class SupplierVO implements Serializable{

	private static final long serialVersionUID = -6894806854387435523L;

	private Long sid;
	
	private String name;
	
	private String loginId;
	
	private String password;
	
	private Short isLogin;

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Short getIsLogin() {
		return isLogin;
	}

	public void setIsLogin(Short isLogin) {
		this.isLogin = isLogin;
	}

}
