package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalprotationprefer", catalog = "approval")
public class ApprovalProtationPreferPO implements java.io.Serializable {

	private static final long serialVersionUID = 90286039390721792L;

	public static final String COLUMN_AID_STR = "aid";

	private long appid;

	private long aid;

	private long pid;

	private long ppid;

	private int preferPrice;

	private int managePrefer;

	private int advancePrefer;

	private int taxPrice;

	private int totalPrice;

	private int activityProfit;

	private short type;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "appid")
	public long getAppid() {
		return appid;
	}

	public void setAppid(long appid) {
		this.appid = appid;
	}

	@Column(name = "aid")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}

	@Column(name = "preferPrice")
	public int getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(int preferPrice) {
		this.preferPrice = preferPrice;
	}

	@Column(name = "managePrefer")
	public int getManagePrefer() {
		return managePrefer;
	}

	public void setManagePrefer(int managePrefer) {
		this.managePrefer = managePrefer;
	}

	@Column(name = "advancePrefer")
	public int getAdvancePrefer() {
		return advancePrefer;
	}

	public void setAdvancePrefer(int advancePrefer) {
		this.advancePrefer = advancePrefer;
	}

	@Column(name = "taxPrice")
	public int getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(int taxPrice) {
		this.taxPrice = taxPrice;
	}

	@Column(name = "totalPrice")
	public int getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(int totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "activityProfit")
	public int getActivityProfit() {
		return activityProfit;
	}

	public void setActivityProfit(int activityProfit) {
		this.activityProfit = activityProfit;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

}