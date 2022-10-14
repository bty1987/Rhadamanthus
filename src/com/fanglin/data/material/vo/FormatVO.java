package com.fanglin.data.material.vo;

import java.io.Serializable;

public class FormatVO implements Serializable {

	private static final long serialVersionUID = 3260050753581191133L;

	private Long fid;

	private Long gid;

	private GoodsVO goods;

	private String info;

	private Short status;

	public FormatVO() {
		super();
	}

	public FormatVO(Long fid) {
		super();
		this.fid = fid;
	}

	public FormatVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}

	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
