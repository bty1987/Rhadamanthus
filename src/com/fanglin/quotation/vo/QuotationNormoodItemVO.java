package com.fanglin.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.GoodsVO;

public class QuotationNormoodItemVO implements Serializable {

	private static final long serialVersionUID = -8588021017285231854L;

	private Long qngiid;

	private Long qid;

	private Long sid;

	private Long areald;

	private Long quoteld;

	private Long qiid;

	private Short type;

	private Short normtype;

	private Short atttype;

	private GoodsVO goods;

	private String normunit;

	private Integer normnum;

	private String storeunit;

	private Integer storenum;

	public QuotationNormoodItemVO() {
		super();
	}

	public QuotationNormoodItemVO(GoodsVO goods) {
		super();
		this.goods = goods;
	}

	public Long getQngiid() {
		return qngiid;
	}

	public void setQngiid(Long qngiid) {
		this.qngiid = qngiid;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getAreald() {
		return areald;
	}

	public void setAreald(Long areald) {
		this.areald = areald;
	}

	public Long getQuoteld() {
		return quoteld;
	}

	public void setQuoteld(Long quoteld) {
		this.quoteld = quoteld;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getNormtype() {
		return normtype;
	}

	public void setNormtype(Short normtype) {
		this.normtype = normtype;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	public Integer getNormnum() {
		return normnum;
	}

	public void setNormnum(Integer normnum) {
		this.normnum = normnum;
	}

	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	public Integer getStorenum() {
		return storenum;
	}

	public void setStorenum(Integer storenum) {
		this.storenum = storenum;
	}
}
