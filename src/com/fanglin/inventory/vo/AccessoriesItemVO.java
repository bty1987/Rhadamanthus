package com.fanglin.inventory.vo;

import java.io.Serializable;

public class AccessoriesItemVO implements Serializable {

	private static final long serialVersionUID = -4448576124164007315L;

	private Long aiid;

	private Long aid;

	private GoodsVO goods;

	private ColorVO color;

	private FormatVO format;

	private StorehouseVO storehouse;
	
	private Float selling;
	
	private Float outprice;

	private Float num;
	
	private Float surplus;

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

	public ColorVO getColor() {
		return color;
	}

	public void setColor(ColorVO color) {
		this.color = color;
	}

	public FormatVO getFormat() {
		return format;
	}

	public void setFormat(FormatVO format) {
		this.format = format;
	}

	public StorehouseVO getStorehouse() {
		return storehouse;
	}

	public void setStorehouse(StorehouseVO storehouse) {
		this.storehouse = storehouse;
	}

	public Float getSelling() {
		return selling;
	}

	public void setSelling(Float selling) {
		this.selling = selling;
	}

	public Float getOutprice() {
		return outprice;
	}

	public void setOutprice(Float outprice) {
		this.outprice = outprice;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getSurplus() {
		return surplus;
	}

	public void setSurplus(Float surplus) {
		this.surplus = surplus;
	}

}
