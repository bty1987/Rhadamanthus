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

}
