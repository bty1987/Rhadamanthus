package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ServiceReceiptVO  implements Serializable{

	private static final long serialVersionUID = 1851130876530178256L;

	private Long srId;        			
	
	private UserBaseVO collecter;
	
	private UserBaseVO confirmer;
	
	private Timestamp collectTime;
	
	private Timestamp confirmTime;
	
	private Float realMoney;
	
	private Float cash;                
	
	private String cashInfo;           
	
	private Float bank;                
	
	private String bankInfo;           
	
	private Float checkv;              
	
	private String checkvBank;         
	
	private Float installment;        
	
	private String installBank;       
	
	private Float accounts;            
	
	private String accountsBank;       
	
	private String comment;               
	
	public ServiceReceiptVO() {
		super();
	}
	
	public ServiceReceiptVO(UserBaseVO collecter) {
		super();
		this.collecter = collecter;
	}

	public ServiceReceiptVO(UserBaseVO collecter,UserBaseVO confirmer) {
		super();
		this.collecter = collecter;
		this.confirmer = confirmer;
	}

	public Long getSrId() {
		return srId;
	}

	public void setSrId(Long srId) {
		this.srId = srId;
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

	@JSON(format="yyyy-MM-dd")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
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

	public String getInstallBank() {
		return installBank;
	}

	public void setInstallBank(String installBank) {
		this.installBank = installBank;
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
