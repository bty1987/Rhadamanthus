package com.fanglin.approval.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approvalfunction", catalog = "approval")
public class ApprovalFunctionPO implements java.io.Serializable {

	private static final long serialVersionUID = -555580571042788346L;

	public static final short STATUS_ENABLE_INT = 0;

	public static final String FIELDTYPE = "decoration";

	private long cfid;

	private String name;

	private String key;

	private String value;

	private short type;

	private short subType;

	private String comment;

	private short status;

	private short sort;

	private String fieldType;

	public ApprovalFunctionPO() {
		super();
	}

	public ApprovalFunctionPO(long cfid) {
		super();
		this.cfid = cfid;
	}

	public ApprovalFunctionPO(long cfid, String name, String key, String value, short type, short subType, String comment, short status, short sort, String fieldType) {
		super();
		this.cfid = cfid;
		this.name = name;
		this.key = key;
		this.value = value;
		this.type = type;
		this.subType = subType;
		this.comment = comment;
		this.status = status;
		this.sort = sort;
		this.fieldType = fieldType;
	}

	@Id
	@GeneratedValue
	@Column(name = "cfid")
	public long getCfid() {
		return cfid;
	}

	public void setCfid(long cfid) {
		this.cfid = cfid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "key")
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Column(name = "value")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "subType")
	public short getSubType() {
		return subType;
	}

	public void setSubType(short subType) {
		this.subType = subType;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

	@Column(name = "fieldType")
	public String getFieldType() {
		return fieldType;
	}

	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
	}

}
