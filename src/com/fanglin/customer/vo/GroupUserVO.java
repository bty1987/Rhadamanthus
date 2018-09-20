package com.fanglin.customer.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class GroupUserVO implements Serializable{

	private static final long serialVersionUID = -9115190469822249802L;
	
	private Long guid;
	
	private String opengid;
	
	private UserBaseVO user;

	public GroupUserVO() {
		super();
	}

	public GroupUserVO(UserBaseVO user) {
		super();
		this.user = user;
	}

	public Long getGuid() {
		return guid;
	}

	public void setGuid(Long guid) {
		this.guid = guid;
	}

	public String getOpengid() {
		return opengid;
	}

	public void setOpengid(String opengid) {
		this.opengid = opengid;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}
	
}
