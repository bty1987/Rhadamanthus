/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			:
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;

public class QuotationFunctionAreaItemPO implements Serializable {
	
	private static final long serialVersionUID = 3077313706873385773L;
	
	public static final short TYPE_QUOTATION_COMMON_INT = 0;
	
	public static final short TYPE_QUOTATION_CUSTOMER_INT = 1;
	
	public static final short TYPE_QUOTATION_TRAFFIC_INT = 2;
	
	public static final short TYPE_QUOTATION_MANAGE_INT = 3;
	
	public static final short TYPE_QUOTATION_FIX_INT = 4;

	private long qfaiId;

	private String itemName;
	
	private String measurementUnit;
	
	private String workType;
	
	private float unitPrice;
	
	private String formula;
	
	private float initNum;
	
	private float num;
	
	private short type;
	
	private short subtype;
	
	private short discount;
	
	private QuotationFunctionAreaPO quotationFunctionArea;
	
	private QuotationItemPO quotationItem;
	
	private String content;
	
	public QuotationFunctionAreaItemPO() {
		super();
	}

	public QuotationFunctionAreaItemPO(String itemName, String measurementUnit, String workType, float unitPrice, float num, short type, short discount, QuotationFunctionAreaPO quotationFunctionArea, String content) {
		this.itemName = itemName;
		this.measurementUnit = measurementUnit;
		this.workType = workType;
		this.unitPrice = unitPrice;
		this.num = num;
		this.type = type;
		this.discount = discount;
		this.quotationFunctionArea = quotationFunctionArea;
		this.content = content;
	}

	public long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(long qfaiId) {
		this.qfaiId = qfaiId;
	}
	
	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public String getWorkType() {
		return workType;
	}

	public void setWorkType(String workType) {
		this.workType = workType;
	}

	public float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice) {
		this.unitPrice = unitPrice;
	}

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public float getInitNum() {
		return initNum;
	}

	public void setInitNum(float initNum) {
		this.initNum = initNum;
	}

	public float getNum(){
		return num;
	}
	
	public void setNum(float num){
		this.num = num;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

	public QuotationFunctionAreaPO getQuotationFunctionArea(){
		return quotationFunctionArea;
	}
	
	public void setQuotationFunctionArea(QuotationFunctionAreaPO quotationFunctionArea){
		this.quotationFunctionArea = quotationFunctionArea;
	}

	public QuotationItemPO getQuotationItem(){
		return quotationItem;
	}
	
	public void setQuotationItem(QuotationItemPO quotationItem){
		this.quotationItem = quotationItem;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	
	public static String quotationFunctionAreaItemTable(Long quotationFunctionAreaId,Integer div) {
		
		int index = (int)(quotationFunctionAreaId/div);
		
		String qfaItem = "QuotationFunctionAreaItemPO";
		
		String quotationFunctionAreaItemTable = qfaItem+index;
		
		return quotationFunctionAreaItemTable;
	}
	
	public static QuotationFunctionAreaItemPO factoryToInstance(Long quotationFunctionAreaId, Integer div)throws FLException{
		
		try {
			int index = (int)(quotationFunctionAreaId/div);
			
			Class<?> clazz = Class.forName("com.fanglin.quotation.po.QuotationFunctionAreaItemPO" + index);
			
			return (QuotationFunctionAreaItemPO) clazz.newInstance();
		} catch (Exception e) {
			throw new FLException(200029, "报价项存储对象错误");
		}
		
	}
	
	public static Class<?> factoryToClazz(Long quotationFunctionAreaId, Integer div)throws FLException{
		
		try {
			int index = (int)(quotationFunctionAreaId/div);
			
			return Class.forName("com.fanglin.quotation.po.QuotationFunctionAreaItemPO" + index);
		} catch (Exception e) {
			throw new FLException(200029, "报价项存储对象错误");
		}
	}
	
}
