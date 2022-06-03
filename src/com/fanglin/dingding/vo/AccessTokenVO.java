package com.fanglin.dingding.vo;

public class AccessTokenVO implements java.io.Serializable {

	private static final long serialVersionUID = -859413617235576784L;

	private Long atid;

	private String accesstoken;

	private Long operateTime;

	private Integer company;

	public Long getAtid() {
		return atid;
	}

	public void setAtid(Long atid) {
		this.atid = atid;
	}

	public String getAccesstoken() {
		return this.accesstoken;
	}

	public void setAccesstoken(String accesstoken) {
		this.accesstoken = accesstoken;
	}

	public Long getOperateTime() {
		return this.operateTime;
	}

	public void setOperateTime(Long operateTime) {
		this.operateTime = operateTime;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}