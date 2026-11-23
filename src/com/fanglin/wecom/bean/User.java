/**
 * @File Name		: User.java
 * @Package   	: com.fanglin.wecom.bean
 * @Version		: 1.0
 * @Date			: 2026-11-23
 * @Copyright		: Copyright Creators 2014
 * @Describing	: 企业微信通讯录成员(免登链路最小集)
 */

package com.fanglin.wecom.bean;

public class User {

	/** 企业微信成员账号 */
	private String userid;

	/** 成员姓名 */
	private String name;

	/** 工号(与ERP user.userId一致) */
	private String workCode;

	public User() {
	}

	public User(String userid, String name, String workCode) {
		this.userid = userid;
		this.name = name;
		this.workCode = workCode;
	}

	@Override
	public String toString() {
		return "User[userid:" + userid + ", name:" + name + ", workCode:" + workCode + "]";
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getWorkCode() {
		return workCode;
	}

	public void setWorkCode(String workCode) {
		this.workCode = workCode;
	}

}
