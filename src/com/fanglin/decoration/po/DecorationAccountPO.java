package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationaccount", catalog = "decoration")
public class DecorationAccountPO implements Serializable {

	private static final long serialVersionUID = -2745701305737937262L;

	public static final String DECORATIONACCOUNT_ORDERID_STR = "orderId";

	private long daid;

	private String orderId;

	private String name;

	private short type;

	private Short typeness;

	private short arcal;

	private int matching;

	private int discount;

	private long discountBase;

	private int serviceRate;

	private long materialPrice;

	private long servicePrice;

	private int paidupMatching;

	private long difference;

	private long coupon;

	private long internal;

	private long fulldel;

	private long cashback;

	private String comment;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "daid")
	public long getDaid() {
		return daid;
	}

	public void setDaid(long daid) {
		this.daid = daid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "typeness")
	public Short getTypeness() {
		return typeness;
	}

	public void setTypeness(Short typeness) {
		this.typeness = typeness;
	}

	@Column(name = "matching")
	public int getMatching() {
		return matching;
	}

	public void setMatching(int matching) {
		this.matching = matching;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "materialPrice")
	public long getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(long materialPrice) {
		this.materialPrice = materialPrice;
	}

	@Column(name = "servicePrice")
	public long getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(long servicePrice) {
		this.servicePrice = servicePrice;
	}

	@Column(name = "serviceRate")
	public int getServiceRate() {
		return serviceRate;
	}

	public void setServiceRate(int serviceRate) {
		this.serviceRate = serviceRate;
	}

	@Column(name = "arcal")
	public short getArcal() {
		return arcal;
	}

	public void setArcal(short arcal) {
		this.arcal = arcal;
	}

	@Column(name = "discountBase")
	public long getDiscountBase() {
		return discountBase;
	}

	public void setDiscountBase(long discountBase) {
		this.discountBase = discountBase;
	}

	@Column(name = "paidupMatching")
	public int getPaidupMatching() {
		return paidupMatching;
	}

	public void setPaidupMatching(int paidupMatching) {
		this.paidupMatching = paidupMatching;
	}

	@Column(name = "difference")
	public long getDifference() {
		return difference;
	}

	public void setDifference(long difference) {
		this.difference = difference;
	}

	@Column(name = "coupon")
	public long getCoupon() {
		return coupon;
	}

	public void setCoupon(long coupon) {
		this.coupon = coupon;
	}

	@Column(name = "internal")
	public long getInternal() {
		return internal;
	}

	public void setInternal(long internal) {
		this.internal = internal;
	}

	@Column(name = "fulldel")
	public long getFulldel() {
		return fulldel;
	}

	public void setFulldel(long fulldel) {
		this.fulldel = fulldel;
	}

	@Column(name = "cashback")
	public long getCashback() {
		return cashback;
	}

	public void setCashback(long cashback) {
		this.cashback = cashback;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
