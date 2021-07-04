/**
 * @File Name		: QuotationItemPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.po;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.communion.po.QuotationBigCategoryPO;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.data.quotation.vo.SystemDefineItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "systemDefineitem", catalog = "quotation")
public class SystemDefineItemPO implements Serializable {

	private static final long serialVersionUID = -7382384455511126014L;

	public static final int TYPE_SYSTEMDEFINEITEM_INT = 3;

	public static final String COLUMN_COMPANY_STR = "company";

	private long sdiid;

	private String no;

	private String name;

	private QuotationBigCategoryPO quotationBigCategory;

	private MeasurementUnitPO measurementUnit;

	private WorkTypePO workType;

	private int addPrice; // 增补价

	private int unitPrice; // 单价

	private int subPrice; // 退减价

	private short status;

	private short discount;

	private String comment;

	private int company;

	public SystemDefineItemPO() {
		super();
	}

	public SystemDefineItemPO(long sdiid) {
		this.sdiid = sdiid;
	}

	@Id
	@GeneratedValue
	@Column(name = "sdiid")
	public long getSdiid() {
		return sdiid;
	}

	public void setSdiid(long sdiid) {
		this.sdiid = sdiid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "quotationBigCategoryId")
	public QuotationBigCategoryPO getQuotationBigCategory() {
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(QuotationBigCategoryPO quotationBigCategory) {
		this.quotationBigCategory = quotationBigCategory;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "measurementUnitId")
	public MeasurementUnitPO getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitPO measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "workTypeId")
	public WorkTypePO getWorkType() {
		return workType;
	}

	public void setWorkType(WorkTypePO workType) {
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "discount")
	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public SystemDefineItemVO ptv(SystemDefineItemVO systemDefineItemVO) {

		BeanUtil.copyProperties(this, systemDefineItemVO, Arrays.asList("category", "bigCategory", "unit", "workType"));

		if (systemDefineItemVO.getBigCategory() != null)
			BeanUtil.copyPropertie(getQuotationBigCategory(), systemDefineItemVO.getBigCategory());

		if (systemDefineItemVO.getUnit() != null)
			BeanUtil.copyPropertie(getMeasurementUnit(), systemDefineItemVO.getUnit());

		if (systemDefineItemVO.getWorkType() != null)
			BeanUtil.copyPropertie(getWorkType(), systemDefineItemVO.getWorkType());

		return systemDefineItemVO;
	}
}
