/**
 * @File Name		: MaterialPaymentVO.java
 * @Package   	: com.fanglin.vo.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.exports.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class MaterialPaymentExportVO implements Serializable {

	private static final long serialVersionUID = 8288554491562070139L;

	private String orderId;

	private String msoNo;

	private String orderAddr;

	private String customerName;

	private String salesmanName;

	private String departmentName;

	private String regionName;

	private String materialType;

	private String materialBrand;

	private Long cash;

	private Long bank;

	private String bankInfo;

	private Integer msoCoupon;

	private String msoCouponInfo;

	private Long coupon;

	private String couponInfo;

	private String paymentTypeName;

	private Long referMoney;

	private String createUserName;

	private String collectUserName;

	private Timestamp collectTime;

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getMsoNo() {
		return msoNo;
	}

	public void setMsoNo(String msoNo) {
		this.msoNo = msoNo;
	}

	public String getOrderAddr() {
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getSalesmanName() {
		return salesmanName;
	}

	public void setSalesmanName(String salesmanName) {
		this.salesmanName = salesmanName;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	public String getMaterialType() {
		return materialType;
	}

	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}

	public String getMaterialBrand() {
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand) {
		this.materialBrand = materialBrand;
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

	public Integer getMsoCoupon() {
		return msoCoupon;
	}

	public void setMsoCoupon(Integer msoCoupon) {
		this.msoCoupon = msoCoupon;
	}

	public String getMsoCouponInfo() {
		return msoCouponInfo;
	}

	public void setMsoCouponInfo(String msoCouponInfo) {
		this.msoCouponInfo = msoCouponInfo;
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

	public String getPaymentTypeName() {
		return paymentTypeName;
	}

	public void setPaymentTypeName(String paymentTypeName) {
		this.paymentTypeName = paymentTypeName;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
	}

	public String getCreateUserName() {
		return createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	public String getCollectUserName() {
		return collectUserName;
	}

	public void setCollectUserName(String collectUserName) {
		this.collectUserName = collectUserName;
	}

	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

}
