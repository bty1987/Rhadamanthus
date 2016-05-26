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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.po.WorkTypePO;

@Entity
@Table(name = "customquotationfuncationareaitem", catalog = "platform")
public class CustomQuotationItemPO implements Serializable {

	private static final long serialVersionUID = -7382384455543326014L;
	
	public static final int TYPE_CUSTOMQUOTATIONITEM_INT = 2;
	
	public static final String TYPE_ORIGINAL_STR = "原始报价";
	
	private long autoId;
	
	private String itemId;
	
	private String itemName;
	
	private float unitPrice;
	
	private float num;
	
	private QuotationClassificationPO quotationClassification;
	
	private QuotationBigCategoryPO quotationBigCategory;
	
	private MeasurementUnitPO measurementUnit;
	
	private WorkTypePO workType;
	
	private QuotationFunctionAreaPO quotationFunctionArea;
	
	private String quotationItemDes;

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
	@javax.persistence.JoinColumn(nullable=false, name="quotationBigCategoryId")
	public QuotationBigCategoryPO getQuotationBigCategory(){
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(QuotationBigCategoryPO quotationBigCategory){
		this.quotationBigCategory = quotationBigCategory;
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

	public void setNum(float num){
		this.num = num;
	}

	public float getNum(){
		return num;
	}
	
	public void setQuotationFunctionArea(QuotationFunctionAreaPO quotationFunctionArea){
		this.quotationFunctionArea = quotationFunctionArea;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "functionAreaId",referencedColumnName = "autoId")
	public QuotationFunctionAreaPO getQuotationFunctionArea(){
		return quotationFunctionArea;
	}

	public void setQuotationClassification(QuotationClassificationPO quotationClassification){
		this.quotationClassification = quotationClassification;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="quotationClassificationId")
	public QuotationClassificationPO getQuotationClassification(){
		return quotationClassification;
	}

}
