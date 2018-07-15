package com.fanglin.information.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class VreceiptVO implements Serializable {

	private static final long serialVersionUID = 4435925467853249226L;

	private Long vrid;// 活动收据ID
	
	private String orderId;// 装修单号

	private UserBaseVO collecter;// 收款人

	private Timestamp collectTime;// 收款时间

	private Float cash;// 现金

	private Float bank;// 刷卡

	private String bankInfo;// 刷卡信息
	
	private Float coupon;//券值
	
	private String couponInfo;//券信息

	private String comment;// 说明
	
	public VreceiptVO(){
		super();
	}
	
	public VreceiptVO(UserBaseVO collecter) {
		super();
		this.collecter=collecter;
	}

	public Long getVrid() {
		return vrid;
	}

	public void setVrid(Long vrid) {
		this.vrid = vrid;
	}
	
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public UserBaseVO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserBaseVO collecter) {
		this.collecter = collecter;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Float getCash() {
		return cash;
	}

	public void setCash(Float cash) {
		this.cash = cash;
	}

	public Float getBank() {
		return bank;
	}

	public void setBank(Float bank) {
		this.bank = bank;
	}

	public String getBankInfo() {
		return bankInfo;
	}

	public void setBankInfo(String bankInfo) {
		this.bankInfo = bankInfo;
	}

	public Float getCoupon() {
		return coupon;
	}

	public void setCoupon(Float coupon) {
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
