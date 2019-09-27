package com.fanglin.store.vo;

import java.io.Serializable;

public class CartVO implements Serializable {

	private static final long serialVersionUID = 3912729427287367340L;

	private Long cid;

	private Long uid;

	private MpriceVO mprice;

	private Integer num;

	public CartVO() {
		super();
	}

	public CartVO(MpriceVO mprice) {
		super();
		this.mprice = mprice;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public MpriceVO getMprice() {
		return mprice;
	}

	public void setMprice(MpriceVO mprice) {
		this.mprice = mprice;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

}
