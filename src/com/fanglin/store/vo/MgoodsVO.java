package com.fanglin.store.vo;

import java.io.Serializable;

public class MgoodsVO implements Serializable{
	
	private static final long serialVersionUID = -4319485472492429001L;
	
	private Long gid;
	
	private String no;
	
	private String name;
	
	private String pinyinName;
	
	private String barcode;
	
	private MbrandVO mbrand;
	
	private String title;
	
	private String defaultImg;
	
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
	
	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}
	
	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}
	
	public MbrandVO getMbrand() {
		return mbrand;
	}

	public void setMbrand(MbrandVO mbrand) {
		this.mbrand = mbrand;
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
	
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}
