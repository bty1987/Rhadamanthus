package com.fanglin.store.vo;

import java.io.Serializable;
public class CouponVO implements Serializable{

	private static final long serialVersionUID = 2652232359053489394L;
	
	private Long cid;
	
	private MgoodsVO mgoods;
	
	private String title;
	
	private Float value;
	
	private Short type;
	
	private Short status;

	public CouponVO() {
		super();
	}

	public CouponVO(MgoodsVO mgoods) {
		super();
		this.mgoods = mgoods;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}
	
	public MgoodsVO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsVO mgoods) {
		this.mgoods = mgoods;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Float getValue() {
		return value;
	}

	public void setValue(Float value) {
		this.value = value;
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
