package com.fanglin.approval.vo;

import java.io.Serializable;

import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;

import com.fanglin.inventory.vo.StorehouseVO;

public class ApprovalManifestDBItemVO implements Serializable{

	private static final long serialVersionUID = 2363581968985577616L;
	
	private Long amdbiid;
	
	private Long amdbid;
	
	private GoodsVO goods;
	
	private ColorVO color;
	
	private FormatVO format;
	
	private StorehouseVO instorehouse; 
	
	private StorehouseVO outstorehouse;
	
	private Float num ;
	
	private String comment;
	
	public ApprovalManifestDBItemVO(){
		super();
	}

	public ApprovalManifestDBItemVO(GoodsVO goods, ColorVO color,
			FormatVO format, StorehouseVO instorehouse,
			StorehouseVO outstorehouse) {
		super();
		this.goods = goods;
		this.color = color;
		this.format = format;
		this.instorehouse = instorehouse;
		this.outstorehouse = outstorehouse;
	}

	public Long getAmdbiid() {
		return amdbiid;
	}
	public void setAmdbiid(Long amdbiid) {
		this.amdbiid = amdbiid;
	}
	public Long getAmdbid() {
		return amdbid;
	}
	public void setAmdbid(Long amdbid) {
		this.amdbid = amdbid;
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

	public StorehouseVO getInstorehouse() {
		return instorehouse;
	}
	public void setInstorehouse(StorehouseVO instorehouse) {
		this.instorehouse = instorehouse;
	}
	public StorehouseVO getOutstorehouse() {
		return outstorehouse;
	}
	public void setOutstorehouse(StorehouseVO outstorehouse) {
		this.outstorehouse = outstorehouse;
	}
	public Float getNum() {
		return num;
	}
	public void setNum(Float num) {
		this.num = num;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
}
