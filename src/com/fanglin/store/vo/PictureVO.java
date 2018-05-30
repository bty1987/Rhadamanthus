package com.fanglin.store.vo;

import java.io.Serializable;

public class PictureVO implements Serializable{
	
	private static final long serialVersionUID = -4219435471492418004L;
	
	private Long pid;
	
	private MgoodsVO mgoods;
	
	private String img;
	
	private Short type;
	
	private Short status;
	
	private Short sort;

	public PictureVO() {
		super();
	}

	public PictureVO(MgoodsVO mgoods) {
		super();
		this.mgoods = mgoods;
	}
	
	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}
	
	public MgoodsVO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsVO mgoods) {
		this.mgoods = mgoods;
	}
	
	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
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
	
	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}
	
}
