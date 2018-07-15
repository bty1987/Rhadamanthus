package com.fanglin.store.vo;

import java.io.Serializable;

public class MgoodsVO implements Serializable{
	
	private static final long serialVersionUID = -4319485472492429001L;
	
	private Long gid;
	
	private String no;
	
	private String name;
	
	private String pinyin;
	
	private MbrandVO mbrand;
	
	private String barcode;
	
	private String title;
	
	private String defaultImg;
	
	private Float price;
	
	private Short status;

	public MgoodsVO() {
		super();
	}

	public MgoodsVO(MbrandVO mbrand) {
		super();
		this.mbrand = mbrand;
	}
	
	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}
	
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public MbrandVO getMbrand() {
		return mbrand;
	}

	public void setMbrand(MbrandVO mbrand) {
		this.mbrand = mbrand;
	}
	
	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getDefaultImg() {
		return defaultImg;
	}

	public void setDefaultImg(String defaultImg) {
		this.defaultImg = defaultImg;
	}
	
	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
}
