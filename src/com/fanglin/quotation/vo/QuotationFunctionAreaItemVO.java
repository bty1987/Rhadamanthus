package com.fanglin.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;

public class QuotationFunctionAreaItemVO implements Serializable {

	private static final long serialVersionUID = 735430251276046420L;

	private Long qfaiId;

	private String itemName;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private String formula;

	private String expres;

	private Integer initNum;

	private Integer num;

	private Short type;

	private Short subtype;

	private String measurementUnit;

	private String workType;

	private Short discount;

	private Long quotationFunctionAreaId;

	private Long quotationItemId;

	private Short isRtem;

	private String content;

	private Integer index;

	private NormoodVO normood;

	private NormriceVO normrice;

	public QuotationFunctionAreaItemVO() {
		super();
	}

	public QuotationFunctionAreaItemVO(NormoodVO normood) {
		super();
		this.normood = normood;
	}

	public QuotationFunctionAreaItemVO(NormriceVO normrice) {
		super();
		this.normrice = normrice;
	}

	public Long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(Long qfaiId) {
		this.qfaiId = qfaiId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
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

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public String getExpres() {
		return expres;
	}

	public void setExpres(String expres) {
		this.expres = expres;
	}

	public Integer getInitNum() {
		return initNum;
	}

	public void setInitNum(Integer initNum) {
		this.initNum = initNum;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
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

	public Short getDiscount() {
		return discount;
	}

	public void setDiscount(Short discount) {
		this.discount = discount;
	}

	public Long getQuotationFunctionAreaId() {
		return quotationFunctionAreaId;
	}

	public void setQuotationFunctionAreaId(Long quotationFunctionAreaId) {
		this.quotationFunctionAreaId = quotationFunctionAreaId;
	}

	public Long getQuotationItemId() {
		return quotationItemId;
	}

	public void setQuotationItemId(Long quotationItemId) {
		this.quotationItemId = quotationItemId;
	}

	public Short getIsRtem() {
		return isRtem;
	}

	public void setIsRtem(Short isRtem) {
		this.isRtem = isRtem;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
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

}
