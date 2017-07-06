package com.fanglin.inventory.vo;

import java.io.Serializable;

public class AssisOrderItemVO implements Serializable{

	private static final long serialVersionUID = -4448576124164007315L;
	
	private Long aoiid;
	
	private Long aoid;
	
	private GoodsVO goods;
	
	private ColorVO color;
	
	private FormatVO format;
	
	private Float num;

	public AssisOrderItemVO() {
		super();
	}

	public AssisOrderItemVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}
	
	public AssisOrderItemVO(GoodsVO goods, ColorVO color, FormatVO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
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

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

}
