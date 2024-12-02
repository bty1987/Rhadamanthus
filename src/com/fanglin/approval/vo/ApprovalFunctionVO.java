package com.fanglin.approval.vo;

import java.io.Serializable;

public class ApprovalFunctionVO implements Serializable {

	private static final long serialVersionUID = 2527558478141212348L;

	private Long cfid;

	private String name;

	private String key;

	private String value;

	private Short group;

	private Short type;

	private Short subType;

	private String comment;

	private Short status;

	private Short sort;
	
	private String fieldType;

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

	public Short getSubType() {
		return subType;
	}

	public void setSubType(Short subType) {
		this.subType = subType;
	}

	public String getFieldType() {
		return fieldType;
	}

	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
	}


	
	

}
