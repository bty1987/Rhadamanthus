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

package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.po.WorkTypePO;

@Entity
@Table(name = "quotationItem", catalog = "platform")
public class QuotationItemPO implements Serializable {

	private static final long serialVersionUID = -7382384455543326014L;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	private long autoId;
	
	private String itemId;
	
	private String itemName;
	
	private float unitPrice;
	
	private QuotationTypePO quotationType;
	
	private QuotationClassificationPO quotationClassification;
	
	private QuotationBigCategoryPO quotationBigCategory;
	
	private QuotationSmallCategoryPO quotationSmallCategory;
	
	private MeasurementUnitPO measurementUnit;
	
	private WorkTypePO workType;
	
	private QuotationVersionPO quotationVersion;
	
	private String quotationItemDes;
	
	private short status;

	public QuotationItemPO(){
		
	}
	
	public QuotationItemPO(long autoId){
		this.autoId = autoId;
	}
	
	@Id
	@GeneratedValue
	@Column(name="autoId")
	public long getAutoId(){
		return autoId;
	}

	public void setAutoId(long autoId){
		this.autoId = autoId;
	}

	@Column(name="itemId")
	public String getItemId(){
		return itemId;
	}

	public void setItemId(String itemId){
		this.itemId = itemId;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="quotationTypeId")
	public QuotationTypePO getQuotationType(){
		return quotationType;
	}

	public void setQuotationType(QuotationTypePO quotationType){
		this.quotationType = quotationType;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="quotationClassificationId")
	public QuotationClassificationPO getQuotationClassification(){
		return quotationClassification;
	}

	public void setQuotationClassification(QuotationClassificationPO quotationClassification){
		this.quotationClassification = quotationClassification;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="quotationBigCategoryId")
	public QuotationBigCategoryPO getQuotationBigCategory(){
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(
			QuotationBigCategoryPO quotationBigCategory){
		this.quotationBigCategory = quotationBigCategory;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="quotationSmallCategoryId")
	public QuotationSmallCategoryPO getQuotationSmallCategory(){
		return quotationSmallCategory;
	}

	public void setQuotationSmallCategory(
			QuotationSmallCategoryPO quotationSmallCategory){
		this.quotationSmallCategory = quotationSmallCategory;
	}

	@Column(name="itemName", nullable=false)
	public String getItemName(){
		return itemName;
	}

	public void setItemName(String itemName){
		this.itemName = itemName;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="measurementUnitId")
	public MeasurementUnitPO getMeasurementUnit(){
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitPO measurementUnit){
		this.measurementUnit = measurementUnit;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="itemWorkTypeId")
	public WorkTypePO getWorkType(){
		return workType;
	}

	public void setWorkType(WorkTypePO workType){
		this.workType = workType;
	}

	@Column(name="quotationItemDes", nullable=false)
	public String getQuotationItemDes(){
		return quotationItemDes;
	}

	public void setQuotationItemDes(String quotationItemDes){
		this.quotationItemDes = quotationItemDes;
	}

	@Column(name="unitPrice", nullable=false)
	public float getUnitPrice(){
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice){
		this.unitPrice = unitPrice;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="versionId")
	public QuotationVersionPO getQuotationVersion(){
		return quotationVersion;
	}

	public void setQuotationVersion(QuotationVersionPO quotationVersion){
		this.quotationVersion = quotationVersion;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
