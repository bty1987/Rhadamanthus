package com.fanglin.data.material.vo;

import java.io.Serializable;

import com.fanglin.data.quotation.vo.QuotationItemVO;

public class SoodsVO implements Serializable {

	private static final long serialVersionUID = 7947027665683137145L;

	private Long sid;

	private String name;

	private GoodsVO goods;

	private Long qiid;

	private QuotationItemVO quotationItem;

	private Integer num;

	private Integer selling;

	private Integer cost;

	private Integer balance;

	private String path;

	private Short status;

	private Integer company;

	public SoodsVO() {
		super();
	}

	public SoodsVO(GoodsVO goods, QuotationItemVO quotationItem) {
		super();
		this.goods = goods;
		this.quotationItem = quotationItem;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
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

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getCost() {
		return cost;
	}

	public void setCost(Integer cost) {
		this.cost = cost;
	}

	public Integer getBalance() {
		return balance;
	}

	public void setBalance(Integer balance) {
		this.balance = balance;
	}

}
