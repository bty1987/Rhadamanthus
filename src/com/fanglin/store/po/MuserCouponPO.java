package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "musercoupon", catalog = "store")
public class MuserCouponPO implements Serializable{

	private static final long serialVersionUID = 6813452178210140419L;
	
	public static final Short STATUS_ABLE_SHORT = 0;
	
	public static final Short STATUS_DISABLE_SHORT = 1; 
	
	private long mcid;
	
	private CouponPO coupon;
	
	private String unionId;
	
	private short status;

	public MuserCouponPO() {
		super();
	}

	public MuserCouponPO(CouponPO coupon) {
		super();
		this.coupon = coupon;
	}

	@Id
	@GeneratedValue
	@Column(name = "mcid")
	public long getMcid() {
		return mcid;
	}

	public void setMcid(long mcid) {
		this.mcid = mcid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public CouponPO getCoupon() {
		return coupon;
	}

	public void setCoupon(CouponPO coupon) {
		this.coupon = coupon;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
