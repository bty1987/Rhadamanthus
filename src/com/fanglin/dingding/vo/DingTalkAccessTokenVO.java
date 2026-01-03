package com.fanglin.dingding.vo;

public class DingTalkAccessTokenVO implements java.io.Serializable {

	private static final long serialVersionUID = -859413617235576784L;

	private Long datid;

	private String accesstoken;

	private Long operateTime;

	private Integer company;

	public Long getDatid() {
		return datid;
	}

	public void setDatid(Long datid) {
		this.datid = datid;
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
