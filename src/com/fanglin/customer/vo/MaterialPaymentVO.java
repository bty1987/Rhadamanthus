package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MaterialPaymentVO implements Serializable{

	private static final long serialVersionUID = 57078245084828724L;

	private String orderId;

	private String brand;

	private String category;

	private String no;

	private Float referMoney;

	private Timestamp collectTime;

	private Float coupon;

	private String couponInfo;

	private Short paymentStatus; 

	private Short paymentType;

	public MaterialPaymentVO(){
		super();
	}
	
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public Float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Float referMoney) {
		this.referMoney = referMoney;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Float getCoupon() {
		return coupon;
	}

	public void setCoupon(Float coupon) {
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

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}

}
