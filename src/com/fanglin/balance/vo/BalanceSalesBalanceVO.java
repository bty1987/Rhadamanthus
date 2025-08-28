package com.fanglin.balance.vo;

import com.fanglin.sales.vo.SalesBalanceVO;

public class BalanceSalesBalanceVO implements java.io.Serializable {

	private static final long serialVersionUID = 6801750205453396693L;

	private Long bsbid;

	private Long bsid;

	private SalesBalanceVO salesBalance;

	public BalanceSalesBalanceVO() {
		super();
	}

	public BalanceSalesBalanceVO(Long bsid, SalesBalanceVO salesBalance) {
		super();
		this.bsid = bsid;
		this.salesBalance = salesBalance;
	}

	public BalanceSalesBalanceVO(SalesBalanceVO salesBalance) {
		super();
		this.salesBalance = salesBalance;
	}

	public Long getBsbid() {
		return bsbid;
	}

	public void setBsbid(Long bsbid) {
		this.bsbid = bsbid;
	}

	public Long getBsid() {
		return bsid;
	}

	public void setBsid(Long bsid) {
		this.bsid = bsid;
	}

	public SalesBalanceVO getSalesBalance() {
		return salesBalance;
	}

	public void setSalesBalance(SalesBalanceVO salesBalance) {
		this.salesBalance = salesBalance;
	}

}
