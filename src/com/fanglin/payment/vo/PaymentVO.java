/**
 * Title: PaymentVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.personel.vo.UserBaseVO;

public class PaymentVO implements Serializable {

	private static final long serialVersionUID = -4900471974953513592L;

	private Long pid;
	
	private CustomerVO customer;
	
	private String orderId;
	
	private Float balance = 0f;
	
	private Float recharge = 0f;
	
	private String type;
	
	private String paymentType;
	
	private String status;
	
	private Float cash = 0f;
	
	private String cashInfo;
	
	private Float bank = 0f;
	
	private String bankInfo;
	
	private Float checkv = 0f;
	
	private String checkvBank;
	
	private Float installment = 0f;
	
	private String installmentBank;
	
	private Float accounts = 0f;
	
	private String accountsBank;
	
	private UserBaseVO collectUser;
	
	private Timestamp collectTime;
	
	private UserBaseVO confirmUser;
	
	private Timestamp confirmTime;
	
	private String comment;
	
	public PaymentVO(){
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public CustomerVO getCustomer(){
		return customer;
	}

	public void setCustomer(CustomerVO customer){
		this.customer = customer;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Float getBalance(){
		return balance;
	}

	public void setBalance(Float balance){
		this.balance = balance;
	}

	public Float getRecharge(){
		return recharge;
	}

	public void setRecharge(Float recharge){
		this.recharge = recharge;
	}

	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	public String getPaymentType(){
		return paymentType;
	}

	public void setPaymentType(String paymentType){
		this.paymentType = paymentType;
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

	public String getInstallmentBank(){
		return installmentBank;
	}

	public void setInstallmentBank(String installmentBank){
		this.installmentBank = installmentBank;
	}

	public Float getInstallment(){
		return installment;
	}

	public void setInstallment(Float installment){
		this.installment = installment;
	}

	public String getAccountsBank(){
		return accountsBank;
	}

	public void setAccountsBank(String accountsBank){
		this.accountsBank = accountsBank;
	}

	public Float getAccounts(){
		return accounts;
	}

	public void setAccounts(Float accounts){
		this.accounts = accounts;
	}

	public UserBaseVO getCollectUser(){
		return collectUser;
	}

	public void setCollectUser(UserBaseVO collectUser){
		this.collectUser = collectUser;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime(){
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime){
		this.collectTime = collectTime;
	}

	public UserBaseVO getConfirmUser(){
		return confirmUser;
	}

	public void setConfirmUser(UserBaseVO confirmUser){
		this.confirmUser = confirmUser;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getConfirmTime(){
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime){
		this.confirmTime = confirmTime;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public Float getBank(){
		return bank;
	}

	public void setBank(Float bank){
		this.bank = bank;
	}

	public Float getCheckv(){
		return checkv;
	}

	public void setCheckv(Float checkv){
		this.checkv = checkv;
	}

	public String getCheckvBank(){
		return checkvBank;
	}

	public void setCheckvBank(String checkvBank){
		this.checkvBank = checkvBank;
	}

	public String getBankInfo(){
		return bankInfo;
	}

	public void setBankInfo(String bankInfo){
		this.bankInfo = bankInfo;
	}
	
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
