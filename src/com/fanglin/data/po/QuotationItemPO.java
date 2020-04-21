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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.communion.po.QuotationBigCategoryPO;
import com.fanglin.communion.po.QuotationClassificationPO;
import com.fanglin.communion.po.QuotationSmallCategoryPO;
import com.fanglin.communion.po.QuotationTypePO;
import com.fanglin.communion.po.WorkTypePO;

@Entity
@Table(name = "quotationItem", catalog = "quotation")
public class QuotationItemPO implements Serializable {

	private static final long serialVersionUID = -7382384455543326014L;
	
	public static final String[] COLUMN_ARRAYS_STR = {"quotationType", "quotationClassification","quotationBigCategory","quotationSmallCategory", "measurementUnit","workType","quotationVersion"};

	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_COMPANY_STR = "company";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long qiId;

	private String itemId;

	private String itemName;

	private int addPrice; // 增补价

	private int unitPrice; // 单价

	private int subPrice; // 退减价

	private QuotationTypePO quotationType;

	private QuotationClassificationPO quotationClassification;

	private QuotationBigCategoryPO quotationBigCategory;

	private QuotationSmallCategoryPO quotationSmallCategory;

	private MeasurementUnitPO measurementUnit;

	private WorkTypePO workType;

	private QuotationVersionPO quotationVersion;

	private String quotationItemDes;

	private short status;

	private short discount;

	public QuotationItemPO() {
		super();
	}

	public QuotationItemPO(long qiId) {
		this.qiId = qiId;
	}

	@Id
	@GeneratedValue
	@Column(name = "qiId")
	public long getQiId() {
		return qiId;
	}

	public void setQiId(long qiId) {
		this.qiId = qiId;
	}

	@Column(name = "itemId")
	public String getItemId() {
		return itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "quotationTypeId")
	public QuotationTypePO getQuotationType() {
		return quotationType;
	}

	public void setQuotationType(QuotationTypePO quotationType) {
		this.quotationType = quotationType;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "quotationClassificationId")
	public QuotationClassificationPO getQuotationClassification() {
		return quotationClassification;
	}

	public void setQuotationClassification(QuotationClassificationPO quotationClassification) {
		this.quotationClassification = quotationClassification;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "quotationBigCategoryId")
	public QuotationBigCategoryPO getQuotationBigCategory() {
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(QuotationBigCategoryPO quotationBigCategory) {
		this.quotationBigCategory = quotationBigCategory;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "quotationSmallCategoryId")
	public QuotationSmallCategoryPO getQuotationSmallCategory() {
		return quotationSmallCategory;
	}

	public void setQuotationSmallCategory(QuotationSmallCategoryPO quotationSmallCategory) {
		this.quotationSmallCategory = quotationSmallCategory;
	}

	@Column(name = "itemName")
	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "measurementUnitId")
	public MeasurementUnitPO getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitPO measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "itemWorkTypeId")
	public WorkTypePO getWorkType() {
		return workType;
	}

	public void setWorkType(WorkTypePO workType) {
		this.workType = workType;
	}

	@Column(name = "quotationItemDes")
	public String getQuotationItemDes() {
		return quotationItemDes;
	}

	public void setQuotationItemDes(String quotationItemDes) {
		this.quotationItemDes = quotationItemDes;
	}

	@Column(name = "addPrice")
	public int getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(int addPrice) {
		this.addPrice = addPrice;
	}

	@Column(name = "unitPrice")
	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "subPrice")
	public int getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(int subPrice) {
		this.subPrice = subPrice;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "versionId", referencedColumnName = "no")
	public QuotationVersionPO getQuotationVersion() {
		return quotationVersion;
	}

	public void setQuotationVersion(QuotationVersionPO quotationVersion) {
		this.quotationVersion = quotationVersion;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "discount")
	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

}
