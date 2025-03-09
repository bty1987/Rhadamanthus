package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.PresignProducePO;
import com.fanglin.quotation.vo.QuotationPreferVO;

@Entity
@Table(name = "quotationprefer", catalog = "quotation")
public class QuotationPreferPO implements Serializable {

	private static final long serialVersionUID = -9070876939335469023L;

	private long qpid;

	private String orderId;

	private long qid;

	private PresignProducePO presignProduce;

	private long preferPrice;

	private long managePrefer;

	private long advancePrefer;

	private int discount;

	private int manageDiscount;

	private long quotePrice;

	private int quoteArea;

	public QuotationPreferPO() {
		super();
	}

	public QuotationPreferPO(String orderId, long qid, int quoteArea){
		this.orderId = orderId;
		this.qid = qid;
		this.quoteArea = quoteArea;
	}

	public QuotationPreferPO(PresignProducePO presignProduce) {
		super();
		this.presignProduce = presignProduce;
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

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ppid", referencedColumnName = "ppid")
	public PresignProducePO getPresignProduce() {
		return presignProduce;
	}

	public void setPresignProduce(PresignProducePO presignProduce) {
		this.presignProduce = presignProduce;
	}

	@Column(name = "preferPrice")
	public long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(long preferPrice) {
		this.preferPrice = preferPrice;
	}

	@Column(name = "managePrefer")
	public long getManagePrefer() {
		return managePrefer;
	}

	public void setManagePrefer(long managePrefer) {
		this.managePrefer = managePrefer;
	}

	@Column(name = "advancePrefer")
	public long getAdvancePrefer() {
		return advancePrefer;
	}

	public void setAdvancePrefer(long advancePrefer) {
		this.advancePrefer = advancePrefer;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "manageDiscount")
	public int getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(int manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	@Column(name = "quotePrice")
	public long getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(long quotePrice) {
		this.quotePrice = quotePrice;
	}

	@Column(name = "quoteArea")
	public int getQuoteArea() {
		return quoteArea;
	}

	public void setQuoteArea(int quoteArea) {
		this.quoteArea = quoteArea;
	}

	public void convert(QuotationPreferVO quotationPreferVO) {

		if (quotationPreferVO.getPreferPrice() != null) setPreferPrice(quotationPreferVO.getPreferPrice());
		if (quotationPreferVO.getManagePrefer() != null) setManagePrefer(quotationPreferVO.getManagePrefer());
		if (quotationPreferVO.getAdvancePrefer() != null) setAdvancePrefer(quotationPreferVO.getAdvancePrefer());
		if (quotationPreferVO.getDiscount() != null) setDiscount(quotationPreferVO.getDiscount());
		if (quotationPreferVO.getManageDiscount() != null) setManageDiscount(quotationPreferVO.getManageDiscount());
		if (quotationPreferVO.getQuotePrice() != null) setQuotePrice(quotationPreferVO.getQuotePrice());
		if (quotationPreferVO.getQuoteArea() != null) setQuoteArea(quotationPreferVO.getQuoteArea());
	}
}
