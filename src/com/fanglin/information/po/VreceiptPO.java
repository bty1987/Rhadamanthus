package com.fanglin.information.po;

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
@Table(name = "vreceipt", catalog = "information")
public class VreceiptPO implements Serializable {

	private static final long serialVersionUID = 7438878699667566721L;
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_BANKINFO_STR = "bankInfo";
	
	public static final String COLUMN_VRID_STR="vrid";
	
	public static final float COLUMN_CASH_INT = 0f;
	
	public static final float COLUMN_BANK_INT = 0f;
	
	public static final float COLUMN_COUPON_INT = 0f;

	private long vrid;// 活动收据ID
	
	private UserPO collecter;// 收款人
	
	private Timestamp collectTime;// 收款时间
	
	private float cash;// 现金
	
	private float bank;// 刷卡
	
	private String bankInfo;// 刷卡信息
	
	private float coupon;//券值
	
	private String couponInfo;//券信息
	
	private String comment;// 说明
	
	public VreceiptPO(){
		super();
	}
	public VreceiptPO(UserPO collecter) {
		super();
		this.collecter = collecter;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)// 主键由数据库自动生成
	@Column(name = "vrid")
	public long getVrid() {
		return vrid;
	}

	public void setVrid(long vrid) {
		this.vrid = vrid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
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
	public float getCash() {
		return cash;
	}

	public void setCash(float cash) {
		this.cash = cash;
	}

	@Column(name = "bank")
	public float getBank() {
		return bank;
	}

	public void setBank(float bank) {
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
	public float getCoupon() {
		return coupon;
	}
	public void setCoupon(float coupon) {
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
