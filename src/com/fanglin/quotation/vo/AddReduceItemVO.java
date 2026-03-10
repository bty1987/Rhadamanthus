package com.fanglin.quotation.vo;

import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.data.quotation.vo.NormtimeVO;

public class AddReduceItemVO implements java.io.Serializable {

	private static final long serialVersionUID = -8622530142993960730L;

	private Long ariId;

	private Long arId;

	private String itemName;

	private Short type;

	private Short subtype;

	private Short itemtype;

	private String measurementUnit;

	private String workType;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private Integer initnum;

	private Integer num;

	private Long quotationFunctionAreaId;

	private String quotationFunctionAreaName;

	private Short quotationFunctionAreaType;

	private Long quoteItemId;

	private Long qiid;

	private String content;

	private Short discount;

	private Long quotationItemId;

	private NormoodVO normood;

	private NormriceVO normrice;

	private NormtimeVO normtime;

	private Integer index;

	public AddReduceItemVO() {
		super();
	}

	public AddReduceItemVO(NormoodVO normood) {
		super();
		this.normood = normood;
	}

	public AddReduceItemVO(NormriceVO normrice) {
		super();
		this.normrice = normrice;
	}

	public Long getAriId() {
		return ariId;
	}

	public void setAriId(Long ariId) {
		this.ariId = ariId;
	}

	public Long getArId() {
		return arId;
	}

	public void setArId(Long arId) {
		this.arId = arId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getSubtype() {
		return subtype;
	}

	public void setSubtype(Short subtype) {
		this.subtype = subtype;
	}

	public Short getItemtype() {
		return itemtype;
	}

	public void setItemtype(Short itemtype) {
		this.itemtype = itemtype;
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

	public Integer getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Integer addPrice) {
		this.addPrice = addPrice;
	}

	public Integer getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Integer unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Integer getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(Integer subPrice) {
		this.subPrice = subPrice;
	}

	public Integer getInitnum() {
		return initnum;
	}

	public void setInitnum(Integer initnum) {
		this.initnum = initnum;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Long getQuotationFunctionAreaId() {
		return quotationFunctionAreaId;
	}

	public void setQuotationFunctionAreaId(Long quotationFunctionAreaId) {
		this.quotationFunctionAreaId = quotationFunctionAreaId;
	}

	public String getQuotationFunctionAreaName() {
		return quotationFunctionAreaName;
	}

	public void setQuotationFunctionAreaName(String quotationFunctionAreaName) {
		this.quotationFunctionAreaName = quotationFunctionAreaName;
	}

	public Short getQuotationFunctionAreaType() {
		return quotationFunctionAreaType;
	}

	public void setQuotationFunctionAreaType(Short quotationFunctionAreaType) {
		this.quotationFunctionAreaType = quotationFunctionAreaType;
	}

	public Long getQuoteItemId() {
		return quoteItemId;
	}

	public void setQuoteItemId(Long quoteItemId) {
		this.quoteItemId = quoteItemId;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getDiscount() {
		return discount;
	}

	public void setDiscount(Short discount) {
		this.discount = discount;
	}

	public Long getQuotationItemId() {
		return quotationItemId;
	}

	public void setQuotationItemId(Long quotationItemId) {
		this.quotationItemId = quotationItemId;
	}

	public NormoodVO getNormood() {
		return normood;
	}

	public void setNormood(NormoodVO normood) {
		this.normood = normood;
	}

	public NormriceVO getNormrice() {
		return normrice;
	}

	public void setNormrice(NormriceVO normrice) {
		this.normrice = normrice;
	}

	public NormtimeVO getNormtime() {
		return normtime;
	}

	public void setNormtime(NormtimeVO normtime) {
		this.normtime = normtime;
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
	}

}