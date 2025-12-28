/**
 * @File Name		: WeChatUserInfoVO.java
 * @Package   	: com.fanglin.wechat.vo
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户信息值对象
 */

package com.fanglin.wechat.vo;

import java.io.Serializable;

/**
 * 微信用户信息值对象
 * 用于传输微信用户信息
 */
public class WeChatUserInfoVO implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * 用户是否订阅该公众号（0-未关注，1-已关注）
	 */
	private Integer subscribe;

	/**
	 * 用户的 OpenID
	 */
	private String openid;

	/**
	 * 用户的昵称
	 */
	private String nickname;

	/**
	 * 用户的性别（0-未知，1-男，2-女）
	 */
	private Integer sex;

	/**
	 * 用户所在城市
	 */
	private String city;

	/**
	 * 用户所在省份
	 */
	private String province;

	/**
	 * 用户所在国家
	 */
	private String country;

	/**
	 * 用户头像 URL
	 */
	private String headimgurl;

	/**
	 * 用户统一标识（UnionID）
	 */
	private String unionid;

	/**
	 * 语言
	 */
	private String language;

	/**
	 * 订阅时间
	 */
	private Long subscribe_time;

	/**
	 * 备注
	 */
	private String remark;

	/**
	 * 用户所在的分组ID
	 */
	private Integer groupid;

	/**
	 * 构造函数
	 */
	public WeChatUserInfoVO() {
	}

	/**
	 * 构造函数
	 * @param openId OpenID
	 * @param unionId UnionID
	 */
	public WeChatUserInfoVO(String openId, String unionId) {
		this.openid = openId;
		this.unionid = unionId;
	}

	// Getters and Setters

	public Integer getSubscribe() {
		return subscribe;
	}

	public void setSubscribe(Integer subscribe) {
		this.subscribe = subscribe;
	}

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public Integer getSex() {
		return sex;
	}

	public void setSex(Integer sex) {
		this.sex = sex;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getHeadimgurl() {
		return headimgurl;
	}

	public void setHeadimgurl(String headimgurl) {
		this.headimgurl = headimgurl;
	}

	public String getUnionid() {
		return unionid;
	}

	public void setUnionid(String unionid) {
		this.unionid = unionid;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public Long getSubscribe_time() {
		return subscribe_time;
	}

	public void setSubscribe_time(Long subscribe_time) {
		this.subscribe_time = subscribe_time;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getGroupid() {
		return groupid;
	}

	public void setGroupid(Integer groupid) {
		this.groupid = groupid;
	}

}
