package com.fanglin.communion.vo;

import com.fanglin.personel.vo.UserVO;

public class SupplierUserRightVO implements java.io.Serializable {

	private static final long serialVersionUID = -3417774421326706902L;

	private Long surId;
	
	private Long sid;
	
	private UserVO user;

	public SupplierUserRightVO() {
		super();
	}

	public SupplierUserRightVO(UserVO user) {
		super();
		this.user = user;
	}

	public Long getSurId() {
		return this.surId;
	}

	public void setSurId(Long surId) {
		this.surId = surId;
	}

	public Long getSid() {
		return this.sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

}