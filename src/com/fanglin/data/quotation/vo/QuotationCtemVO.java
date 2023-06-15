package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.communion.vo.WorkTypeVO;

public class QuotationCtemVO implements Serializable {

	private static final long serialVersionUID = 2263187776087084974L;

	private Long qcid;

	private String name;

	private String pinyin;

	private Short status;

	private Short type;

	private QuotationTypeVO category;

	private QuotationClassificationVO classification;

	private QuotationBigCategoryVO bigCategory;

	private QuotationSmallCategoryVO smallCategory;

	private MeasurementUnitVO unit;

	private WorkTypeVO workType;

	public QuotationCtemVO() {
		super();
	}

	public QuotationCtemVO(QuotationTypeVO category, QuotationClassificationVO classification, QuotationBigCategoryVO bigCategory, QuotationSmallCategoryVO smallCategory, MeasurementUnitVO unit, WorkTypeVO workType) {
		super();
		this.category = category;
		this.classification = classification;
		this.bigCategory = bigCategory;
		this.smallCategory = smallCategory;
		this.workType = workType;
		this.unit = unit;
	}

	public Long getQcid() {
		return qcid;
	}

	public void setQcid(Long qcid) {
		this.qcid = qcid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public QuotationTypeVO getCategory() {
		return category;
	}

	public void setCategory(QuotationTypeVO category) {
		this.category = category;
	}

	public QuotationClassificationVO getClassification() {
		return classification;
	}

	public void setClassification(QuotationClassificationVO classification) {
		this.classification = classification;
	}

	public QuotationBigCategoryVO getBigCategory() {
		return bigCategory;
	}

	public void setBigCategory(QuotationBigCategoryVO bigCategory) {
		this.bigCategory = bigCategory;
	}

	public QuotationSmallCategoryVO getSmallCategory() {
		return smallCategory;
	}

	public void setSmallCategory(QuotationSmallCategoryVO smallCategory) {
		this.smallCategory = smallCategory;
	}

	public MeasurementUnitVO getUnit() {
		return unit;
	}

	public void setUnit(MeasurementUnitVO unit) {
		this.unit = unit;
	}

	public WorkTypeVO getWorkType() {
		return workType;
	}

	public void setWorkType(WorkTypeVO workType) {
		this.workType = workType;
	}

}
