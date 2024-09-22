package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "paymentscaleitem", catalog = "data")
public class PaymentScaleItemPO implements Serializable {

	private static final long serialVersionUID = 4880310559870966082L;

	private long psiid;

	private long ptid;

	private String name;

	private int scale;

	private short sort;

	private PaymentScalePO paymentScale;

	public PaymentScaleItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "psiid")
	public long getPsiid() {
		return psiid;
	}

	public void setPsiid(long psiid) {
		this.psiid = psiid;
	}

	@Column(name = "ptid")
	public long getPtid() {
		return ptid;
	}

	public void setPtid(long ptid) {
		this.ptid = ptid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "scale")
	public int getScale() {
		return scale;
	}

	public void setScale(int scale) {
		this.scale = scale;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "psid", referencedColumnName = "psid")
	public PaymentScalePO getPaymentScale() {
		return paymentScale;
	}

	public void setPaymentScale(PaymentScalePO paymentScale) {
		this.paymentScale = paymentScale;
	}

}
