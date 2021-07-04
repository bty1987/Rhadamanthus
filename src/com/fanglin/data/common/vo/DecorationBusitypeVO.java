package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DecorationBusitypeVO implements Serializable {

	private static final long serialVersionUID = 4830401726290958042L;

	private Long dbid;

	private String name;

	private Short status;

	private Integer company;

	public DecorationBusitypeVO() {
		super();
	}

	public DecorationBusitypeVO(Long dbid, String name, Short status,
			Integer company) {
		super();
		this.dbid = dbid;
		this.name = name;
		this.status = status;
		this.company = company;
	}

	public Long getDbid() {
		return dbid;
	}

	public void setDbid(Long dbid) {
		this.dbid = dbid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
