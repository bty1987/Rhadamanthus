package com.fanglin.data.common.vo;

import java.io.Serializable;

public class GoodsKindVO implements Serializable {

	private static final long serialVersionUID = -2606542965783450955L;

	private Long gkid;

	private String no;

	private String name;

	private Short level;

	private Short status;

	public GoodsKindVO() {
		super();
	}

	public Long getGkid() {
		return gkid;
	}

	public void setGkid(Long gkid) {
		this.gkid = gkid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getLevel() {
		return level;
	}

	public void setLevel(Short level) {
		this.level = level;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
