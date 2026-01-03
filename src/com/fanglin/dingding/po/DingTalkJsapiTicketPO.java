package com.fanglin.dingding.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
// @Table(name = "jsapiticket", catalog = "dingtalk")
@Table(name = "djsapiticket", catalog = "hades")
public class DingTalkJsapiTicketPO implements java.io.Serializable {

	private static final long serialVersionUID = 6747423090505493697L;

	public static final String COLUMN_OPERATETIME_STR = "operateTime";

	public static final String COLUMN_COMPANY_STR = "company";

	private long djtid;

	private String jsapi;

	private long operateTime;

	private int company;

	public DingTalkJsapiTicketPO() {
		super();
	}

	public DingTalkJsapiTicketPO(String jsapi, long operateTime) {
		super();
		this.jsapi = jsapi;
		this.operateTime = operateTime;
	}

	public DingTalkJsapiTicketPO(String jsapi, long operateTime, int company) {
		super();
		this.jsapi = jsapi;
		this.operateTime = operateTime;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "djtid")
	public long getDjtid() {
		return djtid;
	}

	public void setDjtid(long djtid) {
		this.djtid = djtid;
	}

	@Column(name = "jsapi")
	public String getJsapi() {
		return this.jsapi;
	}

	public void setJsapi(String jsapi) {
		this.jsapi = jsapi;
	}

	@Column(name = "operateTime")
	public long getOperateTime() {
		return this.operateTime;
	}

	public void setOperateTime(long operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
