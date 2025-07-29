package com.fanglin.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.quotation.vo.PresignProduceVO;

public class QuotationPreferVO implements Serializable {

	private static final long serialVersionUID = 4258626277674770799L;

	private Long qpid;

	private String orderId;

	private Long qid;

	private PresignProduceVO presignProduce;

	private Long preferPrice;

	private Long managePrefer;

	private Long advancePrefer;

	private Integer discount;

	private Integer manageDiscount;

	private Long quotePrice;

	private Integer quoteArea;

	private Short redo;

	private Short urgent;

	private Short drawing;

	public QuotationPreferVO() {
		super();
	}

	public QuotationPreferVO(PresignProduceVO presignProduce) {
		super();
		this.presignProduce = presignProduce;
	}

	public Long getQpid() {
		return qpid;
	}

	public void setQpid(Long qpid) {
		this.qpid = qpid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public PresignProduceVO getPresignProduce() {
		return presignProduce;
	}

	public void setPresignProduce(PresignProduceVO presignProduce) {
		this.presignProduce = presignProduce;
	}

	public Long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(Long preferPrice) {
		this.preferPrice = preferPrice;
	}

	public Long getManagePrefer() {
		return managePrefer;
	}

	public void setManagePrefer(Long managePrefer) {
		this.managePrefer = managePrefer;
	}

	public Long getAdvancePrefer() {
		return advancePrefer;
	}

	public void setAdvancePrefer(Long advancePrefer) {
		this.advancePrefer = advancePrefer;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(Integer manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	public Long getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(Long quotePrice) {
		this.quotePrice = quotePrice;
	}

	public Integer getQuoteArea() {
		return quoteArea;
	}

	public void setQuoteArea(Integer quoteArea) {
		this.quoteArea = quoteArea;
	}

	public Short getRedo() {
		return redo;
	}

	public void setRedo(Short redo) {
		this.redo = redo;
	}

	public Short getUrgent() {
		return urgent;
	}

	public void setUrgent(Short urgent) {
		this.urgent = urgent;
	}

	public Short getDrawing() {
		return drawing;
	}

	public void setDrawing(Short drawing) {
		this.drawing = drawing;
	}
}
