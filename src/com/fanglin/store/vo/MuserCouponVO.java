package com.fanglin.store.vo;

import java.io.Serializable;

public class MuserCouponVO implements Serializable{

	private static final long serialVersionUID = -100964866731440865L;

	private Long mcid;
	
	private CouponVO coupon;
	
	private String unionId;
	
	private Short status;

	public MuserCouponVO() {
		super();
	}

	public MuserCouponVO(CouponVO coupon) {
		super();
		this.coupon = coupon;
	}

	public Long getMcid() {
		return mcid;
	}

	public void setMcid(Long mcid) {
		this.mcid = mcid;
	}

	public CouponVO getCoupon() {
		return coupon;
	}

	public void setCoupon(CouponVO coupon) {
		this.coupon = coupon;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}
