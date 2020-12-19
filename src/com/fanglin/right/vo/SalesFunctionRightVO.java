package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.sales.vo.SalesFunctionVO;

public class SalesFunctionRightVO implements Serializable{

	private static final long serialVersionUID = -5917768115370778903L;

	private Long sfrid;
	
	private String name;
	
	private SalesFunctionVO salesFunction;
	
	private int company;
	
	public SalesFunctionRightVO() {
		super();
	}
	
	public SalesFunctionRightVO(SalesFunctionVO salesFunction) {
		super();
		this.salesFunction = salesFunction;
	}

	public Long getSfrid() {
		return sfrid;
	}

	public void setSfrid(Long sfrid) {
		this.sfrid = sfrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public SalesFunctionVO getSalesFunction() {
		return salesFunction;
	}

	public void setSalesFunction(SalesFunctionVO salesFunction) {
		this.salesFunction = salesFunction;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}
