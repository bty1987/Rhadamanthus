package com.fanglin.payment.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class AdvanceReceiptVO implements java.io.Serializable {

	private static final long serialVersionUID = 4309455035240158229L;

	private Long arId;
	
	private Short receiptType;
	
	private String collectUserId;
	
	private String collectUserName;
	
	private Timestamp collectTime;
	
	private String confirmUserId;
	
	private String confirmUserName;
	
	private Timestamp confirmTime;
	
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
	
	private String des;

	public Long getArId() {
		return arId;
	}

	public void setArId(Long arId) {
		this.arId = arId;
	}

	public Short getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(Short receiptType) {
		this.receiptType = receiptType;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public String getConfirmUserId() {
		return confirmUserId;
	}

	public void setConfirmUserId(String confirmUserId) {
		this.confirmUserId = confirmUserId;
	}

	public String getConfirmUserName() {
		return confirmUserName;
	}

	public void setConfirmUserName(String confirmUserName) {
		this.confirmUserName = confirmUserName;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	public Float getRealMoney() {
		return realMoney;
	}

	public void setRealMoney(Float realMoney) {
		this.realMoney = realMoney;
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

	public String getBankInfo() {
		return bankInfo;
	}

	public void setBankInfo(String bankInfo) {
		this.bankInfo = bankInfo;
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