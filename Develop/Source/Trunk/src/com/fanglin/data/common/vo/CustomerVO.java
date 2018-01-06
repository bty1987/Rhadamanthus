package com.fanglin.data.common.vo;

import java.io.Serializable;

public class CustomerVO implements Serializable {

	private static final long serialVersionUID = -7469004001329405496L;

	private Long cid;
	
	private String no;
	
	private String name;
	
	private String gender;
	
	private String identity;
	
	private String officer;
	
	private String passport;
	
	private String qq;
	
	private String wechat;
	
	private String email;
	
	private String address;
	
	private String relationshipType;
	
	private Float balance;
	
	private Float materialBalance;
	
	private Float zhenglinBalance;
	
	private Float projectBalance;
	
	private String phone;

	public CustomerVO() {
		super();
	}

	public CustomerVO(Long cid) {
		super();
		this.cid = cid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	public String getOfficer() {
		return officer;
	}

	public void setOfficer(String officer) {
		this.officer = officer;
	}

	public String getPassport() {
		return passport;
	}

	public void setPassport(String passport) {
		this.passport = passport;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getRelationshipType() {
		return relationshipType;
	}

	public void setRelationshipType(String relationshipType) {
		this.relationshipType = relationshipType;
	}

	public Float getBalance() {
		return balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	public Float getMaterialBalance() {
		return materialBalance;
	}

	public void setMaterialBalance(Float materialBalance) {
		this.materialBalance = materialBalance;
	}

	public Float getZhenglinBalance() {
		return zhenglinBalance;
	}

	public void setZhenglinBalance(Float zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}

	public Float getProjectBalance() {
		return projectBalance;
	}

	public void setProjectBalance(Float projectBalance) {
		this.projectBalance = projectBalance;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public void setConfidentialInfo(){
		this.email = "-";
		this.qq = "-";
		this.phone = "-";
		this.wechat = "-";
	}
	
}
