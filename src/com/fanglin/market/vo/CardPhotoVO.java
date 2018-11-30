package com.fanglin.market.vo;

import java.io.Serializable;

public class CardPhotoVO implements Serializable{

	private static final long serialVersionUID = -4204796365626030710L;

	private Long cpid;
	
	private Long caid;
	
	private String url;

	public CardPhotoVO() {
		super();
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}
	
	public Long getCaid() {
		return caid;
	}

	public void setCaid(Long caid) {
		this.caid = caid;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

}
