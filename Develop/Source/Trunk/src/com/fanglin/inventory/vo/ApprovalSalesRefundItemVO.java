package com.fanglin.inventory.vo;

import java.io.Serializable;


public class ApprovalSalesRefundItemVO implements Serializable {

	private static final long serialVersionUID = 2363581968985577616L;

	private Long asriid;

	private Long asrid;

	private Long sid;

	private Float num;

	private Float total;

	private SalesItemVO salesItem;
	
	public ApprovalSalesRefundItemVO(){
		super();
	}

	public ApprovalSalesRefundItemVO(SalesItemVO salesItem) {
		super();
		this.salesItem = salesItem;
	}

	public Long getAsriid() {
		return asriid;
	}

	public void setAsriid(Long asriid) {
		this.asriid = asriid;
	}

	public Long getAsrid() {
		return asrid;
	}

	public void setAsrid(Long asrid) {
		this.asrid = asrid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public SalesItemVO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemVO salesItem) {
		this.salesItem = salesItem;
	}
	
}
