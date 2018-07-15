package com.fanglin.store.vo;

import java.io.Serializable;

public class MpaymentVO implements Serializable{

	private static final long serialVersionUID = 2914045848141541906L;

	private Long mpid;
	
	private MorderVO morder;
	
	private Float totalPrice;
	
	private Short type;
	
	private Short status;

	public MpaymentVO() {
		super();
	}

	public MpaymentVO(MorderVO morder) {
		super();
		this.morder = morder;
	}

	public Long getMpid() {
		return mpid;
	}

	public void setMpid(Long mpid) {
		this.mpid = mpid;
	}

	public MorderVO getMorder() {
		return morder;
	}

	public void setMorder(MorderVO morder) {
		this.morder = morder;
	}

	public Float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Float totalPrice) {
		this.totalPrice = totalPrice;
	}
	
	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
