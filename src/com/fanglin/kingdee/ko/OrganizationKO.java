/**
 * @File Name		: OrganizationKO.java
 * @Package   	: com.fanglin.kingdee.ko
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class OrganizationKO implements Serializable {

	private static final long serialVersionUID = 6813331609664770545L;

	private String FNumber;

	public OrganizationKO() {
		super();
	}

	public OrganizationKO(String fNumber) {
		super();
		FNumber = fNumber;
	}

	public String getFNumber() {
		return FNumber;
	}

	public void setFNumber(String fNumber) {
		FNumber = fNumber;
	}

}
