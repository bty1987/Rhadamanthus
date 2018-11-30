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
@Table(name = "decorationreceipt", catalog = "payment")
public class DecorationReceiptPO implements java.io.Serializable {

	private static final long serialVersionUID = -7276860369088565071L;
	
	public static final String COLUMN_DRID_STR = "drId";
	
	public static final short STATUS_CONFIRM_INT = 2;
	
	public static final short RECEIPT_TYPE_COLLECT_INT = 0;
	
	public static final short RECEIPT_TYPE_REFUND_INT = 1;

	private long drId;
	
	private short type;
	
	private short status;
	
	private UserPO collecter;
	
	private UserPO confirmer;
	
	private String collecterName;
	
	private String confirmerName;
	
	private Timestamp collectTime;
	
	private Timestamp confirmTime;
	
	private float cash;
	
	private String cashInfo;
	
	private float bank;
	
	private String bankInfo;
	
	private float checkv;
	
	private String checkvBank;
	
	private float installment;
	
	private String installmentBank;
	
	private float accounts;
	
	private String accountsBank;
	
	private float advance;
	
	private short advanceType;
	
	private float coupon;
	
	private String couponInfo;
	
	private String comment;

	public DecorationReceiptPO() {
		super();
		
		this.bankInfo = "";
		this.accountsBank = "";
		this.checkvBank = "";
		this.installmentBank = "";
		this.couponInfo = "";
		this.comment = "";
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cluid", referencedColumnName = "uid")
	public UserPO getCollecter(){
		return collecter;
	}
	
	public void setCollecter(UserPO collecter){
		this.collecter = collecter;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cfuid", referencedColumnName = "uid")
	public UserPO getConfirmer(){
		return confirmer;
	}
	
	public void setConfirmer(UserPO confirmer){
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

	@Column(name = "checkvBank")
	public String getCheckvBank() {
		return this.checkvBank;
	}

	public void setCheckvBank(String checkvBank) {
		this.checkvBank = checkvBank;
	}
	
	@Column(name = "installment")
	public float getInstallment() {
		return this.installment;
	}

	public void setInstallment(float installment) {
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
	public float getAccounts() {
		return this.accounts;
	}

	public void setAccounts(float accounts) {
		this.accounts = accounts;
	}

	@Column(name = "accountsBank")
	public String getAccountsBank() {
		return this.accountsBank;
	}

	public void setAccountsBank(String accountsBank) {
		this.accountsBank = accountsBank;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}