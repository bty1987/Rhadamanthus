package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.WorkTypeVO;

public class QuotationFormatVO implements Serializable {

	private static final long serialVersionUID = 2680317275282495512L;

	private Long qfid;

	private Long qcid;

	private QuotationCtemVO quotationCtem;

	private String name;

	private String format;

	private String alias;

	private WorkTypeVO workType = new WorkTypeVO();

	private String pinyin;

	private Integer price;

	private MeasurementUnitVO unit;

	private Integer addPrice;

	private Integer subPrice;

	private Integer cost;

	private Integer achePrice;

	private String formula;

	private Short type;

	private Short discount;

	private Short isRtem;

	private String rtemFlag;

	private Short isImportant;

	private String comment;

	private Short status;

	public QuotationFormatVO() {
		super();
	}

	public QuotationFormatVO(QuotationCtemVO quotationCtem, MeasurementUnitVO unit) {
		super();
		this.quotationCtem = quotationCtem;
		this.unit = unit;
	}

	public Long getQfid() {
		return qfid;
	}

	public void setQfid(Long qfid) {
		this.qfid = qfid;
	}

	public Long getQcid() {
		return qcid;
	}

	public void setQcid(Long qcid) {
		this.qcid = qcid;
	}

	public QuotationCtemVO getQuotationCtem() {
		return quotationCtem;
	}

	public void setQuotationCtem(QuotationCtemVO quotationCtem) {
		this.quotationCtem = quotationCtem;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public WorkTypeVO getWorkType() {
		return workType;
	}

	public void setWorkType(WorkTypeVO workType) {
		this.workType = workType;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public MeasurementUnitVO getUnit() {
		return unit;
	}

	public void setUnit(MeasurementUnitVO unit) {
		this.unit = unit;
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

	public Integer getCost() {
		return cost;
	}

	public void setCost(Integer cost) {
		this.cost = cost;
	}

	public Integer getAchePrice() {
		return achePrice;
	}

	public void setAchePrice(Integer achePrice) {
		this.achePrice = achePrice;
	}

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getDiscount() {
		return discount;
	}

	public void setDiscount(Short discount) {
		this.discount = discount;
	}

	public Short getIsRtem() {
		return isRtem;
	}

	public void setIsRtem(Short isRtem) {
		this.isRtem = isRtem;
	}

	public String getRtemFlag() {
		return rtemFlag;
	}

	public void setRtemFlag(String rtemFlag) {
		this.rtemFlag = rtemFlag;
	}

	public Short getIsImportant() {
		return isImportant;
	}

	public void setIsImportant(Short isImportant) {
		this.isImportant = isImportant;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
