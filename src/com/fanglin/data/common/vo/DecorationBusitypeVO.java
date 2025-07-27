package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DecorationBusitypeVO implements Serializable {

	private static final long serialVersionUID = 4830401726290958042L;

	private Long dbid;

	private DecorationBusitypeVO cascade;

	private Integer no;

	private String name;

	private String alias;

	private Integer notSalesmanRate;

	private Short outside;

	private Short isRefer;

	private Short isAward;

	private Short type;

	private Short status;

	private Integer company;

	public DecorationBusitypeVO() {
		super();
	}

	public DecorationBusitypeVO(DecorationBusitypeVO cascade) {
		super();
		this.cascade = cascade;
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

	public DecorationBusitypeVO getCascade() {
		return cascade;
	}

	public void setCascade(DecorationBusitypeVO cascade) {
		this.cascade = cascade;
	}

	public Integer getNo() {
		return no;
	}

	public void setNo(Integer no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public Integer getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Integer notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public Short getOutside() {
		return outside;
	}

	public void setOutside(Short outside) {
		this.outside = outside;
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

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
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
