package com.fanglin.inventory.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;

public class PurchaseItemVO implements Serializable {

	private static final long serialVersionUID = -2810451235285442491L;

	private Long piid;

	private Long pid;

	private Long siid;

	private GoodsVO goods;

	private ColorVO color;

	private FormatVO format;

	private StorehouseVO storehouse;

	private Integer inprice;

	private Integer num;

	private Integer surplus;

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

	public Integer getInprice() {
		return inprice;
	}

	public void setInprice(Integer inprice) {
		this.inprice = inprice;
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
	
