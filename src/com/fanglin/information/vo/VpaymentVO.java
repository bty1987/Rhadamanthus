package com.fanglin.information.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class VpaymentVO implements Serializable {

	private static final long serialVersionUID = 6240866246932423141L;
	
	private Long vrid;

	private VreceiptVO vreceipt;// 活动收据ID
	
	private Long vpid;// 活动款ID

	private String mno;// 会员号

	private String orderId;// 装修单号

	private UserBaseVO creater;// 创建人

	private Timestamp createTime;// 创建时间

	private UserBaseVO collecter;// 收款人

	private Timestamp collectTime;// 收款时间

	private Short type;// 类型 , 0: 装修款 , 1: 主材款
	
	private Short status;// 状态 , 0: 未付款 , 1: 已付款

	private String brand;// 品牌

	private Float money;// 金额
	
	private Float cash;//现金
	
	private Float bank;//刷卡
	
	private String bankInfo;//刷卡信息
	
	private Float coupon;//券值
	
	private String couponInfo;//券信息

	private String comment;// 备注
	
	public VpaymentVO() {
		super();
	}

	public VpaymentVO(UserBaseVO creater, UserBaseVO collecter,VreceiptVO vreceipt) {
		super();
		this.creater = creater;
		this.collecter = collecter;
		this.vreceipt=vreceipt;
	}
	
	public VreceiptVO getVreceipt() {
		return vreceipt;
	}

	public void setVreceipt(VreceiptVO vreceipt) {
		this.vreceipt = vreceipt;
	}

	public Long getVpid() {
		return vpid;
	}

	public void setVpid(Long vpid) {
		this.vpid = vpid;
	}

	public String getMno() {
		return mno;
	}

	public void setMno(String mno) {
		this.mno = mno;
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

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
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

	public void setMoney(float money) {
		this.money = money;
	}

	public Long getVrid() {
		return vrid;
	}

	public void setVrid(Long vrid) {
		this.vrid = vrid;
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

}
