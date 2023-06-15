package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "proxyreceipt", catalog = "payment")
public class ProxyReceiptPO implements Serializable {

	private static final long serialVersionUID = -2821254564187285742L;

	public static final String COLUMN_COLLECTER_STR = "collecter.userId";

	public static final String COLUMN_COLLECTTIME_STR = "collectTime";

	public static final String COLUMN_CONFIRMER_STR = "confirmer.userId";

	public static final String COLUMN_CONFIRMTIME_STR = "confirmTime";

	private long prid;

	private UserPO collecter;

	private Timestamp collectTime;

	private UserPO confirmer;

	private Timestamp confirmTime;

	private long realMoney;

	private long cash;

	private String cashInfo;

	private long bank;

	private String bankInfo;

	private long checkv;

	private String checkvBank;

	private String comment;

	public ProxyReceiptPO() {
		super();
	}

	public ProxyReceiptPO(UserPO collecter, UserPO confirmer) {
		super();
		this.collecter = collecter;
		this.confirmer = confirmer;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "prid")
	public long getPrid() {
		return prid;
	}

	public void setPrid(long prid) {
		this.prid = prid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cluid", referencedColumnName = "uid")
	public UserPO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserPO collecter) {
		this.collecter = collecter;
	}

	@Column(name = "collectTime")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cfuid", referencedColumnName = "uid")
	public UserPO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserPO confirmer) {
		this.confirmer = confirmer;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "realMoney")
	public long getRealMoney() {
		return realMoney;
	}

	public void setRealMoney(long realMoney) {
		this.realMoney = realMoney;
	}

	@Column(name = "cash")
	public long getCash() {
		return cash;
	}

	public void setCash(long cash) {
		this.cash = cash;
	}

	@Column(name = "cashInfo")
	public String getCashInfo() {
		return cashInfo;
	}

	public void setCashInfo(String cashInfo) {
		this.cashInfo = cashInfo;
	}

	@Column(name = "bank")
	public long getBank() {
		return bank;
	}

	public void setBank(long bank) {
		this.bank = bank;
	}

	@Column(name = "bankInfo")
	public String getBankInfo() {
		return bankInfo;
	}

	public void setBankInfo(String bankInfo) {
		this.bankInfo = bankInfo;
	}

	@Column(name = "checkv")
	public long getCheckv() {
		return checkv;
	}

	public void setCheckv(long checkv) {
		this.checkv = checkv;
	}

	@Column(name = "checkvBank")
	public String getCheckvBank() {
		return checkvBank;
	}

	public void setCheckvBank(String checkvBank) {
		this.checkvBank = checkvBank;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}