package com.fanglin.construction.vo;

import java.io.Serializable;

public class ConstructionFunctionVO implements Serializable {

	private static final long serialVersionUID = 3043316636679080030L;

	private Long cfid;

	private String name;

	private String key;

	private String value;

	private Short type;

	private Short subtype;

	private String comment;

	private Short sort;

	public Long getCfid() {
		return cfid;
	}

	public void setCfid(Long cfid) {
		this.cfid = cfid;
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

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

}
