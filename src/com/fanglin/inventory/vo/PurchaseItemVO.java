package com.fanglin.inventory.vo;

import java.io.Serializable;

public class PurchaseItemVO implements Serializable {

	private static final long serialVersionUID = -2810451235285442491L;

	private Long piid;

	private Long pid;

	private Long siid;

	private GoodsVO goods;

	private ColorVO color;

	private FormatVO format;

	private StorehouseVO storehouse;

	private Float inprice;

	private Float num;

	private Float surplus;

	public PurchaseItemVO() {
		super();
	}

	public PurchaseItemVO(GoodsVO goods, ColorVO color, FormatVO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	public Long getPiid() {
		return piid;
	}

	public void setPiid(Long piid) {
		this.piid = piid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
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

	public Float getInprice() {
		return inprice;
	}

	public void setInprice(Float inprice) {
		this.inprice = inprice;
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
