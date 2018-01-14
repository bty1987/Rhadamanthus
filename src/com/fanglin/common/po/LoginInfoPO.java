package com.fanglin.common.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "logininfo", catalog = "communion")
public class LoginInfoPO implements java.io.Serializable {

	private static final long serialVersionUID = 7482866789664590219L;
	
	public static final String COLUMN_LOGINFLAG_STR = "loginFlag";

	private long liId;
	
	private String loginFlag;
	
	private int code;
	
	private String message;
	
	private String authentication;
	
	private long optime;
	
	private double x;
	
	private double y;
	
	private int company;

	public LoginInfoPO() {
		super();
	}

	public LoginInfoPO(String loginFlag, int code, String message, String authentication, long optime, int company) {
		super();
		this.loginFlag = loginFlag;
		this.code = code;
		this.message = message;
		this.authentication = authentication;
		this.optime = optime;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "liId")
	public long getLiId() {
		return this.liId;
	}

	public void setLiId(long liId) {
		this.liId = liId;
	}

	@Column(name = "loginFlag")
	public String getLoginFlag() {
		return this.loginFlag;
	}

	public void setLoginFlag(String loginFlag) {
		this.loginFlag = loginFlag;
	}

	@Column(name = "code")
	public int getCode() {
		return this.code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	@Column(name = "message")
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Column(name = "authentication")
	public String getAuthentication() {
		return this.authentication;
	}

	public void setAuthentication(String authentication) {
		this.authentication = authentication;
	}
	
	@Column(name = "optime")
	public long getOptime() {
		return optime;
	}

	public void setOptime(long optime) {
		this.optime = optime;
	}

	@Column(name = "x")
	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	@Column(name = "y")
	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}