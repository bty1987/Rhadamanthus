package com.fanglin.inventory.vo;

import java.io.Serializable;

public class AssisOrderItemVO implements Serializable{

	private static final long serialVersionUID = -4448576124164007315L;
	
	private Long aoiid;
	
	private Long aoid;
	
	private GoodsVO goods;
	
	private Float num;

	public AssisOrderItemVO() {
		super();
	}

	public AssisOrderItemVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}

	public Long getAoiid() {
		return aoiid;
	}

	public void setAoiid(Long aoiid) {
		this.aoiid = aoiid;
	}

	public Long getAoid() {
		return aoid;
	}

	public void setAoid(Long aoid) {
		this.aoid = aoid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

}
