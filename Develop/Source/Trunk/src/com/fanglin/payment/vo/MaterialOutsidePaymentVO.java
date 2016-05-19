package com.fanglin.payment.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MaterialOutsidePaymentVO implements java.io.Serializable {

	private static final long serialVersionUID = 3087361874732245667L;

	private Long mopId;
	
	private Long moId;
	
	private Short paymentType;
	
	private Short paymentStatus;
	
	private String orderId;
	
	private String orderAddr;
	
	private String customerId;
	
	private String customerName;
	
	private String materialTypeName;
	
	private String materialBrandName;
	
	private String createUserId;
	
	private String createUserName;
	
	private Timestamp createTime;
	
	private String collectUserId;
	
	private String collectUserName;
	
	private Timestamp collectTime;
	
	private Float referMoney;
	
	private Float cash;
	
	private String cashInfo;
	
	private Float bank;
	
	private String bankName;
	
	private Float checkv;
	
	private String checkvBankName;
	
	private Float installment;
	
	private String installmentBankName;
	
	private Float accounts;
	
	private String accountsBankName;
	
	private String des;

	public Long getMopId() {
		return mopId;
	}

	public void setMopId(Long mopId) {
		this.mopId = mopId;
	}

	public Long getMoId() {
		return moId;
	}

	public void setMoId(Long moId) {
		this.moId = moId;
	}

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}

	public Short getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(Short paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getOrderAddr() {
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getMaterialTypeName() {
		return materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName) {
		this.materialTypeName = materialTypeName;
	}

	public String getMaterialBrandName() {
		return materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName) {
		this.materialBrandName = materialBrandName;
	}

	public String getCreateUserId() {
		return createUserId;
	}

	public void setCreateUserId(String createUserId) {
		this.createUserId = createUserId;
	}

	public String getCreateUserName() {
		return createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getCollectUserId() {
		return collectUserId;
	}

	public void setCollectUserId(String collectUserId) {
		this.collectUserId = collectUserId;
	}

	public String getCollectUserName() {
		return collectUserName;
	}

	public void setCollectUserName(String collectUserName) {
		this.collectUserName = collectUserName;
	}
	
	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Float referMoney) {
		this.referMoney = referMoney;
	}

	public Float getCash() {
		return cash;
	}

	public void setCash(Float cash) {
		this.cash = cash;
	}

	public String getCashInfo() {
		return cashInfo;
	}

	public void setCashInfo(String cashInfo) {
		this.cashInfo = cashInfo;
	}

	public Float getBank() {
		return bank;
	}

	public void setBank(Float bank) {
		this.bank = bank;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public Float getCheckv() {
		return checkv;
	}

	public void setCheckv(Float checkv) {
		this.checkv = checkv;
	}

	public String getCheckvBankName() {
		return checkvBankName;
	}

	public void setCheckvBankName(String checkvBankName) {
		this.checkvBankName = checkvBankName;
	}

	public Float getInstallment() {
		return installment;
	}

	public void setInstallment(Float installment) {
		this.installment = installment;
	}

	public String getInstallmentBankName() {
		return installmentBankName;
	}

	public void setInstallmentBankName(String installmentBankName) {
		this.installmentBankName = installmentBankName;
	}

	public Float getAccounts() {
		return accounts;
	}

	public void setAccounts(Float accounts) {
		this.accounts = accounts;
	}

	public String getAccountsBankName() {
		return accountsBankName;
	}

	public void setAccountsBankName(String accountsBankName) {
		this.accountsBankName = accountsBankName;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}