package com.fanglin.sales.vo;

public class RefundsItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 5543447445422987680L;

	private Long riid;

	private Long sid;

	private Long rid;

	private SalesItemVO salesItem;

	private Long num;

	private Long total;

	public RefundsItemVO() {
		super();
	}

	public RefundsItemVO(SalesItemVO salesItem) {
		super();
		this.salesItem = salesItem;
	}

	public Long getRiid() {
		return riid;
	}

	public void setRiid(Long riid) {
		this.riid = riid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public Long getNum() {
		return num;
	}

	public void setNum(Long num) {
		this.num = num;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public SalesItemVO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemVO salesItem) {
		this.salesItem = salesItem;
	}

}
