package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationPreferVO implements Serializable {

	private static final long serialVersionUID = 4258626277674770799L;

	private Long qpid;

	private String orderId;

	private Long qid;

	private Long preferPrice;

	private Long managePrefer;

	private Long advancePrefer;

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
}
