package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.GoodsVO;

public class NormoodVO implements Serializable {

	private static final long serialVersionUID = 1212883150815441L;

	private Long ngid;// 定定额材料id

	private GoodsVO goods;// 商品

	private QuotationItemVO quotationItem;// 报价id

	private String normunit;// 定额单位

	private Integer normnum;// 定额数量
	
	private String storeunit;// 库房单位

	private Integer storenum;// 库房数量
	
	private Short status;

	private Long amount;
	
	public NormoodVO() {
		super();
	}

	public NormoodVO(GoodsVO goods, QuotationItemVO quotationItem) {
		super();
		this.goods = goods;
		this.quotationItem = quotationItem;
	}

	public Long getNgid() {
		return ngid;
	}

	public void setNgid(Long ngid) {
		this.ngid = ngid;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}
	
}
