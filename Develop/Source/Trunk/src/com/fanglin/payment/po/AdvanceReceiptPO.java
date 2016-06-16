package com.fanglin.payment.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "advancereceipt", catalog = "platform")
public class AdvanceReceiptPO implements java.io.Serializable {

	private static final long serialVersionUID = 4094999268147934216L;
	
	public static final int STATUS_INIT_INT = 0;
	
	public static final int STATUS_CONFIRM_INT = 2;
	
	private long arId;
	
	private short receiptType;
	
	private UserPO collectUser;
	
	private Timestamp collectTime;
	
	private UserPO confirmUser;
	
	private Timestamp confirmTime;
	
	private float realMoney;
	
	private float cash;
	
	private String cashInfo;
	
	private float bank;
	
	private String bankInfo;
	
	private float checkv;
	
	private String checkvBankName;
	
	private float installment;
	
	private String installmentBankName;
	
	private float accounts;
	
	private String accountsBankName;
	
	private short status;
	
	private String des;

	public AdvanceReceiptPO() {
		super();
		
		this.bankInfo = "";
		this.checkvBankName = "";
		this.installmentBankName = "";
		this.accountsBankName = "";
		this.des = "";
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
	
	@Column(name = "receiptType")
	public short getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(short receiptType) {
		this.receiptType = receiptType;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "collectUserId", referencedColumnName = "userId")
	public UserPO getCollectUser(){
		return collectUser;
	}

	public void setCollectUser(UserPO collectUser){
		this.collectUser = collectUser;
	}

	public Timestamp getCollectTime(){
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime){
		this.collectTime = collectTime;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "confirmUserId", referencedColumnName = "userId")
	public UserPO getConfirmUser(){
		return confirmUser;
	}

	public void setConfirmUser(UserPO confirmUser){
		this.confirmUser = confirmUser;
	}

	public Timestamp getConfirmTime(){
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime){
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

	@Column(name = "bankInfo")
	public String getBankInfo() {
		return this.bankInfo;
	}

	public void setBankInfo(String bankInfo) {
		this.bankInfo = bankInfo;
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