package com.fanglin.dingding.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
// @Table(name = "accesstoken", catalog = "dingtalk")
@Table(name = "daccesstoken", catalog = "hades")
public class DingTalkAccessTokenPO implements java.io.Serializable {

	private static final long serialVersionUID = -5569847205831077308L;

	public static final String COLUMN_OPERATETIME_STR = "operateTime";

	public static final String COLUMN_COMPANY_STR = "company";

	private long datid;

	private String accesstoken;

	private long operateTime;

	private int company;

	public DingTalkAccessTokenPO() {
		super();
	}

	public DingTalkAccessTokenPO(String accesstoken, long operateTime) {
		super();
		this.accesstoken = accesstoken;
		this.operateTime = operateTime;
	}

	public DingTalkAccessTokenPO(String accesstoken, long operateTime, int company) {
		super();
		this.accesstoken = accesstoken;
		this.operateTime = operateTime;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "datid")
	public long getDatid() {
		return datid;
	}

	public void setDatid(long datid) {
		this.datid = datid;
	}

	@Column(name = "accesstoken")
	public String getAccesstoken() {
		return this.accesstoken;
	}

	public void setAccesstoken(String accesstoken) {
		this.accesstoken = accesstoken;
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
