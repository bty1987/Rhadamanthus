package com.fanglin.store.vo;

import java.io.Serializable;

public class MpriceVO implements Serializable {

	private static final long serialVersionUID = 9110830259505743618L;

	private Long pid;

	private String name;

	private Long price;

	private MgoodsVO mgoods;

	private McolorVO mcolor;

	private MformatVO mformat;

	private String img;

	private Short status;

	public MpriceVO() {
		super();
	}

	public MpriceVO(MgoodsVO goods, McolorVO color, MformatVO format) {
		super();
		this.mgoods = goods;
		this.mcolor = color;
		this.mformat = format;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getPrice() {
		return price;
	}

	public void setPrice(Long price) {
		this.price = price;
	}

	public MgoodsVO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsVO mgoods) {
		this.mgoods = mgoods;
	}

	public McolorVO getMcolor() {
		return mcolor;
	}

	public void setMcolor(McolorVO mcolor) {
		this.mcolor = mcolor;
	}

	public MformatVO getMformat() {
		return mformat;
	}

	public void setMformat(MformatVO mformat) {
		this.mformat = mformat;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
