package com.fanglin.production.vo;

import java.io.Serializable;

public class ProductionFunctionVO implements Serializable {
	
	private static final long serialVersionUID = 3043316636679080075L;

	private Long pfid;
	
	private String name;
	
	private String key;
	
	private String value;
	
	private Short type;
	
	private Short subtype;
	
	private Short funtype;
	
	private String comment;

	private Short sort;

	public Long getPfid() {
		return pfid;
	}

	public void setPfid(Long pfid) {
		this.pfid = pfid;
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

	public Short getFuntype() {
		return funtype;
	}

	public void setFuntype(Short funtype) {
		this.funtype = funtype;
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
