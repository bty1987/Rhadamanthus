/**
 * @File Name		: WecomAccessTokenVO.java
 * @Package   	: com.fanglin.wecom.vo
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信 access_token 视图对象
 */

package com.fanglin.wecom.vo;

public class WecomAccessTokenVO implements java.io.Serializable {

	private static final long serialVersionUID = 2946738105019284562L;

	private Long eatId;

	private String accessToken;

	private Integer expiresIn;

	private Long operateTime;

	private Integer company;

	public Long getEatId() {
		return eatId;
	}

	public void setEatId(Long eatId) {
		this.eatId = eatId;
	}

	public String getAccessToken() {
		return this.accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public Integer getExpiresIn() {
		return this.expiresIn;
	}

	public void setExpiresIn(Integer expiresIn) {
		this.expiresIn = expiresIn;
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
