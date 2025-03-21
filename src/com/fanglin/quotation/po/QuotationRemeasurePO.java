package com.fanglin.quotation.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.communion.po.BrandPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationRemeasureVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationremeasure", catalog = "quotation")
public class QuotationRemeasurePO implements Serializable {

	private static final long serialVersionUID = 6718691683150500233L;

	private long qrid;

	private String orderId;

	private BrandPO brand;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	private int company;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qrid")
	public long getQrid() {
		return qrid;
	}

	public void setQrid(long qrid) {
		this.qrid = qrid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public QuotationRemeasureVO ptv(QuotationRemeasureVO quotationRemeasureVO) {

		BeanUtil.copyProperties(this, quotationRemeasureVO, Arrays.asList("brand", "creater"));

		if (quotationRemeasureVO.getBrand() != null && getBrand() != null) getBrand().ptv(quotationRemeasureVO.getBrand());
		if (quotationRemeasureVO.getCreater() != null && getCreater() != null) quotationRemeasureVO.getCreater().setBaseInfo(getCreater());

		return quotationRemeasureVO;
	}
}
