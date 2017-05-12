package com.fanglin.inventory.vo;

import com.fanglin.personel.vo.UserVO;

public class StorehouseUserVO implements java.io.Serializable {

	private static final long serialVersionUID = 3674173621146889170L;

	private Long shuId;
	
	private UserVO user;
	
	private StorehouseVO storehouse;
	
	public StorehouseUserVO() {
		super();
	}

	public StorehouseUserVO(UserVO user, StorehouseVO storehouse) {
		super();
		this.user = user;
		this.storehouse = storehouse;
	}

	public Long getShuId() {
		return this.shuId;
	}

	public void setShuId(Long shuId) {
		this.shuId = shuId;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public StorehouseVO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehouseVO storehouse) {
		this.storehouse = storehouse;
	}

}