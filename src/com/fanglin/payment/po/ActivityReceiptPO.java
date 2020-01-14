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
@Table(name = "activityreceipt", catalog = "payment")
public class ActivityReceiptPO implements Serializable {

	private static final long serialVersionUID = 5361587646141009841L;
	
	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_BANKINFO_STR = "bankInfo";

	public static final String COLUMN_VRID_STR = "vrid";

	private long arid;// 活动收据ID

	private UserPO collecter;// 收款人

	private Timestamp collectTime;// 收款时间

	private long cash;// 现金

	private long bank;// 刷卡

	private String bankInfo;// 刷卡信息

	private long coupon;// 券值

	private String couponInfo;// 券信息

	private String comment;// 说明

	public ActivityReceiptPO() {
		super();
	}

	public ActivityReceiptPO(UserPO collecter) {
		super();
		this.collecter = collecter;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "arid")
	public long getArid() {
		return arid;
	}

	public void setArid(long arid) {
		this.arid = arid;
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

	@Column(name = "cash")
	public long getCash() {
		return cash;
	}

	public void setCash(long cash) {
		this.cash = cash;
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

	@Column(name = "coupon")
	public long getCoupon() {
		return coupon;
	}

	public void setCoupon(long coupon) {
		this.coupon = coupon;
	}

	@Column(name = "couponInfo")
	public String getCouponInfo() {
		return couponInfo;
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