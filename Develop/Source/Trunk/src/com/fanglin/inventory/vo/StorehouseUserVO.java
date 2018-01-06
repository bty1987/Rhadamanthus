package com.fanglin.inventory.vo;

import com.fanglin.personel.vo.UserBaseVO;

public class StorehouseUserVO implements java.io.Serializable {

	private static final long serialVersionUID = 3674173621146889170L;

	private Long shuId;
	
	private UserBaseVO user;
	
	private StorehouseVO storehouse;
	
	public StorehouseUserVO() {
		super();
	}

	public StorehouseUserVO(UserBaseVO user, StorehouseVO storehouse) {
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

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public StorehouseVO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehouseVO storehouse) {
		this.storehouse = storehouse;
	}

}