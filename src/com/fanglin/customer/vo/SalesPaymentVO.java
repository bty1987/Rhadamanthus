package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class SalesPaymentVO implements Serializable {

	private static final long serialVersionUID = -4752837520740789732L;

	private String orderId;

	private Float money;

	private Short status;

	private Short paymentType;

	private String brand;

	private Timestamp collectTime;

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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
