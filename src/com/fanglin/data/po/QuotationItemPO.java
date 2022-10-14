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
import com.fanglin.communion.po.QuotationClassificationPO;
import com.fanglin.communion.po.QuotationSmallCategoryPO;
import com.fanglin.communion.po.QuotationTypePO;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationItem", catalog = "quotation")
public class QuotationItemPO implements Serializable {

	private static final long serialVersionUID = -7382384455543326014L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	public static final short TYPE_COMMON_INT = 0;

	public static final short TYPE_COST_INT = 1;

	public static final short TYPE_CUSTOM_INT = 2;

	public static final short TYPE_IGNORE_INT = 3;

	public static final short TYPE_UNACHE_INT = 4;

	private long qiid;

	private String no;

	private String name;

	private QuotationTypePO quotationType;

	private QuotationClassificationPO quotationClassification;

	private QuotationBigCategoryPO quotationBigCategory;

	private QuotationSmallCategoryPO quotationSmallCategory;

	private MeasurementUnitPO measurementUnit;

	private WorkTypePO workType;

	private QuotationVersionPO quotationVersion;

	private int addPrice; // 增补价

	private int unitPrice; // 单价

	private int subPrice; // 退减价

	private short type;

	private short status;

	private short discount;

	private String comment;

	public QuotationItemPO() {
		super();
	}

	public QuotationItemPO(long qiid) {
		this.qiid = qiid;
	}

	@Id
	@GeneratedValue
	@Column(name = "qiid")
	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
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
	@javax.persistence.JoinColumn(nullable = false, name = "quotationTypeId")
	public QuotationTypePO getQuotationType() {
		return quotationType;
	}

	public void setQuotationType(QuotationTypePO quotationType) {
		this.quotationType = quotationType;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "quotationClassificationId")
	public QuotationClassificationPO getQuotationClassification() {
		return quotationClassification;
	}

	public void setQuotationClassification(QuotationClassificationPO quotationClassification) {
		this.quotationClassification = quotationClassification;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "quotationBigCategoryId")
	public QuotationBigCategoryPO getQuotationBigCategory() {
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(QuotationBigCategoryPO quotationBigCategory) {
		this.quotationBigCategory = quotationBigCategory;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "quotationSmallCategoryId")
	public QuotationSmallCategoryPO getQuotationSmallCategory() {
		return quotationSmallCategory;
	}

	public void setQuotationSmallCategory(QuotationSmallCategoryPO quotationSmallCategory) {
		this.quotationSmallCategory = quotationSmallCategory;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "measurementUnitId")
	public MeasurementUnitPO getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitPO measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "workTypeId")
	public WorkTypePO getWorkType() {
		return workType;
	}

	public void setWorkType(WorkTypePO workType) {
		this.workType = workType;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "versionId", referencedColumnName = "no")
	public QuotationVersionPO getQuotationVersion() {
		return quotationVersion;
	}

	public void setQuotationVersion(QuotationVersionPO quotationVersion) {
		this.quotationVersion = quotationVersion;
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

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	public QuotationItemVO ptv(QuotationItemVO quotationItemVO) {

		BeanUtil.copyProperties(this, quotationItemVO, Arrays.asList("version", "category", "classification", "bigCategory", "smallCategory", "unit", "workType"));

		if (quotationItemVO.getVersion() != null) BeanUtil.copyPropertie(getQuotationVersion(), quotationItemVO.getVersion());

		if (quotationItemVO.getCategory() != null) BeanUtil.copyPropertie(getQuotationType(), quotationItemVO.getCategory());

		if (quotationItemVO.getClassification() != null) BeanUtil.copyPropertie(getQuotationClassification(), quotationItemVO.getClassification());

		if (quotationItemVO.getBigCategory() != null) BeanUtil.copyPropertie(getQuotationBigCategory(), quotationItemVO.getBigCategory());

		if (quotationItemVO.getSmallCategory() != null) BeanUtil.copyPropertie(getQuotationSmallCategory(), quotationItemVO.getSmallCategory());

		if (quotationItemVO.getUnit() != null) BeanUtil.copyPropertie(getMeasurementUnit(), quotationItemVO.getUnit());

		if (quotationItemVO.getWorkType() != null) BeanUtil.copyPropertie(getWorkType(), quotationItemVO.getWorkType());

		return quotationItemVO;
	}
}
