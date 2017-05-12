package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.personel.vo.UserVO;

public class SalesReceiptVO  implements Serializable{

	private static final long serialVersionUID = 1851130876530178256L;

	private Long srId;        			//收据ID
	
	private UserVO collecter;
	
	private String collecterName;
	
	private UserVO confirmer;
	
	private String confirmerName;
	
	private Timestamp collectTime;
	
	private Timestamp confirmTime;
	
	private Float realMoney;
	
	private Float cash;                //现金
	
	private String cashInfo;           //现金信息
	
	private Float bank;                //刷卡
	
	private String bankInfo;           //刷卡信息;
	
	private Float checkv;              //转账
	
	private String checkvBank;         //转账银行
	
	private Float installment;         //分期
	
	private String installBank;        //分期银行
	
	private Float accounts;            //对公
	
	private String accountsBank;       //对公银行
	
	private Float advance;             //预付款
	
	private Short advanceType;         //预付款类型
	
	private Float coupon;              //券值
	
	private String couponInfo;         //券信息
	
	private String des;                //说明
	
	public SalesReceiptVO() {
		super();
	}
	
	public SalesReceiptVO(UserVO collecter) {
		super();
		this.collecter = collecter;
	}

	public SalesReceiptVO(UserVO collecter,UserVO confirmer) {
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
	
	public UserVO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserVO collecter) {
		this.collecter = collecter;
	}
	
	public String getCollecterName() {
		return collecterName;
	}

	public void setCollecterName(String collecterName) {
		this.collecterName = collecterName;
	}

	public String getConfirmerName() {
		return confirmerName;
	}

	public void setConfirmerName(String confirmerName) {
		this.confirmerName = confirmerName;
	}

	public UserVO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserVO confirmer) {
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

	public Float getAdvance() {
		return advance;
	}

	public void setAdvance(Float advance) {
		this.advance = advance;
	}

	public Short getAdvanceType() {
		return advanceType;
	}

	public void setAdvanceType(Short advanceType) {
		this.advanceType = advanceType;
	}

	public Float getCoupon() {
		return coupon;
	}

	public void setCoupon(Float coupon) {
		this.coupon = coupon;
	}

	public String getCouponInfo() {
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo) {
		this.couponInfo = couponInfo;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}
	
}
