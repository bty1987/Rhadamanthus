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

package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MaterialPaymentVO implements Serializable{

	private static final long serialVersionUID = 7379370514634255371L;
	
	private Long mpId;
	
	private Long msoId;
	
	private String msoNo;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerId;
	
	private String customerName;
	
	private String salesmanName;
	
	private String departmentName;
	
	private String regionName;
	
	private Integer paymentType;
	
	private String paymentTypeName;
	
	private Integer paymentStatus;
	
	private String materialType;
	
	private String materialBrand;
	
	private String createUserId;
	
	private String createUserName;
	
	private String collectUserId;
	
	private String collectUserName;
	
	private Timestamp collectTime;
	
	private String confirmUserId;
	
	private String confirmUserName;
	
	private Timestamp confirmTime;
	
	private Float referMoney;
	
	private Float cash;
	
	private String cashInfo;
	
	private Float bank;
	
	private String bankInfo;
	
	private Float checkv;
	
	private String checkvBankName;
	
	private Float installment;
	
	private String installmentBankName;
	
	private Float accounts;
	
	private String accountsBankName;
	
	private Float advance;
	
	private Short advanceType;
	
	private Float coupon;
	
	private Short couponType;
	
	private String couponInfo;
	
	private Float msoCoupon;
	
	private String msoCouponInfo;
	
	private String des;
	
	private Long mrId;

	public Long getMpId(){
		return mpId;
	}

	public void setMpId(Long mpId){
		this.mpId = mpId;
	}

	public Long getMsoId(){
		return msoId;
	}

	public void setMsoId(Long msoId){
		this.msoId = msoId;
	}

	public Integer getPaymentType(){
		return paymentType;
	}

	public void setPaymentType(Integer paymentType){
		this.paymentType = paymentType;
	}

	public Integer getPaymentStatus(){
		return paymentStatus;
	}

	public void setPaymentStatus(Integer paymentStatus){
		this.paymentStatus = paymentStatus;
	}

	public String getCreateUserId(){
		return createUserId;
	}

	public void setCreateUserId(String createUserId){
		this.createUserId = createUserId;
	}

	public String getCollectUserId(){
		return collectUserId;
	}

	public void setCollectUserId(String collectUserId){
		this.collectUserId = collectUserId;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime(){
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime){
		this.collectTime = collectTime;
	}

	public String getConfirmUserId(){
		return confirmUserId;
	}

	public void setConfirmUserId(String confirmUserId){
		this.confirmUserId = confirmUserId;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getConfirmTime(){
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime){
		this.confirmTime = confirmTime;
	}

	public Float getReferMoney(){
		return referMoney;
	}

	public void setReferMoney(Float referMoney){
		this.referMoney = referMoney;
	}

	public Float getCash(){
		return cash;
	}

	public void setCash(Float cash){
		this.cash = cash;
	}

	public String getCashInfo() {
		return cashInfo;
	}

	public void setCashInfo(String cashInfo) {
		this.cashInfo = cashInfo;
	}

	public Float getBank(){
		return bank;
	}

	public void setBank(Float bank){
		this.bank = bank;
	}

	public String getCheckvBankName(){
		return checkvBankName;
	}

	public void setCheckvBankName(String checkvBankName){
		this.checkvBankName = checkvBankName;
	}

	public Float getInstallment(){
		return installment;
	}

	public void setInstallment(Float installment){
		this.installment = installment;
	}

	public String getInstallmentBankName(){
		return installmentBankName;
	}

	public void setInstallmentBankName(String installmentBankName){
		this.installmentBankName = installmentBankName;
	}

	public Float getAccounts(){
		return accounts;
	}

	public void setAccounts(Float accounts){
		this.accounts = accounts;
	}

	public String getAccountsBankName(){
		return accountsBankName;
	}

	public void setAccountsBankName(String accountsBankName){
		this.accountsBankName = accountsBankName;
	}

	public Float getCoupon(){
		return coupon;
	}

	public void setCoupon(Float coupon){
		this.coupon = coupon;
	}

	public String getCreateUserName(){
		return createUserName;
	}

	public void setCreateUserName(String createUserName){
		this.createUserName = createUserName;
	}

	public String getCollectUserName(){
		return collectUserName;
	}

	public void setCollectUserName(String collectUserName){
		this.collectUserName = collectUserName;
	}

	public String getConfirmUserName(){
		return confirmUserName;
	}

	public void setConfirmUserName(String confirmUserName){
		this.confirmUserName = confirmUserName;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public Float getCheckv(){
		return checkv;
	}

	public void setCheckv(Float checkv){
		this.checkv = checkv;
	}

	public String getMsoNo(){
		return msoNo;
	}

	public void setMsoNo(String msoNo){
		this.msoNo = msoNo;
	}

	public String getOrderAddr(){
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	public Short getCouponType(){
		return couponType;
	}

	public void setCouponType(Short couponType){
		this.couponType = couponType;
	}

	public Float getAdvance(){
		return advance;
	}

	public void setAdvance(Float advance){
		this.advance = advance;
	}

	public Short getAdvanceType(){
		return advanceType;
	}

	public void setAdvanceType(Short advanceType){
		this.advanceType = advanceType;
	}

	public String getCouponInfo(){
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo){
		this.couponInfo = couponInfo;
	}

	public String getBankInfo(){
		return bankInfo;
	}

	public void setBankInfo(String bankInfo){
		this.bankInfo = bankInfo;
	}

	public String getMaterialType(){
		return materialType;
	}

	public void setMaterialType(String materialType){
		this.materialType = materialType;
	}

	public String getMaterialBrand(){
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand){
		this.materialBrand = materialBrand;
	}

	public String getSalesmanName(){
		return salesmanName;
	}

	public void setSalesmanName(String salesmanName){
		this.salesmanName = salesmanName;
	}

	public String getDepartmentName(){
		return departmentName;
	}

	public void setDepartmentName(String departmentName){
		this.departmentName = departmentName;
	}

	public String getRegionName(){
		return regionName;
	}

	public void setRegionName(String regionName){
		this.regionName = regionName;
	}

	public String getPaymentTypeName(){
		return paymentTypeName;
	}

	public void setPaymentTypeName(String paymentTypeName){
		this.paymentTypeName = paymentTypeName;
	}

	public String getMsoCouponInfo(){
		return msoCouponInfo;
	}

	public void setMsoCouponInfo(String msoCouponInfo){
		this.msoCouponInfo = msoCouponInfo;
	}

	public Float getMsoCoupon() {
		return msoCoupon;
	}

	public void setMsoCoupon(Float msoCoupon) {
		this.msoCoupon = msoCoupon;
	}

	public Long getMrId() {
		return mrId;
	}

	public void setMrId(Long mrId) {
		this.mrId = mrId;
	}

}
