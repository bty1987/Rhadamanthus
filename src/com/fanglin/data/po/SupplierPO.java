/**
 * @File Name		: SupplierPO.java
 * @Package   	: com.fanglin.data.po
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "supplier", catalog = "communion")
public class SupplierPO implements Serializable{

	private static final long serialVersionUID = -6894807664387435523L;
	
	public static final String COLUMN_SID_STR = "sid";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_LOGINID_STR = "loginId";
	
	private long sid;
	
	private String name;
	
	private String loginId;
	
	private String password;
	
	private short isLogin;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sid") 
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "name") 
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "loginId") 
	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	@Column(name = "password") 
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "isLogin") 
	public short getIsLogin() {
		return isLogin;
	}

	public void setIsLogin(short isLogin) {
		this.isLogin = isLogin;
	}

}
