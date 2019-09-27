package com.fanglin.customer.vo;

import java.io.Serializable;

public class DecorationHolonomyVO implements Serializable {

	private static final long serialVersionUID = -9036042774272980800L;

	private String name;

	private String orderId;

	private Integer maching;

	private Integer discount;

	private Long projectBase;

	private Long managePrice;

	private Long materialPrice;

	private Long servicePrice;

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

	public Integer getMaching() {
		return maching;
	}

	public void setMaching(Integer maching) {
		this.maching = maching;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Long getProjectBase() {
		return projectBase;
	}

	public void setProjectBase(Long projectBase) {
		this.projectBase = projectBase;
	}

	public Long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Long managePrice) {
		this.managePrice = managePrice;
	}

	public Long getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(Long materialPrice) {
		this.materialPrice = materialPrice;
	}

	public Long getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(Long servicePrice) {
		this.servicePrice = servicePrice;
	}

}
