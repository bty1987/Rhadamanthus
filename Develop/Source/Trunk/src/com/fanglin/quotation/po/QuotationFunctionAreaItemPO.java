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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.QuotationItemPO;

@Entity
@Table(name = "quotationfunctionareaitem", catalog = "platform")
public class QuotationFunctionAreaItemPO implements Serializable {
	
	private static final long serialVersionUID = 3077313706873385773L;

	public static final int TYPE_QUOTATIONITEM_INT = 0; // 系统报价项
	
	public static final String TYPE_ORIGINAL_STR = "原始报价";
	
	public static final String TYPE_ADD_STR = "增项";
	
	public static final String TYPE_REDUCE_STR = "减项";
	
	private long qfaiId;

	private String itemName;
	
	private String measurementUnit;
	
	private float unitPrice;
	
	private float num;
	
	private short type;
	
	private QuotationFunctionAreaPO quotationFunctionArea;
	
	private QuotationItemPO quotationItem;
	
	private String content;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qfaiId") 
	public long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(long qfaiId) {
		this.qfaiId = qfaiId;
	}
	
	@Column(name = "itemName")
	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	@Column(name = "measurementUnit")
	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@Column(name = "unitPrice")
	public float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "num")
	public float getNum(){
		return num;
	}
	
	public void setNum(float num){
		this.num = num;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "quotationFunctionAreaId", referencedColumnName = "qfaId")
	public QuotationFunctionAreaPO getQuotationFunctionArea(){
		return quotationFunctionArea;
	}
	
	public void setQuotationFunctionArea(QuotationFunctionAreaPO quotationFunctionArea){
		this.quotationFunctionArea = quotationFunctionArea;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "quotationItemId", referencedColumnName = "qiId")
	public QuotationItemPO getQuotationItem(){
		return quotationItem;
	}
	
	public void setQuotationItem(QuotationItemPO quotationItem){
		this.quotationItem = quotationItem;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
