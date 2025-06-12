package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DecorationBusitypeVO implements Serializable {

	private static final long serialVersionUID = 4830401726290958042L;

	private Long dbid;

	private String name;

	private Short outside;

	private Short status;

	private Integer company;
	
	private Short isRefer;

	private Short isAward;

	private Integer notSalesmanRate;

	public DecorationBusitypeVO() {
		super();
	}

	public DecorationBusitypeVO(Long dbid, String name, Short status, Integer company) {
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

	public Short getOutside() {
		return outside;
	}

	public void setOutside(Short outside) {
		this.outside = outside;
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

	public Short getIsRefer() {
		return isRefer;
	}

	public void setIsRefer(Short isRefer) {
		this.isRefer = isRefer;
	}

	public Short getIsAward() {
		return isAward;
	}

	public void setIsAward(Short isAward) {
		this.isAward = isAward;
	}

	public Integer getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Integer notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

}
