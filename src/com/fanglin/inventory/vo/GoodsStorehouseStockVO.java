package com.fanglin.inventory.vo;

public class GoodsStorehouseStockVO implements java.io.Serializable {

	private static final long serialVersionUID = -2766361593114200646L;

	private Long gshsid;
	
	private GoodsVO goods;
	
	private ColorVO color;
	
	private FormatVO format;
	
	private StorehouseVO storehouse;
	
	private Integer num;
	
	public GoodsStorehouseStockVO() {
		super();
	}

	public GoodsStorehouseStockVO(GoodsVO goods, ColorVO color,FormatVO format,StorehouseVO storehouse) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
		this.storehouse = storehouse;
	}

	public Long getGshsid() {
		return gshsid;
	}

	public void setGshsid(Long gshsid) {
		this.gshsid = gshsid;
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

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

}