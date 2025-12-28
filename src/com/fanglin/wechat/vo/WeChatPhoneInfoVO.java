/**
 * @File Name		: WeChatPhoneInfoVO.java
 * @Package   	: com.fanglin.wechat.vo
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信手机号信息值对象
 */

package com.fanglin.wechat.vo;

import java.io.Serializable;

/**
 * 微信手机号信息值对象
 * 用于传输微信小程序手机号信息
 */
public class WeChatPhoneInfoVO implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * 用户绑定的手机号（国外手机号会有区号）
	 */
	private String phoneNumber;

	/**
	 * 区号（纯数字）
	 */
	private String purePhoneNumber;

	/**
	 * 区号（国家码）
	 */
	private String countryCode;

	/**
	 * 手机号是否属于当前用户（true-是，false-否）
	 */
	private Boolean watermark;

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getPurePhoneNumber() {
		return purePhoneNumber;
	}

	public void setPurePhoneNumber(String purePhoneNumber) {
		this.purePhoneNumber = purePhoneNumber;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public Boolean getWatermark() {
		return watermark;
	}

	public void setWatermark(Boolean watermark) {
		this.watermark = watermark;
	}

}
