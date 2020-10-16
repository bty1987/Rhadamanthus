package com.fanglin.communion.vo;

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

	private String photoPath;

	private String signPath;

	private String identityPathF;

	private String identityPathB;

	private Short status;

	private Long balance;

	private Long materialBalance;

	private Long zhenglinBalance;

	private Long projectBalance;

	private String phone;

	private Integer company;

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

	public String getPhotoPath() {
		return photoPath;
	}

	public void setPhotoPath(String photoPath) {
		this.photoPath = photoPath;
	}

	public String getSignPath() {
		return signPath;
	}

	public void setSignPath(String signPath) {
		this.signPath = signPath;
	}

	public String getIdentityPathF() {
		return identityPathF;
	}

	public void setIdentityPathF(String identityPathF) {
		this.identityPathF = identityPathF;
	}

	public String getIdentityPathB() {
		return identityPathB;
	}

	public void setIdentityPathB(String identityPathB) {
		this.identityPathB = identityPathB;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Long getMaterialBalance() {
		return materialBalance;
	}

	public void setMaterialBalance(Long materialBalance) {
		this.materialBalance = materialBalance;
	}

	public Long getZhenglinBalance() {
		return zhenglinBalance;
	}

	public void setZhenglinBalance(Long zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}

	public Long getProjectBalance() {
		return projectBalance;
	}

	public void setProjectBalance(Long projectBalance) {
		this.projectBalance = projectBalance;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public void setConfidentialInfo() {
		this.email = "-";
		this.qq = "-";
		this.phone = "-";
		this.wechat = "-";
	}

}
