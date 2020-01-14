package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.sales.po.SalesBalancePO;

@Entity
@Table(name = "balancesales", catalog = "balance")
public class BalanceSalesPO implements java.io.Serializable {

	private static final long serialVersionUID = 1311080100330609447L;
	
	public static final String COLUMN_BALANCE_BID = "balance.bid";
	
	public static final String COLUMNSALESBALANCE_SBID = "salesBalance.sbid";
	
	private long bsid;	
	
	private BalancePO balance;
	
	private SalesBalancePO salesBalance;

	public BalanceSalesPO() {
		super();
	}

	public BalanceSalesPO(BalancePO balance, SalesBalancePO salesBalance) {
		super();
		this.balance = balance;
		this.salesBalance = salesBalance;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "bid", referencedColumnName = "bid")
	public BalancePO getBalance() {
		return balance;
	}

	public void setBalance(BalancePO balance) {
		this.balance = balance;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "sbid", referencedColumnName = "sbid")
	public SalesBalancePO getSalesBalance() {
		return salesBalance;
	}

	public void setSalesBalance(SalesBalancePO salesBalance) {
		this.salesBalance = salesBalance;
	}

	
}
