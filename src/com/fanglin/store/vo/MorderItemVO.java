package com.fanglin.store.vo;

import java.io.Serializable;

public class MorderItemVO implements Serializable{

	private static final long serialVersionUID = -999546915671488911L;

	private Long oiid;
	
	private MorderVO morder;
	
	private MpriceVO mprice;
	
	private Short num;
	
	private Short status;

	public MorderItemVO() {
		super();
	}

	public MorderItemVO(MorderVO morder, MpriceVO mprice) {
		super();
		this.morder = morder;
		this.mprice = mprice;
	}

	public Long getOiid() {
		return oiid;
	}

	public void setOiid(Long oiid) {
		this.oiid = oiid;
	}

	public MorderVO getMorder() {
		return morder;
	}

	public void setMorder(MorderVO morder) {
		this.morder = morder;
	}

	public MpriceVO getMprice() {
		return mprice;
	}

	public void setMprice(MpriceVO mprice) {
		this.mprice = mprice;
	}

	public Short getNum() {
		return num;
	}

	public void setNum(Short num) {
		this.num = num;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}
