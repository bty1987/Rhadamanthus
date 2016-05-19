/**
 * Title: PaymentVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.vo.CustomerVO;
import com.fanglin.personel.vo.UserVO;

public class PaymentVO implements Serializable {

	private static final long serialVersionUID = -4900471974953513592L;

	private Integer paymentId;
	
	private CustomerVO customer;
	
	private String customerId;
	
	private String customerName;
	
	private String orderId;
	
	private Float balance = 0f;
	
	private Float recharge = 0f;
	
	private String type;
	
	private String paymentType;
	
	private Float cash = 0f;
	
	private String cashInfo;
	
	private Float bank = 0f;
	
	private String bankInfo;
	
	private Float checkv = 0f;
	
	private String checkvBankName;
	
	private Float installment = 0f;
	
	private String installmentBankName;
	
	private Float accounts = 0f;
	
	private String accountsBankName;
	
	private String des;
	
	private UserVO collectUser;
	
	private String collectUserName;
	
	private Timestamp collectTime;
	
	private UserVO confirmUser;
	
	private Timestamp confirmTime;
	
	private String status;
	
	private Long convertPaymentId; // 对应转换款项关联表的id
	
	private List<Map<String, String>> orders;
	
	public PaymentVO(){
	}

	public Integer getPaymentId(){
		return paymentId;
	}

	public void setPaymentId(Integer paymentId){
		this.paymentId = paymentId;
	}

	public CustomerVO getCustomer(){
		return customer;
	}

	public void setCustomer(CustomerVO customer){
		this.customer = customer;
	}

	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
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

	public String getInstallmentBankName(){
		return installmentBankName;
	}

	public void setInstallmentBankName(String installmentBankName){
		this.installmentBankName = installmentBankName;
	}

	public Float getInstallment(){
		return installment;
	}

	public void setInstallment(Float installment){
		this.installment = installment;
	}

	public String getAccountsBankName(){
		return accountsBankName;
	}

	public void setAccountsBankName(String accountsBankName){
		this.accountsBankName = accountsBankName;
	}

	public Float getAccounts(){
		return accounts;
	}

	public void setAccounts(Float accounts){
		this.accounts = accounts;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public UserVO getCollectUser(){
		return collectUser;
	}

	public void setCollectUser(UserVO collectUser){
		this.collectUser = collectUser;
	}

	public String getCollectUserName(){
		return collectUserName;
	}

	public void setCollectUserName(String collectUserName){
		this.collectUserName = collectUserName;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime(){
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime){
		this.collectTime = collectTime;
	}

	public UserVO getConfirmUser(){
		return confirmUser;
	}

	public void setConfirmUser(UserVO confirmUser){
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

	public Long getConvertPaymentId(){
		return convertPaymentId;
	}

	public void setConvertPaymentId(Long convertPaymentId){
		this.convertPaymentId = convertPaymentId;
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

	public String getCheckvBankName(){
		return checkvBankName;
	}

	public void setCheckvBankName(String checkvBankName){
		this.checkvBankName = checkvBankName;
	}

	public String getBankInfo(){
		return bankInfo;
	}

	public void setBankInfo(String bankInfo){
		this.bankInfo = bankInfo;
	}

	public List<Map<String, String>> getOrders(){
		return orders;
	}

	public void setOrders(List<Map<String, String>> orders){
		this.orders = orders;
	}

}
