package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class PresignPriceVO implements Serializable {

	private static final long serialVersionUID = 2409973812855559421L;

	private Long pspid;

	private Long ppid;

	private String name;

	private Integer upperArea;

	private Integer lowerArea;

	private Long price;

	private Integer costPrice;

	private Integer mostPrice;

	private Short status;

	public PresignPriceVO() {
		super();
	}

	public Long getPspid() {
		return pspid;
	}

	public void setPspid(Long pspid) {
		this.pspid = pspid;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getUpperArea() {
		return upperArea;
	}

	public void setUpperArea(Integer upperArea) {
		this.upperArea = upperArea;
	}

	public Integer getLowerArea() {
		return lowerArea;
	}

	public void setLowerArea(Integer lowerArea) {
		this.lowerArea = lowerArea;
	}

	public Long getPrice() {
		return price;
	}

	public void setPrice(Long price) {
		this.price = price;
	}

	public Integer getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Integer costPrice) {
		this.costPrice = costPrice;
	}

	public Integer getMostPrice() {
		return mostPrice;
	}

	public void setMostPrice(Integer mostPrice) {
		this.mostPrice = mostPrice;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
