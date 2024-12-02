package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationbusitype", catalog = "data")
public class DecorationBusitypePO implements Serializable {

	private static final long serialVersionUID = -5869493702897809107L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long dbid;

	private String name;

	private short status;

	private int company;
	
	private long no;

	public DecorationBusitypePO() {
		super();
	}

	public DecorationBusitypePO(long dbid) {
		super();
		this.dbid = dbid;
	}

	public DecorationBusitypePO(long dbid, String name, short status,
			int company) {
		super();
		this.dbid = dbid;
		this.name = name;
		this.status = status;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dbid")
	public long getDbid() {
		return dbid;
	}

	public void setDbid(long dbid) {
		this.dbid = dbid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
	
	@Column(name = "no")
	public long getNo() {
		return no;
	}

	public void setNo(long no) {
		this.no = no;
	}

}
