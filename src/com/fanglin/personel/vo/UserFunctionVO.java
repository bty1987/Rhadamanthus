package com.fanglin.personel.vo;

import java.io.Serializable;

public class UserFunctionVO implements Serializable {

	private static final long serialVersionUID = -8439123115290371942L;

	private Long ufid;

	private String name;

	private String key;

	private String value;

	private Short type;

	private Short subtype;

	private Short status;

	private Short sort;

	private String comment;

	public UserFunctionVO() {
		super();
	}

	public Long getUfid() {
		return ufid;
	}

	public void setUfid(Long ufid) {
		this.ufid = ufid;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
