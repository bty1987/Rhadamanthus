package com.fanglin.personel.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "userfunction", catalog = "communion")
public class UserFunctionPO implements Serializable {

	private static final long serialVersionUID = -1331766931542329173L;

	public static final short STATUS_ENABLE_INT = 0;

	private long ufid;

	private String name;

	private String key;

	private String value;

	private short type;

	private short subtype;

	private short status;

	private short sort;

	private String comment;

	public UserFunctionPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "ufid")
	public long getUfid() {
		return ufid;
	}

	public void setUfid(long ufid) {
		this.ufid = ufid;
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

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
