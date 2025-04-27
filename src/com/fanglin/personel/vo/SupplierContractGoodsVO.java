package com.fanglin.personel.vo;

import com.fanglin.data.po.GoodsPO;

public class SupplierContractGoodsVO implements java.io.Serializable {

	private static final long serialVersionUID = -9071186016137154118L;

	private Long scgid;

	private Long scid;

	private GoodsPO goods;

	private Integer price;

	private Integer balance;

	public SupplierContractGoodsVO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	public SupplierContractGoodsVO() {
		super();
	}

	public SupplierContractGoodsVO(Long scgid, Long scid, GoodsPO goods, Integer price, Integer balance) {
		super();
		this.scgid = scgid;
		this.scid = scid;
		this.goods = goods;
		this.price = price;
		this.balance = balance;
	}

	public Long getScgid() {
		return scgid;
	}

	public void setScgid(Long scgid) {
		this.scgid = scgid;
	}

	public Long getScid() {
		return scid;
	}

	public void setScid(Long scid) {
		this.scid = scid;
	}

	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Integer getBalance() {
		return balance;
	}

	public void setBalance(Integer balance) {
		this.balance = balance;
	}

}
