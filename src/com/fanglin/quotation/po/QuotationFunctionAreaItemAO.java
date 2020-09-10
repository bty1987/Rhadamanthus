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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationfunctionareaitem", catalog = "quotation")
public class QuotationFunctionAreaItemAO implements Serializable {

	private static final long serialVersionUID = -1495497405192428115L;

	private long qfaiId;

	private String itemName;

	private String measurementUnit;

	private String workType;

	private int unitPrice;

	private String formula;

	private int initNum;

	private int num;

	private short type;

	private short subtype;

	private short discount;

	private long quotationFunctionAreaId;

	private String content;

	private int index;

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

	@Column(name = "workType")
	public String getWorkType() {
		return workType;
	}

	public void setWorkType(String workType) {
		this.workType = workType;
	}

	@Column(name = "unitPrice")
	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "formula")
	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	@Column(name = "initNum")
	public int getInitNum() {
		return initNum;
	}

	public void setInitNum(int initNum) {
		this.initNum = initNum;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	@Column(name = "discount")
	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

	public long getQuotationFunctionAreaId() {
		return quotationFunctionAreaId;
	}

	public void setQuotationFunctionAreaId(long quotationFunctionAreaId) {
		this.quotationFunctionAreaId = quotationFunctionAreaId;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "[index]")
	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}
}
