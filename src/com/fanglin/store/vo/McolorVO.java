package com.fanglin.store.vo;

import java.io.Serializable;

public class McolorVO implements Serializable {

	private static final long serialVersionUID = 2210447925127451057L;

	private Long cid;
	
	private MgoodsVO mgoods;
	
	private String color;
	
	private Short status;

	public McolorVO() {
		super();
	}

	public McolorVO(MgoodsVO mgoods) {
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

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
}
