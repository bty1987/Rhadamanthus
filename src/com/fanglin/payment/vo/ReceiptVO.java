package com.fanglin.payment.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class ReceiptVO implements java.io.Serializable {
	
	private static final long serialVersionUID = -31295690054677122L;
	
	private Long rid;
	
	private Long prid;
	
	private String no;
	
	private String name;
	
	private Short type;
	
	private Short paymentType;
	
	private Short receiptType;
	
	private Long money;
	
	private Timestamp collectTime;
	
	private Integer company;

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public Long getPrid() {
		return prid;
	}

	public void setPrid(Long prid) {
		this.prid = prid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}

	public Short getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(Short receiptType) {
		this.receiptType = receiptType;
	}

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}