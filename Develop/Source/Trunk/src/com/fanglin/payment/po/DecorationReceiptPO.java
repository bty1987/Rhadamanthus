package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "decorationreceipt", catalog = "platform")
public class DecorationReceiptPO implements java.io.Serializable {

	private static final long serialVersionUID = -7276860369088565071L;
	
	public static final String COLUMN_DRID_STR = "drId";
	
	public static final int STATUS_CONFIRM_INT = 2;
	
	public static final short RECEIPT_TYPE_COLLECT_INT = 0;
	
	public static final short RECEIPT_TYPE_REFUND_INT = 1;

	private long drId;
	
	private short receiptType;
	
	private UserPO collectUserPO;
	
	private Timestamp collectTime;
	
	private UserPO confirmUserPO;
	
	private Timestamp confirmTime;
	
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
	
	private float advance;
	
	private short advanceType;
	
	private float coupon;
	
	private String couponInfo;
	
	private short status;
	
	private String des;

	public DecorationReceiptPO() {
		super();
		
		this.bankInfo = "";
		this.accountsBankName = "";
		this.checkvBankName = "";
		this.installmentBankName = "";
		this.couponInfo = "";
		this.des = "";
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "drId")
	public long getDrId() {
		return this.drId;
	}

	public void setDrId(long drId) {
		this.drId = drId;
	}

	@Column(name = "receiptType")
	public short getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(short receiptType) {
		this.receiptType = receiptType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "collectUserId", referencedColumnName = "userId")
	public UserPO getCollectUserPO(){
		return collectUserPO;
	}
	
	public void setCollectUserPO(UserPO collectUserPO){
		this.collectUserPO = collectUserPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "confirmUserId", referencedColumnName = "userId")
	public UserPO getConfirmUserPO(){
		return confirmUserPO;
	}
	
	public void setConfirmUserPO(UserPO confirmUserPO){
		this.confirmUserPO = confirmUserPO;
	}
	
	@Column(name = "collectTime")
	public Timestamp getCollectTime(){
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime){
		this.collectTime = collectTime;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime(){
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime){
		this.confirmTime = confirmTime;
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

	@Column(name = "advance")
	public float getAdvance() {
		return this.advance;
	}

	public void setAdvance(float advance) {
		this.advance = advance;
	}

	@Column(name = "advanceType", nullable = false)
	public short getAdvanceType() {
		return this.advanceType;
	}

	public void setAdvanceType(short advanceType) {
		this.advanceType = advanceType;
	}

	@Column(name = "coupon")
	public float getCoupon() {
		return this.coupon;
	}

	public void setCoupon(float coupon) {
		this.coupon = coupon;
	}

	@Column(name = "couponInfo")
	public String getCouponInfo() {
		return this.couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
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