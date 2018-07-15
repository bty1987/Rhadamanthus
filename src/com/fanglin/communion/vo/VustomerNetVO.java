package com.fanglin.communion.vo;

import java.io.Serializable;

public class VustomerNetVO implements Serializable {

	private static final long serialVersionUID = 486904451379656651L;
	
	private Long vnid;
	
	private String unionId;
	
	private String netunionId;

	public VustomerNetVO(){
		super();
	}
	
	public Long getVnid() {
		return vnid;
	}

	public void setVnid(Long vnid) {
		this.vnid = vnid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getNetunionId() {
		return netunionId;
	}

	public void setNetunionId(String netunionId) {
		this.netunionId = netunionId;
	}
	
	

}
