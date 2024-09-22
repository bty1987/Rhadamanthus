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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "balanceoales", catalog = "balance")
public class BalanceOalesBO implements java.io.Serializable {

	private static final long serialVersionUID = 456107171446251260L;

	public static final String COLUMN_BALANCE_STR = "balance.bid";

	public static final String COLUMN_CUID_STR = "cuid";

	public static final String COLUMN_GRADE_STR = "grade";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_NAME_STR = "name";

	public static final short STATUS_INIT_INT = 0;// 初始

	public static final short STATUS_UNLOCK_INT = 1;// 锁定

	public static final short STATUS_ENABLE_CHECK_INT = 2;// 结算

	private long boid;

	private String name;

	private String grade;

	private long profit;

	private short status;

	private BalancePO balance;

	private UserPO creater;

	private UserPO balancer;

	private Timestamp createTime;

	private Timestamp balanceTime;

	private Timestamp lockTime;

	private int company;

	public BalanceOalesBO() {
		super();
	}

	public BalanceOalesBO(BalancePO balance) {
		super();
		this.balance = balance;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "boid")
	public long getBoid() {
		return boid;
	}

	public void setBoid(long boid) {
		this.boid = boid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "bid", referencedColumnName = "bid")
	public BalancePO getBalance() {
		return balance;
	}

	public void setBalance(BalancePO balance) {
		this.balance = balance;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
