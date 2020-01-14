package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationAccountVO implements Serializable {

	private static final long serialVersionUID = 1175981581653015544L;

	private Long daid;

	private String orderId;

	private Short type;

	private Short arcal;

	private Integer matching;

	private Integer discount;

	private Long discountBase;

	private Integer serviceRate;

	private Long materialPrice;

	private Long servicePrice;

	private Long difference;

	private Long coupon;

	private Long fulldel;

	private Long cashback;

	private String comment;

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

	public Integer getMatching() {
		return matching;
	}

	public void setMatching(Integer matching) {
		this.matching = matching;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
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

	public Short getArcal() {
		return arcal;
	}

	public void setArcal(Short arcal) {
		this.arcal = arcal;
	}

	public Long getDiscountBase() {
		return discountBase;
	}

	public void setDiscountBase(Long discountBase) {
		this.discountBase = discountBase;
	}

	public Long getDifference() {
		return difference;
	}

	public void setDifference(Long difference) {
		this.difference = difference;
	}

	public Long getCoupon() {
		return coupon;
	}

	public void setCoupon(Long coupon) {
		this.coupon = coupon;
	}

	public Long getFulldel() {
		return fulldel;
	}

	public void setFulldel(Long fulldel) {
		this.fulldel = fulldel;
	}

	public Long getCashback() {
		return cashback;
	}

	public void setCashback(Long cashback) {
		this.cashback = cashback;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
