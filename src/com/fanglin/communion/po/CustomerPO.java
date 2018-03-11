package com.fanglin.communion.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="customer", catalog = "communion")
public class CustomerPO implements Serializable{

	private static final long serialVersionUID = 263298158826936889L;
	
	public static final String BALANCE_TYPE_BALANCE_STR = "合同预付款";
	
	public static final String BALANCE_TYPE_MATERIAL_STR = "主材预付款";
	
	public static final String BALANCE_TYPE_ZHENGLIN_STR = "正林预付款";
	
	public static final String BALANCE_TYPE_PROJECT_STR = "工程预付款";
	
	private long cid;
	
	private String no;
	
	private String name;
	
	private String pinyinAll;
	
	private String pinyinAB;
	
	private String gender;
	
	private String identity;
	
	private String officer;
	
	private String passport;
	
	private String qq;
	
	private String wechat;
	
	private String email;
	
	private String address;
	
	private String relationshipType;
	
	public CustomerPO() {
		super();
	}

	public CustomerPO(long cid) {
		super();
		this.cid = cid;
	}

	@Id
	@GeneratedValue
	@Column(name="cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name="no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name="name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name="pinyinAll")
	public String getPinyinAll() {
		return pinyinAll;
	}

	public void setPinyinAll(String pinyinAll) {
		this.pinyinAll = pinyinAll;
	}

	@Column(name="pinyinAB")
	public String getPinyinAB() {
		return pinyinAB;
	}

	public void setPinyinAB(String pinyinAB) {
		this.pinyinAB = pinyinAB;
	}

	@Column(name="gender")
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	@Column(name="identity")
	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	@Column(name="officer")
	public String getOfficer() {
		return officer;
	}

	public void setOfficer(String officer) {
		this.officer = officer;
	}

	@Column(name="passport")
	public String getPassport() {
		return passport;
	}

	public void setPassport(String passport) {
		this.passport = passport;
	}

	@Column(name="qq")
	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	@Column(name="wechat")
	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	@Column(name="email")
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name="address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name="relationshipType")
	public String getRelationshipType() {
		return relationshipType;
	}

	public void setRelationshipType(String relationshipType) {
		this.relationshipType = relationshipType;
	}
	
}	
	
	
