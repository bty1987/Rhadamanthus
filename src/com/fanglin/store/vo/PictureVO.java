package com.fanglin.store.vo;

import java.io.Serializable;

public class PictureVO implements Serializable{
	
	private static final long serialVersionUID = -4219435471492418004L;
	
	private Long pid;
	
	private Long gid;
	
	private String img;
	
	private Short type;
	
	private Short sort;

	public PictureVO() {
		super();
	}
	
	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}
	
	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
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
	
	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}
	
}
