package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalsalesdiscount", catalog = "approval")
public class ApprovalSalesDiscountPO implements java.io.Serializable {

	private static final long serialVersionUID = -2322385203203862761L;

	public static final String COLUMN_AID_STR = "aid";

	private int asdid;

	private long aid;

	private long sid;

	private long referMoney;

	private short paymentType;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asdid")
	public int getAsdid() {
		return this.asdid;
	}

	public void setAsdid(int asdid) {
		this.asdid = asdid;
	}

	@Column(name = "aid")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "refermoney")
	public long getReferMoney() {
		return this.referMoney;
	}

	public void setReferMoney(long referMoney) {
		this.referMoney = referMoney;
	}

	@Column(name = "paymenttype")
	public short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(short paymentType) {
		this.paymentType = paymentType;
	}
}
