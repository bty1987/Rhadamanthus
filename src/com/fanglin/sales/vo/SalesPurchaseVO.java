package com.fanglin.sales.vo;

import java.io.Serializable;

import com.fanglin.inventory.vo.PurchaseVO;

public class SalesPurchaseVO implements Serializable{

	private static final long serialVersionUID = -7883317079919388113L;
	
	private Long spid;
	
	private SalesVO sales;
	
	private PurchaseVO purchase;
	
	public SalesPurchaseVO() {
		super();
	}

	public SalesPurchaseVO(SalesVO sales, PurchaseVO purchase) {
		super();
		this.sales = sales;
		this.purchase = purchase;
	}

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public PurchaseVO getPurchase() {
		return purchase;
	}


	public void setPurchase(PurchaseVO purchase) {
		this.purchase = purchase;
	}

}
