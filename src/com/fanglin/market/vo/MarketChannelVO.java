package com.fanglin.market.vo;

import java.io.Serializable;

public class MarketChannelVO implements Serializable {

	private static final long serialVersionUID = 5225724525379551149L;

	private Long mchid;

	private String name;

	private Short type;

	private String platform;

	private Long ownerId;

	private Short status;

	private String comment;

	private Integer company;

	public Long getMchid() {
		return mchid;
	}

	public void setMchid(Long mchid) {
		this.mchid = mchid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
