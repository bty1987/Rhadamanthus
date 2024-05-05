package com.fanglin.balance.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.personel.vo.UserBaseVO;

public class BalanceSelectionVO implements java.io.Serializable {

	private static final long serialVersionUID = -9145874726355093442L;

	private Long bsid;

	private Long bid;

	private String name;

	private BrandVO brand;

	private BalanceVO balance;

	private String grade;

	private Long income;

	private Long cost;

	private Long payment;

	private Long profit;

	private Short status;

	private Integer company;

	private String alias;

	private String categoryId;

	private String categoryName;

	private UserBaseVO creater;

	private UserBaseVO balancer;

	private Timestamp createTime;

	private Timestamp balanceTime;

	private Timestamp lockTime;

	public BalanceSelectionVO() {
		super();
	}

	public BalanceSelectionVO(BrandVO brand, UserBaseVO creater) {
		super();
		this.brand = brand;
		this.creater = creater;
	}

	public BalanceSelectionVO(BrandVO brand, UserBaseVO creater, UserBaseVO balancer) {
		super();
		this.brand = brand;
		this.creater = creater;
		this.balancer = balancer;
	}

	public BalanceSelectionVO(BrandVO brand, BalanceVO balance, UserBaseVO creater, UserBaseVO balancer) {
		super();
		this.brand = brand;
		this.creater = creater;
		this.balancer = balancer;
		this.balance = balance;
	}

	public Long getBsid() {
		return bsid;
	}

	public void setBsid(Long bsid) {
		this.bsid = bsid;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}

	public BalanceVO getBalance() {
		return balance;
	}

	public void setBalance(BalanceVO balance) {
		this.balance = balance;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public Long getIncome() {
		return income;
	}

	public void setIncome(Long income) {
		this.income = income;
	}

	public Long getCost() {
		return cost;
	}

	public void setCost(Long cost) {
		this.cost = cost;
	}

	public Long getPayment() {
		return payment;
	}

	public void setPayment(Long payment) {
		this.payment = payment;
	}

	public Long getProfit() {
		return profit;
	}

	public void setProfit(Long profit) {
		this.profit = profit;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
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

	public UserBaseVO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserBaseVO balancer) {
		this.balancer = balancer;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getLockTime() {
		return lockTime;
	}

	public void setLockTime(Timestamp lockTime) {
		this.lockTime = lockTime;
	}

}