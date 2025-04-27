package com.fanglin.communion.vo;

import java.io.Serializable;

public class ColorPoolVO implements Serializable {

	private static final long serialVersionUID = -5742949570684820088L;

	private Long cpid;

	private GoodsPoolVO goodsPool;

	private String name;

	private Short status;

	public ColorPoolVO() {
		super();
	}

	public ColorPoolVO(Long cpid) {
		super();
		this.cpid = cpid;
	}

	public ColorPoolVO(GoodsPoolVO goodsPool) {
		super();
		this.goodsPool = goodsPool;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public GoodsPoolVO getGoodsPool() {
		return goodsPool;
	}

	public void setGoodsPool(GoodsPoolVO goodsPool) {
		this.goodsPool = goodsPool;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
