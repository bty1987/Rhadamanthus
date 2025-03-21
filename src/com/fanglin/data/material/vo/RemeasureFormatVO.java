/**
 * @File Name		: RemeasureFormatVO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;

public class RemeasureFormatVO implements Serializable {

	private static final long serialVersionUID = -1963696645745508692L;

	private Long rfid;

	private String name;

	private BrandVO brand;

	private QuotationItemVO quotationItem;

	private GoodsVO goods;

	private Short type;

	private Integer value;

	private Short status;

	private Integer company;

	public RemeasureFormatVO() {
		super();
	}

	public RemeasureFormatVO(BrandVO brand, QuotationItemVO quotationItem, GoodsVO goods) {
		super();
		this.brand = brand;
		this.quotationItem = quotationItem;
		this.goods = goods;
	}

	public Long getRfid() {
		return rfid;
	}

	public void setRfid(Long rfid) {
		this.rfid = rfid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
	}

	public GoodsVO getGoods() {
		return goods;
	}

	public void setGoods(GoodsVO goods) {
		this.goods = goods;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getValue() {
		return value;
	}

	public void setValue(Integer value) {
		this.value = value;
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
