package com.fanglin.data.common.vo;

import java.io.Serializable;

public class CustomerPhoneVO implements Serializable {

	private static final long serialVersionUID = -2073011002098345594L;
	
	private Long cpid;
	
	private Long cid;
	
	private String phone;
	
	private Short status;

	private Short defaults;
	
	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getDefaults() {
		return defaults;
	}

	public void setDefaults(Short defaults) {
		this.defaults = defaults;
	}

	
}
