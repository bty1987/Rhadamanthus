package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "paymentscale", catalog = "data")
public class PaymentScalePO implements Serializable {

	private static final long serialVersionUID = 770443296071471774L;

	public static final String COLUMN_CID_STR = "cid";

	public static final short STATUS_ENABLE_INT = 0;

	private long psid;

	private int cid;

	private String name;

	private short status;

	private String comment;

	public PaymentScalePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "psid")
	public long getPsid() {
		return psid;
	}

	public void setPsid(long psid) {
		this.psid = psid;
	}

	@Column(name = "cid")
	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
