package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalquotationprefer", catalog = "approval")
public class ApprovalQuotationPreferPO implements Serializable {

	private static final long serialVersionUID = -8940196742313994740L;

	public static final String COLUMN_AID_STR = "aid";

	private long aqpid;

	private long aid;

	private long qid;

	private long qpid;

	private long ppid;

	private long preferPrice;

	private long managePrefer;

	private long advancePrefer;

	private long activityPrice;

	private long activityProfit;

	private long totalPrice;

	private long taxPrice;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aqpid")
	public long getAqpid() {
		return aqpid;
	}

	public void setAqpid(long aqpid) {
		this.aqpid = aqpid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "qpid")
	public long getQpid() {
		return qpid;
	}

	public void setQpid(long qpid) {
		this.qpid = qpid;
	}

	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
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

	@Column(name = "activityPrice")
	public long getActivityPrice() {
		return activityPrice;
	}

	public void setActivityPrice(long activityPrice) {
		this.activityPrice = activityPrice;
	}

	@Column(name = "activityProfit")
	public long getActivityProfit() {
		return activityProfit;
	}

	public void setActivityProfit(long activityProfit) {
		this.activityProfit = activityProfit;
	}

	@Column(name = "totalPrice")
	public long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "taxPrice")
	public long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(long taxPrice) {
		this.taxPrice = taxPrice;
	}

}
