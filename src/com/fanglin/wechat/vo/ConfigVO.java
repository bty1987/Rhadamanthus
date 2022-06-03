/**
 * @File Name		: WXConfig.java
 * @Package   	: com.fanglin.common.vo
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.vo;

import java.io.Serializable;

public class ConfigVO implements Serializable {

	private static final long serialVersionUID = 1646687387745912404L;

	private String signature;

	private String noceStr;

	private long timestamp;

	private String appId;

	private String url;

	private String query;

	private String accessToken;

	private String code;

	private String openId;

	private String unionId;

	private String company;

	public ConfigVO() {
		super();
	}

	public ConfigVO(String signature, String noceStr, long timestamp, String appId) {
		super();
		this.signature = signature;
		this.noceStr = noceStr;
		this.timestamp = timestamp;
		this.appId = appId;
	}

	public String getSignature() {
		return signature;
	}

	public void setSignature(String signature) {
		this.signature = signature;
	}

	public String getNoceStr() {
		return noceStr;
	}

	public void setNoceStr(String noceStr) {
		this.noceStr = noceStr;
	}

	public long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public void setConfig(String signature, String noceStr, long timestamp, String appId) {
		this.signature = signature;
		this.noceStr = noceStr;
		this.timestamp = timestamp;
		this.appId = appId;
	}

}
