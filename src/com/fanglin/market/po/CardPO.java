package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="card", catalog = "market")
public class CardPO implements Serializable{

	private static final long serialVersionUID = -4498404135414513996L;
	
	public static final String COLUMN_CUID_STR = "cuser.cuid";
	
	private long caid;
	
	private CuserPO cuser;
	
	private String userPhoto;
	
	private String userName;
	
	private String phone;
	
	private String wechat;
	
	private String industry;
	
	private String profession;
	
	private String address;
	
	private String info;
	
	public CardPO() {
		super();
	}
	
	public CardPO(CuserPO cuser) {
		super();
		this.cuser = cuser;
	}

	@Id
	@GeneratedValue
	@Column(name="caid")
	public long getCaid() {
		return caid;
	}

	public void setCaid(long caid) {
		this.caid = caid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName="cuid")
	public CuserPO getCuser() {
		return cuser;
	}

	public void setCuser(CuserPO cuser) {
		this.cuser = cuser;
	}

	@Column(name="userPhoto")
	public String getUserPhoto() {
		return userPhoto;
	}

	public void setUserPhoto(String userPhoto) {
		this.userPhoto = userPhoto;
	}

	@Column(name="userName")
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column(name="phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name="wechat")
	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	@Column(name="industry")
	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	@Column(name="profession")
	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	@Column(name="address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name="info")
	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}
	
}
