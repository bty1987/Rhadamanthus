package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "advancereceipt", catalog = "payment")
public class AdvanceReceiptPO implements java.io.Serializable {

	private static final long serialVersionUID = 4094999268147934216L;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_COLLRCT_INT = 1;

	public static final short STATUS_RECEIPTTYPE_INT = 0;

	public static final short STATUS_CONFIRM_INT = 2;

	public static final long COLUMN_MONEY_INT = 0;

	private long arId;

	private short type;

	private short status;

	private UserPO collecter;

	private String collecterName;

	private Timestamp collectTime;

	private UserPO confirmer;

	private String confirmerName;

	private Timestamp confirmTime;

	private long realMoney;

	private long cash;

	private String cashInfo;

	private long bank;

	private String bankInfo;

	private long checkv;

	private String checkvBank;

	private long installment;

	private String installmentBank;

	private long accounts;

	private String accountsBank;

	private long transfer;

	private String comment;

	public AdvanceReceiptPO() {
		super();

		this.bankInfo = "";
		this.checkvBank = "";
		this.installmentBank = "";
		this.accountsBank = "";
		this.comment = "";
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "arId")
	public long getArId() {
		return this.arId;
	}

	public void setArId(long arId) {
		this.arId = arId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "cluid", referencedColumnName = "uid")
	public UserPO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserPO collecter) {
		this.collecter = collecter;
	}

	@Column(name = "collecterName")
	public String getCollecterName() {
		return collecterName;
	}

	public void setCollecterName(String collecterName) {
		this.collecterName = collecterName;
	}

	@Column(name = "collectTime")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "cfuid", referencedColumnName = "uid")
	public UserPO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserPO confirmer) {
		this.confirmer = confirmer;
	}

	@Column(name = "confirmerName")
	public String getConfirmerName() {
		return confirmerName;
	}

	public void setConfirmerName(String confirmerName) {
		this.confirmerName = confirmerName;
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
		return this.cash;
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
		return this.bank;
	}

	public void setBank(long bank) {
		this.bank = bank;
	}

	@Column(name = "bankInfo")
	public String getBankInfo() {
		return this.bankInfo;
	}

	public void setBankInfo(String bankInfo) {
		this.bankInfo = bankInfo;
	}

	@Column(name = "checkv")
	public long getCheckv() {
		return this.checkv;
	}

	public void setCheckv(long checkv) {
		this.checkv = checkv;
	}

	@Column(name = "checkvBank")
	public String getCheckvBank() {
		return this.checkvBank;
	}

	public void setCheckvBank(String checkvBank) {
		this.checkvBank = checkvBank;
	}

	@Column(name = "installment")
	public long getInstallment() {
		return this.installment;
	}

	public void setInstallment(long installment) {
		this.installment = installment;
	}

	@Column(name = "installmentBank")
	public String getInstallmentBank() {
		return this.installmentBank;
	}

	public void setInstallmentBank(String installmentBank) {
		this.installmentBank = installmentBank;
	}

	@Column(name = "accounts")
	public long getAccounts() {
		return this.accounts;
	}

	public void setAccounts(long accounts) {
		this.accounts = accounts;
	}

	@Column(name = "accountsBank")
	public String getAccountsBank() {
		return this.accountsBank;
	}

	public void setAccountsBank(String accountsBank) {
		this.accountsBank = accountsBank;
	}

	@Column(name = "transfer")
	public long getTransfer() {
		return transfer;
	}

	public void setTransfer(long transfer) {
		this.transfer = transfer;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}