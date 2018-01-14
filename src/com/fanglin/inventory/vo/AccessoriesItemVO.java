package com.fanglin.inventory.vo;

import java.io.Serializable;

public class AccessoriesItemVO implements Serializable{

	private static final long serialVersionUID = -4448576124164007315L;
	
	private Long aiid;
	
	private Long aid;
	
	private GoodsVO goods;
	
	private Float num;

	public AccessoriesItemVO() {
		super();
	}

	public AccessoriesItemVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}
	
	public Long getAiid() {
		return aiid;
	}

	public void setAiid(Long aiid) {
		this.aiid = aiid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
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
