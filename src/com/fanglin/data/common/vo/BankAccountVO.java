package com.fanglin.data.common.vo;

import java.io.Serializable;

public class BankAccountVO implements Serializable {

	private static final long serialVersionUID = 6608350534213203748L;

	private Long baid;

	private String name;

	private String bankName;

	private String bankNo;

	private Short status;

	private Integer company;

	public BankAccountVO() {
		super();
	}

	public Long getBaid() {
		return baid;
	}

	public void setBaid(Long baid) {
		this.baid = baid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getBankNo() {
		return bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
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
