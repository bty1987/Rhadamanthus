package com.fanglin.balance.vo;

import com.fanglin.sales.vo.SalesBalanceVO;

public class BalanceSalesVO implements java.io.Serializable {

	private static final long serialVersionUID = -9145874726355093442L;
	
	private Long sbid;
	
	private BalanceVO balance;
	
	private SalesBalanceVO salesBalance;

	public BalanceSalesVO() {
		super();
	}

	public BalanceSalesVO(BalanceVO balance, SalesBalanceVO salesBalance) {
		super();
		this.balance = balance;
		this.salesBalance = salesBalance;
	}

	public Long getSbid() {
		return sbid;
	}

	public void setSbid(Long sbid) {
		this.sbid = sbid;
	}

	public BalanceVO getBalance() {
		return balance;
	}

	public void setBalance(BalanceVO balance) {
		this.balance = balance;
	}

	public SalesBalanceVO getSalesBalance() {
		return salesBalance;
	}

	public void setSalesBalance(SalesBalanceVO salesBalance) {
		this.salesBalance = salesBalance;
	}
	
	

}
