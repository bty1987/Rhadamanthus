package com.fanglin.payment.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "materialreceipt", catalog = "payment")
public class MaterialReceiptPO implements java.io.Serializable {

	private static final long serialVersionUID = 6365148496263295035L;
	
	public static final String COLUMN_MRID_STR = "mrId";
	
	public static final short RECEIPT_TYPE_COLLECT_INT = 0;
	
	public static final short RECEIPT_TYPE_REFUND_INT = 1;

	private long mrId;
	
	private short type;
	
	private short status;
	
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
	
	private String installmentBank;
	
	private long accounts;
	
	private String accountsBank;
	
	private long advance;
	
	private short advanceType;
	
	private long coupon;
	
	private short couponType;
	
	private String couponInfo;
	
	private String comment;

	public MaterialReceiptPO() {
		super();
		
		this.collecterName = "";
		this.confirmerName = "";
		
		this.bankInfo = "";
		this.checkvBank = "";
		this.installmentBank = "";
		this.accountsBank = "";
		this.couponInfo = "";
		
		this.comment = "";
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

	@Column(name = "advance")
	public long getAdvance() {
		return this.advance;
	}

	public void setAdvance(long advance) {
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
	public long getCoupon() {
		return this.coupon;
	}

	public void setCoupon(long coupon) {
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}