package com.fanglin.market.vo;

import java.io.Serializable;

public class CardVO implements Serializable{
	
	private static final long serialVersionUID = 8026999553409712070L;

	private Long caid;
	
	private CuserVO cuser;
	
	private String userPhoto;
	
	private String userName;
	
	private String phone;
	
	private String wechat;
	
	private String industry;
	
	private String profession;
	
	private String address;
	
	private String info;

	public CardVO() {
		super();
	}
	
	public CardVO(CuserVO cuser) {
		super();
		this.cuser = cuser;
	}

	public Long getCaid() {
		return caid;
	}

	public void setCaid(Long caid) {
		this.caid = caid;
	}

	public CuserVO getCuser() {
		return cuser;
	}

	public void setCuser(CuserVO cuser) {
		this.cuser = cuser;
	}

	public String getUserPhoto() {
		return userPhoto;
	}

	public void setUserPhoto(String userPhoto) {
		this.userPhoto = userPhoto;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

}
