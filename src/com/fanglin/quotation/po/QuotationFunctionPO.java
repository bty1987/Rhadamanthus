package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationfunction", catalog = "quotation")
public class QuotationFunctionPO implements Serializable {

	private static final long serialVersionUID = -2294963542317902082L;

	public static final short STATUS_ENABLE_INT = 0;

	private long qfid;

	private String name;

	private String key;

	private String value;

	private short group;

	private short type;

	private short subtype;

	private String comment;

	private short status;

	private short sort;

	@Id
	@GeneratedValue
	@Column(name = "qfid")
	public long getQfid() {
		return qfid;
	}

	public void setQfid(long qfid) {
		this.qfid = qfid;
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

	@Column(name = "group")
	public short getGroup() {
		return group;
	}

	public void setGroup(short group) {
		this.group = group;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
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

}
