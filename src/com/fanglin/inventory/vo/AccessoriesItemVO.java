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
	
	private Integer selling;
	
	private Integer outprice;

	private Integer num;
	
	private Integer surplus;

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

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getOutprice() {
		return outprice;
	}

	public void setOutprice(Integer outprice) {
		this.outprice = outprice;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getSurplus() {
		return surplus;
	}

	public void setSurplus(Integer surplus) {
		this.surplus = surplus;
	}

}
