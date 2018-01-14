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
	
	private Float realMoney;
	
	private Float cash;
	
	private String cashInfo;
	
	private Float bank;
	
	private String bankInfo;
	
	private Float checkv;
	
	private String checkvBank;
	
	private Float installment;
	
	private String installmentBank;
	
	private Float accounts;
	
	private String accountsBank;
	
	private String comment;

	public Long getArId() {
		return arId;
	}

	public void setArId(Long arId) {
		this.arId = arId;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}
	
	public UserBaseVO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserBaseVO collecter) {
		this.collecter = collecter;
	}

	public UserBaseVO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserBaseVO confirmer) {
		this.confirmer = confirmer;
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

	public String getCheckvBank() {
		return checkvBank;
	}

	public void setCheckvBank(String checkvBank) {
		this.checkvBank = checkvBank;
	}

	public Float getInstallment() {
		return installment;
	}

	public void setInstallment(Float installment) {
		this.installment = installment;
	}

	public String getInstallmentBank() {
		return installmentBank;
	}

	public void setInstallmentBank(String installmentBank) {
		this.installmentBank = installmentBank;
	}

	public Float getAccounts() {
		return accounts;
	}

	public void setAccounts(Float accounts) {
		this.accounts = accounts;
	}

	public String getAccountsBank() {
		return accountsBank;
	}

	public void setAccountsBank(String accountsBank) {
		this.accountsBank = accountsBank;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}