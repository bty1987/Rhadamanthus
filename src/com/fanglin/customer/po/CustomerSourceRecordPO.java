package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "customersourcerecord", catalog = "customer")
public class CustomerSourceRecordPO implements Serializable {

	private static final long serialVersionUID = 1442679154183461057L;

	public static final short TYPE_COMMON_INT = 0;

	public static final short TYPE_SPECIAL_INT = 1;

	private long csrid;

	private long csid;

	private long ccid;

	private short type;

	private UserPO operater;

	private Timestamp operatTime;

	private String comment;

	public CustomerSourceRecordPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "csrid")
	public long getCsrid() {
		return csrid;
	}

	public void setCsrid(long csrid) {
		this.csrid = csrid;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	public long getCcid() {
		return ccid;
	}

	public void setCcid(long ccid) {
		this.ccid = ccid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	@Column(name = "operatTime")
	public Timestamp getOperatTime() {
		return operatTime;
	}

	public void setOperatTime(Timestamp operatTime) {
		this.operatTime = operatTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public CustomerSourceRecordPO init(long csid, long ccid, String comment, Short type, UserPO operater) {

		setCsid(csid);
		setCcid(ccid);
		setType(type);
		setOperater(operater);

		setOperatTime(new Timestamp(System.currentTimeMillis()));

		setComment(comment);

		return this;
	}
}
