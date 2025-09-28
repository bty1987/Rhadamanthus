package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.vo.OalesVO;

public class OalesPaymentVO implements Serializable {

	private static final long serialVersionUID = 1075349217063354824L;

	private Long opid;

	private Long osid;

	private OalesReceiptVO oalesReceipt;

	private OalesVO oales;

	private String orderId;

	private Short type;

	private String types;

	private Short status;

	private UserBaseVO creater;

	private Timestamp createTime;

	private UserBaseVO collecter;

	private Timestamp collectTime;

	private UserBaseVO confirmer;

	private Timestamp confirmTime;

	private Long referMoney;

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

	private Integer company;

	private String bompany;

	public OalesPaymentVO() {
		super();
	}

	public OalesPaymentVO(Long opid) {
		super();
		this.opid = opid;
	}

	public OalesPaymentVO(UserBaseVO creater, OalesVO oales) {
		super();
		this.creater = creater;
		this.oales = oales;
	}

	public OalesPaymentVO(UserBaseVO creater, OalesVO oales, OalesReceiptVO oalesReceipt) {
		super();
		this.creater = creater;
		this.oales = oales;
		this.oalesReceipt = oalesReceipt;
	}

	public OalesPaymentVO(OalesReceiptVO oalesReceipt) {
		super();
		this.oalesReceipt = oalesReceipt;
	}

	public Long getOpid() {
		return opid;
	}

	public void setOpid(Long opid) {
		this.opid = opid;
	}

	public Long getOsid() {
		return osid;
	}

	public void setOsid(Long osid) {
		this.osid = osid;
	}

	public OalesVO getOales() {
		return oales;
	}

	public void setOales(OalesVO oales) {
		this.oales = oales;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getTypes() {
		return types;
	}

	public void setTypes(String types) {
		this.types = types;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
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

	public OalesReceiptVO getOalesReceipt() {
		return oalesReceipt;
	}

	public void setOalesReceipt(OalesReceiptVO oalesReceipt) {
		this.oalesReceipt = oalesReceipt;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getBompany() {
		return bompany;
	}

	public void setBompany(String bompany) {
		this.bompany = bompany;
	}

	public OalesPaymentVO filter(List<Filter> filters) {

		if (getStatus() != null) {
			filters.add(new Filter("status", String.valueOf(getStatus()), "eq"));
		}

		if (getTypes() != null) {
			filters.add(new Filter("type", String.valueOf(getTypes()), "in"));
		}

		return this;
	}
}
