package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.material.vo.GoodsVO;

public class NormoodVO implements Serializable{

	private static final long serialVersionUID = 1212883150815441L;

	private Long ngid;// 定定额材料id
	
	private GoodsVO goods;// 商品
	
	private QuotationItemVO quotationItem;// 报价id
	
	private Integer num;// 数量
	
	private Short status;

	public NormoodVO(){
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

}
