package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "bankaccount", catalog = "data")
public class BankAccountPO implements Serializable {

	private static final long serialVersionUID = -1431978626505967669L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_BANKNAME_STR = "bankName";

	public static final String COLUMN_BANKNO_STR = "bankNo";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	private long baid;

	private String name;

	private String bankName;

	private String bankNo;

	private short status;

	private int company;

	public BankAccountPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "baid")
	public long getBaid() {
		return baid;
	}

	public void setBaid(long baid) {
		this.baid = baid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "bankName")
	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Column(name = "bankNo")
	public String getBankNo() {
		return bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
