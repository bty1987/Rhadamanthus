/**
 * @File Name		: QuotationVO
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class DecorationPaymentVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;

	private Long autoId;
	
	private String orderId;
	
	private String customerId;
	
	private String customer;
	
	private String designer;
	
	private String designerDepartment;
	
	private String salesman;
	
	private String village;
	
	private String houseNumber;
	
	private String orderStatus;
	
	private Float orderTotalPrice;
	
	private Timestamp contractTime;
	
	private String paymentType;
	
	private String paymentStatus;
	
	private String createUser;
	
	private String createUserId;
	
	private Timestamp createTime;
	
	private String createDes;
	
	private String collectUser;
	
	private String collectUserId;
	
	private Timestamp collectTime;
	
	private String confirmUser;
	
	private String confirmUserId;
	
	private Timestamp confirmTime;
	
	private Float referMoney;
	
	private Float realMoney;
	
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
	
	private Float coupon;
	
	private String couponInfo;
	
	private Float advance;
	
	private Short advanceType;
	
	private String des;

	private Long drId;
	
	private Long psId;
	
	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getOrderStatus(){
		return orderStatus;
	}

	public void setOrderStatus(String orderStatus){
		this.orderStatus = orderStatus;
	}

	public Float getOrderTotalPrice(){
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}

	public String getPaymentType(){
		return paymentType;
	}

	public void setPaymentType(String paymentType){
		this.paymentType = paymentType;
	}

	public String getPaymentStatus(){
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus){
		this.paymentStatus = paymentStatus;
	}

	public String getCreateUser(){
		return createUser;
	}

	public void setCreateUser(String createUser){
		this.createUser = createUser;
	}

	public String getCreateUserId(){
		return createUserId;
	}

	public void setCreateUserId(String createUserId){
		this.createUserId = createUserId;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime(){
		return createTime;
	}
	
	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getCollectUser(){
		return collectUser;
	}

	public void setCollectUser(String collectUser){
		this.collectUser = collectUser;
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

	public String getConfirmUser(){
		return confirmUser;
	}

	public void setConfirmUser(String confirmUser){
		this.confirmUser = confirmUser;
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

	@JSON(format="yyyy-MM-dd")
	public Timestamp getContractTime(){
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime){
		this.contractTime = contractTime;
	}

	public void setHouseNumber(String houseNumber){
		this.houseNumber = houseNumber;
	}

	public String getHouseNumber(){
		return houseNumber;
	}

	public void setVillage(String village){
		this.village = village;
	}

	public String getVillage(){
		return village;
	}

	public void setCustomer(String customer){
		this.customer = customer;
	}

	public String getCustomer(){
		return customer;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public String getDesigner(){
		return designer;
	}

	public void setSalesman(String salesman){
		this.salesman = salesman;
	}

	public String getSalesman(){
		return salesman;
	}

	public void setDes(String des){
		this.des = des;
	}

	public String getDes(){
		return des;
	}

	public void setCreateDes(String createDes){
		this.createDes = createDes;
	}

	public String getCreateDes(){
		return createDes;
	}

	public Float getBank(){
		return bank;
	}

	public void setBank(Float bank){
		this.bank = bank;
	}

	public String getBankInfo(){
		return bankInfo;
	}

	public void setBankInfo(String bankInfo){
		this.bankInfo = bankInfo;
	}

	public Float getCheckv(){
		return checkv;
	}

	public void setCheckv(Float checkv){
		this.checkv = checkv;
	}

	public String getCheckvBankName(){
		return checkvBankName;
	}

	public void setCheckvBankName(String checkvBankName){
		this.checkvBankName = checkvBankName;
	}

	public String getCouponInfo(){
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo){
		this.couponInfo = couponInfo;
	}

	public Float getAdvance(){
		return advance;
	}

	public void setAdvance(Float advance){
		this.advance = advance;
	}

	public Short getAdvanceType() {
		return advanceType;
	}

	public void setAdvanceType(Short advanceType) {
		this.advanceType = advanceType;
	}

	public Float getRealMoney(){
		return realMoney;
	}

	public void setRealMoney(Float realMoney){
		this.realMoney = realMoney;
	}

	public String getDesignerDepartment(){
		return designerDepartment;
	}

	public void setDesignerDepartment(String designerDepartment){
		this.designerDepartment = designerDepartment;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public Long getDrId() {
		return drId;
	}

	public void setDrId(Long drId) {
		this.drId = drId;
	}

	public Long getPsId() {
		return psId;
	}

	public void setPsId(Long psId) {
		this.psId = psId;
	}

}
