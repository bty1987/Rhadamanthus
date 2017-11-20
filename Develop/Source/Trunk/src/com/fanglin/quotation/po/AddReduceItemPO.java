package com.fanglin.quotation.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.quotation.po.QuotationFunctionAreaPO;

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
	
	private int arId;
	
	private String itemName;
	
	private short type;
	
	private short subtype;
	
	private String measurementUnit;
	
	private String workType;
	
	private float unitPrice;
	
	private float num;
	
	private short discount;
	
	private QuotationFunctionAreaPO quotationFunctionArea;
	
	private long quoteItemId;
	
	private String content;
	
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
	public int getArId() {
		return this.arId;
	}

	public void setArId(int arId) {
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

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	public void setType(short type) {
		this.type = type;
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

	@Column(name = "unitPrice")
	public float getUnitPrice() {
		return this.unitPrice;
	}

	public void setUnitPrice(float unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "num")
	public float getNum() {
		return this.num;
	}

	public void setNum(float num) {
		this.num = num;
	}

	@javax.persistence.ManyToOne(fetch=FetchType.LAZY)
	@javax.persistence.JoinColumn(name="quotationFunctionAreaId", referencedColumnName="qfaId")
	public QuotationFunctionAreaPO getQuotationFunctionArea() {
		return quotationFunctionArea;
	}

	public void setQuotationFunctionArea(
			QuotationFunctionAreaPO quotationFunctionArea) {
		this.quotationFunctionArea = quotationFunctionArea;
	}

	@Column(name = "quoteItemId")
	public long getQuoteItemId() {
		return quoteItemId;
	}

	public void setQuoteItemId(long quoteItemId) {
		this.quoteItemId = quoteItemId;
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

}