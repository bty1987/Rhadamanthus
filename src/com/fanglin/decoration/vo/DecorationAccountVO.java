package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class DecorationAccountVO implements Serializable {

	private static final long serialVersionUID = 1175981581653015544L;

	private Long daid;

	private DecorationVO decoration;

	private String name;

	private String orderId;

	private Short type;

	private Short typeness;

	private Short arcal;

	private Integer matching;

	private Integer discount;

	private Long discountBase;

	private Integer serviceRate;

	private Long materialPrice;

	private Long servicePrice;

	private Long projectPrice;

	private Long projectBase;

	private Integer paidupMatching;

	private Long difference;

	private Long coupon;

	private Long fulldel;

	private Long cashback;

	private Long internal;

	private Short isAffirm;

	private Timestamp affirmTime;

	private String comment;

	public DecorationAccountVO() {
		super();
	}

	public DecorationAccountVO(String orderId) {
		super();
		this.orderId = orderId;
	}

	public Long getDaid() {
		return daid;
	}

	public void setDaid(Long daid) {
		this.daid = daid;
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

	public Short getTypeness() {
		return typeness;
	}

	public void setTypeness(Short typeness) {
		this.typeness = typeness;
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

	public Long getProjectPrice() {
		return projectPrice;
	}

	public void setProjectPrice(Long projectPrice) {
		this.projectPrice = projectPrice;
	}

	public Long getProjectBase() {
		return projectBase;
	}

	public void setProjectBase(Long projectBase) {
		this.projectBase = projectBase;
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

	public Integer getPaidupMatching() {
		return paidupMatching;
	}

	public void setPaidupMatching(Integer paidupMatching) {
		this.paidupMatching = paidupMatching;
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

	public Long getInternal() {
		return internal;
	}

	public void setInternal(Long internal) {
		this.internal = internal;
	}

	public Short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(Short isAffirm) {
		this.isAffirm = isAffirm;
	}

	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
