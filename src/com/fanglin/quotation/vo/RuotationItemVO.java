package com.fanglin.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.quotation.vo.QuotationItemVO;

public class RuotationItemVO implements Serializable {

	private static final long serialVersionUID = -827651832388248078L;

	private Long qriid;

	private RuotationVO ruotation;

	private QuotationFunctionAreaVO quotationFunctionArea;

	private QuotationItemVO quotationItem;

	private String itemName;

	private String measurementUnit;

	private String workType;

	private Integer unitPrice;

	private Integer addPrice;

	private Integer subPrice;

	private String formula;

	private Integer initNum;

	private Integer num;

	private Short type;

	private Short subtype;

	private String content;

	private Integer index;

	private Short source;

	private Long sourceItemId;

	private Long qfaiId;

	private Short incur;

	public RuotationItemVO() {
		super();
	}

	public RuotationItemVO(RuotationVO ruotation, QuotationFunctionAreaVO quotationFunctionArea, QuotationItemVO quotationItem) {
		super();

		this.ruotation = ruotation;
		this.quotationFunctionArea = quotationFunctionArea;
		this.quotationItem = quotationItem;
	}

	public Long getQriid() {
		return qriid;
	}

	public void setQriid(Long qriid) {
		this.qriid = qriid;
	}

	public RuotationVO getRuotation() {
		return ruotation;
	}

	public void setRuotation(RuotationVO ruotation) {
		this.ruotation = ruotation;
	}

	public QuotationFunctionAreaVO getQuotationFunctionArea() {
		return quotationFunctionArea;
	}

	public void setQuotationFunctionArea(
			QuotationFunctionAreaVO quotationFunctionArea) {
		this.quotationFunctionArea = quotationFunctionArea;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
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

	public Integer getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Integer unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Integer getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Integer addPrice) {
		this.addPrice = addPrice;
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

	public Short getSource() {
		return source;
	}

	public void setSource(Short source) {
		this.source = source;
	}

	public Long getSourceItemId() {
		return sourceItemId;
	}

	public void setSourceItemId(Long sourceItemId) {
		this.sourceItemId = sourceItemId;
	}

	public Long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(Long qfaiId) {
		this.qfaiId = qfaiId;
	}

	public Short getIncur() {
		return incur;
	}

	public void setIncur(Short incur) {
		this.incur = incur;
	}
}
