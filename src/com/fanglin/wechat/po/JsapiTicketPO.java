package com.fanglin.wechat.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "jsapiticket", catalog = "wechat")
public class JsapiTicketPO implements java.io.Serializable {

	private static final long serialVersionUID = 6513276145439985544L;

	public static final String COLUMN_OPERATETIME_STR = "operateTime";

	public static final String COLUMN_COMPANY_STR = "company";

	private long wjtId;

	private String jsapiticket;

	private long operateTime;

	private int company;

	public JsapiTicketPO() {
		super();
	}

	public JsapiTicketPO(String jsapiticket, long operateTime, int company) {
		super();
		this.jsapiticket = jsapiticket;
		this.operateTime = operateTime;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wjtId")
	public long getWjtId() {
		return this.wjtId;
	}

	public void setWjtId(long wjtId) {
		this.wjtId = wjtId;
	}

	@Column(name = "jsapiticket")
	public String getJsapiticket() {
		return this.jsapiticket;
	}

	public void setJsapiticket(String jsapiticket) {
		this.jsapiticket = jsapiticket;
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