package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.NoodsVO;

public class NormoodVO implements Serializable {

	private static final long serialVersionUID = 1212883150815441L;

	private Long ngid;// 定定额材料id

	private String name;

	private NoodsVO noods; // 定材

	private QuotationItemVO quotationItem;// 报价id

	private String normunit;// 定额单位

	private Integer normnum;// 定额数量

	private String storeunit;// 库房单位

	private Integer storenum;// 库房数量

	private Integer price;

	private Short status;

	private Long amount;

	public NormoodVO() {
		super();
	}

	public NormoodVO(NoodsVO noods, QuotationItemVO quotationItem) {

		super();

		this.noods = noods;
		this.quotationItem = quotationItem;
	}

	public Long getNgid() {
		return ngid;
	}

	public void setNgid(Long ngid) {
		this.ngid = ngid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public NoodsVO getNoods() {
		return noods;
	}

	public void setNoods(NoodsVO noods) {
		this.noods = noods;
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

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
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
