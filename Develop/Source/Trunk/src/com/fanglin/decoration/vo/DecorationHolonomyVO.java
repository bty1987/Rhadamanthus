package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationHolonomyVO implements Serializable {

	private static final long serialVersionUID = -3908006385443580348L;
	
	private Long dhid;
	
	private DecorationVO decoration;
	
	private String name;
	
	private Float maching;
	
	private Float discount;	
	
	private Float projectPrice;
	
	private Float managePrice;	
	
	private Float manageRate;	
	
	private Float materialPrice;	
	
	private Float servicePrice;	
		
	private Float serviceRate;
	
	private Float materialPaidup;	
	
	private Float servicePaidup;
	
	private Short status;
	
	private Long psId;
	
	public DecorationHolonomyVO() {
		super();
	}

	public DecorationHolonomyVO(DecorationVO decoration) {
		super();
		this.decoration = decoration;
	}


	public Long getDhid() {
		return dhid;
	}

	public void setDhid(Long dhid) {
		this.dhid = dhid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public Float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Float managePrice) {
		this.managePrice = managePrice;
	}

	public Float getManageRate() {
		return manageRate;
	}

	public void setManageRate(Float manageRate) {
		this.manageRate = manageRate;
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

	public Float getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(Float materialPaidup) {
		this.materialPaidup = materialPaidup;
	}

	public Float getServicePaidup() {
		return servicePaidup;
	}

	public void setServicePaidup(Float servicePaidup) {
		this.servicePaidup = servicePaidup;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getPsId() {
		return psId;
	}

	public void setPsId(Long psId) {
		this.psId = psId;
	}




}
