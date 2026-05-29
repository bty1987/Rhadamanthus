package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationnamingrule", catalog = "data")
public class QuotationNamingRulePO implements Serializable {

	private static final long serialVersionUID = 1L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short TYPE_NORMADD_SHORT = 3;

	public static final short STATUS_ENABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	private long qnrid;

	private String name;

	private String pinyin;

	private short type;

	private int sort;

	private short status;

	private String comment;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qnrid")
	public long getQnrid() {
		return qnrid;
	}

	public void setQnrid(long qnrid) {
		this.qnrid = qnrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "sort")
	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
