package com.fanglin.quotation.vo;

import java.io.Serializable;

public class SelectionVO implements Serializable {

	private static final long serialVersionUID = -2288485824151499913L;

	private Long sid;// 选材单ID
	
	private String orderId;// 装修单号
	
	private Long qid;// 报价ID
	
	private Short status;// 状态 , 0: 初始 , 1: 锁定
	
	private Integer company;// 公司
	
	private Long total;// 总额
	
	private Long quotationTotal;// 报价总额
	
	private Long extensionAddTotal;// 拓展增总额
	
	private Long extensionReduceTotal;// 拓展减总额
	
	private Long addReduceAddTotal;// 增减增总额
	
	private Long addReduceMinusTotal;// 增减减总额
	
	public SelectionVO() {
		super();
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Long getQuotationTotal() {
		return quotationTotal;
	}

	public void setQuotationTotal(Long quotationTotal) {
		this.quotationTotal = quotationTotal;
	}

	public Long getExtensionAddTotal() {
		return extensionAddTotal;
	}

	public void setExtensionAddTotal(Long extensionAddTotal) {
		this.extensionAddTotal = extensionAddTotal;
	}

	public Long getExtensionReduceTotal() {
		return extensionReduceTotal;
	}

	public void setExtensionReduceTotal(Long extensionReduceTotal) {
		this.extensionReduceTotal = extensionReduceTotal;
	}

	public Long getAddReduceAddTotal() {
		return addReduceAddTotal;
	}

	public void setAddReduceAddTotal(Long addReduceAddTotal) {
		this.addReduceAddTotal = addReduceAddTotal;
	}

	public Long getAddReduceMinusTotal() {
		return addReduceMinusTotal;
	}

	public void setAddReduceMinusTotal(Long addReduceMinusTotal) {
		this.addReduceMinusTotal = addReduceMinusTotal;
	}
}
