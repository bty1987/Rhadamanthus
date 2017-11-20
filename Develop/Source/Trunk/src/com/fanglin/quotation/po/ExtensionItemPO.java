package com.fanglin.quotation.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "extensionitem", catalog = "quotation")
public class ExtensionItemPO implements Serializable{

	private static final long serialVersionUID = 6856979622166928634L;
	
	public static final String COLUMN_EID_STR = "eid";
	
	private long eiId;
	
	private long eid;
	
	private String itemName;
	
	private short type;
	
	private short subtype;
	
	private String measurementUnit;
	
	private String workType;
	
	private float unitPrice;
	
	private float num;
	
	private QuotationFunctionAreaPO quotationFunctionAreaPO;
	
	private long quoteItemId ;
	
	private String content;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "eiId")
	public long getEiId() {
		return eiId;
	}

	public void setEiId(long eiId) {
		this.eiId = eiId;
	}
	
	@Column(name = "eId")
	public long getEid() {
		return eid;
	}

	public void setEid(long eid) {
		this.eid = eid;
	}
	
	@Column(name = "itemName")
	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
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
	public float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice) {
		this.unitPrice = unitPrice;
	}
	@Column(name = "num")
	public float getNum() {
		return num;
	}

	public void setNum(float num) {
		this.num = num;
	}
	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(name="quotationFunctionAreaId", referencedColumnName="qfaId")
	public QuotationFunctionAreaPO getQuotationFunctionAreaPO() {
		return quotationFunctionAreaPO;
	}

	public void setQuotationFunctionAreaPO(
			QuotationFunctionAreaPO quotationFunctionAreaPO) {
		this.quotationFunctionAreaPO = quotationFunctionAreaPO;
	}
	
	@Column(name = "quoteItemId")
	public long getQuoteItemId() {
		return quoteItemId;
	}

	public void setQuoteItemId(long quoteItemId) {
		this.quoteItemId = quoteItemId;
	}
	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
}
