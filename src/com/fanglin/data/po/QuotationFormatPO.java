package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.data.quotation.vo.QuotationFormatVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationformat", catalog = "quotation")
public class QuotationFormatPO implements Serializable {

	private static final long serialVersionUID = 6581325512288639780L;

	public static final String COLUMN_QCID_STR = "quotationCtem.qcid";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_STR = 0;

	private long qfid;

	private QuotationCtemPO quotationCtem;

	private String name;

	private String format;

	private String pinyin;

	private int price;

	private MeasurementUnitPO measurementUnit;

	private short status;

	public QuotationFormatPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qfid")
	public long getQfid() {
		return qfid;
	}

	public void setQfid(long qfid) {
		this.qfid = qfid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qcid", referencedColumnName = "qcid")
	public QuotationCtemPO getQuotationCtem() {
		return quotationCtem;
	}

	public void setQuotationCtem(QuotationCtemPO quotationCtem) {
		this.quotationCtem = quotationCtem;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "unit")
	public MeasurementUnitPO getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitPO measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public QuotationFormatVO ptv(QuotationFormatVO quotationFormatVO) {

		BeanUtil.copyProperties(this, quotationFormatVO, Arrays.asList("quotationCtem", "measurementUnit"));

		if (getQuotationCtem() != null && quotationFormatVO.getQuotationCtem() != null) BeanUtil.copyPropertie(getQuotationCtem(), quotationFormatVO.getQuotationCtem(), Arrays.asList("quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType"));
		if (getMeasurementUnit() != null && quotationFormatVO.getUnit() != null) BeanUtil.copyPropertie(getMeasurementUnit(), quotationFormatVO.getUnit());

		if (getQuotationCtem() != null) quotationFormatVO.setQcid(getQuotationCtem().getQcid());

		quotationFormatVO.setName(quotationFormatVO.getName() + "-" + quotationFormatVO.getFormat());

		return quotationFormatVO;
	}

}
