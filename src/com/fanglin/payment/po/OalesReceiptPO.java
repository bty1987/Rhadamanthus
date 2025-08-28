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
@Table(name = "oalesreceipt", catalog = "payment")
public class OalesReceiptPO implements Serializable {

	private static final long serialVersionUID = -1338386407765927692L;

	public static final String COLUMN_SRID_STR = "orid";

	public static final short TYPE_PAYMENT_INT = 0;

	public static final short TYPE_REFUND_INT = 1;

	private long orid;

	private short type;

	private UserPO collecter;

	private UserPO confirmer;

	private String collecterName;

	private String confirmerName;

	private Timestamp collectTime;

	private Timestamp confirmTime;

	private long realMoney;

	private long cash;

	private String cashInfo;

	private long bank;

	private String bankInfo;

	private long checkv;

	private String checkvBank;

	private long installment;

	private String installBank;

	private long accounts;

	private String accountsBank;

	private String comment;

	public OalesReceiptPO() {
		super();

		this.installBank = "";
		this.accountsBank = "";
	}

	public OalesReceiptPO(long orid) {
		super();
		this.orid = orid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "orid")
	public long getOrid() {
		return orid;
	}

	public void setOrid(long orid) {
		this.orid = orid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cluid", referencedColumnName = "uid")
	public UserPO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserPO collecter) {
		this.collecter = collecter;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cfuid", referencedColumnName = "uid")
	public UserPO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserPO confirmer) {
		this.confirmer = confirmer;
	}

	@Column(name = "collecterName")
	public String getCollecterName() {
		return collecterName;
	}

	public void setCollecterName(String collecterName) {
		this.collecterName = collecterName;
	}

	@Column(name = "confirmerName")
	public String getConfirmerName() {
		return confirmerName;
	}

	public void setConfirmerName(String confirmerName) {
		this.confirmerName = confirmerName;
	}

	@Column(name = "collectTime")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
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

	@Column(name = "installment")
	public long getInstallment() {
		return installment;
	}

	public void setInstallment(long installment) {
		this.installment = installment;
	}

	@Column(name = "installmentBank")
	public String getInstallBank() {
		return installBank;
	}

	public void setInstallBank(String installBank) {
		this.installBank = installBank;
	}

	@Column(name = "accounts")
	public long getAccounts() {
		return accounts;
	}

	public void setAccounts(long accounts) {
		this.accounts = accounts;
	}

	@Column(name = "accountsBank")
	public String getAccountsBank() {
		return accountsBank;
	}

	public void setAccountsBank(String accountsBank) {
		this.accountsBank = accountsBank;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
