package com.fanglin.customer.vo;

import java.io.Serializable;

public class DecorationHolonomyVO implements Serializable{

	private static final long serialVersionUID = -9036042774272980800L;
	
	private String name;
	
	private String orderId;
	
	private Float maching;
	
	private Float discount;
	
	private Float projectBase;
	
	private Float managePrice;
	
	private Float materialPrice;
	
	private Float servicePrice;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Float getMaching() {
		return maching;
	}

	public void setMaching(Float maching) {
		this.maching = maching;
	}

	public Float getDiscount() {
		return discount;
	}

	public void setDiscount(Float discount) {
		this.discount = discount;
	}

	public Float getProjectBase() {
		return projectBase;
	}

	public void setProjectBase(Float projectBase) {
		this.projectBase = projectBase;
	}

	public Float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Float managePrice) {
		this.managePrice = managePrice;
	}

	public Float getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(Float materialPrice) {
		this.materialPrice = materialPrice;
	}

	public Float getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(Float servicePrice) {
		this.servicePrice = servicePrice;
	}
	
}
