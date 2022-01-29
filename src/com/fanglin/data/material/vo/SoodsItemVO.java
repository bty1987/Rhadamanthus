package com.fanglin.data.material.vo;

import java.io.Serializable;

import com.fanglin.data.quotation.vo.QuotationItemVO;

public class SoodsItemVO implements Serializable {

	private static final long serialVersionUID = 7947027665683137145L;

	private Long siid;

	private Long sid;

	private Long qiid;

	private GoodsVO goods;

	private QuotationItemVO quotationItem;

	private Integer selling;

	private Integer num;

	private Short status;

	private Integer company;

	public SoodsItemVO() {
		super();
	}

	public SoodsItemVO(GoodsVO goods, QuotationItemVO quotationItem) {
		super();
		this.goods = goods;
		this.quotationItem = quotationItem;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
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

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
