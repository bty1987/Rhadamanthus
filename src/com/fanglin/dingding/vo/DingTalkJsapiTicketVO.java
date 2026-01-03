package com.fanglin.dingding.vo;

public class DingTalkJsapiTicketVO implements java.io.Serializable {

	private static final long serialVersionUID = -8780310391096195927L;

	private Long djtid;

	private String jsapi;

	private Long operateTime;

	private Integer company;

	public Long getDjtid() {
		return djtid;
	}

	public void setDjtid(Long djtid) {
		this.djtid = djtid;
	}

	public String getJsapi() {
		return this.jsapi;
	}

	public void setJsapi(String jsapi) {
		this.jsapi = jsapi;
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
