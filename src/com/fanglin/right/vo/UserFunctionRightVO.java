package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserFunctionVO;

public class UserFunctionRightVO implements Serializable {

	private static final long serialVersionUID = -7626213544855906518L;

	private Long ufrid;

	private String name;

	private UserFunctionVO userFunction;

	private int company;

	public UserFunctionRightVO() {
		super();
	}

	public UserFunctionRightVO(UserFunctionVO userFunction) {
		super();
		this.userFunction = userFunction;
	}

	public Long getUfrid() {
		return ufrid;
	}

	public void setUfrid(Long ufrid) {
		this.ufrid = ufrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UserFunctionVO getUserFunction() {
		return userFunction;
	}

	public void setUserFunction(UserFunctionVO userFunction) {
		this.userFunction = userFunction;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
