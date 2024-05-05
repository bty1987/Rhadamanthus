package com.fanglin.data.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationPrice", catalog = "quotation")
public class QuotationPricePO implements Serializable {

	private static final long serialVersionUID = -4926291473233488143L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long qpid;

	private QuotationItemPO quotationItem;

	private int addPrice;

	private int unitPrice;

	private int subPrice;

	private Timestamp createTime;

	private Timestamp updateTime;

	private short status;

	public QuotationPricePO() {
		super();
	}

	public QuotationPricePO(long qpid) {
		super();
		this.qpid = qpid;
	}

	@Id
	@GeneratedValue
	@Column(name = "qpid")
	public long getQpid() {
		return qpid;
	}

	public void setQpid(long qpid) {
		this.qpid = qpid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "qiid", referencedColumnName = "qiid")
	public QuotationItemPO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemPO quotationItem) {
		this.quotationItem = quotationItem;
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

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public QuotationItemVO ptv(QuotationItemVO quotationItemVO) {

		BeanUtil.copyProperties(getQuotationItem(), quotationItemVO, Arrays.asList("version", "category", "classification", "bigCategory", "smallCategory", "unit", "workType", "quotationCtem"));

		if (quotationItemVO.getVersion() != null) BeanUtil.copyPropertie(getQuotationItem().getQuotationVersion(), quotationItemVO.getVersion());
		if (quotationItemVO.getCategory() != null) BeanUtil.copyPropertie(getQuotationItem().getQuotationType(), quotationItemVO.getCategory());
		if (quotationItemVO.getClassification() != null) BeanUtil.copyPropertie(getQuotationItem().getQuotationClassification(), quotationItemVO.getClassification());
		if (quotationItemVO.getBigCategory() != null) BeanUtil.copyPropertie(getQuotationItem().getQuotationBigCategory(), quotationItemVO.getBigCategory());
		if (quotationItemVO.getSmallCategory() != null) BeanUtil.copyPropertie(getQuotationItem().getQuotationSmallCategory(), quotationItemVO.getSmallCategory());
		if (quotationItemVO.getUnit() != null) BeanUtil.copyPropertie(getQuotationItem().getMeasurementUnit(), quotationItemVO.getUnit());
		if (quotationItemVO.getWorkType() != null) BeanUtil.copyPropertie(getQuotationItem().getWorkType(), quotationItemVO.getWorkType());
		if (quotationItemVO.getQuotationCtem() != null) BeanUtil.copyPropertie(getQuotationItem().getQuotationCtem(), quotationItemVO.getQuotationCtem());

		quotationItemVO.setAddPrice(getAddPrice());
		quotationItemVO.setUnitPrice(getUnitPrice());
		quotationItemVO.setSubPrice(getSubPrice());

		return quotationItemVO;
	}
}
