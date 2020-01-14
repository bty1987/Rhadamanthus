/**
 * @File Name		: Organization.java
 * @Package   	: com.fanglin.finance.bean
 * @Version		: 1.0
 * @Date			: 2019-12-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.bean;

import java.io.Serializable;

public class Organization implements Serializable, KTCBean {

	private static final long serialVersionUID = -826669568339691771L;

	public static final String FORM_ID_STR = "DB_Organization";

	private String FNumber;

	public Organization() {
		super();
	}

	public Organization(String fNumber) {
		super();
		FNumber = fNumber;
	}

	public String getFNumber() {
		return FNumber;
	}

	public void setFNumber(String fNumber) {
		FNumber = fNumber;
	}

	@Override
	public String formId() {
		return FORM_ID_STR;
	}

	@Override
	public String view() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String save() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String update() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String submit() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String audit() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String unaudit() {
		// TODO Auto-generated method stub
		return null;
	}

}
