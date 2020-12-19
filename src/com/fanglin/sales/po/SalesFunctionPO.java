package com.fanglin.sales.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "salesfunction", catalog = "sales")
public class SalesFunctionPO implements Serializable{

	private static final long serialVersionUID = -5544324123290422714L;

	private long sfid;
	
	private String name;
	
	private String key;
	
	private String value;
	
	private short type;
	
	private short subtype;
	
	private short group;
	
	private String comment;

	private short sort;

	@Id
	@GeneratedValue
	@Column(name = "sfid")
	public long getSfid() {
		return sfid;
	}

	public void setSfid(long sfid) {
		this.sfid = sfid;
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

	@Column(name = "group")
	public short getGroup() {
		return group;
	}

	public void setGroup(short group) {
		this.group = group;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}
}
