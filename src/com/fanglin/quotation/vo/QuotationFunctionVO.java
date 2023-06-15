package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationFunctionVO implements Serializable {

	private static final long serialVersionUID = 2741334902774332120L;

	private Long qfid;

	private String name;

	private String key;

	private String value;

	private Short group;

	private Short type;

	private Short subtype;

	private String comment;

	private Short status;

	private Short sort;

	public Long getQfid() {
		return qfid;
	}

	public void setQfid(Long qfid) {
		this.qfid = qfid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Short getGroup() {
		return group;
	}

	public void setGroup(Short group) {
		this.group = group;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getSubtype() {
		return subtype;
	}

	public void setSubtype(Short subtype) {
		this.subtype = subtype;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

}
