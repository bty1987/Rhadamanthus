package com.fanglin.communion.vo;

import com.fanglin.data.common.vo.ReceiptTypeVO;

public class CustypeVO implements java.io.Serializable {

	private static final long serialVersionUID = -819625806029342769L;

	private Long ctid;

	private String name;

	private String no;

	private String agent;

	private String phone;

	private String wxapp;

	private ReceiptTypeVO receiptType;

	private Short platform;

	private Short atttype;

	private String dgrade;

	private String sgrade;

	private Short status;

	private Integer company;

	public CustypeVO() {
		super();
	}

	public CustypeVO(ReceiptTypeVO receiptType) {
		super();
		this.receiptType = receiptType;
	}

	public Long getCtid() {
		return ctid;
	}

	public void setCtid(Long ctid) {
		this.ctid = ctid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getAgent() {
		return agent;
	}

	public void setAgent(String agent) {
		this.agent = agent;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getWxapp() {
		return wxapp;
	}

	public void setWxapp(String wxapp) {
		this.wxapp = wxapp;
	}

	public ReceiptTypeVO getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(ReceiptTypeVO receiptType) {
		this.receiptType = receiptType;
	}

	public Short getPlatform() {
		return platform;
	}

	public void setPlatform(Short platform) {
		this.platform = platform;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public String getDgrade() {
		return dgrade;
	}

	public void setDgrade(String dgrade) {
		this.dgrade = dgrade;
	}

	public String getSgrade() {
		return sgrade;
	}

	public void setSgrade(String sgrade) {
		this.sgrade = sgrade;
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

}