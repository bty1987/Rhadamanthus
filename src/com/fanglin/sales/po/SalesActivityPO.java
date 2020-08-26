package com.fanglin.sales.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.information.po.ActivityPO;

@Entity
@Table(name = "sales", catalog = "sales")
public class SalesActivityPO implements Serializable {

	private static final long serialVersionUID = -1848992411674586983L;
	
	private long sid;
	
	private SalesPO sales;
	
	private ActivityPO activity;
	
	private long amount;
	
	public SalesActivityPO() {
		super();
	}

	public SalesActivityPO(SalesPO sales, ActivityPO activity) {
		super();
		this.sales = sales;
		this.activity = activity;
	}
	
	@Id
	@GeneratedValue
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sid", referencedColumnName = "sid", insertable = false, updatable = false)
	public SalesPO getSales() {
		return sales;
	}

	public void setSales(SalesPO sales) {
		this.sales = sales;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "activityId", referencedColumnName = "aid")
	public ActivityPO getActivity() {
		return activity;
	}

	public void setActivity(ActivityPO activity) {
		this.activity = activity;
	}

	@Column(name = "amount")
	public long getAmount() {
		return amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
	}
	
}
