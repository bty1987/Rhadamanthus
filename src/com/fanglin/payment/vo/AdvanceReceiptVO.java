package com.fanglin.payment.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;
import com.fanglin.personel.vo.UserBaseVO;

public class AdvanceReceiptVO implements java.io.Serializable {

	private static final long serialVersionUID = 4309455035240158229L;

	private Long arId;
	
	private UserBaseVO collecter; 
	
	private Timestamp collectTime;
	
	private UserBaseVO confirmer; 
	
	private Timestamp confirmTime;
	
	private Long cash;
	
	private String cashInfo;
	
	private Long bank;
	
	private String bankInfo;
	
	private Long checkv;
	
	private String checkvBank;
	
	private Long installment;
	
	private String installmentBank;
	
	private Long accounts;
	
	private String accountsBank;
	
	private Long transfer;
	
	private String comment;

	public Long getArId() {
		return arId;
	}

	public void setArId(Long arId) {
		this.arId = arId;
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
	
	public UserBaseVO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserBaseVO confirmer) {
		this.confirmer = confirmer;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	public Long getCash() {
		return cash;
	}

	public void setCash(Long cash) {
		this.cash = cash;
	}

	public String getCashInfo() {
		return cashInfo;
	}

	public void setCashInfo(String cashInfo) {
		this.cashInfo = cashInfo;
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

	public Long getCheckv() {
		return checkv;
	}

	public void setCheckv(Long checkv) {
		this.checkv = checkv;
	}

	public String getCheckvBank() {
		return checkvBank;
	}

	public void setCheckvBank(String checkvBank) {
		this.checkvBank = checkvBank;
	}

	public Long getInstallment() {
		return installment;
	}

	public void setInstallment(Long installment) {
		this.installment = installment;
	}

	public String getInstallmentBank() {
		return installmentBank;
	}

	public void setInstallmentBank(String installmentBank) {
		this.installmentBank = installmentBank;
	}

	public Long getAccounts() {
		return accounts;
	}

	public void setAccounts(Long accounts) {
		this.accounts = accounts;
	}

	public String getAccountsBank() {
		return accountsBank;
	}

	public void setAccountsBank(String accountsBank) {
		this.accountsBank = accountsBank;
	}

	public Long getTransfer() {
		return transfer;
	}

	public void setTransfer(Long transfer) {
		this.transfer = transfer;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}