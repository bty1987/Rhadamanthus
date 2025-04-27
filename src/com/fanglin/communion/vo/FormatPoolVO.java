package com.fanglin.communion.vo;

import java.io.Serializable;

public class FormatPoolVO implements Serializable {

	private static final long serialVersionUID = -2422419101080978982L;

	private Long fpid;

	private GoodsPoolVO goodsPool;

	private String info;

	private Short status;

	public FormatPoolVO() {
		super();
	}

	public FormatPoolVO(Long fpid) {
		super();
		this.fpid = fpid;
	}

	public FormatPoolVO(GoodsPoolVO goodsPool) {
		super();
		this.goodsPool = goodsPool;
	}

	public Long getFpid() {
		return fpid;
	}

	public void setFpid(Long fpid) {
		this.fpid = fpid;
	}

	public GoodsPoolVO getGoodsPool() {
		return goodsPool;
	}

	public void setGoodsPool(GoodsPoolVO goodsPool) {
		this.goodsPool = goodsPool;
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
