/**
 * @File Name		: Department.java
 * @Package   	: com.fanglin.dingding.po
 * @Version		: 1.0
 * @Date			: 2016-12-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.po;

public class Department {
	
	private long id;
	
	private String name;
	
	private long parentid;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getParentid() {
		return parentid;
	}

	public void setParentid(long parentid) {
		this.parentid = parentid;
	}
	
}
