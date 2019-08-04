package com.fanglin.decoration.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationfunction", catalog = "decoration")
public class DecorationFunctionPO implements Serializable {

	private static final long serialVersionUID = 1120316382402950963L;
	
	private long dfid;
	
	private String name;
	
	private String key;
	
	private String value;
	
	private short type;
	
	private short subtype;
	
	private String comment;

	private short sort;

	@Id
	@GeneratedValue
	@Column(name = "dfid")
	public long getDfid() {
		return dfid;
	}

	public void setDfid(long dfid) {
		this.dfid = dfid;
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
