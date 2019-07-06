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
import com.fanglin.communion.po.WorkTypePO;


@Entity
@Table(name = "systemDefineitem", catalog = "quotation")
public class SystemDefineItemPO implements Serializable {

	private static final long serialVersionUID = -7382384455511126014L;
	
	public static final int TYPE_SYSTEMDEFINEITEM_INT = 3;	
	
	public static final String COLUMN_COMPANY_STR ="company";
	
	private long sdiId;
	
	private String itemId;
	
	private String itemName;
	
	private float addPrice;  //增补价
	
	private float unitPrice; //单价
	
	private float subPrice;  //退减价
	
	private QuotationBigCategoryPO quotationBigCategory;
	
	private MeasurementUnitPO measurementUnit;
	
	private WorkTypePO workType;
	
	private String quotationItemDes;
	
	private short status;
	
	private short discount;
	
	private int company;
	
	public SystemDefineItemPO(){
		super();
	}
	
	public SystemDefineItemPO(long sdiId){
		this.sdiId = sdiId;
	}
	
	@Id
	@GeneratedValue
	@Column(name="sdiId")
	public long getSdiId(){
		return sdiId;
	}

	public void setSdiId(long sdiId){
		this.sdiId = sdiId;
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

	@Column(name="addPrice")
	public float getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(float addPrice) {
		this.addPrice = addPrice;
	}

	@Column(name="unitPrice")
	public float getUnitPrice(){
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice){
		this.unitPrice = unitPrice;
	}

	@Column(name="subPrice")
	public float getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(float subPrice) {
		this.subPrice = subPrice;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="discount")
	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

	@Column(name="company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
}
