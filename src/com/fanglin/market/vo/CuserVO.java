package com.fanglin.market.vo;

import java.io.Serializable;

public class CuserVO implements Serializable{
	
	private static final long serialVersionUID = -8658449139671800853L;

	private Long cuid;
	
	private String unionId;
	
	public CuserVO() {
		super();
	}

	public Long getCuid() {
		return cuid;
	}

	public void setCuid(Long cuid) {
		this.cuid = cuid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

}
