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

public class QuotationItemVO implements Serializable {

	private static final long serialVersionUID = -629582034818766395L;

	private Long qiId;

	private String itemId;

	private Integer quotationTypeId;

	private String quotationType;

	private Integer quotationClassificationId;

	private String quotationClassification;

	private Integer quotationBigCategoryId;

	private String quotationBigCategory;

	private Integer quotationSmallCategoryId;

	private String quotationSmallCategory;

	private String itemName;

	private Integer measurementUnitId;

	private String measurementUnit;

	private Integer workTypeId;

	private String workType;

	private String quotationItemDes;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private String versionId;

	private String version;

	private Short status;

	private Short discount;

	public Long getQiId() {
		return qiId;
	}

	public void setQiId(Long qiId) {
		this.qiId = qiId;
	}

	public String getItemId() {
		return itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
	}

	public Integer getQuotationTypeId() {
		return quotationTypeId;
	}

	public void setQuotationTypeId(Integer quotationTypeId) {
		this.quotationTypeId = quotationTypeId;
	}

	public String getQuotationType() {
		return quotationType;
	}

	public void setQuotationType(String quotationType) {
		this.quotationType = quotationType;
	}

	public Integer getQuotationClassificationId() {
		return quotationClassificationId;
	}

	public void setQuotationClassificationId(Integer quotationClassificationId) {
		this.quotationClassificationId = quotationClassificationId;
	}

	public String getQuotationClassification() {
		return quotationClassification;
	}

	public void setQuotationClassification(String quotationClassification) {
		this.quotationClassification = quotationClassification;
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

	public Integer getQuotationSmallCategoryId() {
		return quotationSmallCategoryId;
	}

	public void setQuotationSmallCategoryId(Integer quotationSmallCategoryId) {
		this.quotationSmallCategoryId = quotationSmallCategoryId;
	}

	public String getQuotationSmallCategory() {
		return quotationSmallCategory;
	}

	public void setQuotationSmallCategory(String quotationSmallCategory) {
		this.quotationSmallCategory = quotationSmallCategory;
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

	public Integer getWorkTypeId() {
		return workTypeId;
	}

	public void setWorkTypeId(Integer workTypeId) {
		this.workTypeId = workTypeId;
	}

	public String getWorkType() {
		return workType;
	}

	public void setWorkType(String workType) {
		this.workType = workType;
	}

	public String getQuotationItemDes() {
		return quotationItemDes;
	}

	public void setQuotationItemDes(String quotationItemDes) {
		this.quotationItemDes = quotationItemDes;
	}

	public Integer getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Integer unitPrice) {
		this.unitPrice = unitPrice;
	}

	public String getVersionId() {
		return versionId;
	}

	public void setVersionId(String versionId) {
		this.versionId = versionId;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
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

	public Integer getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Integer addPrice) {
		this.addPrice = addPrice;
	}

	public Integer getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(Integer subPrice) {
		this.subPrice = subPrice;
	}

}
