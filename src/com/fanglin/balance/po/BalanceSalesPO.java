package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.BrandPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "balancesales", catalog = "balance")
public class BalanceSalesPO implements java.io.Serializable {

	private static final long serialVersionUID = 1311080100330609447L;

	public static final String COLUMN_BALANCE_STR = "balance.bid";

	public static final String COLUMN_CUID_STR = "cuid";

	public static final String COLUMN_GRADE_STR = "grade";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_NAME_STR = "name";

	public static final short STATUS_INIT_INT = 0;// 初始

	public static final short STATUS_UNLOCK_INT = 1;// 锁定

	public static final short STATUS_ENABLE_CHECK_INT = 2;// 结算

	private long bsid;

	private long bid;

	private String name;

	private BrandPO brand;

	private String grade;

	private long income;

	private long cost;

	private long payment;

	private long profit;

	private short status;

	private int company;

	private UserPO creater;

	private UserPO balancer;

	private Timestamp createTime;

	private Timestamp balanceTime;

	private Timestamp lockTime;

	public BalanceSalesPO() {
		super();
	}

	public BalanceSalesPO(BrandPO brand) {
		super();
		this.brand = brand;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bsid")
	public long getBsid() {
		return bsid;
	}

	public void setBsid(long bsid) {
		this.bsid = bsid;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "brid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@Column(name = "grade")
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "income")
	public long getIncome() {
		return income;
	}

	public void setIncome(long income) {
		this.income = income;
	}

	@Column(name = "cost")
	public long getCost() {
		return cost;
	}

	public void setCost(long cost) {
		this.cost = cost;
	}

	@Column(name = "payment")
	public long getPayment() {
		return payment;
	}

	public void setPayment(long payment) {
		this.payment = payment;
	}

	@Column(name = "profit")
	public long getProfit() {
		return profit;
	}

	public void setProfit(long profit) {
		this.profit = profit;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buid", referencedColumnName = "uid")
	public UserPO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserPO balancer) {
		this.balancer = balancer;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "lockTime")
	public Timestamp getLockTime() {
		return lockTime;
	}

	public void setLockTime(Timestamp lockTime) {
		this.lockTime = lockTime;
	}

}
