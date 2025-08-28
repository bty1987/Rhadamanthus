package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class OalesReceiptVO implements Serializable {

	private static final long serialVersionUID = 1851130876530178256L;

	private Long orid;

	private UserBaseVO collecter;

	private UserBaseVO confirmer;

	private Timestamp collectTime;

	private Timestamp confirmTime;

	private Long realMoney;

	private Long cash;

	private String cashInfo;

	private Long bank;

	private String bankInfo;

	private Long checkv;

	private String checkvBank;

	private Long installment;

	private String installBank;

	private Long accounts;

	private String accountsBank;

	private String comment;

	public OalesReceiptVO() {
		super();
	}

	public OalesReceiptVO(UserBaseVO collecter) {
		super();
		this.collecter = collecter;
	}

	public OalesReceiptVO(UserBaseVO collecter, UserBaseVO confirmer) {
		super();
		this.collecter = collecter;
		this.confirmer = confirmer;
	}

	public Long getOrid() {
		return orid;
	}

	public void setOrid(Long orid) {
		this.orid = orid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Long getRealMoney() {
		return realMoney;
	}

	public void setRealMoney(Long realMoney) {
		this.realMoney = realMoney;
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

	public String getInstallBank() {
		return installBank;
	}

	public void setInstallBank(String installBank) {
		this.installBank = installBank;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
