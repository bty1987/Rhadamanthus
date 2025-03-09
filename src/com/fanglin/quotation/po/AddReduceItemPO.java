package com.fanglin.quotation.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "addreduceitem", catalog = "quotation")
public class AddReduceItemPO implements java.io.Serializable {

	private static final long serialVersionUID = 5762586048215579423L;

	public static final short TYPE_COMMON_QUOTATION_INT = 0;

	public static final short TYPE_SYSTEM_QUOTATION_INT = 1;

	public static final short TYPE_CUSTOM_QUOTATION_INT = 2;

	public static final short TYPE_QUOTATION_ITEM_INT = 3;

	public static final short TYPE_ADD_ITEM_INT = 4;

	public static final short TYPE_EXTENSION_ITEM_INT = 5;

	public static final String COLUMN_ARID_STR = "arId";

	private long ariId;

	private long arId;

	private String itemName;

	private short type;

	private short subtype;

	private short itemtype;

	private String measurementUnit;

	private String workType;

	private int addPrice; // 增补价

	private int unitPrice; // 原单价

	private int subPrice; // 退减价

	private int initnum;

	private int num;

	private short discount;

	private QuotationFunctionAreaPO quotationFunctionArea;

	private long quoteItemId;

	private long qiid;

	private String content;

	private int index;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ariId")
	public long getAriId() {
		return this.ariId;
	}

	public void setAriId(long ariId) {
		this.ariId = ariId;
	}

	@Column(name = "arId")
	public long getArId() {
		return this.arId;
	}

	public void setArId(long arId) {
		this.arId = arId;
	}

	@Column(name = "itemName")
	public String getItemName() {
		return this.itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
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

	@Column(name = "itemtype")
	public short getItemtype() {
		return itemtype;
	}

	public void setItemtype(short itemtype) {
		this.itemtype = itemtype;
	}

	@Column(name = "measurementUnit")
	public String getMeasurementUnit() {
		return this.measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@Column(name = "workType")
	public String getWorkType() {
		return this.workType;
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
		return this.unitPrice;
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

	@Column(name = "initnum")
	public int getInitnum() {
		return initnum;
	}

	public void setInitnum(int initnum) {
		this.initnum = initnum;
	}

	@Column(name = "num")
	public int getNum() {
		return this.num;
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

	@Column(name = "qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	@Column(name = "discount")
	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

	@Column(name = "content")
	public String getContent() {
		return this.content;
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