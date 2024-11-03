package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationprefer", catalog = "quotation")
public class QuotationPreferPO implements Serializable {

	private static final long serialVersionUID = -9070876939335469023L;

	private long qpid;

	private String orderId;

	private long qid;

	private long preferPrice;

	private long managePrefer;

	private long advancePrefer;

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
}
