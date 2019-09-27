package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationHolonomyVO implements Serializable {

	private static final long serialVersionUID = -3908006385443580348L;

	private Long dhid;

	private DecorationVO decoration;

	private String name;

	private Integer maching;

	private Integer discount;

	private Long projectPrice;

	private Long managePrice;

	private Integer manageRate;

	private Long materialPrice;

	private Long servicePrice;

	private Integer serviceRate;

	private Long materialPaidup;

	private Long servicePaidup;

	private Short status;

	private Long psId;

	private Long discountBase;

	private Long projectBase;

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

	public Long getProjectPrice() {
		return projectPrice;
	}

	public void setProjectPrice(Long projectPrice) {
		this.projectPrice = projectPrice;
	}

	public Long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Long managePrice) {
		this.managePrice = managePrice;
	}

	public Integer getManageRate() {
		return manageRate;
	}

	public void setManageRate(Integer manageRate) {
		this.manageRate = manageRate;
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

	public Integer getServiceRate() {
		return serviceRate;
	}

	public void setServiceRate(Integer serviceRate) {
		this.serviceRate = serviceRate;
	}

	public Long getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(Long materialPaidup) {
		this.materialPaidup = materialPaidup;
	}

	public Long getServicePaidup() {
		return servicePaidup;
	}

	public void setServicePaidup(Long servicePaidup) {
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

	public Long getDiscountBase() {
		return discountBase;
	}

	public void setDiscountBase(Long discountBase) {
		this.discountBase = discountBase;
	}

	public Long getProjectBase() {
		return projectBase;
	}

	public void setProjectBase(Long projectBase) {
		this.projectBase = projectBase;
	}
}
