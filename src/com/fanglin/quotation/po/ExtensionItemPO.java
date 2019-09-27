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
public class ExtensionItemPO implements Serializable {

	private static final long serialVersionUID = 6856979622166928634L;

	public static final String COLUMN_EID_STR = "eid";

	private long eiid;

	private long eid;

	private String itemName;

	private short type;

	private short subtype;

	private String measurementUnit;

	private String workType;

	private int addPrice; // 增补价

	private int unitPrice; // 原单价

	private int subPrice; // 退减价

	private int num;

	private QuotationFunctionAreaPO quotationFunctionArea;

	private long quoteItemId;

	private String content;

	private short discount;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "eiid")
	public long getEiid() {
		return eiid;
	}

	public void setEiid(long eiid) {
		this.eiid = eiid;
	}

	@Column(name = "eid")
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

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "quotationFunctionAreaId", referencedColumnName = "qfaId")
	public QuotationFunctionAreaPO getQuotationFunctionArea() {
		return quotationFunctionArea;
	}

	public void setQuotationFunctionArea(QuotationFunctionAreaPO quotationFunctionArea) {
		this.quotationFunctionArea = quotationFunctionArea;
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

	@Column(name = "discount")
	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

}
