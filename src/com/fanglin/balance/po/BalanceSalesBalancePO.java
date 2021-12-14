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
@Table(name = "balancesalesbalance", catalog = "balance")
public class BalanceSalesBalancePO implements java.io.Serializable {

	private static final long serialVersionUID = -3143180129486018768L;

	public static final String COLUMN_BSBID_STR = "bsbid";

	public static final String COLUMN_BSID_STR = "bsid";

	private long bsbid;	

	private long bsid;

	private SalesBalancePO salesBalance;

	public BalanceSalesBalancePO() {
		super();
	}

	public BalanceSalesBalancePO(SalesBalancePO salesBalance) {
		super();
		this.salesBalance = salesBalance;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bsbid")
	public long getBsbid() {
		return bsbid;
	}

	public void setBsbid(long bsbid) {
		this.bsbid = bsbid;
	}

	@Column(name = "bsid")
	public long getBsid() {
		return bsid;
	}

	public void setBsid(long bsid) {
		this.bsid = bsid;
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
