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
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationCtem", catalog = "quotation")
public class QuotationCtemPO implements Serializable {

	private static final long serialVersionUID = -4732027883097773171L;

	public static final String COLUMN_QCID_STR = "qcid";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	private long qcid;

	private String name;

	private String pinyin;

	private short status;

	private short type;

	private QuotationTypePO quotationType;

	private QuotationClassificationPO quotationClassification;

	private QuotationBigCategoryPO quotationBigCategory;

	private QuotationSmallCategoryPO quotationSmallCategory;

	private MeasurementUnitPO measurementUnit;

	private WorkTypePO workType;

	public QuotationCtemPO() {
		super();
	}

	public QuotationCtemPO(long qcid) {
		this.qcid = qcid;
	}

	@Id
	@GeneratedValue
	@Column(name = "qcid")
	public long getQcid() {
		return qcid;
	}

	public void setQcid(long qcid) {
		this.qcid = qcid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "quotationTypeId")
	public QuotationTypePO getQuotationType() {
		return quotationType;
	}

	public void setQuotationType(QuotationTypePO quotationType) {
		this.quotationType = quotationType;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "quotationClassificationId")
	public QuotationClassificationPO getQuotationClassification() {
		return quotationClassification;
	}

	public void setQuotationClassification(QuotationClassificationPO quotationClassification) {
		this.quotationClassification = quotationClassification;
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
	@javax.persistence.JoinColumn(name = "quotationSmallCategoryId")
	public QuotationSmallCategoryPO getQuotationSmallCategory() {
		return quotationSmallCategory;
	}

	public void setQuotationSmallCategory(QuotationSmallCategoryPO quotationSmallCategory) {
		this.quotationSmallCategory = quotationSmallCategory;
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

	public QuotationCtemVO ptv(QuotationCtemVO quotationCtemVO) {

		BeanUtil.copyProperties(this, quotationCtemVO, Arrays.asList("quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType"));

		if (quotationCtemVO.getCategory() != null && getQuotationType() != null) BeanUtil.copyPropertie(getQuotationType(), quotationCtemVO.getCategory());
		if (quotationCtemVO.getClassification() != null && getQuotationClassification() != null) BeanUtil.copyPropertie(getQuotationClassification(), quotationCtemVO.getClassification());
		if (quotationCtemVO.getBigCategory() != null && getQuotationBigCategory() != null) BeanUtil.copyPropertie(getQuotationBigCategory(), quotationCtemVO.getBigCategory());
		if (quotationCtemVO.getSmallCategory() != null && getQuotationSmallCategory() != null) BeanUtil.copyPropertie(getQuotationSmallCategory(), quotationCtemVO.getSmallCategory());
		if (quotationCtemVO.getUnit() != null && getMeasurementUnit() != null) BeanUtil.copyPropertie(getMeasurementUnit(), quotationCtemVO.getUnit());
		if (quotationCtemVO.getWorkType() != null && getWorkType() != null) BeanUtil.copyPropertie(getWorkType(), quotationCtemVO.getWorkType());

		return quotationCtemVO;
	}

}
