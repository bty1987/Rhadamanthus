/**
 * @File Name		: QuotationItemVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class SystemDefineItemVO implements Serializable {

	private static final long serialVersionUID = -629582034818766395L;

	private Long sdiid;

	private String itemId;

	private Integer quotationBigCategoryId;

	private String quotationBigCategory;

	private String itemName;

	private Integer measurementUnitId;

	private String measurementUnit;

	private Integer itemWorkTypeId;

	private String itemWorkType;

	protected String quotationItemDes;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private Integer quotationTypeId;

	private Short status;

	private Short discount;

	public Long getSdiid() {
		return sdiid;
	}

	public void setSdiid(Long sdiid) {
		this.sdiid = sdiid;
	}

	public String getItemId() {
		return itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
	}

	public Integer getQuotationBigCategoryId() {
		return quotationBigCategoryId;
	}

	public void setQuotationBigCategoryId(Integer quotationBigCategoryId) {
		this.quotationBigCategoryId = quotationBigCategoryId;
	}

	public String getQuotationBigCategory() {
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(String quotationBigCategory) {
		this.quotationBigCategory = quotationBigCategory;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Integer getMeasurementUnitId() {
		return measurementUnitId;
	}

	public void setMeasurementUnitId(Integer measurementUnitId) {
		this.measurementUnitId = measurementUnitId;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public Integer getItemWorkTypeId() {
		return itemWorkTypeId;
	}

	public void setItemWorkTypeId(Integer itemWorkTypeId) {
		this.itemWorkTypeId = itemWorkTypeId;
	}

	public String getItemWorkType() {
		return itemWorkType;
	}

	public void setItemWorkType(String itemWorkType) {
		this.itemWorkType = itemWorkType;
	}

	public String getQuotationItemDes() {
		return quotationItemDes;
	}

	public void setQuotationItemDes(String quotationItemDes) {
		this.quotationItemDes = quotationItemDes;
	}

	public Integer getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Integer addPrice) {
		this.addPrice = addPrice;
	}

	public Integer getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Integer unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Integer getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(Integer subPrice) {
		this.subPrice = subPrice;
	}

	public Integer getQuotationTypeId() {
		return quotationTypeId;
	}

	public void setQuotationTypeId(Integer quotationTypeId) {
		this.quotationTypeId = quotationTypeId;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getDiscount() {
		return discount;
	}

	public void setDiscount(Short discount) {
		this.discount = discount;
	}

}
