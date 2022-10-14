/**
 * @File Name		: Wxpay.java
 * @Package   	: com.fanglin.payment.bean
 * @Version		: 1.0
 * @Date			: 2022-5-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.bean;

public class Wxpay {

	// args of system

	private Long paymentptid; // 转换款id

	private Long paymentid; // 各款项id

	private String paymentOrderId;

	private Short paymentType; // 各款项类型

	private Long paymentMoney;

	private String userId; // 微信wechat

	// avancePaymentType

	private Short paymentAttrType; // 业务类型-装修/主材

	// args of wechat pay

	private String openid;

	private String jsapiAppid;

	private String jsapiPaySign;

	private String jsapiSignType;

	private String jsapiNoncestr;

	private String jsapiTimestamp;

	private String jsapiPackage;

	// args of postar

	private String orderNo;

	private String orderTime;

	private String threeOrderNo;

	public Wxpay() {
		super();
	}

	public Long getPaymentptid() {
		return paymentptid;
	}

	public void setPaymentptid(Long paymentptid) {
		this.paymentptid = paymentptid;
	}

	public Long getPaymentid() {
		return paymentid;
	}

	public void setPaymentid(Long paymentid) {
		this.paymentid = paymentid;
	}

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}

	public String getPaymentOrderId() {
		return paymentOrderId;
	}

	public void setPaymentOrderId(String paymentOrderId) {
		this.paymentOrderId = paymentOrderId;
	}

	public Long getPaymentMoney() {
		return paymentMoney;
	}

	public void setPaymentMoney(Long paymentMoney) {
		this.paymentMoney = paymentMoney;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Short getPaymentAttrType() {
		return paymentAttrType;
	}

	public void setPaymentAttrType(Short paymentAttrType) {
		this.paymentAttrType = paymentAttrType;
	}

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public String getJsapiAppid() {
		return jsapiAppid;
	}

	public void setJsapiAppid(String jsapiAppid) {
		this.jsapiAppid = jsapiAppid;
	}

	public String getJsapiPaySign() {
		return jsapiPaySign;
	}

	public void setJsapiPaySign(String jsapiPaySign) {
		this.jsapiPaySign = jsapiPaySign;
	}

	public String getJsapiSignType() {
		return jsapiSignType;
	}

	public void setJsapiSignType(String jsapiSignType) {
		this.jsapiSignType = jsapiSignType;
	}

	public String getJsapiNoncestr() {
		return jsapiNoncestr;
	}

	public void setJsapiNoncestr(String jsapiNoncestr) {
		this.jsapiNoncestr = jsapiNoncestr;
	}

	public String getJsapiTimestamp() {
		return jsapiTimestamp;
	}

	public void setJsapiTimestamp(String jsapiTimestamp) {
		this.jsapiTimestamp = jsapiTimestamp;
	}

	public String getJsapiPackage() {
		return jsapiPackage;
	}

	public void setJsapiPackage(String jsapiPackage) {
		this.jsapiPackage = jsapiPackage;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public String getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(String orderTime) {
		this.orderTime = orderTime;
	}

	public String getThreeOrderNo() {
		return threeOrderNo;
	}

	public void setThreeOrderNo(String threeOrderNo) {
		this.threeOrderNo = threeOrderNo;
	}

}
