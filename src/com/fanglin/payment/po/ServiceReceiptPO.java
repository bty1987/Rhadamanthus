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
@Table(name = "servicereceipt", catalog = "payment")
public class ServiceReceiptPO  implements Serializable{

	private static final long serialVersionUID = -1338386407765927692L;
	
	public static final String COLUMN_SRID_STR = "srId";
	
	public static final String COLUMN_INFO_STR = "";
	
	public static final long COLUMN_MONEY_INT = 0;
	
	public static final short COLUMN_ADVANCETYPE_INT = 0;
	
	public static final short COLUMN_ADVANCETYPE_BALANCE_INT = 1; //合同预付款
	
	private long srId;
	
	private short type;
	
	private UserPO collecter;
	
	private UserPO confirmer;
	
	private String collecterName;
	
	private String confirmerName;
	
	private Timestamp collectTime;
	
	private Timestamp confirmTime;
	
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
	
	private long advance;
	
	private short advanceType;
	
	private String comment;
	
	public ServiceReceiptPO() {
		super();
		
		this.installBank = "";
		this.accountsBank = "";
	}

	public ServiceReceiptPO(long srId) {
		super();
		this.srId = srId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY) 
	@Column(name = "srid")
	public long getSrId() {
		return srId;
	}

	public void setSrId(long srId) {
		this.srId = srId;
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

	@Column(name = "advance")
	public long getAdvance() {
		return advance;
	}

	public void setAdvance(long advance) {
		this.advance = advance;
	}

	@Column(name = "advanceType")
	public short getAdvanceType() {
		return advanceType;
	}

	public void setAdvanceType(short advanceType) {
		this.advanceType = advanceType;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
