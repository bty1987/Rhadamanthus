package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationAccountVO implements Serializable{

	private static final long serialVersionUID = 1175981581653015544L;
	
	private Long daid;
	
	private String orderId;
	
	private Short type;
	
	private Float maching;
	
	private Float discount;
	
	private Float projectPrice;
	
	private Float materialPrice;
	
	private Float servicePrice;
	
	private Float serviceRate;
	
	
	
	public Long getDaid() {
		return daid;
	}

	public void setDaid(Long daid) {
		this.daid = daid;
	}
	
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
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

	public Float getProjectPrice() {
		return projectPrice;
	}

	public void setProjectPrice(Float projectPrice) {
		this.projectPrice = projectPrice;
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

	public Float getServiceRate() {
		return serviceRate;
	}

	public void setServiceRate(Float serviceRate) {
		this.serviceRate = serviceRate;
	}
	
	
	
	
	
}
