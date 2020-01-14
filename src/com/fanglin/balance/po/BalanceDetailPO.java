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
@Table(name = "balanceDetail", catalog = "balance")
public class BalanceDetailPO implements java.io.Serializable {
	
	private static final long serialVersionUID = 6898789209231067123L;

	public static final String COLUMN_COMPANY_STR = "company";
	
	private long bdid;
	
	private BalancePO balance;
	
	private AccountPO account;
	
	private UserPO operater;
	
	private Timestamp operateTime;
	
	private long money;

	public BalanceDetailPO() {
		super();
	}
	
	public BalanceDetailPO(AccountPO account, UserPO operater) {
		super();
		this.account = account;
		this.operater = operater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bdid")
	public long getBdid() {
		return bdid;
	}

	public void setBdid(long bdid) {
		this.bdid = bdid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "bid", referencedColumnName = "bid")
	public BalancePO getBalance() {
		return balance;
	}

	public void setBalance(BalancePO balance) {
		this.balance = balance;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "aid", referencedColumnName = "aid")
	public AccountPO getAccount() {
		return account;
	}

	public void setAccount(AccountPO account) {
		this.account = account;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name="operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name="money")
	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
	}
	
}
