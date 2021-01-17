package com.fanglin.payment.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "paymentfunction", catalog = "payment")
public class PaymentFunctionPO implements Serializable {
	
	private static final long serialVersionUID = 8792715675005550598L;
	
	public static final short STATUS_ENABLE_INT = 0;
	
	private long pfid;
	
	private String name;
	
	private String key;
	
	private String value;
	
	private short group;
	
	private short type;
	
	private short subtype;
	
	private String comment;
	
	private short status;

	private short sort;

	public PaymentFunctionPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "pfid")
	public long getPfid() {
		return pfid;
	}

	public void setPfid(long pfid) {
		this.pfid = pfid;
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
