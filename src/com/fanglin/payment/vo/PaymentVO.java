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
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class PaymentVO implements Serializable {

	private static final long serialVersionUID = -4900471974953513592L;

	private Long pid;

	private String orderId;

	private DecorationVO decoration;

	private CustomerVO customer;

	private Long balance = 0L;

	private Long recharge = 0L;

	private Short type;

	private Short paymentType;

	private Timestamp createTime;

	private UserBaseVO collectUser;

	private Timestamp collectTime;

	private UserBaseVO confirmUser;

	private Timestamp confirmTime;

	private Short status;

	private Long cash = 0L;

	private String cashInfo;

	private Long bank = 0L;

	private String bankInfo;

	private Long checkv = 0L;

	private String checkvBank;

	private Long installment = 0L;

	private String installmentBank;

	private Long accounts = 0L;

	private String accountsBank;

	private Long transfer = 0L;

	private String comment;

	private String uniqueid;

	private Long arId;

	private String company;

	public PaymentVO() {
		super();
	}

	public PaymentVO(CustomerVO customer, UserBaseVO collectUser, UserBaseVO confirmUser) {
		super();
		this.customer = customer;
		this.collectUser = collectUser;
		this.confirmUser = confirmUser;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Long getRecharge() {
		return recharge;
	}

	public void setRecharge(Long recharge) {
		this.recharge = recharge;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getCollectUser() {
		return collectUser;
	}

	public void setCollectUser(UserBaseVO collectUser) {
		this.collectUser = collectUser;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public UserBaseVO getConfirmUser() {
		return confirmUser;
	}

	public void setConfirmUser(UserBaseVO confirmUser) {
		this.confirmUser = confirmUser;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
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

	public String getUniqueid() {
		return uniqueid;
	}

	public void setUniqueid(String uniqueid) {
		this.uniqueid = uniqueid;
	}

	public Long getArId() {
		return arId;
	}

	public void setArId(Long arId) {
		this.arId = arId;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public PaymentVO filter(List<Filter> filters, int company) {

		if (getStatus() != null) {
			filters.add(new Filter("status", String.valueOf(getStatus()), "eq"));
		}

		if (getType() != null) {
			filters.add(new Filter("type", String.valueOf(getType()), "eq"));
		}

		if (getCompany() != null) {
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}

		return this;
	}

}
