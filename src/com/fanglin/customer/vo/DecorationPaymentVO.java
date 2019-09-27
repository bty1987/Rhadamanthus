package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class DecorationPaymentVO implements Serializable {

	private static final long serialVersionUID = 8484894874127122141L;

	private String orderId;

	private Long referMoney;

	private Timestamp collectTime;

	private Long coupon;

	private String couponInfo;

	private Short paymentStatus;

	private String paymentType;

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Long getCoupon() {
		return coupon;
	}

	public void setCoupon(Long coupon) {
		this.coupon = coupon;
	}

	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}

	public Short getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(Short paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}

}
