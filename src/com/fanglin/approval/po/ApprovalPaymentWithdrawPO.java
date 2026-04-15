package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalpaymentwithdraw", catalog = "approval")
public class ApprovalPaymentWithdrawPO implements java.io.Serializable {

	private static final long serialVersionUID = -7124386594610984567L;

	public static final String COLUMN_AID_STR = "aid";

	private long apwId;

	private long aid;

	private String orderId;

	private short paymentType;

	private long amount;

	private String comment;

	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "apwId")
	public long getApwId() {
		return this.apwId;
	}

	public void setApwId(long apwId) {
		this.apwId = apwId;
	}

	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "paymentType")
	public short getPaymentType() {
		return this.paymentType;
	}

	public void setPaymentType(short paymentType) {
		this.paymentType = paymentType;
	}

	@Column(name = "amount")
	public long getAmount() {
		return this.amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}
