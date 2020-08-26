package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "salesmatching", catalog = "data")
public class SalesMatchingPO implements Serializable {

	private static final long serialVersionUID = 5090009469824011241L;
	
	public static final short STATUS_DISABLE_SHORT = 0;
	
	public static final short STATUS_ENABLE_SHORT = 1;
	
	public static final String COLUMN_COMPANY_STR = "company";

	private long smid;
    
	private String name;

	private int onecheck;

	private int twocheck;

	private int thrcheck;

	private short status;
    
	private String comment;

	private int company;
	
	public SalesMatchingPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "smid")
	public long getSmid() {
		return smid;
	}

	public void setSmid(long smid) {
		this.smid = smid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "onecheck")
	public int getOnecheck() {
		return onecheck;
	}

	public void setOnecheck(int onecheck) {
		this.onecheck = onecheck;
	}

	@Column(name = "twocheck")
	public int getTwocheck() {
		return twocheck;
	}

	public void setTwocheck(int twocheck) {
		this.twocheck = twocheck;
	}

	@Column(name = "thrcheck")
	public int getThrcheck() {
		return thrcheck;
	}

	public void setThrcheck(int thrcheck) {
		this.thrcheck = thrcheck;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
}
