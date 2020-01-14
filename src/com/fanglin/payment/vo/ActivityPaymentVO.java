package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ActivityPaymentVO implements Serializable {

	private static final long serialVersionUID = 8484465951085992045L;

	private Long arid;

	private ActivityReceiptVO activityReceipt;// 活动收据ID

	private Long apid;// 活动款ID

	private String mno;// 会员号

	private String orderId;// 装修单号

	private UserBaseVO creater;// 创建人

	private Timestamp createTime;// 创建时间

	private UserBaseVO collecter;// 收款人

	private Timestamp collectTime;// 收款时间

	private Short type;// 类型 , 0: 装修款 , 1: 主材款

	private Short status;// 状态 , 0: 未付款 , 1: 已付款

	private String brand;// 品牌

	private Long money;// 金额

	private Long cash;// 现金

	private Long bank;// 刷卡

	private String bankInfo;// 刷卡信息

	private Long coupon;// 券值

	private String couponInfo;// 券信息

	private String comment;// 备注

	public ActivityPaymentVO() {
		super();
	}

	public ActivityPaymentVO(UserBaseVO creater, UserBaseVO collecter, ActivityReceiptVO activityReceipt) {
		super();
		this.creater = creater;
		this.collecter = collecter;
		this.activityReceipt = activityReceipt;
	}

	public Long getArid() {
		return arid;
	}

	public void setArid(Long arid) {
		this.arid = arid;
	}

	public ActivityReceiptVO getActivityReceipt() {
		return activityReceipt;
	}

	public void setActivityReceipt(ActivityReceiptVO activityReceipt) {
		this.activityReceipt = activityReceipt;
	}

	public Long getApid() {
		return apid;
	}

	public void setApid(Long apid) {
		this.apid = apid;
	}

	public String getMno() {
		return mno;
	}

	public void setMno(String mno) {
		this.mno = mno;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserBaseVO collecter) {
		this.collecter = collecter;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	public Long getCash() {
		return cash;
	}

	public void setCash(Long cash) {
		this.cash = cash;
	}

	public Long getBank() {
		return bank;
	}

	public void setBank(Long bank) {
		this.bank = bank;
	}

	public String getBankInfo() {
		return bankInfo;
	}

	public void setBankInfo(String bankInfo) {
		this.bankInfo = bankInfo;
	}

	public Long getCoupon() {
		return coupon;
	}

	public void setCoupon(Long coupon) {
		this.coupon = coupon;
	}

	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
