/**
 * @File Name		: QuotationVO
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.payment.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class DecorationPaymentVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;

	private Long dpid;
	
	private Long drId;
	
	private DecorationVO decoration;
	
	private Short oneType;
	
	private Short twoType;
	
	private String paymentType;
	
	private String paymentStatus;
	
	private UserBaseVO creater; 
	
	private Timestamp createTime;
	
	private UserBaseVO collecter; 
	
	private Timestamp collectTime;
	
	private UserBaseVO confirmer; 
	
	private Timestamp confirmTime;
	
	private Float referMoney;
	
	private Short sort;
	
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
	
	private Float coupon;
	
	private String couponInfo;
	
	private Float advance;
	
	private Short advanceType;
	
	private String comment;

	private Long psId;
	
	private Integer company;
	
	public DecorationPaymentVO() {
		super();
	}
	
	public DecorationPaymentVO(DecorationVO decoration) {
		super();
		this.decoration = decoration;
	}

	public Long getDpid() {
		return dpid;
	}

	public void setDpid(Long dpid) {
		this.dpid = dpid;
	}

	public Long getDrId() {
		return drId;
	}

	public void setDrId(Long drId) {
		this.drId = drId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Short getOneType() {
		return oneType;
	}

	public void setOneType(Short oneType) {
		this.oneType = oneType;
	}

	public Short getTwoType() {
		return twoType;
	}

	public void setTwoType(Short twoType) {
		this.twoType = twoType;
	}

	public String getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
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

	@JSON(format="yyyy-MM-dd HH:mm:ss")
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

	@JSON(format="yyyy-MM-dd HH:mm:ss")
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

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Long getPsId() {
		return psId;
	}

	public void setPsId(Long psId) {
		this.psId = psId;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
