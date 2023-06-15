package com.fanglin.wechat.vo;

public class AccessTokenVO implements java.io.Serializable {

	private static final long serialVersionUID = -3510368582173133287L;

	private Long atid;

	private String accesstoken;

	private Long operateTime;

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

}