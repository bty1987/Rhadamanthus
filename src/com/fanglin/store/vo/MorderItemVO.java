package com.fanglin.store.vo;

import java.io.Serializable;

public class MorderItemVO implements Serializable{

	private static final long serialVersionUID = -999546915671488911L;

	private Long oiid;
	
	private Long oid;
	
	private MpriceVO mprice;
	
	private Short num;

	public MorderItemVO() {
		super();
	}

	public MorderItemVO(MpriceVO mprice) {
		super();
		this.mprice = mprice;
	}

	public Long getOiid() {
		return oiid;
	}

	public void setOiid(Long oiid) {
		this.oiid = oiid;
	}
	
	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
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

}
