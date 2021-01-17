package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "walletard", catalog = "payment")
public class WalletardPO implements java.io.Serializable {

	private static final long serialVersionUID = 973089022415633084L;

	public static final short STATUS_INIT_INT = 0; //初始

	public static final short STATUS_ABLE_INT = 1; //有效

	public static final short STATUS_DISABLED_INT = 2; //失效

	public static final short STATUS_SIGNINGFAILED_INT = 3; //签约失败

	public static final short STATUS_REGISTER_INT = 4; //已登记

	public static final short STATUS_UNBIND_INT = 5; //解绑

	private long wcid;
	
	private long wid;
	
	private String bankNo;
	
	private String bankName;
	
	private String validTime;
	
	private String cvv;
	
	private short type;
	
	private short status;
	
	private String mobile;
	
	private Timestamp bindTime;
	
	private String token;

	public WalletardPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wcid")
	public long getWcid() {
		return wcid;
	}

	public void setWcid(long wcid) {
		this.wcid = wcid;
	}

	@Column(name = "wid")
	public long getWid() {
		return wid;
	}

	public void setWid(long wid) {
		this.wid = wid;
	}

	@Column(name = "bankNo")
	public String getBankNo() {
		return bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}

	@Column(name = "bankName")
	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Column(name = "validTime")
	public String getValidTime() {
		return validTime;
	}

	public void setValidTime(String validTime) {
		this.validTime = validTime;
	}

	@Column(name = "cvv")
	public String getCvv() {
		return cvv;
	}

	public void setCvv(String cvv) {
		this.cvv = cvv;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "mobile")
	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "bindTime")
	public Timestamp getBindTime() {
		return bindTime;
	}

	public void setBindTime(Timestamp bindTime) {
		this.bindTime = bindTime;
	}

	@Column(name = "token")
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}