package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.inventory.vo.SalesVO;

public class SalesPaymentVO  implements Serializable{

	private static final long serialVersionUID = 1075349217063354824L;

	private Long spid;                 //款项ID
	
	private Long sid;                  //款项ID
	
	private Short type;                //款项类型
	
	private Short status;              //状态
	
	private String category;           //品类
	
	private String brand;              //品牌
	
	private SalesVO sales;             //销售单
		
	private UserVO creater;            //创建人
	
	private String createrName;        //创建人姓名
	
	private Float referMoney;          //应收金额
	
	private SalesReceiptVO salesReceipt;  //收据ID
	
	private UserVO collecter;          //收款人
	
	private Timestamp collectTime;	   //收款时间
	
	private UserVO confirmer;          //确认人
	
	private Timestamp confirmTime;     //确认时间
	
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
	
	private Float coupon;              //券值
	
	private String couponInfo;         //券信息
	
	private Float advance;             //预付款
	
	private Short advanceType;         //预付款类型
	
	private String des;                //说明

	public SalesPaymentVO() {
		super();
	}
	
	public SalesPaymentVO(Long spid) {
		super();
		this.spid = spid;
	}
	
	public SalesPaymentVO(UserVO creater,SalesVO sales) {
		super();
		this.creater = creater;
		this.sales = sales;
	}
	
	public SalesPaymentVO(UserVO creater,SalesVO sales, SalesReceiptVO salesReceipt) {
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
	
	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public UserVO getCollecter() {
		return collecter;
	}

	public void setCollecter(UserVO collecter) {
		this.collecter = collecter;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
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

	public Float getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Float referMoney) {
		this.referMoney = referMoney;
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

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}
	
	public String getCreaterName() {
		return createrName;
	}

	public void setCreaterName(String createrName) {
		this.createrName = createrName;
	}

	public SalesReceiptVO getSalesReceipt() {
		return salesReceipt;
	}

	public void setSalesReceipt(SalesReceiptVO salesReceipt) {
		this.salesReceipt = salesReceipt;
	}	
}
