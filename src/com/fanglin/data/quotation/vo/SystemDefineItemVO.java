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
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.communion.vo.WorkTypeVO;

public class SystemDefineItemVO implements Serializable {

	private static final long serialVersionUID = -629582034818766395L;

	private Long sdiid;

	private String no;

	private String name;

	private QuotationTypeVO category;

	private QuotationBigCategoryVO bigCategory;

	private MeasurementUnitVO unit;

	private WorkTypeVO workType;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private Short status;

	private Short discount;

	protected String comment;

	public SystemDefineItemVO() {
		super();
	}

	public SystemDefineItemVO(QuotationBigCategoryVO bigCategory, MeasurementUnitVO unit, WorkTypeVO workType) {
		super();
		this.bigCategory = bigCategory;
		this.unit = unit;
		this.workType = workType;
	}

	public Long getSdiid() {
		return sdiid;
	}

	public void setSdiid(Long sdiid) {
		this.sdiid = sdiid;
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

	public QuotationTypeVO getCategory() {
		return category;
	}

	public void setCategory(QuotationTypeVO category) {
		this.category = category;
	}

	public QuotationBigCategoryVO getBigCategory() {
		return bigCategory;
	}

	public void setBigCategory(QuotationBigCategoryVO bigCategory) {
		this.bigCategory = bigCategory;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
