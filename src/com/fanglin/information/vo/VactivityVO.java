package com.fanglin.information.vo;

public class VactivityVO implements java.io.Serializable {

	private static final long serialVersionUID = 1172470281307940364L;

	private Long vaid;
	
	private String name;
	
	private Short status;

	public Long getVaid() {
		return vaid;
	}

	public void setVaid(Long vaid) {
		this.vaid = vaid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}