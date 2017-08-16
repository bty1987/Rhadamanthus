package com.fanglin.payment.vo;

import org.apache.struts2.json.annotations.JSON;


public class MaterialInsidePaymentVO implements java.io.Serializable {

	private static final long serialVersionUID = -2604452280849226587L;

	private Integer mipId;
	
	private Integer miId;
	
	private Integer paymentType;
	
	private Integer paymentStatus;
	
	private String orderAddr;
	
	private String customerId;
	
	private String customerName;
	
	private String materialTypeName;
	
	private String materialBrandName;
	
	private String createUserId;
	
	private String createUserName;
	
	private String collectUserId;
	
	private String collectUserName;
	
	private String collectTime;
	
	private String confirmUserId;
	
	private String confirmUserName;
	
	private String confirmTime;
	
	private Float referMoney;
	
	private Float cash;
	
	private Float bank;
	
	private String bankName;
	
	private Float checkv;
	
	private String checkvBankName;
	
	private Float installment;
	
	private String installmentBankName;
	
	private Float accounts;
	
	private String accountsBankName;
	
	private String des;

	public Integer getMipId(){
		return this.mipId;
	}

	public void setMipId(Integer mipId){
		this.mipId = mipId;
	}

	public Integer getMiId(){
		return this.miId;
	}

	public void setMiId(Integer miId){
		this.miId = miId;
	}

	public Integer getPaymentType(){
		return this.paymentType;
	}

	public void setPaymentType(Integer paymentType){
		this.paymentType = paymentType;
	}

	public Integer getPaymentStatus(){
		return this.paymentStatus;
	}

	public void setPaymentStatus(int paymentStatus){
		this.paymentStatus = paymentStatus;
	}

	public String getOrderAddr(){
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	public String getCustomerName(){
		return this.customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	public String getMaterialTypeName(){
		return this.materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName){
		this.materialTypeName = materialTypeName;
	}

	public String getMaterialBrandName(){
		return this.materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName){
		this.materialBrandName = materialBrandName;
	}

	public String getCreateUserId(){
		return this.createUserId;
	}

	public void setCreateUserId(String createUserId){
		this.createUserId = createUserId;
	}

	public String getCreateUserName(){
		return this.createUserName;
	}

	public void setCreateUserName(String createUserName){
		this.createUserName = createUserName;
	}

	public String getCollectUserId(){
		return this.collectUserId;
	}

	public void setCollectUserId(String collectUserId){
		this.collectUserId = collectUserId;
	}

	public String getCollectUserName(){
		return this.collectUserName;
	}

	public void setCollectUserName(String collectUserName){
		this.collectUserName = collectUserName;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public String getCollectTime(){
		return this.collectTime;
	}

	public void setCollectTime(String collectTime){
		this.collectTime = collectTime;
	}

	public String getConfirmUserId(){
		return this.confirmUserId;
	}

	public void setConfirmUserId(String confirmUserId){
		this.confirmUserId = confirmUserId;
	}

	public String getConfirmUserName(){
		return this.confirmUserName;
	}

	public void setConfirmUserName(String confirmUserName){
		this.confirmUserName = confirmUserName;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public String getConfirmTime(){
		return this.confirmTime;
	}

	public void setConfirmTime(String confirmTime){
		this.confirmTime = confirmTime;
	}

	public Float getReferMoney(){
		return this.referMoney;
	}

	public void setReferMoney(Float referMoney){
		this.referMoney = referMoney;
	}

	public Float getCash(){
		return this.cash;
	}

	public void setCash(Float cash){
		this.cash = cash;
	}

	public Float getBank(){
		return this.bank;
	}

	public void setBank(Float bank){
		this.bank = bank;
	}

	public String getBankName(){
		return this.bankName;
	}

	public void setBankName(String bankName){
		this.bankName = bankName;
	}

	public Float getCheckv(){
		return this.checkv;
	}

	public void setCheckv(Float checkv){
		this.checkv = checkv;
	}

	public String getCheckvBankName(){
		return this.checkvBankName;
	}

	public void setCheckvBankName(String checkvBankName){
		this.checkvBankName = checkvBankName;
	}

	public Float getInstallment(){
		return this.installment;
	}

	public void setInstallment(Float installment){
		this.installment = installment;
	}

	public String getInstallmentBankName(){
		return this.installmentBankName;
	}

	public void setInstallmentBankName(String installmentBankName){
		this.installmentBankName = installmentBankName;
	}

	public Float getAccounts(){
		return this.accounts;
	}

	public void setAccounts(Float accounts){
		this.accounts = accounts;
	}

	public String getAccountsBankName(){
		return this.accountsBankName;
	}

	public void setAccountsBankName(String accountsBankName){
		this.accountsBankName = accountsBankName;
	}

	public String getDes(){
		return this.des;
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

}