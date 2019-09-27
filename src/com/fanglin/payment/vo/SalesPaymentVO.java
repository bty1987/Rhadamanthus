package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.vo.SalesVO;

public class SalesPaymentVO  implements Serializable{

	private static final long serialVersionUID = 1075349217063354824L;

	private Long spid;                 
	
	private SalesReceiptVO salesReceipt;  
	
	private SalesVO sales;             
	
	private Short type;                
	
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
	
	private Long coupon;              
	
	private String couponInfo;        
	
	private Long advance;             
	
	private Short advanceType;         
	
	private String comment;
	
	private Integer company;

	public SalesPaymentVO() {
		super();
	}
	
	public SalesPaymentVO(Long spid) {
		super();
		this.spid = spid;
	}
	
	public SalesPaymentVO(UserBaseVO creater,SalesVO sales) {
		super();
		this.creater = creater;
		this.sales = sales;
	}
	
	public SalesPaymentVO(UserBaseVO creater,SalesVO sales, SalesReceiptVO salesReceipt) {
		super();
		this.creater = creater;
		this.sales = sales;
		this.salesReceipt = salesReceipt;
	}
	
	public SalesPaymentVO(SalesReceiptVO salesReceipt) {
		super();
		this.salesReceipt = salesReceipt;
	}

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}
	
	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
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

	@JSON(format="yyyy-MM-dd")
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

	public Long getCoupon() {
		return coupon;
	}

	public void setCoupon(Long coupon) {
		this.coupon = coupon;
	}

	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}

	public Long getAdvance() {
		return advance;
	}

	public void setAdvance(Long advance) {
		this.advance = advance;
	}

	public Short getAdvanceType() {
		return advanceType;
	}

	public void setAdvanceType(Short advanceType) {
		this.advanceType = advanceType;
	}

	public SalesReceiptVO getSalesReceipt() {
		return salesReceipt;
	}

	public void setSalesReceipt(SalesReceiptVO salesReceipt) {
		this.salesReceipt = salesReceipt;
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
}
