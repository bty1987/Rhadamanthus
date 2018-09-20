package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class ServicePaymentVO implements Serializable {

	private static final long serialVersionUID = 1826864912143630662L;

	private String orderId;
	
	private Float advanceMoney;
	
	private Timestamp collectTime;

	private Float serviceMoney;
	
	private Short status;
	
	private Short type;

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Float getAdvanceMoney() {
		return advanceMoney;
	}

	public void setAdvanceMoney(Float advanceMoney) {
		this.advanceMoney = advanceMoney;
	}
	
	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Float getServiceMoney() {
		return serviceMoney;
	}

	public void setServiceMoney(Float serviceMoney) {
		this.serviceMoney = serviceMoney;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}
	
}
