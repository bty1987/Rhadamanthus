package com.fanglin.wechat.vo;

public class WeChatJsapiTicketVO implements java.io.Serializable {

	private static final long serialVersionUID = 7899938529350157347L;

	private Long jtid;

	private String jsapiticket;

	private Long operateTime;

	public Long getJtid() {
		return jtid;
	}

	public void setJtid(Long jtid) {
		this.jtid = jtid;
	}

	public String getJsapiticket() {
		return this.jsapiticket;
	}

	public void setJsapiticket(String jsapiticket) {
		this.jsapiticket = jsapiticket;
	}

	public Long getOperateTime() {
		return this.operateTime;
	}

	public void setOperateTime(Long operateTime) {
		this.operateTime = operateTime;
	}

}