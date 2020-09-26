package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cppoint", catalog = "customer")
public class CppointPO implements Serializable {

	private static final long serialVersionUID = 6028304136209275173L;

	public static final String COLUMN_CID_STR = "cid";

	private long cpid;

	private long cid;

	private long dpoint;

	private long spoint;

	private int company;

	public CppointPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "dpoint")
	public long getDpoint() {
		return dpoint;
	}

	public void setDpoint(long dpoint) {
		this.dpoint = dpoint;
	}

	@Column(name = "spoint")
	public long getSpoint() {
		return spoint;
	}

	public void setSpoint(long spoint) {
		this.spoint = spoint;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
