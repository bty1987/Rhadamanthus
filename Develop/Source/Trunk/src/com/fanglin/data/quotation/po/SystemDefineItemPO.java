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

package com.fanglin.data.quotation.po;

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
@Table(name = "systemDefineitem", catalog = "platform")
public class SystemDefineItemPO implements Serializable {

	private static final long serialVersionUID = -7382384455511126014L;
	
	public static final int TYPE_SYSTEMDEFINEITEM_INT = 3;	
	
	private long autoId;
	
	private String itemId;
	
	private String itemName;
	
	private float unitPrice;
	
	private QuotationBigCategoryPO quotationBigCategory;
	
	private MeasurementUnitPO measurementUnit;
	
	private WorkTypePO workType;
	
	private String quotationItemDes;
	
	public SystemDefineItemPO(){
		
	}
	
	public SystemDefineItemPO(long autoId){
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
	@javax.persistence.JoinColumn(name="quotationBigCategoryId")
	public QuotationBigCategoryPO getQuotationBigCategory(){
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(QuotationBigCategoryPO quotationBigCategory){
		this.quotationBigCategory = quotationBigCategory;
	}

	@Column(name="itemName")
	public String getItemName(){
		return itemName;
	}

	public void setItemName(String itemName){
		this.itemName = itemName;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(name="measurementUnitId")
	public MeasurementUnitPO getMeasurementUnit(){
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitPO measurementUnit){
		this.measurementUnit = measurementUnit;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(name="itemWorkTypeId")
	public WorkTypePO getWorkType(){
		return workType;
	}

	public void setWorkType(WorkTypePO workType){
		this.workType = workType;
	}

	@Column(name="quotationItemDes")
	public String getQuotationItemDes(){
		return quotationItemDes;
	}

	public void setQuotationItemDes(String quotationItemDes){
		this.quotationItemDes = quotationItemDes;
	}

	@Column(name="unitPrice")
	public float getUnitPrice(){
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice){
		this.unitPrice = unitPrice;
	}

}
