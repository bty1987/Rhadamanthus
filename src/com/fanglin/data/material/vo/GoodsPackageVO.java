package com.fanglin.data.material.vo;

import java.io.Serializable;


public class GoodsPackageVO implements Serializable {

	private static final long serialVersionUID = -3150381870201634575L;

	private Long gpid;

	private Long pid;

	private GoodsVO goods;

	private ColorVO color;

	private FormatVO format;

	private Integer num;

	private Integer purchase;  // 限价

	private Integer selling;   // 售价

	private Integer confine;   // 控价

	private Short ctype;       // 结算类型

	private Integer cvalue;    // 结算值

	public GoodsPackageVO() {
		super();
	}

	public GoodsPackageVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}

	public GoodsPackageVO(GoodsVO goods, ColorVO color, FormatVO format) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
	}

	public Long getGpid() {
		return gpid;
	}

	public void setGpid(Long gpid) {
		this.gpid = gpid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
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

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getPurchase() {
		return purchase;
	}

	public void setPurchase(Integer purchase) {
		this.purchase = purchase;
	}

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getConfine() {
		return confine;
	}

	public void setConfine(Integer confine) {
		this.confine = confine;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Integer getCvalue() {
		return cvalue;
	}

	public void setCvalue(Integer cvalue) {
		this.cvalue = cvalue;
	}

}
