package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvaldecorationterminalitem", catalog = "approval")
public class ApprovalDecorationTerminalItemPO implements java.io.Serializable {

	private static final long serialVersionUID = 8728346145018302959L;

	public static final String COLUMN_ATID_STR = "adtid";

	private long adtiid;

	private long aid;

	private long adtid;

	private long referMoney;

	private String paymentType;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "adtiid")
	public long getAdtiid() {
		return this.adtiid;
	}

	public void setAdtiid(long adtiid) {
		this.adtiid = adtiid;
	}

	@Column(name = "aid")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "adtid")
	public long getAdtid() {
		return adtid;
	}

	public void setAdtid(long adtid) {
		this.adtid = adtid;
	}

	@Column(name = "referMoney")
	public long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(long referMoney) {
		this.referMoney = referMoney;
	}

	@Column(name = "paymentType")
	public String getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}

}
