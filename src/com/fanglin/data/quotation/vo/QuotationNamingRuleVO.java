package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class QuotationNamingRuleVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long qnrid;

	private String name;

	private String pinyin;

	private Short type;

	private Integer sort;

	private Short status;

	private String comment;

	public QuotationNamingRuleVO() {
		super();
	}

	public Long getQnrid() {
		return qnrid;
	}

	public void setQnrid(Long qnrid) {
		this.qnrid = qnrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
