/**
 * @File Name		: WeChatConfigVO.java
 * @Package   	: com.fanglin.wechat.vo
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信配置值对象
 */

package com.fanglin.wechat.vo;

import java.io.Serializable;

/**
 * 微信配置值对象
 * 用于传输微信 JS-SDK 配置信息和 OpenAccessToken 相关配置
 */
public class WeChatConfigVO implements Serializable {

	private static final long serialVersionUID = 1646687387745912404L;

	/**
	 * JS-SDK 签名
	 */
	private String signature;

	/**
	 * 随机字符串（修正拼写错误：nonceStr）
	 */
	private String nonceStr;

	/**
	 * 时间戳
	 */
	private Long timeStamp;

	/**
	 * 应用ID
	 */
	private String appId;

	/**
	 * URL 地址
	 */
	private String url;

	/**
	 * 查询字符串
	 */
	private String query;

	/**
	 * AccessToken
	 */
	private String accessToken;

	/**
	 * 微信登录 code
	 */
	private String code;

	/**
	 * 微信用户 OpenID
	 */
	private String openId;

	/**
	 * 微信用户 UnionID
	 */
	private String unionId;

	/**
	 * 公司标识
	 */
	private String company;

	public WeChatConfigVO() {
		super();
	}

	public WeChatConfigVO(String signature, String nonceStr, Long timeStamp, String appId) {
		super();
		this.signature = signature;
		this.nonceStr = nonceStr;
		this.timeStamp = timeStamp;
		this.appId = appId;
	}

	public String getSignature() {
		return signature;
	}

	public void setSignature(String signature) {
		this.signature = signature;
	}

	public String getNonceStr() {
		return nonceStr;
	}

	public void setNonceStr(String nonceStr) {
		this.nonceStr = nonceStr;
	}

	public Long getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(Long timeStamp) {
		this.timeStamp = timeStamp;
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

	/**
	 * 设置配置信息
	 * @param signature 签名
	 * @param nonceStr 随机字符串
	 * @param timeStamp 时间戳
	 * @param appId 应用ID
	 */
	public void setConfig(String signature, String nonceStr, Long timeStamp, String appId) {
		this.signature = signature;
		this.nonceStr = nonceStr;
		this.timeStamp = timeStamp;
		this.appId = appId;
	}

}
