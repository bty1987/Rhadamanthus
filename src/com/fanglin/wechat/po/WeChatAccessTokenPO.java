package com.fanglin.wechat.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "accesstoken", catalog = "wechat")
public class WeChatAccessTokenPO implements java.io.Serializable {

	private static final long serialVersionUID = 5253002651815597375L;

	public static String COLUMN_OPERATETIME_STR = "operateTime";

	public static String COLUMN_COMPANY_STR = "company";

	private long watId;

	private String accesstoken;

	private long operateTime;

	private int company;

	public WeChatAccessTokenPO() {
		super();
	}

	public WeChatAccessTokenPO(String accesstoken, long operateTime, int company) {
		super();
		this.accesstoken = accesstoken;
		this.operateTime = operateTime;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "watId")
	public long getWatId() {
		return this.watId;
	}

	public void setWatId(long watId) {
		this.watId = watId;
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
