/**
 * @File Name		: QuotationItemVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.communion.vo.WorkTypeVO;

public class QuotationItemVO implements Serializable {

	private static final long serialVersionUID = -629582034818766395L;

	private Long qiid;

	private String no;

	private String name;

	private String alias;

	private Long qvid;

	private QuotationVersionVO version;

	private QuotationTypeVO category;

	private QuotationClassificationVO classification;

	private QuotationBigCategoryVO bigCategory;

	private QuotationSmallCategoryVO smallCategory;

	private WorkTypeVO workType;

	private MeasurementUnitVO unit;

	private QuotationCtemVO quotationCtem;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private Integer cost;

	private Integer achePrice;

	private Short type;

	private Short status;

	private Short discount;

	private String formula;

	private Integer offset;

	private String comment;

	public QuotationItemVO() {
		super();
	}

	public QuotationItemVO(QuotationVersionVO version) {
		super();
		this.version = version;
	}

	public QuotationItemVO(QuotationVersionVO version, QuotationTypeVO category, QuotationClassificationVO classification, QuotationBigCategoryVO bigCategory, QuotationSmallCategoryVO smallCategory, WorkTypeVO workType, MeasurementUnitVO unit, QuotationCtemVO quotationCtem) {
		super();
		this.version = version;
		this.category = category;
		this.classification = classification;
		this.bigCategory = bigCategory;
		this.smallCategory = smallCategory;
		this.workType = workType;
		this.unit = unit;
		this.quotationCtem = quotationCtem;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public Long getQvid() {
		return qvid;
	}

	public void setQvid(Long qvid) {
		this.qvid = qvid;
	}

	public QuotationVersionVO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionVO version) {
		this.version = version;
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

	public WorkTypeVO getWorkType() {
		return workType;
	}

	public void setWorkType(WorkTypeVO workType) {
		this.workType = workType;
	}

	public MeasurementUnitVO getUnit() {
		return unit;
	}

	public void setUnit(MeasurementUnitVO unit) {
		this.unit = unit;
	}

	public QuotationCtemVO getQuotationCtem() {
		return quotationCtem;
	}

	public void setQuotationCtem(QuotationCtemVO quotationCtem) {
		this.quotationCtem = quotationCtem;
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

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getDiscount() {
		return discount;
	}

	public void setDiscount(Short discount) {
		this.discount = discount;
	}

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public Integer getOffset() {
		return offset;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
