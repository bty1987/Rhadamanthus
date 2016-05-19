package com.fanglin.payment.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialoutsidereceipt", catalog = "platform")
public class MaterialOutsideReceiptPO implements java.io.Serializable {

	private static final long serialVersionUID = 7722843785560964260L;
	
	public static final String COLUMN_MORID_STR = "morId";

	private long morId;
	
	private String collectUserId;
	
	private String collectUserName;
	
	private Timestamp collectTime;
	
	private String confirmUserId;
	
	private String confirmUserName;
	
	private Timestamp confirmTime;
	
	private float realMoney;
	
	private float cash;
	
	private String cashInfo;
	
	private float bank;
	
	private String bankName;
	
	private float checkv;
	
	private String checkvBankName;
	
	private float installment;
	
	private String installmentBankName;
	
	private float accounts;
	
	private String accountsBankName;
	
	private short status;
	
	private String des;

	public MaterialOutsideReceiptPO() {
		super();
		
		this.collectUserId = "";
		this.collectUserName = "";
		this.confirmUserId = "";
		this.confirmUserName = "";
		
		this.bankName = "";
		this.checkvBankName = "";
		this.installmentBankName = "";
		this.accountsBankName = "";
		
		this.des = "";
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "morId")
	public long getMorId() {
		return this.morId;
	}

	public void setMorId(long morId) {
		this.morId = morId;
	}

	@Column(name = "collectUserId")
	public String getCollectUserId() {
		return this.collectUserId;
	}

	public void setCollectUserId(String collectUserId) {
		this.collectUserId = collectUserId;
	}

	@Column(name = "collectUserName")
	public String getCollectUserName() {
		return this.collectUserName;
	}

	public void setCollectUserName(String collectUserName) {
		this.collectUserName = collectUserName;
	}

	@Column(name = "collectTime")
	public Timestamp getCollectTime() {
		return this.collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	@Column(name = "confirmUserId")
	public String getConfirmUserId() {
		return this.confirmUserId;
	}

	public void setConfirmUserId(String confirmUserId) {
		this.confirmUserId = confirmUserId;
	}

	@Column(name = "confirmUserName")
	public String getConfirmUserName() {
		return this.confirmUserName;
	}

	public void setConfirmUserName(String confirmUserName) {
		this.confirmUserName = confirmUserName;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return this.confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "realMoney")
	public float getRealMoney() {
		return this.realMoney;
	}

	public void setRealMoney(float realMoney) {
		this.realMoney = realMoney;
	}

	@Column(name = "cash")
	public float getCash() {
		return this.cash;
	}

	public void setCash(float cash) {
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
	public float getBank() {
		return this.bank;
	}

	public void setBank(float bank) {
		this.bank = bank;
	}

	@Column(name = "bankName")
	public String getBankName() {
		return this.bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Column(name = "checkv")
	public float getCheckv() {
		return this.checkv;
	}

	public void setCheckv(float checkv) {
		this.checkv = checkv;
	}

	@Column(name = "checkvBankName")
	public String getCheckvBankName() {
		return this.checkvBankName;
	}

	public void setCheckvBankName(String checkvBankName) {
		this.checkvBankName = checkvBankName;
	}

	@Column(name = "installment")
	public float getInstallment() {
		return this.installment;
	}

	public void setInstallment(float installment) {
		this.installment = installment;
	}

	@Column(name = "installmentBankName")
	public String getInstallmentBankName() {
		return this.installmentBankName;
	}

	public void setInstallmentBankName(String installmentBankName) {
		this.installmentBankName = installmentBankName;
	}

	@Column(name = "accounts")
	public float getAccounts() {
		return this.accounts;
	}

	public void setAccounts(float accounts) {
		this.accounts = accounts;
	}

	@Column(name = "accountsBankName")
	public String getAccountsBankName() {
		return this.accountsBankName;
	}

	public void setAccountsBankName(String accountsBankName) {
		this.accountsBankName = accountsBankName;
	}

	@Column(name = "des")
	public String getDes() {
		return this.des;
	}

	public void setDes(String des) {
		this.des = des;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}