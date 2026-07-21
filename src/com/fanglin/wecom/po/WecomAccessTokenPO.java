/**
 * @File Name		: WecomAccessTokenPO.java
 * @Package   	: com.fanglin.wecom.po
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信自建应用 access_token 实体
 */

package com.fanglin.wecom.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 企业微信 access_token 缓存表
 * <p>
 * 表 hades.eaccesstoken (e=enterprise 企业微信)，独立于公众号 waccesstoken / 钉钉 daccesstoken
 * </p>
 */
@Entity
@Table(name = "eaccesstoken", catalog = "hades")
public class WecomAccessTokenPO implements java.io.Serializable {

	private static final long serialVersionUID = -6284723950183726493L;

	public static final String COLUMN_OPERATETIME_STR = "operateTime";

	public static final String COLUMN_COMPANY_STR = "company";

	private long eatId;

	private String accessToken;

	private int expiresIn;

	private long operateTime;

	private int company;

	public WecomAccessTokenPO() {
		super();
	}

	public WecomAccessTokenPO(String accessToken, int expiresIn, long operateTime, int company) {
		super();
		this.accessToken = accessToken;
		this.expiresIn = expiresIn;
		this.operateTime = operateTime;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "eatId")
	public long getEatId() {
		return eatId;
	}

	public void setEatId(long eatId) {
		this.eatId = eatId;
	}

	@Column(name = "access_token")
	public String getAccessToken() {
		return this.accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	@Column(name = "expiresIn")
	public int getExpiresIn() {
		return this.expiresIn;
	}

	public void setExpiresIn(int expiresIn) {
		this.expiresIn = expiresIn;
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
