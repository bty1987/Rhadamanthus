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

package com.fanglin.decoration.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.po.WorkTypePO;
import com.fanglin.quotation.po.QuotationBigCategoryPO;
import com.fanglin.quotation.po.QuotationClassificationPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

@Entity
@Table(name = "addorreducedetail", catalog = "platform")
public class AddOrReduceDetailPO implements Serializable {

	private static final long serialVersionUID = -7382384455543116014L;
	
	private long autoId;
	
	private int arId;
	
	private int itemType;
	
	private String customerItemId;
	
	private String itemId;
	
	private QuotationClassificationPO quotationClassificationPO;

	private QuotationBigCategoryPO quotationBigCategoryPO;
	
	private String itemName;
	
	private MeasurementUnitPO measurementUnitPO;
	
	private WorkTypePO workTypePO;
	
	private String quotationItemDes;
	
	private Float unitPrice;
	
	private Float num;
	
	private QuotationFunctionAreaPO quotationFunctionAreaPO;

	public AddOrReduceDetailPO(){
	}
	
	public AddOrReduceDetailPO(long autoId){
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

	@Column(name="itemId", nullable=false)
	public String getItemId(){
		return itemId;
	}

	public void setItemId(String itemId){
		this.itemId = itemId;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="quotationBigCategoryId")
	public QuotationBigCategoryPO getQuotationBigCategoryPO(){
		return quotationBigCategoryPO;
	}

	public void setQuotationBigCategoryPO(
			QuotationBigCategoryPO quotationBigCategoryPO){
		this.quotationBigCategoryPO = quotationBigCategoryPO;
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
	public MeasurementUnitPO getMeasurementUnitPO(){
		return measurementUnitPO;
	}

	public void setMeasurementUnitPO(MeasurementUnitPO measurementUnitPO){
		this.measurementUnitPO = measurementUnitPO;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="itemWorkTypeId")
	public WorkTypePO getWorkTypePO(){
		return workTypePO;
	}

	public void setWorkTypePO(WorkTypePO workTypePO){
		this.workTypePO = workTypePO;
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

	public void setCustomerItemId(String customerItemId){
		this.customerItemId = customerItemId;
	}

	public String getCustomerItemId(){
		return customerItemId;
	}

	public void setArId(int arId){
		this.arId = arId;
	}

	public int getArId(){
		return arId;
	}

	public void setItemType(int itemType){
		this.itemType = itemType;
	}

	public int getItemType(){
		return itemType;
	}

	public void setNum(Float num){
		this.num = num;
	}

	public Float getNum(){
		return num;
	}

	public void setQuotationFunctionAreaPO(QuotationFunctionAreaPO quotationFunctionAreaPO){
		this.quotationFunctionAreaPO = quotationFunctionAreaPO;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="quotationFunctionAreaId", referencedColumnName="autoId")
	public QuotationFunctionAreaPO getQuotationFunctionAreaPO(){
		return quotationFunctionAreaPO;
	}

	public void setQuotationClassificationPO(QuotationClassificationPO quotationClassificationPO){
		this.quotationClassificationPO = quotationClassificationPO;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable=false, name="quotationClassificationId")
	public QuotationClassificationPO getQuotationClassificationPO(){
		return quotationClassificationPO;
	}
	
}
