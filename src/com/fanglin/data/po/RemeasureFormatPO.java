/**
 * @File Name		: QuotationItemPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.BrandPO;
import com.fanglin.data.material.vo.RemeasureFormatVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "remeasureformat", catalog = "data")
public class RemeasureFormatPO implements Serializable {

	private static final long serialVersionUID = -2588378911821136184L;

	public static final String COLUMN_NAME_INT = "name";

	public static final String COLUMN_BRAND_INT = "brand.bid";

	public static final String COLUMN_TYPE_INT = "type";

	public static final String COLUMN_STATUS_INT = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long rfid;

	private String name;

	private BrandPO brand;

	private QuotationItemPO quotationItem;

	private GoodsPO goods;

	private short type;

	private int value;

	private short status;

	private int company;

	public RemeasureFormatPO() {
		super();
	}

	public RemeasureFormatPO(long rfid) {
		super();
		this.rfid = rfid;
	}

	public RemeasureFormatPO(BrandPO brand) {
		super();
		this.brand = brand;
	}

	public RemeasureFormatPO(BrandPO brand, QuotationItemPO quotationItem, GoodsPO goods) {
		super();
		this.brand = brand;
		this.quotationItem = quotationItem;
		this.goods = goods;
	}

	@Id
	@GeneratedValue
	@Column(name = "rfid")
	public long getRfid() {
		return rfid;
	}

	public void setRfid(long rfid) {
		this.rfid = rfid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qiid", referencedColumnName = "qiid")
	public QuotationItemPO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemPO quotationItem) {
		this.quotationItem = quotationItem;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "value")
	public int getValue() {
		return value;
	}

	public void setValue(int value) {
		this.value = value;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public RemeasureFormatVO ptv(RemeasureFormatVO remeasureFormatVO) {

		BeanUtil.copyProperties(this, remeasureFormatVO, Arrays.asList("brand", "quotationItem", "goods"));

		if (remeasureFormatVO.getBrand() != null && getBrand() != null) BeanUtil.copyPropertie(getBrand(), remeasureFormatVO.getBrand(), Arrays.asList("supplier"));
		if (remeasureFormatVO.getQuotationItem() != null && getQuotationItem() != null) getQuotationItem().ptv(remeasureFormatVO.getQuotationItem());
		if (remeasureFormatVO.getGoods() != null && getGoods() != null) getGoods().ptv(remeasureFormatVO.getGoods());

		return remeasureFormatVO;
	}
}
