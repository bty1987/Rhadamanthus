package com.fanglin.payment.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialreceipt", catalog = "platform")
public class MaterialReceiptPO implements java.io.Serializable {

	private static final long serialVersionUID = 6365148496263295035L;
	
	public static final String COLUMN_MRID_STR = "mrId";
	
	public static final short RECEIPT_TYPE_COLLECT_INT = 0;
	
	public static final short RECEIPT_TYPE_REFUND_INT = 1;

	private long mrId;
	
	private short receiptType;
	
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
	
	private short couponType;
	
	private String couponInfo;
	
	private short status;
	
	private String des;

	public MaterialReceiptPO() {
		super();
		
		this.collectUserId = "";
		this.collectUserName = "";
		this.confirmUserId = "";
		this.confirmUserName = "";
		
		this.bankInfo = "";
		this.checkvBankName = "";
		this.installmentBankName = "";
		this.accountsBankName = "";
		this.couponInfo = "";
		
		this.des = "";
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mrId")
	public long getMrId() {
		return this.mrId;
	}

	public void setMrId(long mrId) {
		this.mrId = mrId;
	}

	@Column(name = "receiptType")
	public short getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(short receiptType) {
		this.receiptType = receiptType;
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

	@Column(name = "advanceType")
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

	@Column(name = "couponType")
	public short getCouponType() {
		return this.couponType;
	}

	public void setCouponType(short couponType) {
		this.couponType = couponType;
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