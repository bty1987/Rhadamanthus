package com.fanglin.sales.vo;

import java.io.Serializable;

import com.fanglin.information.vo.ActivityVO;

public class SalesActivityVO implements Serializable {

	private static final long serialVersionUID = 111178771971763471L;
	
	private Long sid;
	
	private SalesVO sales;
	
	private ActivityVO activity;
	
	private Long amount;
	
	public SalesActivityVO(SalesVO sales, ActivityVO activity) {
		super();
		this.sales = sales;
		this.activity = activity;
	}
	
	public SalesActivityVO() {
		super();
	}
	
	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public ActivityVO getActivity() {
		return activity;
	}

	public void setActivity(ActivityVO activity) {
		this.activity = activity;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

}
